# Software Development Lifecycle

How software is planned, built, tested, and delivered — plus the process frameworks and testing strategies that shape the work.

## SDLC Phases

The classic flow, whether you run it as waterfall or iterate through it every sprint:

```
Analysis → Design → Development → Testing → Deployment → Maintenance
```

| Phase           | Typical artifacts                                                               |
| --------------- | ------------------------------------------------------------------------------- |
| **Analysis**    | Business requirements (BRD), functional spec (FRS/SRS), user stories, use cases |
| **Design**      | High-level design, detailed design, database schema, API contracts, UI mockups  |
| **Development** | Source code, code review, documentation                                         |
| **Testing**     | Test plans, test cases, bug reports, test summary                               |
| **Deployment**  | Release notes, deployment scripts, runbooks                                     |
| **Maintenance** | Hotfixes, monitoring, incident reports                                          |

## Roles

| Role                      | Responsibility                                                     |
| ------------------------- | ------------------------------------------------------------------ |
| **Product Owner / PM**    | What to build and why; owns priorities.                            |
| **Business Analyst (BA)** | Turns business needs into specs.                                   |
| **Architect / Tech Lead** | System design and technical direction.                             |
| **Developer**             | Writes and ships code (frontend, backend, mobile, data, ML, etc.). |
| **QA**                    | Defines test strategy; verifies quality.                           |
| **DevOps / SRE**          | Infrastructure, CI/CD, observability, on-call.                     |
| **UX/UI Designer**        | User flows and visual design.                                      |
| **Scrum Master**          | Facilitates process and removes blockers.                          |

## Environments

Code flows through environments before reaching users:

- **Local** — your machine. Break things freely.
- **Dev / Integration** — shared playground where features meet. Often wired to a `develop` branch.
- **Staging** — production-like. Used for QA, UAT, and final rehearsal. No real users.
- **Production** — live traffic, real users, real money. Changes go through CI/CD gates.

## Agile, Scrum, Kanban

Agile is a mindset, not a process. The Agile Manifesto values **people, working software, collaboration, and responding to change**. Two common frameworks implement it:

**Scrum** — time-boxed iterations (sprints, usually 1–4 weeks) with defined roles and ceremonies:

- Roles: Product Owner, Scrum Master, Development Team
- Events: Sprint Planning, Daily Standup, Sprint Review, Retrospective
- Artifacts: Product Backlog, Sprint Backlog, Increment

**Kanban** — continuous flow instead of sprints. Visualize work on a board, limit WIP, measure cycle time, improve the flow. Better suited to support and ops-style work.

Use Scrum when you want predictable delivery cadence and a clear rhythm; Kanban when priorities shift too fast to plan in two-week chunks.

## Testing

A short taxonomy of test types, ordered roughly from narrow to broad:

| Type                    | What it checks                                                             |
| ----------------------- | -------------------------------------------------------------------------- |
| **Unit**                | A single function or class in isolation. Fast, cheap, run on every commit. |
| **Integration**         | How multiple components work together (e.g., service + database).          |
| **Functional**          | The system meets a specific functional requirement.                        |
| **System / End-to-End** | The whole stack from the user's perspective.                               |
| **Acceptance (UAT)**    | The business signs off that requirements are met.                          |
| **Non-Functional**      | Performance, security, usability, reliability.                             |
| **Stress / Load**       | Behavior at high or breaking load.                                         |

**Testing pyramid:** lots of unit tests, fewer integration tests, very few end-to-end tests. The pyramid is cheap to run and fast to diagnose.

## TDD and BDD

**Test-Driven Development (TDD)** — write the test first, make it pass, then refactor. The *Red → Green → Refactor* loop.

- Forces you to think about the interface before the implementation.
- Produces a safety net that makes refactoring cheap.

**Behavior-Driven Development (BDD)** — a TDD variant that writes tests in natural language (`Given / When / Then`). Bridges the gap between developers, QA, and product.

## Code Review

Every change merged by a second pair of eyes. Rules of thumb:

- Keep PRs small (< 400 lines is easier to review well).
- Review within a day — stale PRs rot.
- Focus on logic and design; let linters handle style.
- Ask questions, explain the *why*, be respectful.
- Require 2 approvals for critical code, 1 for routine work.

Code review is the cheapest place to catch bugs and the best place to spread knowledge across the team.

## CI/CD

- **Continuous Integration (CI)** — every commit is built and tested automatically. Broken builds are fixed immediately.
- **Continuous Delivery** — main is always deployable; releases are a button press.
- **Continuous Deployment** — every green commit is automatically pushed to production.

A minimal CI pipeline: **lint → unit tests → integration tests → build artifact → deploy to staging → (manual gate) → deploy to prod**.

## Development Workflow (Example)

```
Feature Request (ticket)
       │
       ▼
Create feature/* branch from develop
       │
       ▼
Implement + unit tests
       │
       ▼
Pull Request (feature/* → develop)
       │
       ├─ Code Review (≥ 2 approvals)
       ├─ CI: lint, type-check, tests
       └─ Automated checks pass
       │
       ▼
Merge to develop → deploy to staging
       │
       ▼
QA & acceptance testing
       │
       ▼
release/* branch → merge to main → tag → deploy to production
```

## Version Control

Git is the de-facto standard for source control. A typical workflow combines three things: a branching model, a commit convention, and a versioning scheme.

### Branching Models

| Branch      | Purpose                                            |
| ----------- | -------------------------------------------------- |
| `main`      | Latest production-ready code. Tagged for releases. |
| `develop`   | Integration branch for the next release.           |
| `feature/*` | New feature work, branched from `develop`.         |
| `release/*` | Stabilization branch before a release.             |
| `hotfix/*`  | Emergency fix, branched from `main`.               |

Smaller teams often simplify this to `main` + short-lived feature branches (*trunk-based development*). Pick the simplest model that matches your release cadence.

### Conventional Commits

A prefix tells readers and tooling what kind of change a commit is:

| Prefix      | Meaning                             |
| ----------- | ----------------------------------- |
| `feat:`     | New feature                         |
| `fix:`      | Bug fix                             |
| `docs:`     | Documentation only                  |
| `style:`    | Formatting, whitespace              |
| `refactor:` | Neither a fix nor a feature         |
| `test:`     | Add or fix tests                    |
| `chore:`    | Tooling, dependencies, build config |

Good commit messages explain the *why* in the body, not just the *what* in the subject.

### Semantic Versioning

`MAJOR.MINOR.PATCH` — e.g. `2.5.1`:

- **MAJOR** — breaking change.
- **MINOR** — new functionality, backwards-compatible.
- **PATCH** — backwards-compatible bug fix.

Pre-release sequence: `Alpha → Beta → RC1 → RC2 → … → Release`.

**Further reading:** [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/), [Write Better Commits, Build Better Projects](https://github.blog/developer-skills/github/write-better-commits-build-better-projects/).
