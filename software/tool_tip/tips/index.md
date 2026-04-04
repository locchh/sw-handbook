# Tips

## Pair-coding Tips

1. *Configure AI assistants for collaborative development using [rules](https://docs.windsurf.com/windsurf/cascade/memories) or memory systems in agentic coding tools, for example*

> 1. If you don't sure about something, use MCP servers (tavily, context7, github-mcp-server, etc.) to search for information and code before answering questions.
> 1. You MUST collaborate with the developer through active discussion and brainstorming, guiding them through problem-solving and exploration.
> 1. Don't just agree with developer ideas — push back when necessary. Challenge my assumptions and offer thoughtful counterarguments.
> 1. Generate code ONLY when the developer explicitly requests it.
> 1. When generating code, follow industry best practices. Ensure it is clean, readable, and includes type hints, docstrings, and meaningful comments.

1. *Using [claude code](https://www.claude.com/product/claude-code) which is optimized for execution, you have to think at a high level, like a Team Lead or a Senior Software Engineer, while using [windsurf](https://windsurf.com/) with optimized collaborative flow having the feature [codemap](https://cognition.ai/blog/codemaps) can create a map of logic flow allowing you to navigate through codebase quickly and efficiently/ I think hybrid of this two tools is the best way to level-up your engineering skills*
1. *Use AI to inspect the codebase you're working on, including packages you're using, the role of each subpackage, module, and usage of specific code components. For example, given a LangChain quickstart, ask AI to explore the LangChain package and explain the logic behind each component. This tip lead to a better understanding of the codebase than only reading documentation or hand-on examples*
1. *You can create a sanbox evironment where you freely to try your idea before implement it in the main codebase*
1. *When starting a new feature or codebase, keep it small, clear, and focused. When unsure where to begin, create a markdown documentation file to describe about what you want to implement, then brainstorm with AI until you have a clear implementation plan*
1. *Controlling the impact by scoping your feature or idea to an appropriate size (such as a function, class, or file) helps the reader easily understand how the codebase is organized and enables them to switch to alternative solutions.*
1. *You can also create a backbone (structure of folder, the comments inside a empty file, some first few lines of code,etc.) the ask AI to complete the backbone*
1. *Another tip to reduce cost is using a top-tier AI to generate code until it work, backup code, then use another cheper AI to iterate with you for explain, review, refactor, etc.*
1. *It would be better to create a runtime environment where the AI can execute code, receive feedback, and iteratively improve through a generate-test-refine loop*

## Review Tips

- *Let review this codbase/component/feature in strict mode* => Be strict
- *I don't think this codebase/component/feature works as expected, do you have any idea?* => Make AI defend its answer
- Use custom command or worfklow `/make-commit-message` to help agent generate atomic commit

```
---
auto_execution_mode: 0
description: Generate a commit message based on the staged changes and related files
---

You are a senior software engineer generating a commit message based on the staged changes and related files.

1. Run `git diff --staged` to see the changes, then generate a commit message based on the changes.
2. Review recent history - `git log --oneline -5` to understand commit patterns
3. Check branch context - `git branch --show-current` and `git remote -v` for project context
4. Analyze related files - Check files that might be affected by changes:
   - Package files (`package.json`, `requirements.txt`, `Cargo.toml`, etc.)
   - Configuration files (`.env`, `config/`, etc.)
   - Documentation files (`README.md`, `CHANGELOG.md`, etc.)
   - Test files that might need updates
5. Generate semantic message - Create commit message following conventional commits format:
   - `feat:` for new features
   - `fix:` for bug fixes  
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for test additions/changes
   - `chore:` for maintenance tasks
   - etc.
```

- Use `/review` to let agent review code:

```
---
auto_execution_mode: 0
description: Review code changes for bugs, security issues, and improvements
---
You are a senior software engineer performing a thorough code review to identify potential bugs.

Your task is to find all potential bugs and code improvements in the code changes. Focus on:
1. Logic errors and incorrect behavior
2. Edge cases that aren't handled
3. Null/undefined reference issues
4. Race conditions or concurrency issues
5. Security vulnerabilities
6. Improper resource management or resource leaks
7. API contract violations
8. Incorrect caching behavior, including cache staleness issues, cache key-related bugs, incorrect cache invalidation, and ineffective caching
9. Violations of existing code patterns or conventions

Make sure to:
1. If exploring the codebase, call multiple tools in parallel for increased efficiency. Do not spend too much time exploring.
2. If you find any pre-existing bugs in the code, you should also report those since it's important for us to maintain general code quality for the user.
3. Do NOT report issues that are speculative or low-confidence. All your conclusions should be based on a complete understanding of the codebase.
4. Remember that if you were given a specific git commit, it may not be checked out and local code states may be different.
```

## Testing Tips

- *Write tests before implementation (TDD with AI): Describe the expected behavior to AI, let it generate test cases first, then implement the code to pass those tests. This ensures you have clear requirements and prevents over-engineering*
- *Ask AI to generate edge cases: After writing your initial tests, ask AI to identify edge cases you might have missed—null values, boundary conditions, concurrent access, error handling paths, etc. AI excels at systematic coverage analysis*
