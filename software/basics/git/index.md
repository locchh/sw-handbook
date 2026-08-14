# Git: Merge vs Rebase

The two commands every branch workflow runs on, and the mental model that keeps them straight.

This page owns the **branch mechanics** — fetch vs. pull, `origin/main`, merge, rebase, conflicts, and the daily loop. For reading the resulting diff and reviewing a PR, see [Code Review](https://locchh.github.io/sw-handbook/software/basics/code_review/index.md); for the branching model these commands serve, see [Lifecycle → Version Control](https://locchh.github.io/sw-handbook/software/basics/lifecycle/#version-control); for the commands themselves as a quick lookup, see [Linux Commands → Git Essentials](https://locchh.github.io/sw-handbook/software/tool_tip/linux_commands/#git-essentials).

## 1. The Core Concept

Both commands integrate changes from one branch into another, but in different directions and for different purposes.

> **merge** = integrate your work **into** the product (feature → main)
>
> **rebase** = integrate the product's updates **into** your work (main → feature)

```
rebase: main → your feature (you catch up)
merge:  your feature → main (you ship)
```

## 2. Understanding the Three Layers

There are 3 things, not 2:

| No  | Name                   | Where                    | Purpose                                             |
| --- | ---------------------- | ------------------------ | --------------------------------------------------- |
| 1   | Remote branch          | GitHub server            | Source of truth — the real `main`                   |
| 2   | Remote tracking branch | Your machine (read-only) | `origin/main` — cached copy, updated by `git fetch` |
| 3   | Local branch           | Your machine             | `feature`, etc. — where you work                    |

### `origin/main` is a local cache, not GitHub itself

`origin/main` lives on **your machine** inside `.git/refs/remotes/origin/main`. It is a read-only snapshot of what GitHub looked like the last time you fetched.

```
GitHub (real): main → A-B-C-D
        ↑
git fetch (refresh cache)
        ↓
Your machine: origin/main → A-B-C-D (cache, read-only)
```

**Analogy:** Think of it like a news app on your phone.

- GitHub = the actual news server
- `origin/main` = news cached on your phone
- `git fetch` = hitting refresh to get latest news

### What `git fetch` does (and does NOT do)

| Command     | What it updates                                      |
| ----------- | ---------------------------------------------------- |
| `git fetch` | Only `origin/*` (remote tracking branches)           |
| `git pull`  | `fetch` + auto-merges into your current local branch |

`git fetch` is "safe" — it never touches your local branches or working files.

```
After git fetch:

origin/main → updated ✓
origin/dev  → updated ✓

local feature → unchanged ✗
```

### Local `main` is optional — senior devs delete it

`git fetch` updates `origin/main` but does **not** update your local `main` — it goes stale immediately. You never need it. Delete it:

```
git branch -d main
```

`origin/main` is always fresh after `git fetch` — use that instead.

```
# If you need to build/test from latest main:
git fetch
git checkout --detach origin/main  # detached HEAD, no branch created
# build, test, run
git checkout feature/your-branch   # return to your work
```

## 3. Git Merge

Combines histories by creating a new merge commit. In real workflow, **you never run this manually** — it happens when you click "Merge pull request" on GitHub, GitLab, Bitbucket, or VS Code's Source Control panel.

```
main: A - B - C ----------\
                           \
feature:      D  -  E   -  [M] <- merge commit (created by GitHub/VS Code)
```

- `[M]` has two parents: the tip of `main` and the tip of `feature`
- Full history is preserved — you can always see where the branch came from
- **You do this via PR/MR, not the terminal**

### What the UI does under the hood

When you click "Merge pull request":

```
git checkout main
git merge feature/your-branch  # creates [M] on main
```

### Never use `git merge` locally to catch up

Some developers run `git merge main` on their feature branch to pull in upstream changes. Don't — it litters your feature branch with a noisy merge commit:

```
feature: D - E - [M] <- "merged main into feature" — this is just noise
```

Reviewers see this extra commit mixed in with your real work. Use `git rebase origin/main` instead (see §4).

## 4. Git Rebase

Takes your commits and **replants them on top of the latest main**. No merge commit — history stays linear.

### Before rebase

Your feature branch was created when main was at `B`. Main has since moved to `C`.

```
main:    A - B - C
              \
feature:       D - E   (based on B, now behind)
```

### After `git rebase origin/main`

Git lifts `D` and `E` off their old base and replays them after `C`:

```
main:    A - B - C
                  \
feature:           D' - E'   (rebased on C, now up to date)
```

### Why D' and E' (not D and E)?

Rebase **rewrites** your commits. Each replayed commit gets a new parent and a new hash. The content of your changes is the same, but they are technically new objects.

### How to run it

```
git fetch                  # update origin/main cache
git rebase origin/main     # replay your commits on top
```

### Rules

- Only rebase **your own local/feature branches** — never a shared branch
- Rewriting a branch others have cloned breaks their history
- This is a local operation — no one sees it until you `git push`

## 5. Interactive Rebase: Cleaning Up History

### `git rebase origin/main`

Just replays your commits on top of latest main. Automatic.

### `git rebase -i origin/main`

`-i` = interactive. Opens an editor to clean up commits before replaying.

```
pick abc "wip"
pick def "fix"
pick ghi "fix again"

# change to:
squash abc "wip"
squash def "fix"
pick ghi "add login feature" # squash all 3 into 1 clean commit
```

**Interactive mode options:**

| Command  | What it does                     |
| -------- | -------------------------------- |
| `pick`   | Keep commit as-is                |
| `squash` | Merge into previous commit       |
| `reword` | Keep commit but edit the message |
| `drop`   | Delete commit entirely           |

|                         | When to use                                       |
| ----------------------- | ------------------------------------------------- |
| `rebase origin/main`    | Just catching up, commits are already clean       |
| `rebase -i origin/main` | Before opening PR, want to clean up messy history |

## 6. Resolving Conflicts

A conflict happens when two branches edit the **same line** in the same file. Git can't decide which version to keep — it stops and asks you to choose.

### What a conflict looks like

When Git hits a conflict, it injects markers directly into the file:

```
<<<<<<< HEAD (your branch)
const timeout = 3000;
=======
const timeout = 5000;
>>>>>>> origin/main
```

- `<<<<<<< HEAD` — your version
- `=======` — divider
- `>>>>>>> origin/main` — the incoming version

You must edit the file to remove the markers and leave only the correct code.

### Step-by-step: resolve in terminal

```
# 1. See which files have conflicts
git status
# → both modified: src/config.ts

# 2. Open the file, find the markers, fix the code manually
# (remove <<<, ===, >>> and keep the right version)

# 3. Stage the resolved file
git add src/config.ts

# 4. Continue (do NOT commit manually during rebase)
git rebase --continue   # or: git merge --continue
```

### Step-by-step: resolve in VS Code

VS Code has built-in conflict UI — no need to edit markers by hand.

1. Open the conflicted file — VS Code highlights the conflict block
1. Click one of the options above the block:
1. **Accept Current Change** — keep your version
1. **Accept Incoming Change** — keep their version
1. **Accept Both Changes** — keep both (stacked)
1. **Compare Changes** — see a side-by-side diff
1. Save the file
1. In the Source Control panel, stage the file
1. Run `git rebase --continue` or `git merge --continue` in the terminal

### Rebase vs merge: key difference when conflicting

|                  | Merge                  | Rebase                  |
| ---------------- | ---------------------- | ----------------------- |
| Conflicts appear | Once, all at once      | One per replayed commit |
| After resolving  | `git merge --continue` | `git rebase --continue` |
| Abort everything | `git merge --abort`    | `git rebase --abort`    |

With rebase, if you have 3 commits and 2 of them conflict, you resolve conflicts **twice** — once per commit as Git replays them.

### If it gets too messy — abort

```
git rebase --abort   # restores your branch to exactly where it was before
git merge --abort    # same for merge
```

No harm done — you're back to the state before you started.

## 7. Professional Daily Workflow

```
# Clone repo
git clone ...

# Start a new feature
git checkout -b feature/TICKET-123-short-description origin/main
git branch -D main

# Do your work
git add .
git commit -m "meaningful commit message"

# Catch up with latest main (before PR)
git fetch
git rebase origin/main

# Optional: clean up commit history before PR
git rebase -i origin/main

# Push and open PR
git push origin feature/TICKET-123-short-description
# Or
git push -u origin feature/TICKET-123-short-description

# PR approved → merge on GitHub → done
git branch -d feature/TICKET-123-short-description

# ↓ Start next feature — cycle repeats from here
git fetch
git checkout -b feature/TICKET-456-short-description origin/main
```

### Senior developers never:

- Force push to `main`
- Commit directly to `main`
- Use `git merge main` locally to catch up
- Maintain a local `main` branch — delete it, use `origin/main`
- Leave stale branches for weeks

## 8. Golden Rules

> **Rebase to clean up your local work. Merge to integrate into shared history.**
>
> **main is protected and always merged online via PR.**
>
> **Feature branches are always rebased locally to catch up.**

```
main (protected, on GitHub)
^
└── merged via PR only (never directly pushed)

feature (local)
└── rebased to catch up with origin/main
└── pushed → PR → merged on GitHub
```
