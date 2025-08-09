# Software Engineering Handbook

*A personal handbook about Software Engineering, Data and AI*

## Description

This repository contains a web-based handbook with my notes and insights about Software Engineering, Data Science, and Artificial Intelligence. The handbook is designed with a retro-style, simple interface focused on content readability.

## Features

- Content organized in a hierarchical folder structure
- Markdown-based content with dynamic HTML generation
- Retro-style design with modern functionality
- Automatic navigation based on folder structure
- Hosted on GitHub Pages

## Getting Started

### Prerequisites

- Python 3.7+

### Installation

```bash
# Clone the repository
git clone https://github.com/locch/sw-handbook.git
cd sw-handbook

# Create a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Development

```bash
# Start the development server
mkdocs serve
```

Visit `http://127.0.0.1:8000/` to see the handbook locally.

### Building

```bash
# Build the static site
mkdocs build
```

### Deployment

```bash
# Deploy to GitHub Pages
mkdocs gh-deploy
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.