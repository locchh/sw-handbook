# Databases

Where state lives. [Introduction to Data](https://locchh.github.io/sw-handbook/data/basics/introduction_to_data/index.md) covered data types and normalization (1NF→BCNF); this page goes deeper into how a database stores, finds, and protects data. For the full menu of database *types* (document, key-value, wide-column, graph), see [Architecture](https://locchh.github.io/sw-handbook/software/basics/architecture/index.md) under *Databases* — here we focus on the relational core and when to leave it.

## Relational vs NoSQL

|             | **Relational (SQL)**           | **NoSQL**                        |
| ----------- | ------------------------------ | -------------------------------- |
| Schema      | fixed, enforced                | flexible / none                  |
| Strength    | joins, transactions, integrity | scale-out, varied shapes         |
| Scales by   | mostly up (one strong node)    | mostly out (many nodes)          |
| Default for | most apps                      | a specific, known access pattern |

**Start relational** (PostgreSQL) unless you have a measured reason — extreme write scale, a schema that genuinely varies per record, or a pure key-value access pattern.

## SQL in One Breath

SQL has sub-languages: **DDL** defines structure (`CREATE`, `ALTER`), **DML** changes rows (`INSERT`, `UPDATE`, `DELETE`), and queries read them:

```
SELECT u.name, COUNT(o.id) AS orders
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.active = true
GROUP BY u.name;
```

## Indexing

An index is a sorted lookup structure (usually a B-tree — a balanced tree, see [Algorithms](https://locchh.github.io/sw-handbook/software/basics/algorithms/index.md)) that turns an O(n) table scan into an O(log n) lookup.

- **Index the columns you filter, join, and sort on.**
- Every index **speeds reads but slows writes** and costs space — don't index everything.
- A query that filters on an unindexed column scans the whole table; check the query plan (`EXPLAIN`).

## Transactions & ACID

A **transaction** groups operations so they succeed or fail as one unit. The guarantees are **ACID**:

- **Atomicity** — all or nothing; a failure rolls everything back.
- **Consistency** — every transaction moves the DB from one valid state to another.
- **Isolation** — concurrent transactions don't corrupt each other.
- **Durability** — once committed, it survives a crash, persisted via a write-ahead log.

### Isolation Levels

Stronger isolation prevents more anomalies but allows less concurrency:

| Level                | Allows                                                 |
| -------------------- | ------------------------------------------------------ |
| **Read Uncommitted** | dirty reads (seeing uncommitted data)                  |
| **Read Committed**   | non-repeatable reads (a row changes mid-transaction)   |
| **Repeatable Read**  | phantom reads (new rows appear)                        |
| **Serializable**     | nothing — behaves as if transactions ran one at a time |

## Consistency at Scale

ACID describes guarantees **within one database**. Spread data across machines and you hit the **CAP trade-off** (see [Architecture](https://locchh.github.io/sw-handbook/software/basics/architecture/index.md)) — many distributed stores relax strict consistency for availability. This looser model is called **BASE**: *Basically Available, Soft state, Eventually consistent*.

## Rule of Thumb

- **PostgreSQL until proven otherwise.** It scales further than you'd expect.
- **Model for your queries**, not just your nouns.
- **Wrap any multi-step change in a transaction**, and index deliberately — measure, don't guess.
