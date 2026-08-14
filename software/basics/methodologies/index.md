# Philosophies, Methodologies & Practices

Where the ideas came from, and who to read. This page traces the *lineage* of how the industry builds software — each entry gives the origin story and a primary source. For the day-to-day application of these ideas, see [Design Principles](https://locchh.github.io/sw-handbook/software/basics/principles/index.md) and [Lifecycle](https://locchh.github.io/sw-handbook/software/basics/lifecycle/index.md).

```
Philosophy   — mindset & values
  └── Methodology — how you organize your team & process
        └── Practice — specific techniques while coding
              └── Design approach — how you model and structure code
```

______________________________________________________________________

## Philosophies ( The why and what to believe )

### 1. Systems Thinking

> *"A system is more than the sum of its parts."*

Before you fix a team, a service, or a process, step back and look at the whole. A faster development team means nothing if deployment is still a bottleneck. A brilliant individual component can make the overall system worse if it shifts the problem somewhere else. Systems Thinking teaches you to ask "what does the whole look like?" before touching any one part.

**Ref:** Peter Senge, [*The Fifth Discipline*](https://en.wikipedia.org/wiki/The_Fifth_Discipline) (1990)

______________________________________________________________________

### 2. Lean

> *"The most dangerous kind of waste is the waste we do not recognize."* — Shigeo Shingo

Toyota discovered in the 1950s that most time in any production process is not spent making things — it's spent waiting, fixing mistakes, and building things nobody asked for. Lean is the discipline of making that invisible waste visible, then relentlessly cutting it. When it crossed into software, it became the foundation for Agile, Kanban, and DevOps.

**Ref:** Toyota Production System; [*Lean Software Development*](https://www.amazon.com/Lean-Software-Development-Agile-Toolkit/dp/0321150783) — Mary & Tom Poppendieck (2003)

______________________________________________________________________

### 3. Agile ( Able to move quickly and change direction without losing balance )

> *"Responding to change over following a plan."* — Agile Manifesto

In 2001, seventeen developers gathered at a ski lodge in Utah, frustrated by years of big upfront plans that crumbled on contact with reality. What they wrote — the Agile Manifesto — was a bet that short cycles, real working software, and continuous customer feedback would beat any rigid specification. It changed how the industry thinks about software delivery.

**Ref:** [Agile Manifesto](https://agilemanifesto.org/) (2001)

______________________________________________________________________

### 4. DevOps

> *"You build it, you run it."* — Werner Vogels, Amazon CTO

For decades, developers wrote code and handed it to a separate operations team to deploy. When things broke in production, nobody fully owned the problem. DevOps tore down that wall — the team that builds a service is also responsible for running it. The result is faster feedback, shared accountability, and systems designed with failure already in mind.

**Ref:** [*The Phoenix Project*](https://itrevolution.com/product/the-phoenix-project/) — Gene Kim (2013); [*Accelerate*](https://itrevolution.com/product/accelerate/) — Nicole Forsgren (2018)

______________________________________________________________________

### 5. Unix Philosophy

> *"Write programs that do one thing and do it well."* — Doug McIlroy

When Ken Thompson and Doug McIlroy built Unix at Bell Labs in the 1970s, they made a deliberate choice: keep every tool small, focused, and composable. `grep` finds text. `sort` orders lines. `curl` fetches URLs. None of them try to do more. Together, through pipes, they can do almost anything. That same idea lives on today in microservices — small services, clear boundaries, simple interfaces.

**Ref:** Doug McIlroy, [*The Art of Unix Programming*](http://www.catb.org/~esr/writings/taoup/) — Eric S. Raymond (2003)

______________________________________________________________________

### 6. Separation of Concerns (SoC)

> *"The art of programming is the art of organizing complexity."* — Edsger Dijkstra

A system becomes hard to understand the moment different kinds of work start bleeding into each other — when a function that fetches data also formats it for display, or when payment logic lives alongside authentication. Separation of Concerns is the discipline of keeping distinct responsibilities in distinct places, so you can change one without disturbing the others.

**Ref:** Edsger Dijkstra, [*On the role of scientific thought*](https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD447.html) (1974)

**Practical detail:** [Design Principles → Other Principles](https://locchh.github.io/sw-handbook/software/basics/principles/#other-principles-worth-knowing) · [Architecture](https://locchh.github.io/sw-handbook/software/basics/architecture/index.md)

______________________________________________________________________

### 7. Convention over Configuration (CoC)

> *"Rails is omakase."* — DHH

When David Heinemeier Hansson released Ruby on Rails in 2004, he noticed that developers were spending enormous energy making trivial decisions — what to name a table, where to put a file, how to structure a route. Convention over Configuration says: a good framework should make those decisions for you. You configure only what makes your app genuinely unique, and trust the framework for everything else.

**Ref:** David Heinemeier Hansson, [Ruby on Rails](https://rubyonrails.org/) (2004)

**Practical detail:** [Design Principles → Other Principles](https://locchh.github.io/sw-handbook/software/basics/principles/#other-principles-worth-knowing)

______________________________________________________________________

### 8. SOLID

> *"Write code so that when you change one thing, only that one thing changes."*

Robert C. Martin distilled decades of painful object-oriented lessons into five principles that keep code changeable over time. Violate them and the codebase slowly becomes a place where every change breaks something unexpected.

|       | Principle             | Meaning                                 | Fights against                                        |
| ----- | --------------------- | --------------------------------------- | ----------------------------------------------------- |
| **S** | Single Responsibility | One class, one job                      | One change affects unrelated things                   |
| **O** | Open/Closed           | Extend without modifying                | Editing old code introduces new bugs                  |
| **L** | Liskov Substitution   | Subclasses replace parents safely       | Swapping parts breaks the system                      |
| **I** | Interface Segregation | Don't force unused interfaces           | One change forces unrelated classes to change too     |
| **D** | Dependency Inversion  | Depend on abstractions, not concretions | High-level logic breaks when low-level details change |

**Ref:** Robert C. Martin, [*Clean Architecture*](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164) (2017)

**Practical detail:** [Design Principles → SOLID](https://locchh.github.io/sw-handbook/software/basics/principles/#solid)

______________________________________________________________________

### 9. Fail Fast

> *"Surface errors early and loudly — not silently downstream."*

A null slipping through five layers of code before causing a cryptic crash is one of the hardest bugs to trace. Fail Fast says: the moment something is wrong, say so immediately and loudly. Don't pass the problem downstream hoping someone else will catch it. The earlier an error surfaces, the cheaper it is to fix.

**Ref:** Jim Shore, [*Fail Fast*](https://www.martinfowler.com/ieeeSoftware/failFast.pdf) — IEEE Software (2004)

**Practical detail:** [Error Handling → Fail Fast](https://locchh.github.io/sw-handbook/software/basics/error_handling/#fail-fast)

______________________________________________________________________

### 10. DRY ( Don't Repeat Yourself )

> *"Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."* — Andrew Hunt & David Thomas

When the same logic lives in two places, you've created a silent promise that both will always stay in sync. Eventually, one changes and the other doesn't — and that gap becomes a bug. DRY is less about avoiding copy-paste and more about having one clear home for every piece of knowledge, so there's never any doubt about what the truth is.

**Ref:** Andrew Hunt & David Thomas, [*The Pragmatic Programmer*](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/) (1999)

**Practical detail:** [Design Principles → The Core Three](https://locchh.github.io/sw-handbook/software/basics/principles/#the-core-three-dry-kiss-yagni)

______________________________________________________________________

### 11. KISS ( Keep It Simple, Stupid )

> *"Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it."* — Brian Kernighan

Every layer of cleverness you add is a layer the next person — or future you — has to unpeel to understand what's happening. The simplest solution that actually works is almost always the right one, because simplicity is the only quality that survives time, team changes, and 3am incidents.

**Ref:** Kelly Johnson, Lockheed Skunk Works (1960s); [*The Pragmatic Programmer*](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/) — Hunt & Thomas (1999)

**Practical detail:** [Design Principles → The Core Three](https://locchh.github.io/sw-handbook/software/basics/principles/#the-core-three-dry-kiss-yagni)

______________________________________________________________________

### 12. YAGNI ( You Aren't Gonna Need It )

> *"Always implement things when you actually need them, never when you just foresee that you need them."* — Ron Jeffries

Developers are optimists by nature — they build for futures that rarely arrive. The abstraction layer written "just in case" becomes a burden that slows down every future change while solving a problem that never materialized. YAGNI is a discipline of restraint: build exactly what's needed today, and trust that future-you will know what future-you needs.

**Ref:** Ron Jeffries, Extreme Programming (1999); [*The Pragmatic Programmer*](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/) — Hunt & Thomas

**Practical detail:** [Design Principles → The Core Three](https://locchh.github.io/sw-handbook/software/basics/principles/#the-core-three-dry-kiss-yagni)

______________________________________________________________________

## Methodologies ( The how to do )

### 1. Waterfall - "Do it in order, no going back"

> *"Do it right the first time — in the right order."*

Waterfall treats software like construction: lay the foundation before the walls, walls before the roof. You gather all requirements, then design, then build, then test — in strict sequence with no going back. It works when the requirements are truly fixed and well understood from the start, and falls apart the moment reality diverges from the original plan.

**Use when:** Requirements are stable and unlikely to change.

**Ref:** Winston Royce, [*Managing the Development of Large Software Systems*](http://www-scf.usc.edu/~csci201/lectures/Lecture11/royce1970.pdf) (1970)

______________________________________________________________________

### 2. V-Model - "For every step, define how you'll prove it worked"

> *"For every decision, define how you'll prove it worked."*

```
Requirements ————————————————————————— Acceptance Test
  Architecture ——————————————————— Integration Test
            Design —————————— System Test
                  Code — Unit Test
```

An evolution of Waterfall for high-stakes domains. At every stage of development, you define a corresponding test that will prove the work was done correctly. Requirements get acceptance tests. Architecture gets integration tests. Code gets unit tests. Nothing moves forward without a plan for verifying it — because in aviation or medical devices, "it seemed to work" isn't good enough.

**Use when:** Safety-critical systems where correctness must be formally proven at every level.

**Ref:** Barry Boehm; DO-178C (aviation) and IEC 62304 (medical software) standards

______________________________________________________________________

### 3. Scrum - "Build a little, show it, improve"

> *"Inspect and adapt."* — Ken Schwaber & Jeff Sutherland

Scrum broke the long planning horizon into short, repeatable sprints of one to two weeks. At the end of each sprint, you have something real to show — working software, not a status report. A Product Owner decides what matters, a Scrum Master keeps the team unblocked, and the team owns how the work gets done. The retrospective at the end of each cycle asks the question most processes skip: how do we get better?

**Key roles:** Product Owner, Scrum Master, Developers

**Key ceremonies:** Sprint Planning, Daily Standup, Sprint Review, Retrospective

**Ref:** [*The Scrum Guide*](https://scrumguides.org/) — Ken Schwaber & Jeff Sutherland (free)

**Practical detail:** [Lifecycle → Agile, Scrum, Kanban](https://locchh.github.io/sw-handbook/software/basics/lifecycle/#agile-scrum-kanban)

______________________________________________________________________

### 4. Kanban - "Finish before you start something new"

> *"Stop starting, start finishing."* — David Anderson

Where Scrum organizes work into time-boxed sprints, Kanban lets work flow continuously — like a kitchen that cooks orders as they arrive rather than batching them by the hour. The key insight is WIP limits: capping how much work is "in progress" at once forces the team to finish things before starting new ones, which surfaces bottlenecks that would otherwise stay hidden.

**Use when:** Support, maintenance, or workflows where new tasks arrive unpredictably.

**Ref:** David Anderson, [*Kanban: Successful Evolutionary Change*](https://www.amazon.com/Kanban-David-J-Anderson/dp/0984521402) (2010)

**Practical detail:** [Lifecycle → Agile, Scrum, Kanban](https://locchh.github.io/sw-handbook/software/basics/lifecycle/#agile-scrum-kanban)

______________________________________________________________________

### 5. SAFe - "Scrum, but for 50 teams"

> *"Align, collaborate, deliver."*

When Agile teams multiply across a large organization, the question becomes: how do fifty teams stay pointed in the same direction? SAFe answers by adding coordination layers above individual Scrum teams — synchronizing them into Program Increments of roughly ten weeks, with shared planning events and portfolio-level alignment. It trades some of Agile's simplicity for the structure large enterprises need.

**Use when:** Many teams across an organization need to coordinate and ship together.

**Ref:** Dean Leffingwell, [Scaled Agile Framework](https://scaledagileframework.com/)

______________________________________________________________________

### 6. XP (Extreme Programming)

> *"If it's good practice, do it all the time."* — Kent Beck

Kent Beck asked a simple question: if code review is good, what if you reviewed every line as it was written? If testing is good, what if you wrote the test before the code? XP takes the best-known engineering practices and applies them continuously rather than occasionally — pair programming, TDD, continuous integration, and small releases done constantly, not at the end of a long cycle.

**Use when:** Teams that want rigorous code quality and very fast feedback loops.

**Ref:** Kent Beck, [*Extreme Programming Explained*](https://www.amazon.com/Extreme-Programming-Explained-Embrace-Change/dp/0321278658) (1999)

______________________________________________________________________

### 7. Shape Up - "Decide how much time it's worth, not how long it takes"

> *"Appetite, not estimates."* — Ryan Singer

Basecamp grew tired of backlogs that never shrank and estimates that never held. Shape Up inverts the usual approach: instead of estimating how long a feature will take, you decide upfront how much time you're willing to spend — the "appetite." Senior people shape the problem into something solvable within a fixed 6-week cycle, small teams own the solution completely, and anything that doesn't get bet on this cycle simply doesn't happen.

**Use when:** Small, autonomous product teams that want focused cycles without backlog debt.

**Ref:** Ryan Singer, [*Shape Up*](https://basecamp.com/shapeup) — Basecamp (free online book)

______________________________________________________________________

### 8. RUP - "Waterfall + iteration + formal governance"

> *"Structure the chaos of iterative development."*

RUP was IBM's answer to the rigidity of Waterfall and the looseness of early iterative methods. It gives large teams a formal framework of four phases — Inception, Elaboration, Construction, Transition — each with defined milestones, roles, and artifacts. You iterate within each phase, but the overall governance structure stays firm. The result is more adaptable than Waterfall and more auditable than Scrum.

**Use when:** Large enterprise or government projects requiring formal traceability and documented governance.

**Ref:** Philippe Kruchten, [*The Rational Unified Process*](https://www.amazon.com/Rational-Unified-Process-Introduction-3rd/dp/0321197704) (1998)

______________________________________________________________________

## Practices & Design Approaches

### TDD — Test-Driven Development

> *"Red, Green, Refactor."* — Kent Beck

You write the test before you write the code — which means you define exactly what "done" looks like before you start. The test fails (red), you write just enough code to make it pass (green), then you clean it up without breaking it (refactor). The discipline forces small, focused steps and produces a safety net that makes future changes fearless.

**Ref:** Kent Beck, [*Test-Driven Development: By Example*](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530) (2002)

**Practical detail:** [Lifecycle → TDD and BDD](https://locchh.github.io/sw-handbook/software/basics/lifecycle/#tdd-and-bdd)

______________________________________________________________________

### BDD — Behavior-Driven Development

> *"Given... When... Then."*

BDD extends TDD by writing tests in plain English, so that a non-technical product manager can read a test suite and verify it describes the right behavior. The format — Given a context, When an action happens, Then something should be true — bridges the gap between what the business wants and what the code actually does.

```
Given: a user is logged in
When: they click "Delete Account"
Then: their account is removed and they receive a confirmation email
```

**Ref:** Dan North, [*Introducing BDD*](https://dannorth.net/introducing-bdd/) (2006); [Cucumber](https://cucumber.io/docs/bdd/)

**Practical detail:** [Lifecycle → TDD and BDD](https://locchh.github.io/sw-handbook/software/basics/lifecycle/#tdd-and-bdd)

______________________________________________________________________

### DDD — Domain-Driven Design

> *"The heart of software is its ability to solve domain-related problems for its users."* — Eric Evans

In a complex business, the hardest part of building software is understanding the domain — the real-world rules, relationships, and language of banking, healthcare, logistics, or whatever the business actually does. DDD says the code should speak that language directly. When a developer and a domain expert talk about an "Order," they should mean exactly the same thing, with no translation layer between them.

**Ref:** Eric Evans, [*Domain-Driven Design*](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215) (2003)

**Further reading:** [The Architecture Bookshelf → Domain-Driven Design](https://locchh.github.io/sw-handbook/software/advanced/books/#domain-driven-design)

______________________________________________________________________

## Glossary

| Term  | Full form                     | Plain meaning                                          |
| ----- | ----------------------------- | ------------------------------------------------------ |
| BDD   | Behavior-Driven Development   | Write tests as plain English user stories              |
| CI    | Continuous Integration        | Merge and test code many times per day                 |
| CoC   | Convention over Configuration | Sensible defaults reduce trivial decisions             |
| DDD   | Domain-Driven Design          | Model code around the real-world business domain       |
| DRY   | Don't Repeat Yourself         | One source of truth for every piece of knowledge       |
| KISS  | Keep It Simple, Stupid        | The simplest solution is usually the best              |
| PI    | Program Increment             | ~10-week synchronized cycle across Scrum teams (SAFe)  |
| RUP   | Rational Unified Process      | IBM's structured iterative development process         |
| SAFe  | Scaled Agile Framework        | Agile practices scaled for large organizations         |
| SoC   | Separation of Concerns        | Different responsibilities belong in different parts   |
| TDD   | Test-Driven Development       | Write tests before writing code                        |
| WIP   | Work In Progress              | Tasks currently being worked (Kanban limits this)      |
| XP    | Extreme Programming           | Agile methodology focused on rigorous coding practices |
| YAGNI | You Aren't Gonna Need It      | Build only what you need right now                     |
