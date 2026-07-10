# Data Modelling & Architecture

Two related disciplines: **modelling** designs the *structure* of data — entities, attributes, and relationships. **Architecture** is the org-wide *blueprint* — how data flows, where it lands, and who serves it. [Introduction to Data](introduction_to_data.md) covered normalization (1NF→BCNF); [Databases](databases.md) and [Data Engineering](data_engineering.md) covered where data lives and how it moves. This page ties them together.

## What It Is

Modelling proceeds through three levels of increasing detail:

| Level | Answers | Audience | Artifact |
|---|---|---|---|
| **Conceptual** | *What* entities exist and how they relate | business | ER diagram, no attributes |
| **Logical** | *Which* attributes, keys, and normal form | analyst / architect | normalized schema, DB-agnostic |
| **Physical** | *How* it's stored — tables, types, indexes | engineer | DDL for a specific engine |

**Architecture** then decides the macro shape: OLTP vs OLAP separation, [warehouse / lake / lakehouse](data_engineering.md) storage, and how curated data is served to consumers.

## Modelling Styles

| Style | Shape | Optimized for |
|---|---|---|
| **Normalized (3NF)** | many narrow tables, no redundancy | transactional writes (OLTP) |
| **Dimensional (star/snowflake)** | facts + surrounding dimensions | analytical reads (OLAP) |
| **Data Vault** | hubs, links, satellites | auditable, evolving warehouses |
| **One Big Table (OBT)** | wide denormalized flat table | simple BI, columnar stores |

## Frameworks That Apply

- **Inmon (top-down)** — build one integrated, 3NF enterprise warehouse first, then spin off marts. Consistent but slower to deliver.
- **Kimball (bottom-up)** — build dimensional marts (star schemas) per business process, connected by conformed dimensions. Faster to value, the common default.
- **Data Vault 2.0 (Linstedt)** — hub/link/satellite modelling for full history and auditability at scale.
- **Medallion (bronze → silver → gold)** — the lakehouse layering convention: raw → cleaned → business-ready.
- **Data Mesh** — organizational architecture: domain teams own their data as products, on a self-serve platform.

## Golden Lesson

**Model for the questions you'll ask, not the data you happen to have.** Match the model to the workload: normalize for write-heavy transactional systems, denormalize into star schemas for read-heavy analytics. A model that ignores the query pattern is either slow or a maintenance nightmare — usually both.

## Learn More

- [Kimball Group — Dimensional Modeling Techniques](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/) — the canonical reference for star schemas, facts, and dimensions.
- [Data Vault Alliance](https://datavaultalliance.com/) — Dan Linstedt's hub/link/satellite methodology.
- [Data Mesh Principles (Martin Fowler / Zhamak Dehghani)](https://martinfowler.com/articles/data-mesh-principles.html) — the essay that defined domain-oriented data ownership.
- [Lakehouse: A New Generation of Open Platforms (CIDR 2021)](https://www.cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf) — the paper behind the lakehouse and medallion layering.
