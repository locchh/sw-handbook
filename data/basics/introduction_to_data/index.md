# Introduction to Data

## What is Data?

From the Latin *datum* — "given, fact." Data is raw, uninterpreted facts about the world, captured so they can be stored, processed, and reasoned about later.

## Metadata: The Context Around Data

Metadata is data *about* data. Without it, a number is just a number. The five questions that define a dataset's context:

- **When** was it collected?
- **Where** was it collected?
- **How** was it collected?
- **Who** collected it?
- **Why** was it collected?

Answering these up front prevents misinterpretation later.

## Types of Data

**By structure:**

| Type                | Description                           | Examples                   |
| ------------------- | ------------------------------------- | -------------------------- |
| **Structured**      | Fits a fixed schema, usually tabular. | SQL tables, CSVs           |
| **Semi-structured** | Self-describing, flexible schema.     | JSON, XML, YAML            |
| **Unstructured**    | No predefined schema.                 | Text, images, audio, video |

**By nature:**

- **Quantitative** — measurable numeric values (age, temperature, revenue).
- **Qualitative** — descriptive, categorical (color, opinion, label).

## The DIKW Pyramid

How raw data becomes decisions:

```
Data → Information → Knowledge → Wisdom
```

- **Data** — raw, unprocessed facts.
- **Information** — data *with context*. Organized, meaningful.
- **Knowledge** — information connected into patterns that support decisions.
- **Wisdom** — the ability to apply knowledge well. The hardest, most valuable layer.

## From Data to Decision

```
Ask → Gather → Prepare → Analyze → Decide
```

A clear question before collection saves hours of rework. Most data projects fail not because of bad algorithms but because the goal was fuzzy.

## Core Concepts

| Concept            | What it means                                                                 |
| ------------------ | ----------------------------------------------------------------------------- |
| **Ingestion**      | Collecting data from sources into your system (aka *population*).             |
| **Transformation** | Reshaping raw data into a form suitable for analysis.                         |
| **Storage**        | Keeping data accessible and durable.                                          |
| **Analysis**       | Extracting insight via statistics or ML.                                      |
| **Visualization**  | Communicating findings through charts and dashboards.                         |
| **Normalization**  | Splitting data into related tables (1NF, 2NF, 3NF, BCNF) to avoid redundancy. |
| **Aggregation**    | Summarizing many records into fewer (mean, sum, min, max, KPIs).              |
| **Management**     | Unifying data across multiple flows.                                          |
| **Governance**     | Ensuring data is consistent, trustworthy, and used appropriately.             |

## Data Quality Dimensions

When you receive or produce a dataset, check it against these five criteria:

| Dimension        | Question to ask                                          |
| ---------------- | -------------------------------------------------------- |
| **Accuracy**     | Is it correct? Does it match reliable sources?           |
| **Validity**     | Does it fit the intended use?                            |
| **Completeness** | Are required fields missing?                             |
| **Reliability**  | Is the source credible?                                  |
| **Consistency**  | Does it agree with itself over time and across datasets? |

## Ethics of Data

Five principles, one question each:

- **Permission** — do subjects consent to this use?
- **Transparency** — is the plan visible to them?
- **Privacy** — is personal data protected?
- **Intent** — are the goals legitimate?
- **Outcome** — have you considered the downstream effects?

## Data Lifecycle

```
Plan → Collect → Store → Manage → Clean & Process → Analyze & Visualize → Share → Archive / Destroy
```

Every stage has compliance and quality implications. Skipping "Plan" is the most common mistake.

## Importing Data

"Importing" means moving data from a source into your storage system, usually reshaping it along the way. Common sources:

- Relational databases (RDBMS)
- Web / REST APIs
- Flat files (CSV, JSON, XML)
- Excel workbooks, BI tool exports
- Public data directories

**Choose the import strategy based on:**

- Volume of data
- Frequency of updates (one-off, scheduled, continuous, real-time)
- Required transformations
- Source model vs. target model mismatch

Typical approaches, from simplest to most complex: *one-off batch → scheduled batch → continuous pipeline → real-time streaming*. Start simple and upgrade when a real constraint forces the change.

## Common Mistakes

- **No clear question.** Data projects without a goal produce reports nobody uses.
- **Wrong or biased data.** Garbage in, garbage out — no amount of modeling fixes bad sources.
- **Inappropriate analysis.** Right numbers, wrong metric, wrong conclusion.
- **No communication plan.** An insight that isn't shared clearly might as well not exist.
