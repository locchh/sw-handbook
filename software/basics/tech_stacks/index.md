# Tech Stacks

A tech stack is the set of languages, frameworks, databases, and infrastructure used to build a system. This page is a compact reference — for architectural patterns and layering, see [Architecture](https://locchh.github.io/sw-handbook/software/basics/architecture/index.md).

## The Layered View

A modern web system is usually composed of these layers. Each layer has many viable choices; the list below is representative, not exhaustive.

| Layer                 | Purpose                   | Common choices                                      |
| --------------------- | ------------------------- | --------------------------------------------------- |
| **Edge**              | CDN, DDoS protection, DNS | Cloudflare, CloudFront, Akamai, Fastly              |
| **Presentation**      | User interface            | React, Vue, Angular, Svelte, Flutter, Swift, Kotlin |
| **API / Integration** | Service contracts         | REST, GraphQL, gRPC, WebSocket                      |
| **Business Logic**    | Application frameworks    | Spring Boot, Django, FastAPI, Express, Rails, .NET  |
| **Messaging**         | Async communication       | Kafka, RabbitMQ, SQS, Celery                        |
| **Data Access**       | ORMs, search, cache       | SQLAlchemy, Hibernate, Sequelize, Elasticsearch     |
| **Storage**           | Persistent state          | PostgreSQL, MySQL, MongoDB, Redis, S3               |
| **Infrastructure**    | Runtime and orchestration | AWS, GCP, Azure, Docker, Kubernetes                 |

## Languages at a Glance

| Language                    | Sweet spot                               | Notable frameworks                   |
| --------------------------- | ---------------------------------------- | ------------------------------------ |
| **Python**                  | Data, ML, scripting, web APIs            | Django, FastAPI, Flask               |
| **JavaScript / TypeScript** | Frontend, full-stack, Node backends      | React, Vue, Next.js, Express, NestJS |
| **Java**                    | Enterprise, Android, high-scale services | Spring Boot, Quarkus                 |
| **C#**                      | Windows, enterprise, game dev (Unity)    | .NET, ASP.NET Core                   |
| **Go**                      | Cloud infrastructure, microservices, CLI | Gin, Echo                            |
| **Rust**                    | Systems, performance-critical services   | Actix, Axum                          |
| **Ruby**                    | Rapid web development, scripting         | Rails, Sinatra                       |
| **PHP**                     | Traditional web, CMS                     | Laravel, Symfony                     |

## Databases at a Glance

See [Architecture § Databases](https://locchh.github.io/sw-handbook/software/basics/architecture/#databases) for the full breakdown. Quick picks:

- **Default choice:** PostgreSQL. Relational, ACID, JSON support, mature.
- **Document store:** MongoDB for flexible schemas; DynamoDB for serverless AWS.
- **Cache / queue:** Redis — in-memory, versatile.
- **Analytics:** BigQuery, Snowflake, ClickHouse.
- **Wide-column at scale:** Cassandra, Bigtable.

## Classic Stack Combinations

| Stack                                     | Components                         | Typical use                        |
| ----------------------------------------- | ---------------------------------- | ---------------------------------- |
| **LAMP**                                  | Linux + Apache + MySQL + PHP       | Traditional web apps, CMS          |
| **MEAN**                                  | MongoDB + Express + Angular + Node | SPAs, real-time apps               |
| **MERN**                                  | MongoDB + Express + React + Node   | Modern SPAs                        |
| **JAMstack**                              | JavaScript + APIs + Markup         | Static sites, blogs, JAMstack apps |
| **Django + PostgreSQL + Redis**           | Python web + relational + cache    | Content and data-driven apps       |
| **Spring Boot + PostgreSQL + Kubernetes** | Java + relational + orchestration  | Enterprise microservices           |

## How to Pick a Stack

Order of considerations, roughly in this priority:

1. **Team expertise.** A familiar stack ships faster than a theoretically better one.
1. **Problem fit.** ML-heavy? Python. High-throughput trading? Rust, C++, or Java. Real-time collab? Node or Elixir.
1. **Ecosystem maturity.** Libraries, hiring pool, Stack Overflow answers, long-term viability.
1. **Operational cost.** Managed services (RDS, Cloud Run) beat self-hosting when you can afford them.
1. **Future-proofing, carefully.** Don't adopt yesterday's fad; don't chase tomorrow's either.

**Common mistake:** picking the stack before understanding the problem. Write the one-page problem statement first.

## Further Reading

- The [Architecture](https://locchh.github.io/sw-handbook/software/basics/architecture/index.md) page covers the patterns these stacks implement.
- The [Lifecycle](https://locchh.github.io/sw-handbook/software/basics/lifecycle/index.md) page covers how teams ship software built on any stack, including version control practices.
