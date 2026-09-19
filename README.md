# Software Handbook

*A personal handbook about Software Engineering, Data and AI*

## Description

This repository contains a web-based handbook with my notes and insights about Software Engineering, Data Science, and Artificial Intelligence. The handbook is designed with a retro-style, simple interface focused on content readability.

## Features

- Content organized in a hierarchical folder structure
- Markdown-based content with dynamic HTML generation
- Retro-style design with modern functionality
- Automatic navigation based on folder structure
- Hosted on GitHub Pages
- Support [llms.txt](https://llmstxt.org/)

## Getting Started

### Prerequisites

- Python 3.13 (the version used to verify `requirements.lock`)
- Git; Make is optional
- Repository write access for deployment

### Installation

```bash
# Clone the repository
git clone https://github.com/locchh/sw-handbook.git
cd sw-handbook

# Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
python -m pip install -r requirements.lock
```

With [uv](https://docs.astral.sh/uv/), the equivalent setup is:

```bash
uv venv --python 3.13 .venv
uv pip sync --python .venv/bin/python requirements.lock
source .venv/bin/activate
```

`requirements.txt` lists direct dependencies; `requirements.lock` pins the resolved build environment. To refresh dependencies deliberately, run `uv pip compile --python-version 3.13 requirements.txt -o requirements.lock`, sync the environment, and verify a strict build before deploying.

On Linux/macOS, `make setup`, `make serve`, `make build`, and `make deploy` provide the same workflow without activating the environment. `make setup` uses `python3`; override it with `make setup PYTHON=python3.13` if needed.

### Development

```bash
# Start the development server
mkdocs serve
```

Visit `http://127.0.0.1:8000/` to see the handbook locally.

### Building

```bash
# Build the static site
mkdocs build --strict
```

### Deployment

```bash
# Deploy to GitHub Pages
mkdocs gh-deploy --strict
```

The generated site is published to the `gh-pages` branch at [locchh.github.io/sw-handbook](https://locchh.github.io/sw-handbook/). GitHub Pages must use **Deploy from a branch → gh-pages → / (root)**. The remote must be writable through your Git credentials.

Build and review locally before deploying. `gh-deploy` publishes the current working tree, including uncommitted documentation edits; it does not commit or push source changes on `main`. Commit source changes separately when ready. See the [MkDocs deployment guide](https://www.mkdocs.org/user-guide/deploying-your-docs/).

After publishing, check the repository's Pages build and open the changed pages on the live site. Generated `site/` files and the local `.venv/` stay out of Git. No `.env` file or application API keys are needed to build this handbook.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
