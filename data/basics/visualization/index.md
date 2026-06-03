# Data Visualization

A chart is an argument. Its job is to make the right comparison obvious and the wrong reading hard.

## Pick the Chart by the Relationship

Choose the chart for what you're *showing*, not for how it looks:

| You want to show                   | Use                               |
| ---------------------------------- | --------------------------------- |
| Comparison across categories       | bar chart                         |
| Trend over time                    | line chart                        |
| Part-to-whole                      | stacked bar (or a pie, sparingly) |
| Distribution of one variable       | histogram, box plot               |
| Relationship between two variables | scatter plot                      |
| Composition over time              | stacked area                      |
| Geographic pattern                 | map / choropleth                  |

## Design Principles

- **One message per chart.** If it makes two points, split it.
- **Maximize data, minimize ink.** Drop gridlines, borders, and 3D — that's *chartjunk*.
- **Start bar axes at zero.** Truncating exaggerates differences.
- **Order categories meaningfully** (by value, not alphabetically) unless order is inherent.
- **Label directly** instead of forcing a trip to the legend.
- **Use color with purpose** — to encode meaning, not decorate — and keep it colorblind-safe.

## Dashboards

| Type            | Audience      | Purpose                      |
| --------------- | ------------- | ---------------------------- |
| **Operational** | on-call / ops | real-time monitoring, alerts |
| **Analytical**  | analysts      | explore trends, drill down   |
| **Strategic**   | leadership    | high-level KPIs at a glance  |

Put the most important number top-left; don't cram everything onto one screen.

## Common Distortions

Truncated or dual axes, pie charts with too many slices, 3D effects, and area scaled by radius instead of value — all mislead, usually by accident. Sanity-check what a casual reader would conclude.

## Rule of Thumb

Choose the chart for the comparison, then strip everything that isn't carrying information. If a reader needs a decoder ring to read it, simplify.
