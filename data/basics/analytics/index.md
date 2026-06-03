# Data Analytics

Turning data into answers. Where the [DIKW pyramid](https://locchh.github.io/sw-handbook/data/basics/introduction_to_data/index.md) explained *why* data becomes insight, this page is the *how* — the questions you ask and the statistics behind them.

## Four Kinds of Analytics

Each step is more valuable and harder than the last:

| Type             | Question           | Example                               |
| ---------------- | ------------------ | ------------------------------------- |
| **Descriptive**  | What happened?     | last month's revenue                  |
| **Diagnostic**   | Why did it happen? | revenue fell because churn rose       |
| **Predictive**   | What will happen?  | forecast next month's revenue         |
| **Prescriptive** | What should we do? | the discount that maximizes retention |

## Exploratory Data Analysis (EDA)

The first pass over any new dataset, before modeling:

1. **Shape** — rows, columns, types.
1. **Missing values** — how many, and why.
1. **Distributions** — histograms; is it skewed, bimodal, normal?
1. **Outliers** — errors or real extremes?
1. **Relationships** — how do variables move together?

## Descriptive Statistics

| Aspect     | Measures                      | Note                                                                   |
| ---------- | ----------------------------- | ---------------------------------------------------------------------- |
| **Center** | mean, median, mode            | use the **median** for skewed data — the mean gets dragged by outliers |
| **Spread** | range, variance, std dev, IQR | how much the data varies                                               |
| **Shape**  | skew, kurtosis                | symmetric or lopsided?                                                 |

## Traps to Avoid

- **Correlation ≠ causation.** Two things moving together may share a hidden **confounder**. To establish cause, run a controlled experiment (**A/B test**).
- **Simpson's paradox** — a trend in subgroups can reverse when combined. Always check segments.
- **Sampling bias** — if the sample isn't representative, no statistic fixes it.
- **Vanity metrics** — numbers that look good but drive no decision (raw page views). Prefer **actionable** metrics tied to a goal.

## Rule of Thumb

- **Start with the question.** Most data projects fail from a fuzzy goal, not a bad model (see [Introduction to Data](https://locchh.github.io/sw-handbook/data/basics/introduction_to_data/index.md)).
- **Look at the distribution before computing summaries** — a single number hides more than it shows.
- **A metric is only useful if it changes a decision.**
