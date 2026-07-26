# The Senior Curriculum

Universities and course platforms teach fundamentals and frameworks — what can be graded at scale. Seniority is judgment under real constraints, and judgment is learned from artifacts of real decisions and real failures: books by practitioners, postmortems, papers, design reviews — plus deliberate practice. This page is the self-study path. Companion to [Becoming Senior](becoming_senior.md).

## How to Use This Page

Do **not** try to read everything. Start with the core three books and the weekly habits, then pull from the tables by whichever skill is currently weakest. The [cadence table](#suggested-cadence) at the bottom turns this into a routine.

This page is a **path** — a short list in an order, on a cadence. When you need the **map** instead — what literature exists on a specific subfield such as DDD, streaming, or scalability — see [The Architecture Bookshelf](../advanced/books.md).

## The Core Three

If you read only three books, read these, in this order:

| Book | Link | Why |
|---|---|---|
| **Designing Data-Intensive Applications** — Martin Kleppmann | [dataintensive.net](https://dataintensive.net/) | The bridge from fundamentals to production judgment. Every chapter: the mechanism, how it fails, the trade-off. |
| **Release It!** (2nd ed.) — Michael Nygard | [pragprog.com](https://pragprog.com/titles/mnee2/release-it-second-edition/) | The failure path as a discipline — circuit breakers, bulkheads, timeout budgets — each taught through a real production war story. |
| **The Staff Engineer's Path** — Tanya Reilly | [noidea.dog/staff](https://noidea.dog/staff) | What senior+ work actually consists of: ambiguity, influence, choosing what *not* to build. The linked page also collects free staff-engineering resources. |

## Books by Skill

| Skill | Book | Link | Why |
|---|---|---|---|
| Architecture trade-offs | *Fundamentals of Software Architecture* — Richards & Ford | [fundamentalsofsoftwarearchitecture.com](http://fundamentalsofsoftwarearchitecture.com/) | "There are no right answers, only trade-offs" — the doctrine, systematized. |
| Distributed trade-offs | *Software Architecture: The Hard Parts* — Ford, Richards, Sadalage, Dehghani | [nealford.com/books](https://nealford.com/books/) | Decomposition, data ownership, and coupling decisions in distributed systems. |
| Business-anchored design | *Learning Domain-Driven Design* — Vlad Khononov | [vladikk.com](https://vladikk.com/) | The accessible modern DDD — bounded contexts are the formal version of the capability map. |
| The original source | *Domain-Driven Design* — Eric Evans | [domainlanguage.com/ddd](https://www.domainlanguage.com/ddd/) | Harder read; the free DDD Reference on that page summarizes the patterns. |
| Engineering ↔ business | *Accelerate* — Forsgren, Humble, Kim | [itrevolution.com](https://itrevolution.com/product/accelerate/) | Research linking engineering practice to business outcomes — the evidence for justifying decisions to leadership. |
| Teams as architecture | *Team Topologies* — Skelton & Pais | [teamtopologies.com](https://teamtopologies.com/book) | Conway's law made actionable: org design and system design are the same problem. |
| Operations | *Site Reliability Engineering* + *The SRE Workbook* — Google | [sre.google/books](https://sre.google/books/) | Free online. SLOs, error budgets, postmortem culture, escalation — reliability measured, not felt. |
| Distributed systems (gentle) | *Understanding Distributed Systems* — Roberto Vitillo | [understandingdistributed.systems](https://understandingdistributed.systems/) | The on-ramp if Kleppmann feels heavy — same territory, friendlier pace. |
| Code-level judgment | *A Philosophy of Software Design* — John Ousterhout | [stanford.edu](https://web.stanford.edu/~ouster/cgi-bin/book.php) | Short and opinionated — about complexity, not syntax. |
| Craft & habits | *The Pragmatic Programmer* (20th anniv.) — Hunt & Thomas | [pragprog.com](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/) | The classic on professional habits that compound. |
| Career | *Staff Engineer* — Will Larson | [staffeng.com/book](https://staffeng.com/book) | Free essays and interviews at [staffeng.com](https://staffeng.com/) — how real staff engineers operate. |

## Free Courses & Lectures

| Course | Link | Why |
|---|---|---|
| MIT 6.824 Distributed Systems | [pdos.csail.mit.edu/6.824](https://pdos.csail.mit.edu/6.824/) | Fundamentals taught the senior way: through real papers (Raft, GFS, Spanner) and "how does this break" reasoning. Lectures and labs are free. |
| CMU 15-445 Database Systems | [15445.courses.cs.cmu.edu](https://15445.courses.cs.cmu.edu/) | Database internals from Andy Pavlo — why your queries behave the way they do. Lectures free on YouTube. |
| The Missing Semester (MIT) | [missing.csail.mit.edu](https://missing.csail.mit.edu/) | The tooling universities skip: shell, git, debugging, profiling. |
| Google SRE resources | [sre.google](https://sre.google/) | Both SRE books plus workshop material, free. |
| AWS Well-Architected Framework | [aws.amazon.com/architecture/well-architected](https://aws.amazon.com/architecture/well-architected/) | A senior review checklist in disguise: reliability, security, cost, operational excellence. One of the few mainstream resources treating **cost as an architectural input**. |
| Cloud architecture centers | [AWS](https://aws.amazon.com/blogs/architecture/) · [Azure](https://learn.microsoft.com/azure/architecture/) · [GCP](https://cloud.google.com/architecture) | Worked reference architectures, many per industry — raw material for the capability map. |

## Blogs & Newsletters

| Source | Link | Why |
|---|---|---|
| The Pragmatic Engineer — Gergely Orosz | [newsletter.pragmaticengineer.com](https://newsletter.pragmaticengineer.com/) | How engineering actually works inside real companies. The closest thing to a seniority newsletter. |
| martinfowler.com | [martinfowler.com](https://martinfowler.com/) | Architecture patterns with the reasoning shown. |
| charity.wtf — Charity Majors | [charity.wtf](https://charity.wtf/) | Observability and operational honesty — "explainable, reliable, traceable" as a worldview. |
| Irrational Exuberance — Will Larson | [lethain.com](https://lethain.com/) | Careful essays on engineering strategy and career judgment. |
| Dan Luu | [danluu.com](https://danluu.com/) | Evidence-heavy deep dives that question popular wisdom. |
| Architecture Weekly | [github.com/oskardudycz/ArchitectureWeekly](https://github.com/oskardudycz/ArchitectureWeekly) | A weekly curated link list on architecture — a good discovery feed. |

## Real Systems: Company Engineering Blogs

The reverse of a course: here the constraints came first and the design followed.

| Source | Link | Known for |
|---|---|---|
| Cloudflare | [blog.cloudflare.com](https://blog.cloudflare.com/) | Gold-standard public outage writeups — full root-cause analyses of their own failures. |
| Netflix TechBlog | [netflixtechblog.com](https://netflixtechblog.com/) | Resilience engineering, chaos testing, scale. |
| Stripe | [stripe.com/blog/engineering](https://stripe.com/blog/engineering) | Payments — money-grade correctness and idempotency. |
| Uber Engineering | [eng.uber.com](https://eng.uber.com/) | Real-time systems, data platforms, migrations. |
| Shopify Engineering | [shopify.engineering](https://shopify.engineering/) | E-commerce peak scaling (Black Friday as a design constraint). |
| Slack Engineering | [slack.engineering](https://slack.engineering/) | Messaging architecture and incremental migration stories. |
| Meta Engineering | [engineering.fb.com](https://engineering.fb.com/) | Infrastructure at extreme scale. |
| GitHub Engineering | [github.blog/engineering](https://github.blog/engineering/) | Also publishes monthly availability reports — recurring public postmortems. |
| High Scalability | [highscalability.com](https://highscalability.com/) | Long-running aggregator of "real-life architectures." |

## The Postmortem Habit

The highest-yield practice no course offers. Twenty postmortems teach more judgment than any certificate, because they are the only study material with the happy path already removed.

- **The list:** [github.com/danluu/post-mortems](https://github.com/danluu/post-mortems) — hundreds of public incident reports, categorized.
- **The culture:** [Postmortem Culture chapter, Google SRE book](https://sre.google/sre-book/postmortem-culture/) — how to write and run blameless postmortems.
- **The protocol:** read one per week and interrogate it with the [senior reflex questions](becoming_senior.md#the-senior-reflex-questions): what category of failure was this, what code-level guarantee was missing, who got paged and what did they see, what did the business lose?

## Papers That Built the Industry

Read them through [MIT 6.824](https://pdos.csail.mit.edu/6.824/)'s schedule rather than cold — the lectures supply the "how does this break" commentary.

- **Dynamo** (Amazon) — [Werner Vogels' post with the paper](https://www.allthingsdistributed.com/2007/10/amazons_dynamo.html): availability over consistency, and the birth of NoSQL trade-off language.
- **Raft** — [raft.github.io](https://raft.github.io/): consensus explained to be understood, with visualizations.
- **Latency numbers every programmer should know** — [the classic gist](https://gist.github.com/jboner/2841832) and an [interactive year-by-year version](https://colin-scott.github.io/personal_website/research/interactive_latency.html). Memorize the orders of magnitude — back-of-envelope fluency starts here.

## System Design

Two different games share this name. **Interview system design** is a formalized 45-minute game with known moves — worth learning for the vocabulary and the doors it opens. **Real system design** is the senior skill: the same components under constraints the interview omits — cost, compliance, team size, migration from what exists, and who operates it at 3 a.m.

| Resource | Link | Role |
|---|---|---|
| System Design Primer | [github.com/donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) | The free interview-prep standard. Use as an **index of components**, not as truth. |
| ByteByteGo / *System Design Interview* vol. 1–2 — Alex Xu | [bytebytego.com](https://bytebytego.com/) | Well-drawn maps of common designs. Same caveat: optimized for interviews, no real failure data. |
| Awesome Scalability | [github.com/binhnguyennus/awesome-scalability](https://github.com/binhnguyennus/awesome-scalability) | Curated real-world engineering articles, organized by principle (by a Vietnamese engineer). |
| C4 model | [c4model.com](https://c4model.com/) | Diagrams that stay at one altitude at a time — how seniors communicate designs. |
| Architecture Decision Records | [adr.github.io](https://adr.github.io/) · [templates](https://github.com/joelparkerhenderson/architecture-decision-record) | Capture the *why*. In real work the design doc is the deliverable, not the whiteboard. |
| Architectural katas — Neal Ford | [nealford.com/katas](https://nealford.com/katas/) | Practice scenarios: design for a business case and defend the trade-offs. |
| AWS Well-Architected | [link above](#free-courses-lectures) | The review checklist to run your own designs against. |

A real design is not done when the diagram is complete. It is done when it answers: **what breaks first, what does it cost, how do we migrate without downtime, and what does the on-call engineer see when it fails.**

## Practice Drills

Reading builds vocabulary; only practice builds judgment.

1. **One postmortem per week** — with the protocol above.
2. **Reverse-engineer a product you use.** Design Grab or Shopee's order flow yourself — estimates, data model, failure paths — then find the company's engineering blog and compare. The delta is your personalized curriculum.
3. **Katas with business constraints.** Take a [kata](https://nealford.com/katas/) and add the senior clauses: "regulator requires 7-year audit trails, ops team is four people, budget is fixed." That last clause is what separates senior practice from interview practice.
4. **Back-of-envelope drills.** QPS, storage per year, cost per month — from the [latency numbers](https://gist.github.com/jboner/2841832) up. Seniors kill bad architectures in thirty seconds of arithmetic.
5. **One design doc per quarter** — for real work, even retroactively for a system that already exists. Get it torn apart by someone senior; record decisions as [ADRs](https://adr.github.io/).
6. **Own a service end to end** — its on-call, its dashboard, its cost line. Nothing teaches the failure path like being paged for it.
7. **Learn one industry deeply** — its capabilities, regulators, and vocabulary — until the capability map unrolls by itself ([Becoming Senior](becoming_senior.md#think-in-business-capabilities-not-frameworks)).
8. **Write publicly.** Explaining a design or an incident to strangers is the cheapest design review available — and it trains the communication half of seniority.

## Suggested Cadence

| Rhythm | Practice |
|---|---|
| **Weekly** | 1 postmortem (with protocol) + 1 essay from the blogs above. |
| **Monthly** | 1 architectural kata or reverse-engineering exercise + 1 paper or deep-dive article. |
| **Quarterly** | 1 design doc written and reviewed + 1 book from the tables. |
| **Ongoing** | Own a service end to end; go deep in one industry; write publicly. |

Sustained for a year, this is roughly 50 postmortems, 12 design exercises, 4 reviewed design docs, and 4 of the books above — more judgment-per-hour than any certificate path, because every hour is spent where the happy path has already failed.
