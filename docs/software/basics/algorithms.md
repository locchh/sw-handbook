# Data Structures & Algorithms

The vocabulary for reasoning about *cost*. You rarely implement these from scratch, but picking the right structure — and knowing its price — is the difference between code that scales and code that melts.

## Big-O — Measuring Growth

Big-O describes how cost grows as input size `n` grows. It ignores constants and small inputs; it tells you what happens when `n` gets large.

| Notation | Name | Example |
|---|---|---|
| **O(1)** | constant | hash lookup, array index |
| **O(log n)** | logarithmic | binary search, balanced-tree lookup |
| **O(n)** | linear | scan a list |
| **O(n log n)** | linearithmic | good sorts (merge, heap, quicksort avg) |
| **O(n²)** | quadratic | nested loop, bubble sort |
| **O(2ⁿ)** | exponential | brute-force over all subsets |
| **O(n!)** | factorial | brute-force over all permutations |

At `n = 1,000,000`: an **O(n)** pass is trivial, **O(n²)** is ~10¹² operations (minutes), and **O(2ⁿ)** is hopeless. Also watch **space** complexity — memory grows too.

## Core Data Structures

| Structure | Lookup | Insert / Delete | Use when |
|---|---|---|---|
| **Array / List** | O(1) by index, O(n) by value | O(n) (shift) | indexed access, iteration |
| **Hash map / set** | O(1) avg | O(1) avg | keyed lookup, dedup, counting |
| **Linked list** | O(n) | O(1) at a known node | many inserts/deletes at the ends |
| **Stack** (LIFO) | — | O(1) | undo, DFS, call stack |
| **Queue** (FIFO) | — | O(1) | BFS, buffering, scheduling |
| **Balanced tree** (RB/AVL) | O(log n) | O(log n) | sorted data that keeps changing |
| **Heap** (priority queue) | O(1) peek | O(log n) | top-k, scheduling, Dijkstra |
| **Trie** | O(k) by key length | O(k) | autocomplete, prefix search |
| **Graph** | depends | depends | networks, dependencies, routes |

## Algorithmic Patterns

Most problems reduce to a handful of patterns:

| Pattern | Idea | Typical use |
|---|---|---|
| **Two pointers** | walk a sequence from both ends or at two speeds | sorted-array pairs, cycle detection |
| **Sliding window** | move a range over a sequence | substrings, running aggregates |
| **Divide & conquer** | split, solve halves, combine | sorting, search |
| **Recursion / backtracking** | solve via subproblems; undo on a dead end | trees, permutations, mazes |
| **Dynamic programming** | cache overlapping subproblems | shortest path, knapsack, edit distance |
| **Greedy** | take the locally best choice | scheduling, Huffman coding, MST |
| **BFS / DFS** | explore a graph breadth- or depth-first | reachability, shortest unweighted path |
| **Hashing** | trade memory for O(1) lookup | dedup, counting, caching |

## Rule of Thumb

- **Pick the structure first.** The right one (a hash map, a heap) often makes the algorithm trivial.
- **Big-O dominates at scale; constants dominate when `n` is small.** A linear scan can beat a hash map for ten items.
- **Measure before micro-optimizing.** Profile, don't guess — see [Architecture § Performance Bottlenecks](architecture.md).
