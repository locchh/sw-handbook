# Tips

Practical tips for working effectively, especially when collaborating with AI coding assistants.

## Pair-Coding with AI

1. **Configure the assistant with rules or memory** so it behaves consistently across sessions. A minimal set of rules worth having:

   > - When unsure, use MCP servers (tavily, context7, github-mcp-server) to look up real information before answering.
   > - Collaborate through active discussion — push back on ideas when there's a reason to.
   > - Generate code only when explicitly asked for it.
   > - Follow industry practice: clean, typed, documented code with meaningful comments.

1. **Use the right tool for the right level.** High-level agents (Claude Code) are good for architectural and team-lead thinking; editor-integrated tools (Windsurf) are good for tight code-level collaboration. A hybrid of both often beats either alone.

1. **Ask the assistant to explore the codebase for you.** Have it map subpackages, modules, and key components. You'll understand the code faster than by reading docs linearly.

1. **Keep a sandbox environment** where you can try ideas before touching the main codebase.

1. **Start each feature small.** When unsure, write a short markdown spec describing what you want and brainstorm with the assistant until the plan is clear. Then implement.

1. **Scope changes to something reviewable** — a function, a class, a file. Smaller scope makes it easier for humans and AIs to follow the reasoning.

1. **Build scaffolding first.** Create the folder structure, empty files with intent comments, maybe the first few lines — then ask the assistant to fill it in.

1. **Tier your models by task.** Use a top-tier model to get code working, then switch to a cheaper model to explain, review, and iterate.

1. **Give the assistant a runtime environment** where it can execute code and see feedback. Generate-test-refine loops are more reliable than one-shot code generation.

## Review & Defend Prompts

Short prompts that change how the assistant behaves:

- *"Review this codebase/component in strict mode"* — raises the bar.
- *"I don't think this works as expected — do you see the issue?"* — forces the assistant to defend its answer instead of agreeing.

## Testing Tips

- **TDD with AI.** Describe the expected behavior, have the assistant generate tests first, then implement against them. Prevents over-engineering by pinning down requirements up front.
- **Ask for edge cases.** After your initial tests, ask the assistant to identify missing cases: nulls, boundaries, concurrency, error paths. AIs are good at systematic coverage.

## Custom Commands

### `/make-commit-message`

```
---
description: Generate a commit message based on staged changes
---

You are a senior engineer writing a commit message for the staged changes.

1. Run `git diff --staged` to see the changes.
2. Review recent history — `git log --oneline -5` — to match commit patterns.
3. Check branch context — `git branch --show-current` and `git remote -v`.
4. Analyze related files (package files, configs, docs, tests that may need updates).
5. Write a conventional-commits message:
   - feat: new features
   - fix: bug fixes
   - docs: documentation
   - refactor: code restructuring
   - test: test changes
   - chore: tooling / maintenance
```

### `/review`

```
---
description: Review code changes for bugs, security issues, and improvements
---

You are a senior engineer doing a careful code review. Find bugs and improvements. Focus on:

1. Logic errors and incorrect behavior
2. Unhandled edge cases
3. Null / undefined references
4. Race conditions and concurrency bugs
5. Security vulnerabilities
6. Resource leaks
7. API contract violations
8. Caching bugs (staleness, bad keys, bad invalidation)
9. Violations of existing codebase patterns

Rules:
1. Explore the codebase in parallel. Don't over-explore.
2. Report pre-existing bugs too — they matter for quality.
3. Don't speculate. Only report issues you're confident about.
4. Remember: the commit may not be checked out; local state may differ.
```

## Prompt Bank for Exploring a Codebase

When the assistant doesn't know the project, give it specific starting points. Always include file paths, error messages, or feature names — the more context, the better the output.

**Starting a project**

- "Help me start this project from `{design_doc}`. Show the folder structure and setup steps."
- "Give me the exact commands to run this on a fresh machine."
- "Create a minimal `Dockerfile` and `docker-compose.yml` for local development."
- "Set up linters, formatters, and pre-commit hooks with configs."

**Building features**

- "Plan how to implement `{feature_name}`."
- "Build `{functionality}` with tests and edge-case handling."
- "Fix this error: `{error_message}`. Stack trace: `{stack_trace}`."
- "Add logging and metrics to debug `{component}`."

**Understanding code**

- "What does this codebase do and how is it structured?"
- "Show me the core components and how they connect."
- "How does data flow through the system?"
- "Explain the architecture of `{component}`."
- "What are the entry points and how do I run this locally?"

**Quality and deployment**

- "Give me a PR review checklist (security, tests, performance)."
- "What's the test coverage and strategy?"
- "Create a CI/CD pipeline for GitHub Actions."
- "Write onboarding docs: setup → run → test → deploy."
- "Generate OpenAPI docs for these endpoints."

**System design and operations**

- "Explain the platform architecture and component interactions."
- "How is auth handled across services?"
- "Where are the failure points, and what resilience strategies are in place?"
- "Show me the deployment order, scaling strategy, and monitoring setup."
