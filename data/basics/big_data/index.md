# Big Data

"Big data" is data too large or too fast for one machine to handle the usual way. The key question is rarely *"how do I use Spark?"* — it's *"do I actually need to?"*

## The V's

| V            | Meaning                                             |
| ------------ | --------------------------------------------------- |
| **Volume**   | too much to fit or process on one machine           |
| **Velocity** | arrives fast; must be handled in near real-time     |
| **Variety**  | mixed structured, semi-structured, and unstructured |
| **Veracity** | quality and trustworthiness are uncertain           |
| **Value**    | worth extracting — the point of all the above       |

The first three are the classic definition; the last two are why it's hard to do *well*.

## Scale Up vs Scale Out

One bigger machine (**up**) is simplest but has a ceiling. Big data forces **scale out** — many machines working together — which trades simplicity for capacity (see [Architecture](https://locchh.github.io/sw-handbook/software/basics/architecture/index.md)).

## Distributed Processing

The core idea: split the data across nodes, compute locally, then combine. **MapReduce** formalized this; **Spark** made it fast by working in memory:

```
flowchart LR
    D[(Big dataset)] --> S[Split across nodes]
    S --> M1[Map] & M2[Map] & M3[Map]
    M1 & M2 & M3 --> SH[Shuffle / group]
    SH --> R1[Reduce] & R2[Reduce]
    R1 & R2 --> O[(Result)]
```

Storage scales out too: object stores or HDFS hold the data, **partitioned** so nodes work in parallel (see [Architecture](https://locchh.github.io/sw-handbook/software/basics/architecture/index.md)), in columnar formats like Parquet (see [Data Engineering](https://locchh.github.io/sw-handbook/data/basics/data_engineering/index.md)). Common tools: **Spark** (batch + processing), **Kafka** (streaming), cloud warehouses (BigQuery, Snowflake).

## Do You Actually Need It?

Most datasets fit on one machine. A laptop handles millions of rows; a big server handles billions. Distributed systems add real complexity — network, partial failure, harder debugging. Reach for them only when a single machine genuinely **can't hold the data or process it in time**.

## Rule of Thumb

**Measure first.** A well-indexed PostgreSQL or a single Python process beats a misused cluster on most real workloads. Scale out when the data forces it — not because the tool sounds impressive.
