# Spec-Driven Development with AI

Spec-driven development (SDD) makes intent an explicit, reviewable artifact before implementation. With an AI coding agent, the specification also becomes durable context that can survive across sessions and agents.

```
Problem → Constraints → Specification → Plan → Tasks → Implementation → Verification
```

SDD is not “write a large document first.” A useful spec is proportional to the risk and uncertainty of the change.

For the agents these tools run on top of, see [The LLM Landscape → CLI Coding Agents](https://locchh.github.io/sw-handbook/ai/basics/landscape/#cli-coding-agents); for day-to-day habits when pairing with an AI, see [Tips](https://locchh.github.io/sw-handbook/software/tool_tip/tips/index.md).

## What the Spec Should Contain

- **Outcome:** what changes for the user or system?
- **Scope:** what is deliberately included and excluded?
- **Constraints:** compatibility, security, performance, policy, and deadlines.
- **Behavior:** concrete examples and edge cases.
- **Interfaces:** affected APIs, events, data models, and dependencies.
- **Verification:** observable acceptance criteria.
- **Open questions:** decisions that must not be silently guessed.

The spec should describe the problem and contract. The implementation plan describes how this codebase will satisfy it.

## Four Tooling Approaches

The tools below overlap, but emphasize different failure modes. Their features and platform support evolve quickly; the comparison describes their primary design intent rather than a permanent compatibility matrix.

| Tool            | Primary emphasis                                        | Process weight | Good fit                                                             |
| --------------- | ------------------------------------------------------- | -------------- | -------------------------------------------------------------------- |
| **GSD Core**    | Fresh-context execution and durable phase state         | Medium         | Long agent sessions and phased solo work                             |
| **BMad Method** | Adaptive delivery workflow with specialist perspectives | High           | Larger initiatives needing product, architecture, and test artifacts |
| **Spec Kit**    | Structured path from principles to executable tasks     | Medium         | Teams wanting explicit clarification and specification stages        |
| **Agent OS**    | Discovering and injecting codebase standards            | Low            | Existing repositories where agent output is inconsistent             |

## GSD Core

[GSD Core](https://github.com/open-gsd/gsd-core) organizes work into a repeated phase loop: discuss, plan, execute, verify, and ship. Heavy work can run in fresh contexts while state files carry decisions between phases.

**Strength:** context management and phase continuity.

**Trade-off:** an opinionated artifact and command structure.

The original `gsd-build/get-shit-done` repository was archived in June 2026; active development moved to `open-gsd/gsd-core`. Follow the active repository’s installation instructions.

## BMad Method

[BMad Method](https://github.com/bmad-code-org/BMAD-METHOD) models a broader AI-assisted delivery lifecycle. It can bring product, architecture, UX, development, and testing perspectives into the workflow and scale the amount of process to the work.

**Strength:** comprehensive planning and delivery coverage.

**Trade-off:** more roles, artifacts, and decisions to navigate.

Use it when the coordination value exceeds the process cost. A small fix should not require an enterprise project ceremony.

## Spec Kit

[GitHub Spec Kit](https://github.com/github/spec-kit) centers the specification itself. Its workflow moves through project principles, specification, clarification, implementation planning, tasks, and execution.

**Strength:** clear separation between what is needed and how it will be built.

**Trade-off:** requires active human decisions; structure does not guarantee a good spec.

This is a strong default when ambiguity, rather than context-window management, is the main failure mode.

## Agent OS

[Agent OS](https://github.com/buildermethods/agent-os) focuses on discovering codebase conventions and making them available while shaping a specification and implementing it.

**Strength:** lightweight alignment with an established repository.

**Trade-off:** not a complete product or delivery lifecycle.

It can complement another workflow: standards answer “how we work here,” while a delivery method answers “how this change moves from idea to verified code.”

## The Tools Are Composable—but Cost Adds Up

The approaches address three distinct concerns:

```
Standards       → Agent OS
Specification   → Spec Kit
Orchestration   → GSD Core or BMad Method
```

Combining them can work, but each adds vocabulary, files, commands, and maintenance. Start with one clear problem:

- **The agent loses context:** evaluate GSD Core.
- **The initiative needs coordinated product and technical artifacts:** evaluate BMad.
- **Requirements remain ambiguous until implementation:** evaluate Spec Kit.
- **Generated code ignores repository conventions:** evaluate Agent OS.

## A Tool-Independent SDD Loop

You can get most of the benefit without installing a framework:

1. Write a one-paragraph problem statement.
1. List in-scope and out-of-scope behavior.
1. Add examples, failure cases, and acceptance criteria.
1. Inspect the repository and record relevant constraints.
1. Resolve high-impact questions before planning.
1. Decompose the plan into independently verifiable tasks.
1. Implement one task at a time.
1. Run tests and compare the result with the acceptance criteria.
1. Update the spec if the intended behavior changed.

The last step matters: a stale spec is worse than no spec because it looks authoritative.

## Failure Modes

- **Specification theater:** many documents, few concrete decisions.
- **Premature implementation detail:** the spec dictates filenames before the codebase is understood.
- **Unbounded scope:** every adjacent improvement becomes part of the feature.
- **Agent-authored assumptions:** unanswered questions are converted into confident requirements.
- **No executable evidence:** acceptance criteria cannot be tested or observed.
- **Stale artifacts:** implementation changes while the spec remains frozen.

## Rule of Thumb

Use enough specification to make the next expensive mistake visible before code is written. Keep humans accountable for goals, trade-offs, and acceptance; use agents to explore, draft, challenge, and execute under those decisions.
