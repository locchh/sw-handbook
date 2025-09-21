# Introduction to Data

*Data is everywhere.*

## What is Data?

- Derived from `datum`: given, fact.
- Valuable resource in this digital era.

## Data context

*Everything can be the context, but which ones are prior?*

Information that provides meaning to data

- When the data was collected?

- Where the data was collected?

- How the data was collected?

- Who collected the data?

- Why the data was collected?

These characteristics of data are called the **metadata**.

## Type of data

Classification of data based on their structure:

- Structured data (*If there are rules, then there must be some form of structure*)

- Semi-structured data

- Unstructured data

Classification of data based on their nature: 

- Quantitative data

- Qualitative data

## Data storage is changing

**Historical data storage**
- Genetic information in DNA.
- Cave and wall paintings.
- Scroll and books of papyrus/parchment.

**19th and 20th century**
- Punch cards.
- Magnetic tape, floppy disks.

**20th and 21st century**
- More data on smaller media.
- CDs and hard/solid state drives(local).
- Data centers (cloud).

## The DIKW pyramid

```
Data -> Information -> Knowledge -> Wisdom
```

**Raw data**
- unprocessed data.

**Creating information**
- Information is (organized) data with **context**.

**Knowledge is power**:
- Information alone doesn't lead to decisions.
- Connecting all the dots of information.
- Knowledge is information with **meaning**.

**Archiving wisdom**
- The hardest part
- Insights: add more meaning to information by linking pieces.
- Apply the knowledge for better decisions.

## From data to decision

```
Ask questions -> Gather data -> Prepare data -> Conduct Analysis -> Make decision
```

## Data as a resource

**Overwhelming data**

- Data is often too large in its raw form. Even "simple" analysis require large amount of data.

- More complex analysis can leverage even million or billion of records.

**Data aggregation**

Aggregation is the process to summarize a dataset into a smaller pieces (easier to understand) is required to make informed decisions.

Common aggregation:
- Simple average (mean)
- Sum (totals)
- Minimum or Maximum
- Modes

Aggregation appear in many ways throughout organizations.
- Metrics
- Benchmarks
- Key performance indicators (KPIs)

Understanding how these aggregations are created is extremely helpful for many investigations.

## Key concepts

**Data flow**

Data flow within organizations is often  highly complex.

- Data from many different sources systems
- Processed through other systems
- Displayed and manipulated in other systems.

**Data ingestion**

Data ingestion is the process of collecting data from various sources and loading it into a data storage system. The same process is also called **data population**.

**Data transformation**

Data transformation is the process of converting raw data into a format that is useful for analysis.

**Data storage**

Data storage is the process of storing data in a way that is accessible and secure.

**Data analysis**

Data analysis is the process of using statistical and machine learning techniques to extract insights from data.

**Data visualization**

Data visualization is the process of representing data in a way that is easy to understand.

**Data normalization**

Avoid data redundancy and maintain integrity. Organize data into multiple related tables using normal forms (1NF, 2NF, 3NF, BCNF, etc.).

**Data management**
Data management is responsible trying to unify and standardize data from many different data flows. These 

**Data governance**
Ensure data is consistent, trustworthy, and isn't misused.

**Data quality**

You should assess the source data for accuracy, validity, completeness, reliability, and consistency:

- Accuracy - verify that the data is correct and error-free by cross-referencing with reliable sources.

- Validity - Ensure the data is applicable and suitable for the intended use or context.

- Completeness - Check that you included all necessary data and there are no missing elements.

- Reliability - Ascertain that the data comes from a credible and dependable source.

- Consistency - Confirm that the data does not show discrepancies when compared over time or with similar datasets.

**Data Privacy and Security**
Ensure proper data access, use, and protection.

## Principles of data ethics

- Permission for 
- Transparency about the plan
- Privacy of data
- Good intentions
- Consider the outcome

## Data lifecycle

```
Planning -> Collection -> Storage -> Management -> Cleaning and processing -> Analysis and Visualization -> Sharing -> Archiving/destroying
```

## Approaches for Importing Data

When we say importing data, it means the process of moving data from one system into database. The import could be a one-time operation, or it could be a regular process that you need to automate. Typically, the source system would have a different data model than database, and by importing data, you would transform the data into a model that is more appropriate for your use case.

The source may expose data in different ways, for example:

- Relational Database Management Systems (RDBMS)

- Web APIs

- Public data directories

- BI tools

- Excel

- Flat files (CSV, JSON, XML)

The method by which you import data into database will depend on several factors, including:

- The source of the data

- The volume of data

- The frequency of the import

- The complexity of the data model

- The transformation required

The options available to you are numerous, and include:

- One-off batch import of all data

- One-off load with a regular update

- Continuous import of data

- Real-time application updates

- ETL (Extract, Transform, Load) pipelines

Before you start importing data, you should take time to understand the data you are working with, including:

- The data format and structure

- The frequency of updates

- Data quality

- Uniquely identifying data

These factors will influence the process you take to import the data into database.

## Common mistakes about data
- Not having a clear goal or question
- Insufficient or wrong data (data bias, dirty data,etc.)
- Lack of appropriate analysis (lack of context, wrong metrics,etc.)
- No clear communication of results
