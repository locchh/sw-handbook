# Design Principles

Principles for writing code that is readable, maintainable, and robust. Use them as guidelines, not laws — judgment always wins over dogma.

## SOLID

Five object-oriented design principles that keep classes and modules loosely coupled and easy to change.

| | Principle | One-line rule |
|---|---|---|
| **S** | Single Responsibility | A class should have one reason to change. |
| **O** | Open / Closed | Open for extension, closed for modification. |
| **L** | Liskov Substitution | Subtypes must be usable wherever their base type is. |
| **I** | Interface Segregation | Prefer many small interfaces to one fat one. |
| **D** | Dependency Inversion | Depend on abstractions, not concrete implementations. |

**Example — SRP violation:** A `User` class that also sends email and writes to the database has three reasons to change. Split it into `User`, `UserMailer`, `UserRepository`.

**Example — DIP in practice:** Instead of `class OrderService { new MySqlRepo() }`, inject a repository interface. You can now swap implementations and test with a fake.

## The Core Three: DRY, KISS, YAGNI

- **DRY — Don't Repeat Yourself.** Each piece of knowledge should have one representation. But don't over-abstract: two similar-looking lines are not always the same *knowledge*. Three is a better trigger for extraction than two.
- **KISS — Keep It Simple.** Prefer boring, obvious code over clever code. Optimize for the reader.
- **YAGNI — You Aren't Gonna Need It.** Don't build for imagined futures. Add it when a real requirement forces it. Exception: decisions that are genuinely expensive to reverse (database engine, language, auth model).

These three are often in tension with each other. When they conflict, favor simplicity.

## Clean Code Habits

From Robert C. Martin's *Clean Code*, boiled down:

- **Names reveal intent.** `elapsed_days` beats `d`. If you need a comment to explain a name, rename it.
- **Functions are small and do one thing.** A rough ceiling: 20 lines, ≤3 arguments.
- **Comments explain *why*, not *what*.** The code shows what; a comment adds context the code can't.
- **Prefer exceptions to error codes.** Error codes get ignored; exceptions can't be silently lost.
- **Don't return or pass `null`.** Use `Optional`, default values, or empty collections.
- **Formatting is communication.** Related code stays close; unrelated code is separated by blank lines.

## Other Principles Worth Knowing

- **Separation of Concerns (SoC).** SRP applied at the module/system level. MVC, microservices, and layered architecture are all SoC in action.
- **Law of Demeter.** Talk only to your immediate neighbors. Avoid `a.getB().getC().doThing()` — that chain couples you to three types.
- **Composition over Inheritance.** Inheritance creates tight coupling and fragile base classes. Composition (has-a) is more flexible than inheritance (is-a).
- **Fail Fast.** Validate inputs and invariants early. A crash near the cause is cheaper to debug than corrupted state discovered later.
- **Convention over Configuration.** Sensible defaults reduce decisions. Rails and Spring Boot popularized this.
- **Principle of Least Astonishment (POLA).** Behave the way a reasonable user would expect. `getUserById()` returns a user — it should never delete one.
- **Premature optimization is the root of all evil.** (Knuth) Make it work, make it right, *then* make it fast — and only where profiling says it matters.

## When Principles Conflict

They will. A rigid DRY can fight YAGNI; SOLID can fight KISS. Some rules of thumb:

1. **Clarity first.** If a principle makes the code harder to read, it's wrong for this case.
2. **Match the scope.** A one-off script doesn't need SOLID; a shared library does.
3. **Rule of three.** Don't abstract a duplication until you have three instances — two can be coincidence.
4. **Refactor opportunistically.** Apply principles when you're already touching the code, not as a standalone cleanup pass.

The goal isn't to follow every principle — it's to end up with software that is easy to change.
