# Tips

## Pair-coding Tips

1. *Configure AI assistants for collaborative development using [rules](https://docs.windsurf.com/windsurf/cascade/memories) or memory systems in agentic coding tools, for example* 

    - *You MUST collaborate with the developer through active discussion and brainstorming, guiding them through problem-solving and exploration.*

    - *Don’t just agree with developer ideas — push back when necessary. Challenge my assumptions and offer thoughtful counterarguments.*

    - *Generate code ONLY when the developer explicitly requests it.*

    - *When generating code, follow industry best practices. Ensure it is clean, readable, and includes type hints, docstrings, and meaningful comments.*


2. *Using [claude code](https://www.claude.com/product/claude-code) which is optimized for execution, you have to think at a high level, like a Team Lead or a Senior Software Engineer, while using [windsurf](https://windsurf.com/) with optimized collaborative flow having the feature [codemap](https://cognition.ai/blog/codemaps) can create a map of logic flow allowing you to navigate through codebase quickly and efficiently/ I think hybrid of this two tools is the best way to level-up your engineering skills*


3. *Use AI to inspect the codebase you're working on, including packages you're using, the role of each subpackage, module, and usage of specific code components. For example, given a LangChain quickstart, ask AI to explore the LangChain package and explain the logic behind each component. This tip lead to a better understanding of the codebase than only reading documentation or hand-on examples*


4. *You can create a sanbox evironment where you freely to try your idea before implement it in the main codebase*


5. *When starting a new feature or codebase, keep it small, clear, and focused. When unsure where to begin, create a markdown documentation file to describe about what you want to implement, then brainstorm with AI until you have a clear implementation plan*


6. *Controlling the impact by scoping your feature or idea to an appropriate size (such as a function, class, or file) helps the reader easily understand how the codebase is organized and enables them to switch to alternative solutions.*


7. *You can also create a backbone (structure of folder, the comments inside a empty file, some first few lines of code,etc.) the ask AI to complete the backbone* 


8. *Another tip to reduce cost is using a top-tier AI to generate code until it work, backup code, then use another cheper AI to iterate with you for explain, review, refactor, etc.*


9. *It would be better to create a runtime environment where the AI can execute code, receive feedback, and iteratively improve through a generate-test-refine loop* 


## Review Tips

- *Let review this codbase/component/feature in strict mode* => Be strict

- *I don't think this codebase/component/feature works as expected, do you have any idea?* => Make AI defend its answer

## Testing Tips

- *Write tests before implementation (TDD with AI): Describe the expected behavior to AI, let it generate test cases first, then implement the code to pass those tests. This ensures you have clear requirements and prevents over-engineering*

- *Ask AI to generate edge cases: After writing your initial tests, ask AI to identify edge cases you might have missed—null values, boundary conditions, concurrent access, error handling paths, etc. AI excels at systematic coverage analysis*