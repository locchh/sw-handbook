# Becoming Senior

Seniority is not years of experience or the number of frameworks you know. It is technical skill anchored in business meaning: a senior engineer designs for the failure path, thinks in business capabilities rather than libraries, and can answer feasibility, cost, and risk — not only "how do I code it."

## Why It Matters

- **Frameworks rotate; capabilities endure** — claims adjudication, KYC, and settlement reconciliation outlive every JavaScript framework.
- **Companies pay for outcomes** — a business capability that fails well, not code that works on the happy path.
- **The gap between mid and senior is judgment, not syntax** — knowing *which* mechanism fits the problem, and what happens when it breaks.

## The Ladder

| Level      | What they deliver                                                                      | What they receive |
| ---------- | -------------------------------------------------------------------------------------- | ----------------- |
| **Junior** | Makes it work — the happy path runs.                                                   | Tasks.            |
| **Mid**    | Makes it right — correct, tested, maintainable.                                        | Features.         |
| **Senior** | Makes it survive contact with the business — failure paths, money, compliance, people. | Problems.         |
| **Staff+** | Makes the organization effective — direction, leverage, alignment.                     | Ambiguity.        |

The step to senior is not "more code, faster." It is a change in what you consider the deliverable.

## Think in Business Capabilities, Not Frameworks

When a senior engineer hears an industry name, a map unrolls by itself — from business need down to deployment:

```
flowchart LR
    A[Business capability] --> B[Services]
    B --> C[Modules / code]
    C --> D[Data]
    D --> E[Infrastructure]
    E --> F[Deployment & operations]
```

The same capabilities recur across industries, wearing different names:

| Capability                 | Appears as                                          |
| -------------------------- | --------------------------------------------------- |
| Identity & authentication  | Login, KYC, member verification, SSO                |
| Payment                    | Checkout, claims payout, payroll, settlement        |
| Document extraction        | Invoices, medical records, contracts, customs forms |
| Customer support           | Tickets, disputes, returns, escalations             |
| Notification               | Alerts, statements, reminders, confirmations        |
| Reconciliation & reporting | Ledgers, audits, end-of-day batches                 |

And each industry adds its own constraints on top:

| Industry   | Core capabilities                               | Hard constraints                             |
| ---------- | ----------------------------------------------- | -------------------------------------------- |
| Insurance  | Policy admin, underwriting, claims, reinsurance | Audit trails, retention, regulator reporting |
| Banking    | Ledger, KYC/AML, settlement, lending            | SOX, Basel, dual approval, immutability      |
| Healthcare | Records, claims, scheduling, prescriptions      | HIPAA, consent, data residency               |
| E-commerce | Catalog, cart, checkout, fulfillment            | PCI-DSS, peak scaling, fraud                 |
| Logistics  | Routing, tracking, warehouse, customs           | SLAs, offline tolerance, partner integration |

A senior hears "claims processing" and thinks: intake (multi-channel, dedup) → validation gates → fraud scoring with a human-review threshold → adjudication against rules → payout (idempotent payment, caps, dual approval) → audit trail → batch reconciliation. That map — not the framework list — is what transfers between jobs.

## Design for the Failure Path

Code that works is only the beginning; **a system that fails well is the job**. The first senior habit is classifying errors, because each category has a different owner and a different correct response:

| Category       | Meaning                                                    | Whose decision | Correct response                                         |
| -------------- | ---------------------------------------------------------- | -------------- | -------------------------------------------------------- |
| **Transient**  | Network blip, timeout, rate limit                          | Operations     | Retry with backoff + jitter; circuit breaker             |
| **Validation** | Input violates the contract                                | Contract owner | Reject with the specific violation; never "fix" silently |
| **Business**   | Policy forbids it (refund cap, change freeze, fraud block) | The business   | Not retryable — explain, route to approval or escalation |
| **Permission** | Caller lacks the right                                     | Security       | Deny, log, never leak internals                          |
| **Logic**      | Runs fine, wrong answer                                    | Engineering    | Tests, invariants, independent review                    |

Notice these are **business categories wearing technical clothes**. "Is this retryable?" is a policy question. A generic `"Operation failed"` is a senior-level sin because it erases the business meaning of the failure.

