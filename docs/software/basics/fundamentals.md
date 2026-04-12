# Fundamentals

Core concepts every software engineer should know before going deeper.

## Programming Paradigms

A paradigm is a *style* of structuring programs. Most modern languages are multi-paradigm, but each has a dominant style.

| Paradigm | Core idea | Typical languages |
|---|---|---|
| **Imperative / Procedural** | Describe *how*: sequence of statements that change state. | C, Pascal, Go |
| **Object-Oriented (OOP)** | Bundle state and behavior into objects. Reuse via inheritance and composition. | Java, C#, Python, C++ |
| **Functional (FP)** | Compute via pure functions and immutable data; avoid side effects. | Haskell, Elixir, Scala |
| **Declarative** | Describe *what*, not how. The runtime figures out execution. | SQL, HTML, Prolog |
| **Logic** | Express facts and rules; the engine infers answers. | Prolog, Datalog |

Most real systems mix paradigms. Pick the one that fits the problem: OOP for domain modeling, FP for data transformation pipelines, declarative for queries and UI.

## Code Unit Hierarchy

Code is organized at increasing levels of scope. Understanding these levels helps you choose the right boundary for a change.

| Level | Purpose | Example |
|---|---|---|
| **Expression / Statement** | A value or action. | `x = a + b` |
| **Function** | A named, reusable operation. | `def add(a, b): ...` |
| **Class** | State plus behavior; a type. | `class Calculator: ...` |
| **Module / File** | A namespace containing related code. | `calculator.py` |
| **Package** | A directory of related modules. | `numpy`, `myapp/utils/` |
| **Project** | A deliverable application or library. | A Django web app |
| **Platform / Ecosystem** | The runtime and tooling the project lives in. | JVM, Node.js, Python + PyPI |

**Rule of thumb:** Keep the unit at each level *small and focused*. A function that does one thing is easier to test than a class with many responsibilities; a package with a clear purpose is easier to reuse than a catch-all `utils`.

## Formal Languages (Brief Note)

When you write regex, a parser, or a DSL, you are working with a formal language. The **Chomsky hierarchy** ranks them from simplest to most powerful:

- **Regular (Type 3)** — regex. Matches flat patterns like identifiers and keywords.
- **Context-Free (Type 2)** — parsers. Handles nesting, e.g. matched parentheses. Most programming-language grammars live here.
- **Context-Sensitive / Unrestricted (Type 1/0)** — natural language, general computation.

**Practical takeaway:** Don't reach for a parser when a regex will do, and don't try to parse nested structures with regex — match the tool to the level of the language.
