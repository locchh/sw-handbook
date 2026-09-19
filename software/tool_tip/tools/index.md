# Software Tools

Choose tools around a repeatable workflow: find the code, reproduce the environment, make a change, check it, and ship it. Start with the tools your project already uses; add another when it solves a specific problem.

For installation, see [Machine Setup](https://locchh.github.io/sw-handbook/software/tool_tip/machine_setup/index.md). For command syntax beyond the examples here, use [Linux Commands](https://locchh.github.io/sw-handbook/software/tool_tip/linux_commands/index.md).

## Choose by task

| Task                       | Tools                                                                              | When to use them                                                       |
| -------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Search and inspect code    | [ripgrep](https://github.com/BurntSushi/ripgrep), [jq](https://jqlang.org/manual/) | Search a repository quickly; filter JSON responses and logs            |
| Manage Python dependencies | [uv](https://docs.astral.sh/uv/guides/projects/)                                   | Create isolated environments and commit a resolved dependency lockfile |
| Run project commands       | [GNU Make](https://www.gnu.org/software/make/manual/make.html)                     | Give contributors and CI the same entry points for checks and builds   |
| Format and lint Python     | [Ruff](https://docs.astral.sh/ruff/)                                               | Keep style consistent and catch common code problems                   |
| Check Python types         | [mypy](https://mypy.readthedocs.io/)                                               | Check contracts between typed functions and modules                    |
| Test behavior              | [pytest](https://docs.pytest.org/)                                                 | Exercise outcomes, edge cases, and regressions                         |
| Run local dependencies     | [Docker Compose](https://docs.docker.com/compose/)                                 | Start an application's database, cache, and other services together    |
| Sketch a design            | [Excalidraw](https://excalidraw.com/), [Lucidchart](https://www.lucidchart.com/)   | Discuss boundaries, dependencies, and flows before implementation      |

## A small Python workflow

For a **new Python application**, uv can manage both runtime and development dependencies. This example assumes uv is installed and runs in a new directory:

```
uv init sample-service
cd sample-service
uv add --dev ruff mypy pytest
uv run ruff check .
uv run ruff format --check .
# After adding application code and tests:
uv run mypy main.py
uv run pytest
```

Commit `pyproject.toml` and `uv.lock`; keep `.venv/` out of Git. On another machine or in CI, `uv sync --locked` installs from the lockfile and fails if the project metadata requires a lock update. See [uv's project guide](https://docs.astral.sh/uv/guides/projects/).

An existing repository may instead use `requirements.txt`, Poetry, or another manager. Follow its setup instructions before introducing a second dependency workflow. This handbook's own setup is documented in the repository README.

### Give checks one entry point

A Makefile makes the expected commands discoverable. Recipe lines must start with a **tab**:

```
.PHONY: check format test

check:
    uv run ruff check .
    uv run ruff format --check .
    uv run mypy main.py

format:
    uv run ruff format .

test:
    uv run pytest
```

Replace `main.py` with your application's source path. `make check` checks lint, formatting, and types; `make test` checks behavior. A formatter is not a type checker, and neither replaces tests. Keep the same commands in [CI/CD](https://locchh.github.io/sw-handbook/software/tool_tip/cicd/index.md) so local success means something before a merge.

## Inspect before changing

These commands run from a repository root; replace paths and URLs with your own:

```
# Find files and relevant code without opening every directory.
rg --files
rg -n 'timeout|retry' src/

# Inspect a JSON response saved locally.
jq '.items[] | {id, name}' response.json

# Review the scope of a change.
git diff --stat
git diff --check
git diff
```

Use [Git](https://locchh.github.io/sw-handbook/software/basics/git/index.md) for branch and history mechanics, and [Code Review](https://locchh.github.io/sw-handbook/software/basics/code_review/index.md) for evaluating the resulting change.

## Run services locally

[Docker Compose](https://docs.docker.com/compose/) describes a group of services in a YAML file. In a repository with a Compose configuration:

```
docker compose config --quiet
docker compose up -d
docker compose ps
docker compose logs --tail=100
docker compose down
```

Keep application dependencies in the language lockfile and service configuration in Compose. Document required environment variables with placeholder values in `.env.example`; keep actual credentials out of Git. Named volumes retain data when running `docker compose down`; adding `--volumes` removes those volumes, so use it only when you intend to discard their data.

A local stack is a development environment. Deployment still needs resource sizing, backups, health checks, and a recovery path; see [Running a Server](https://locchh.github.io/sw-handbook/software/tool_tip/server_operations/index.md).

## Documentation and design

- **Excalidraw / Lucidchart:** sketch a request path or system boundary. Put the final decision and rationale next to the diagram.
- **[Context7](https://github.com/upstash/context7):** supply library documentation to coding assistants. Match documentation to the dependency version used by the repository.
- **llms.txt discovery:** [llmstxt.site](https://llmstxt.site/) and [directory.llmstxt.cloud](https://directory.llmstxt.cloud/) help find documentation indexes. Follow links back to the project's own documentation before relying on an example.
- **[database.build](https://database.build/):** explore database ideas. Review the resulting schema, constraints, and migrations before adopting them.
- **[petname](https://github.com/dustinkirkland/petname):** generate readable names for temporary resources. A memorable name is not a uniqueness guarantee or a secret.

## Build a toolchain gradually

Start with Git, an editor, the project's package manager, and its test command. Add formatting and linting for consistent feedback, a task runner when commands repeat, and containers when service dependencies become difficult to reproduce. Introduce AI assistance through the [AI Tools](https://locchh.github.io/sw-handbook/ai/tool_tip/tools/index.md) guide while keeping the same verification steps.