The supporting mechanics — see [Error Handling](https://locchh.github.io/sw-handbook/software/basics/error_handling/index.md) for details:

- **Fail fast** on violated invariants; **idempotency** on anything involving money.
- **Timeout budgets** end-to-end, not per-call.
- **Dead-letter queues** and **compensation (sagas)** for multi-step workflows.
- **Never silent failure** — returning an empty result as "success" when a backend is down makes incomplete work look complete. It is the cardinal sin: the report ships with a hole and nobody knows.
- **Guarantees need code, not intentions** — a rule that must *never* be violated (verify identity before refund, cap payouts) needs a programmatic gate that blocks the action *before* execution. Instructions, conventions, and review checklists only improve the odds; they never reach zero failure.

## Observability Is a Property of the Pipeline

Observability is not a tool you buy. It is a property you design in: structure the system as a pipeline of **versioned stages with contracts**, **gates that enforce schema and policy**, and **records that keep full lineage** (correlation IDs, typed failures, run history).

Done right, one disciplined pipeline answers three audiences at once:

| Audience       | What they get               | Their question                                             |
| -------------- | --------------------------- | ---------------------------------------------------------- |
| **Compliance** | Coded gates, audit trail    | "Prove the forbidden action cannot pass."                  |
| **Operations** | Typed failures, run history | "What broke, where, is it retryable?"                      |
| **Leadership** | Stratified metrics          | "Which segment is weak, at which step, what does it cost?" |

The test is three words: is the system **explainable** (why did it produce this result?), **reliable** (does it fail well?), and **traceable** (can you follow one record end to end?).

## Reliability Is Measured, Not Felt

| Term             | Meaning                                                                      |
| ---------------- | ---------------------------------------------------------------------------- |
| **SLI**          | The indicator you measure (success rate, p99 latency, extraction accuracy).  |
| **SLO**          | The target you promise (99.5% over 30 days).                                 |
| **Error budget** | The failure you are *allowed* — spend it on releases, freeze when it's gone. |

For systems with an automated path (extraction, scoring, auto-approval), the senior questions about "acceptance rate":

- **Never trust an aggregate.** 97% overall accuracy can hide a segment running at 85%. Stratify by type *and* field before automating anything.
- **Calibrate before you route.** Confidence scores are meaningless until validated against a labeled sample of real outcomes.
- **Keep sampling forever.** Stratified random human review of the auto-approved path is what catches novel failure patterns after launch.

## Escalation Is a Designed Path

Escalation is not an exception — it is a feature with its own design.

**Machine → human.** Explicit triggers, not vibes: policy gaps (silence in the policy is neither permission nor prohibition — escalate), exception requests, ambiguous identity (ask for another identifier, never guess), and an explicit request for a human (honor it immediately). The handoff is a **structured summary** — identifiers, what was verified, root cause, amounts, recommended action — because the human cannot see the transcript.

**Human → human.** Severity levels with definitions, on-call rotations, runbooks that a stranger can follow at 3 a.m., incident command for large events, and **blameless postmortems** that fix the system instead of the person.

## Deployment and Scale Are Part of the Design

The implementation details live in [CI/CD Platforms](https://locchh.github.io/sw-handbook/software/tool_tip/cicd/index.md) for delivery automation and [Running a Server](https://locchh.github.io/sw-handbook/software/tool_tip/server_operations/index.md) for capacity, monitoring, and incident triage.

- **Progressive delivery** — feature flags, canary, blue-green. Rollback is a first-class requirement, not an apology.
- **Capacity is planned**, not discovered during the traffic spike.
- **Disaster recovery has numbers** — RPO (how much data you may lose) and RTO (how long you may be down) — agreed with the business, not assumed.
- **Cost is an architectural input.** A design that doubles the cloud bill or needs five on-call engineers is a wrong design, even if it is elegant.

## Data Is Where the Risk Lives

In insurance, healthcare, and banking, most of the business risk is in the data, not the code: **ownership** (who may change it), **lineage** (where it came from), **quality** (see [Data Quality](https://locchh.github.io/sw-handbook/data/basics/data_quality/index.md)), **privacy and classification** (see [Data Security](https://locchh.github.io/sw-handbook/data/basics/data_security/index.md)), and **retention** (what must be kept, what must be deleted). A senior treats a schema change with the same care as a payment code change.

## Communication Is Part of the System

- **Write to decide** — design docs and ADRs (architecture decision records) turn arguments into reviewable artifacts and preserve the *why*.
- **Translate between languages** — the same design must answer compliance ("what cannot happen"), operations ("what do I see when it breaks"), and leadership ("what does it cost, what is the risk").
- **Deliver bad news early.** Feasibility, cost, and risk said honestly at the start is cheaper than a failed demo at the end.
- **Never accept a game you cannot win** — no real requirements, no real data, no realistic timeline: renegotiate the scope before you build.

## How to Practice

1. **Own a service end to end** — including its on-call, its dashboard, and its cost line.
1. **Write postmortems** for your own incidents; read other companies' public ones.
1. **Demand real data early.** Rebuild one of your happy-path demos with production-shaped data and watch what breaks.
1. **Estimate before you build** — capacity, cost, and timeline; then compare with reality afterwards.
1. **Learn one industry deeply** — its capabilities, regulators, and vocabulary — until the capability map unrolls by itself.
1. **Write one design doc per quarter** and get it torn apart by someone senior.
1. **Automate your repetitive work** — keep your attention for judgment, not clicking.

## The Senior Reflex Questions

Ask these by reflex about any design — your own first:

- What happens when this fails? Which category of failure is it, and who owns that decision?
- What must *never* happen — and what **code** (not instruction) enforces it?
- Who gets paged, and what do they see when they open the alert?
- What will compliance need to prove afterwards?
- What is the acceptance rate — per segment, not aggregate — and how is it calibrated?
- What is the narrowest mechanism that covers this need?
- Is it feasible, what does it cost, what is the risk, and is now the right time?

## Anti-Patterns

- **Framework collecting** — technology for the résumé, not the problem.
- **Happy-path demos on mock data** — real data always reveals patterns mock data cannot.
- **The prompt/config patch** — strengthening instructions where the requirement is a guarantee.
- **Silent failure** — anything that makes incomplete work look complete.
- **The post-hoc fix** — validating or reversing after the damage, when a pre-execution gate was possible.
- **Burden shift** — making users or teammates restructure their work to accommodate your system.

## Further Reading

The full self-study path — books, courses, blogs, postmortems, papers, and practice drills with links — lives in [The Senior Curriculum](https://locchh.github.io/sw-handbook/software/basics/senior_curriculum/index.md). The short version:

- *Designing Data-Intensive Applications* — Martin Kleppmann
- *Release It!* — Michael Nygard
- *The Staff Engineer's Path* — Tanya Reilly
- *Site Reliability Engineering* — Google (free at sre.google)
- *Learning Domain-Driven Design* — Vlad Khononov
