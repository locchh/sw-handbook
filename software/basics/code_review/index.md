# How to Review Code

Every day, developers read diffs and review pull requests. It looks simple — lines in red and green — but reading a diff fluently, and reviewing code well, are two different skills. This guide covers both: how to decode what `git diff` is actually telling you, and what a thorough code review really requires beyond just reading the lines that changed.

This page owns **reading diffs and reviewing PRs**. For the branch mechanics underneath — merge vs. rebase, conflicts, the daily branch workflow — see [Git: Merge vs Rebase](https://locchh.github.io/sw-handbook/software/basics/git/index.md); for where review sits in the delivery process, see [Lifecycle](https://locchh.github.io/sw-handbook/software/basics/lifecycle/index.md).

## Part 1 — Reading Git Diff

### What is a Git Diff?

A git diff shows the **differences between two states** — two branches, two commits, or a working file vs. the last commit. It answers the question: *"What changed?"*

A **MR (Merge Request) / PR (Pull Request)** is a request to apply a diff from one branch into another. The platform (GitLab/GitHub) displays the diff so reviewers can inspect what will change before approving.

______________________________________________________________________

### Running Git Diff — Two Forms

There are two forms, and the order of "old" vs "new" differs between them.

#### Single-argument form (while checked out on a branch)

```
# Stand on branch feature, compare with main
git diff main
```

- **Current branch** (`feature`) = **new version** (`+++`)
- **Argument branch** (`main`) = **old version** (`---`)

> **Rule:** current branch is always "new", argument branch is always "old".

If you swap — stand on `main` and run `git diff feature` — the `+` and `-` lines flip completely.

#### Two-argument form (explicit, recommended for PR review)

```
git diff <old> <new>
git diff main feature
```

- **First argument** (`main`) = **old version** (`---`)
- **Second argument** (`feature`) = **new version** (`+++`)

> **Rule:** first argument is always "old", second argument is always "new".

The naming looks like the opposite of the single-argument form, but the underlying rule is the same: **argument = old**. In the two-argument form, both are arguments, so first = old, second = new.

#### Comparing against remote tracking branches (best practice)

Local branches can be stale if you haven't pulled recently. Always compare remote tracking branches to get the true state of each branch:

```
git fetch
git diff origin/<old-branch> origin/<new-branch>
```

| Form                                  | Old (`---`)         | New (`+++`)             |
| ------------------------------------- | ------------------- | ----------------------- |
| `git diff A` (on branch A)            | A (argument)        | B (current)             |
| `git diff A B`                        | A (first)           | B (second)              |
| `git diff origin/main origin/feature` | origin/main (first) | origin/feature (second) |

______________________________________________________________________

### Overall Structure (Hierarchy)

```
diff (overall output)
└── per changed file
    ├── file header  (identifies which file changed)
    └── hunk(s)  (one or more regions of change per file)
        ├── hunk header  (where the change is + how many lines)
        └── hunk body   (the actual changes + surrounding context)
```

______________________________________________________________________

### 1. File Header

```
diff --git a/example.py b/example.py
index abc123..def456 100644
--- a/example.py
+++ b/example.py
```

| Line                     | Meaning                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `diff --git a/... b/...` | Which file changed. `a/` = old version, `b/` = new version         |
| `index abc123..def456`   | Git hashes of the old and new file versions                        |
| `100644`                 | File permission mode (regular file, owner read/write, others read) |
| `--- a/example.py`       | Lines marked `-` in the body belong to the **old/argument branch** |
| `+++ b/example.py`       | Lines marked `+` in the body belong to the **new/current branch**  |

______________________________________________________________________

### 2. Hunk Header

```
@@ -10,6 +10,7 @@ class Example:
```

**Format:** `@@ -old_start,old_count +new_start,new_count @@ context_name`

| Part             | Meaning                                                               |
| ---------------- | --------------------------------------------------------------------- |
| `-10,6`          | In the **old file**: change starts at line **10**, covers **6 lines** |
| `+10,7`          | In the **new file**: change starts at line **10**, covers **7 lines** |
| `class Example:` | Context hint — which class/function this change is inside             |

**How the counts are calculated:**

```
old_count  =  context lines  +  removed lines (-)
new_count  =  context lines  +  added lines (+)
```

So if one line was added, `new_count` will be exactly 1 more than `old_count`.

______________________________________________________________________

### 3. Hunk Body

The hunk body is a **merged view** of both old and new versions, using three types of lines:

| Symbol                | Meaning                                                                          |
| --------------------- | -------------------------------------------------------------------------------- |
| *(no symbol / space)* | **Context line** — unchanged, exists in both branches. Shown for reference only. |
| `-`                   | **Removed line** — exists in the old/argument branch, NOT in the current branch  |
| `+`                   | **Added line** — exists in the current branch, NOT in the old/argument branch    |

**Example:**

```
@@ -10,6 +10,7 @@ class User:
         self.id: int = 0            ← context (unchanged)
         self.name: str = ""          ← context (unchanged)
         self.email: str = ""         ← context (unchanged)
+        self.role: str = "viewer"    ← added in current branch
                                      ← context (blank line, unchanged)
     # ----------------------------   ← context (unchanged)
     # Helper methods                 ← context (unchanged)
```

Git shows ~3 context lines above and below each change by default, so you have enough surrounding code to understand where the change happened without opening the file.

______________________________________________________________________

### 4. Multiple Hunks Per File

A file can have **many hunks** if changes happened in different regions. Each hunk has its own header and body. They appear sequentially in the diff output.

```
@@ -10,6 +10,7 @@    ← hunk 1: change near line 10
...
@@ -45,9 +46,13 @@   ← hunk 2: change near line 45
...
@@ -90,14 +95,49 @@  ← hunk 3: change near line 90
...
```

______________________________________________________________________

### 5. Quick Summary Commands

```
# Show files changed + insertions/deletions per file
git diff --stat B

# Show only the total numbers
git diff --shortstat B
```

Example output of `--stat`:

```
 src/user.py    |  12 ++++++----
 src/config.py  |   3 +++
 2 files changed, 15 insertions(+), 4 deletions(-)
```

Example output of `--shortstat`:

```
2 files changed, 15 insertions(+), 4 deletions(-)
```

______________________________________________________________________

## Part 2 — Reviewing a PR/MR

### 6. Beyond the Diff — Understanding a PR/MR

A **MR (Merge Request) / PR (Pull Request)** is a request to apply a diff from one branch into another. Reading the diff tells you *what* changed — but a complete code review requires understanding four layers:

| Layer                | Source                         | Tells you                               |
| -------------------- | ------------------------------ | --------------------------------------- |
| **What changed**     | `git diff`                     | Exact lines added/removed               |
| **Why it changed**   | Commit messages (`git log`)    | The author's intent                     |
| **How it fits**      | Codebase / architecture        | Design patterns, structure, conventions |
| **Business context** | PR description, linked tickets | The requirement or bug being solved     |

A reviewer who only reads the diff might approve code that is technically correct but architecturally wrong, or reject code that looks unusual but has a valid reason.

______________________________________________________________________

### 7. Reading Commit Messages to Understand Intent

```
# See all commits in branch B that are not in branch A
git log A..B --oneline

# See full commit messages
git log A..B
```

A good commit message explains **what** changed and **why**:

```
Add role field to User — needed for permission checks in #123
```

A bad commit message gives you nothing:

```
fix
update
wip
```

When commit messages are poor, you must rely more on the PR description and linked tickets to understand intent. This is why good commit discipline is a **team responsibility** that seniors enforce during reviews.

______________________________________________________________________

### 8. What Seniors Look For in a PR Review

Reading a diff fluently is a necessary foundation, but senior reviewers go further:

- **Intent** — does this change solve the right problem?
- **Architecture** — is the approach well-designed, or over-engineered?
- **Edge cases** — what happens with invalid input, race conditions, or failures?
- **Security** — any injection risks, exposed secrets, improper access control?
- **Performance** — any N+1 queries, unnecessary loops, or memory leaks?
- **Testability** — is the code testable, are tests included and meaningful?
- **Readability** — is the code clear to the next person who reads it?
- **Consistency** — does it follow the project's conventions and patterns?

The standard PR review workflow:

```
# 1. Get latest remote state
git fetch                                                                                                                                                                    

# 2. See what commits the feature added (Before and After)
git log origin/main..origin/feature --oneline                                        

# 3. See the full file changes
git diff origin/main origin/feature                                                                                                                                          

# 4. Optional: commits + changes together
git log origin/main..origin/feature --oneline --stat
```

Why this order:

- `git log` first — understand the story (how many commits, what they claim to do)
- `git diff` second — verify the actual changes match the commit messages

______________________________________________________________________

## Part 3 — AI-Assisted Code Review

Human reviewers are expensive and slow. AI review tools have emerged to run a first pass on every PR automatically — catching bugs, flagging security issues, and surfacing problems before a human even opens the diff. Two of the most capable are **Devin Review** and **Claude Code Review**.

______________________________________________________________________

### 9. Devin Review

Devin Review was built around a specific insight: as AI generates more code, the bottleneck shifts from writing to reviewing. A PR that took hours to write can contain thousands of lines that no human has time to read carefully.

**How it works:**

Devin Review comes in two modes:

- **Webapp** — diff-only review. Uses the GitHub API and a pre-indexed snapshot of the repo to power codebase-aware chat ("Ask Devin"). No fresh clone triggered.
- **CLI (`devin-review`)** — enables "deeper analysis than diff-only review" (Cognition's own words). Fetches the PR branch, checks it out into an isolated local git worktree, and sends the diff to Devin's servers. The Bug Catcher can then run read-only shell commands (`cat`, `grep`, `find`, `ls`, etc.) scoped to that worktree for deeper file-level analysis.

Rather than reading a diff as a flat list of changed lines, it reorganizes changes semantically — grouping related edits together and detecting when code was moved or copied, so those show as relocations rather than full deletes and re-inserts. This makes the diff genuinely easier for a human to read even before the AI analysis begins.

On top of that, an integrated **Bug Catcher** analyzes the PR and categorizes its findings into two types:

| Type                     | Icon | Meaning                                                              |
| ------------------------ | ---- | -------------------------------------------------------------------- |
| **Bug** (severe)         | 🔴   | An actionable error that requires immediate attention before merging |
| **Bug** (non-severe)     | 🟠   | An issue worth reviewing, but not necessarily blocking               |
| **Flag** (investigate)   | —    | Warrants closer inspection — something unusual or risky              |
| **Flag** (informational) | —    | Explains what code does without requiring any action                 |

**Triggers:** Auto-review can be configured to run when a PR is opened, when new commits are pushed, when a draft is marked ready, or when an enrolled user is added as a reviewer. Users can self-enroll without admin permissions.

**Customization:** Add a `REVIEW.md` to your repository to define which areas need scrutiny, which conventions to enforce, and which files to ignore. Additional glob-pattern rules can be configured in Settings > Review.

**Ref:** [Devin Review](https://app.devin.ai/review) — Cognition AI | [Docs](https://docs.devin.ai/work-with-devin/devin-review) | [Blog: Devin Review: AI to Stop Slop](https://cognition.ai/blog/devin-review)

______________________________________________________________________

### 10. Claude Code Review

Claude Code Review takes a multi-agent approach: instead of one model reading the diff, a fleet of specialized agents examines the PR in parallel, each looking for a different class of issue. A verification step then checks each candidate finding against actual code behavior to filter out false positives before anything is posted.

**How it works:**

Claude Code Review installs as a GitHub App (`Contents: read`, `Pull requests: read/write`) and pulls the full source on Anthropic's infrastructure when a review triggers. Agents then analyze the diff in the context of the full codebase — not just the lines that changed. The results are deduplicated, ranked by severity, and posted as inline comments on the specific lines where issues were found. If nothing is found, Claude posts a short confirmation comment rather than staying silent.

Each finding is tagged with a severity level:

| Marker | Severity     | Meaning                                         |
| ------ | ------------ | ----------------------------------------------- |
| 🔴     | Normal       | A bug that should be fixed before merging       |
| 🟡     | Nit          | A minor issue, worth fixing but not blocking    |
| 🟣     | Pre-existing | A bug in the codebase not introduced by this PR |

**Default focus:** Correctness only — bugs that would break production. It does not flag formatting preferences or missing test coverage unless you tell it to.

**Triggers:** Runs when a PR is opened, on every push, or manually via `@claude review` in a PR comment. Manual mode is useful for high-traffic repos where you want to opt specific PRs into review.

**Customization:** Two files control behavior:

- `CLAUDE.md` — shared project instructions used by all Claude Code tasks, not just reviews. Violations in new code are flagged as nits.
- `REVIEW.md` — review-only rules: what to always flag, what to skip, team conventions. Keeps review guidance separate from general project instructions.

**Ref:** [Claude Code Review](https://code.claude.com/docs/en/code-review) — Anthropic

______________________________________________________________________

### Comparing the Two

Both tools post inline comments on GitHub PRs without blocking existing review workflows. The key differences are in approach:

|                             | Devin Review                                                                                 | Claude Code Review                             |
| --------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Source access**           | Webapp: diff + pre-indexed context. CLI: local worktree checkout with read-only shell access | GitHub App, full repo on Anthropic infra       |
| **Core idea**               | Reorganize the diff + bug detection                                                          | Multi-agent parallel analysis of full codebase |
| **Severity system**         | Bugs (severe/non-severe) + Flags                                                             | 🔴 Normal / 🟡 Nit / 🟣 Pre-existing           |
| **Default scope**           | Bugs and code understanding                                                                  | Correctness bugs only                          |
| **Customization**           | `REVIEW.md` + glob rules in settings                                                         | `CLAUDE.md` + `REVIEW.md`                      |
| **Manual trigger**          | Add enrolled user as reviewer                                                                | Comment `@claude review` on PR                 |
| **False positive handling** | Confidence levels on findings                                                                | Verification step filters before posting       |

**Reading only the diff isn't enough.** A change that looks correct in isolation can break something elsewhere in the codebase that was never touched by the PR. Claude Code Review accesses the full repository to catch these cross-file issues. Devin Review's webapp mode uses a pre-indexed snapshot for this context, while the CLI mode checks out the full worktree locally. For Claude Code Review, cost scales with codebase size, not just PR size: the larger the repo, the more context the agents load and analyze.

Neither tool replaces a human reviewer — they are a first pass that catches the obvious problems so human attention can focus on intent, architecture, and judgment calls that AI cannot make.

______________________________________________________________________

## Quick Reference Cheat Sheet

```
Single-argument form (on branch A):
  git diff A
           ↑
           A = old (---)
           B (current) = new (+++)

Two-argument form:
  git diff <old> <new>
           ↑      ↑
           old    new
           (---)  (+++)

PR review best practice:
  git fetch
  git diff origin/main origin/feature
                ↑              ↑
               old            new
              (---)           (+++)

File header:
  diff --git a/file b/file   → which file
  --- a/file                 → old version (first arg)
  +++ b/file                 → new version (second arg)

Hunk header:
  @@ -old_start,old_count +new_start,new_count @@ function_name
       ↑                    ↑
       old = context + (-)  new = context + (+)

Hunk body:
  (space) context line  → unchanged, in both versions
  -       removed line  → only in old branch
  +       added line    → only in new branch
```

**Further reading:** [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/) — Vincent Driessen. The branching model this workflow assumes is summarized in [Lifecycle → Version Control](https://locchh.github.io/sw-handbook/software/basics/lifecycle/#version-control).
