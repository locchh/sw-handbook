PYTHON ?= python3
VENV ?= .venv
MKDOCS = $(VENV)/bin/mkdocs

.PHONY: setup serve build deploy

setup:
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/python -m pip install -r requirements.lock

serve:
	$(MKDOCS) serve

build:
	$(MKDOCS) build --strict

deploy:
	$(MKDOCS) gh-deploy --strict
