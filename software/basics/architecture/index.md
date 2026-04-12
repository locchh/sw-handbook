# Architecture

How to structure software, from the shape of a single codebase to the topology of a distributed system. This page consolidates four related concerns:

1. **Layers** inside a single application
1. **Code organization** in a repository
1. **System-level patterns** (how services are deployed and communicate)
1. **UI patterns** for interactive apps
1. **System design building blocks** (scalability, caching, databases…)

______________________________________________________________________

## 1. Application Layers

Most applications separate responsibilities into horizontal layers. A request flows top-down; data flows bottom-up.

| Layer                      | Responsibility                               | Typical components                      |
| -------------------------- | -------------------------------------------- | --------------------------------------- |
| **Presentation (UI)**      | User interaction, rendering, input handling. | Web/mobile UI, controllers, view models |
| **Application / Business** | Core logic, use cases, coordination.         | Services, domain objects, workflows     |
| **Data (Persistence)**     | Storage and retrieval of data.               | Repositories, DAOs, ORM models          |

Optional additions as systems grow:

- **API Layer** — exposes services to external clients via REST/GraphQL/gRPC.
- **Integration Layer** — adapters to third-party services and external systems.
- **Security Layer** — authentication, authorization, encryption, auditing.

**Rule of thumb:** dependencies point inward — UI depends on business, business depends on data abstractions. Data never calls up into the UI.

______________________________________________________________________

## 2. Code Organization

How you group files in a repository matters as much as how you design the runtime. Four common strategies:

### By Component (recommended)

Group by **business feature** (`user-management/`, `order-processing/`). Each component is self-contained with a minimal public interface. Dependencies between components are explicit and few.

```
src/
├── graph/
│   ├── Graph.java
│   ├── GraphService.java
│   └── GraphPersister.java     # interface
├── graph-storage/
│   └── FileGraphPersister.java # implements GraphPersister
└── app/
    └── AppModule.java          # wires them together
```

### By Layer

Group by **technical role** (`presentation/`, `application/`, `domain/`, `infrastructure/`). Easy to understand at a glance but a single feature change often touches every layer, increasing coupling.

```
src/
├── presentation/ UserController.java
├── application/  PlaceOrderUseCase.java
├── domain/       Order.java, OrderService.java
└── infrastructure/ JdbcOrderRepository.java
```

### By Toolbox

Group **interchangeable implementations** that share an interface — good for collections, loggers, or codecs where consumers pick one at a time.

```
collections/
├── List.java           # interface
├── ArrayList.java
└── LinkedList.java
```

### By Kind (anti-pattern)

Do **not** group by technical type (`interfaces/`, `managers/`, `helpers/`, `exceptions/`). It looks tidy but hides the real relationships — a single feature change requires editing files in every bucket.

**Repository layouts:**

- **Monorepo** — all projects in one repo. Shared tooling, atomic cross-project changes, simpler dependency management. Requires workspace tooling at scale (Nx, Bazel, Lerna).
- **Polyrepo** — one project per repo. Independent releases, clear ownership, per-repo access control. Cross-project changes are more expensive.

______________________________________________________________________

## 3. System-Level Patterns

How you arrange services and their communication. Each pattern solves a different scaling problem.

### Monolithic

All code ships as a single deployable unit.

- **Use when:** early-stage products, small teams, simple domains.
- **Pros:** easy deploy, simple debugging, no network overhead, one tech stack.
- **Cons:** must scale the whole app as one unit; large codebases get unwieldy; any deploy affects everything.

### Client-Server

Clients request services from a server. The classic 2-tier / 3-tier / N-tier web app.

- **Use when:** traditional database-driven applications.

### Microservices

Decompose the system into small, independently deployable services, each owning its data.

- **Use when:** large systems, multiple teams, services scale differently.
- **Pros:** independent deploys, tech diversity per service, team autonomy, fault isolation.
- **Cons:** operational complexity, network latency, distributed data consistency, harder testing and debugging.

```
flowchart TB
    Client --> Gateway[API Gateway]
    Gateway --> UserSvc[User Service]
    Gateway --> OrderSvc[Order Service]
    Gateway --> PaySvc[Payment Service]
    UserSvc --> UserDB[(User DB)]
    OrderSvc --> OrderDB[(Order DB)]
    PaySvc --> PayDB[(Payment DB)]
```

### Service-Oriented Architecture (SOA)

Coarser-grained than microservices, often with an Enterprise Service Bus routing messages. Common in enterprise environments for integrating legacy systems.

### Event-Driven

Components communicate by publishing and subscribing to events on a bus — no direct calls.

- **Use when:** real-time workflows, systems needing audit trails, loosely coupled services.
- **Pros:** loose coupling, easy to add new consumers, natural audit log.
- **Cons:** async flows are hard to debug; event ordering and delivery guarantees are tricky.

### Serverless / FaaS

Code runs in managed, stateless functions triggered by events (`AWS Lambda`, `Cloud Functions`).

- **Use when:** sporadic traffic, event-driven workloads, pay-per-use workloads.
- **Pros:** no servers to manage, auto-scales to zero.
- **Cons:** vendor lock-in, cold starts, short execution windows, debugging is harder.

### Pipe and Filter

Data flows through a sequence of independent processing stages.

- **Use when:** ETL, stream processing, batch data pipelines.

### Peer-to-Peer (P2P)

Every node is both client and server. No central coordinator.

- **Use when:** file sharing, blockchain, distributed systems that must avoid a single point of failure.

### Comparison

| Pattern       | Scalability | Complexity | Best For                     |
| ------------- | ----------- | ---------- | ---------------------------- |
| Monolithic    | Low         | Low        | Small apps, prototypes       |
| Client-Server | Medium      | Low        | Traditional web apps         |
| Microservices | High        | High       | Large, complex systems       |
| SOA           | Medium      | Medium     | Enterprise integration       |
| Event-Driven  | High        | Medium     | Real-time, async workflows   |
| Serverless    | Auto        | Low        | Sporadic, event-driven loads |
| Pipe & Filter | Medium      | Low        | Data pipelines               |
| P2P           | High        | High       | Decentralized systems        |

______________________________________________________________________

## 4. Deployment Topologies

How patterns land on infrastructure. Most systems evolve through these stages as they grow.

### All-in-One

A single server runs the web server, application, and database. Cheap and simple — right for MVPs and side projects. Single point of failure; can only scale vertically.

### Split Database

Application server and database are separate machines. Lets each scale and be tuned independently. Adds network latency and a second machine to manage.

### Microservices (many services, many machines)

Each service has its own deploy, its own database, and often its own team. An API gateway or service mesh coordinates traffic.

### Serverless

Functions on demand behind an API gateway, backed by managed databases and storage.

### Container Orchestration

Docker + Kubernetes (or similar) schedules containers across a cluster of nodes. The standard way to run microservices in production today.

### Evolution Path

```
All-in-One → Split DB → Extract Services → Full Microservices
```

Start simple. Move to the next stage only when a real constraint (scale, team size, release coupling) forces the change — not because the next step sounds more modern.

______________________________________________________________________

## 5. System Design Building Blocks

The primitives you assemble distributed systems from.

### Scalability

- **Vertical (scale up):** bigger machine — more CPU, RAM, disk.
- **Horizontal (scale out):** more machines behind a load balancer.

Horizontal is more fault-tolerant but requires stateless services or sticky sessions.

### Load Balancers

Distribute traffic across instances. Algorithms: round robin, least connections, IP hash, weighted. Layer 4 (TCP/UDP) vs Layer 7 (HTTP). Examples: NGINX, HAProxy, AWS ALB.

### Caching

Store frequently accessed data in fast storage to reduce latency and backend load.

- **Levels:** browser → CDN → application → database.
- **Strategies:** cache-aside, write-through, write-behind.
- **Invalidation:** TTL, event-based, manual. (Cache invalidation is one of the two hard problems in CS.)
- **Examples:** Redis, Memcached, Varnish.

### CDN (Content Delivery Network)

Geographically distributed cache for static assets. Reduces latency, offloads origin, provides DDoS protection. Examples: Cloudflare, CloudFront, Akamai.

### Databases

| Type            | Examples          | Best for                           |
| --------------- | ----------------- | ---------------------------------- |
| **Relational**  | PostgreSQL, MySQL | Structured data, ACID transactions |
| **Document**    | MongoDB, CouchDB  | Flexible schemas, JSON payloads    |
| **Key-Value**   | Redis, DynamoDB   | Lookups, caching, sessions         |
| **Wide-Column** | Cassandra, HBase  | Time-series, write-heavy workloads |
| **Graph**       | Neo4j, Neptune    | Relationship-heavy data            |

### Partitioning (Sharding)

Split data across nodes by **range**, **hash**, or **directory**. Horizontal partitioning splits rows; vertical partitioning splits columns.

### Message Queues

Asynchronous communication that decouples producers from consumers. Adds buffering and load-leveling.

- **Patterns:** point-to-point, pub/sub.
- **Examples:** Kafka, RabbitMQ, SQS.

### Stream Processing

Continuous processing of event streams. Used for real-time analytics, fraud detection, IoT pipelines. Examples: Kafka Streams, Flink, Kinesis.

### Rate Limiting

Cap how many requests a client can make. Algorithms: token bucket, leaky bucket, fixed window, sliding window. Typically enforced at the API gateway.

### CAP Theorem

In a distributed system you can pick two of three: **Consistency, Availability, Partition tolerance**. Since network partitions are a fact of life, real systems are either **CP** (MongoDB, HBase) or **AP** (Cassandra, DynamoDB).

### Performance Bottlenecks

When a system is slow, diagnose *what* it is bound by:

| Bound by    | Symptoms                | Typical fixes                                      |
| ----------- | ----------------------- | -------------------------------------------------- |
| **CPU**     | High CPU, low wait      | Optimize algorithms, parallelize, scale vertically |
| **Memory**  | Swapping, GC pauses     | Smaller data structures, pooling, more RAM         |
| **I/O**     | Low CPU, high wait      | Async I/O, connection pooling, batching            |
| **Network** | Waiting on remote calls | Compression, CDN, batching, protocol tuning        |
| **Disk**    | High disk util          | SSDs, write batching, different file system        |

**Loop:** `Observe → Measure → Analyze → Optimize → Verify`. Tools: `top`, `htop`, `iostat`, `iotop`, `netstat`, profilers, flame graphs, distributed traces (Jaeger, Zipkin).

### Putting It Together

A typical request path through a modern system:

```
flowchart TB
    Users --> CDN
    CDN --> LB[Load Balancer]
    LB --> Gateway[API Gateway]
    Gateway --> RL[Rate Limiter]
    RL --> S1[Service A]
    RL --> S2[Service B]
    S1 --> Cache
    S2 --> Cache
    Cache --> DB[(Database)]
    S1 --> MQ[Message Queue]
    MQ --> S2
```

______________________________________________________________________

## 6. UI Architecture Patterns

For interactive client applications. Each pattern improves testability and separation of concerns relative to the last.

| Pattern    | Components                                  | Best for                                                    |
| ---------- | ------------------------------------------- | ----------------------------------------------------------- |
| **MVC**    | Model, View, Controller                     | Simple apps; the classic baseline.                          |
| **MVP**    | Model, View, Presenter                      | High-testability apps; the View is passive.                 |
| **MVVM**   | Model, View, ViewModel                      | UIs with rich data binding (WPF, SwiftUI, Jetpack Compose). |
| **MVVM-C** | MVVM + Coordinator                          | Apps with complex navigation flows.                         |
| **VIPER**  | View, Interactor, Presenter, Entity, Router | Enterprise iOS apps with strict separation.                 |

The translators between view and model (Controller / Presenter / ViewModel) exist to keep the view dumb and the model pure. Testability rises from MVC to VIPER — so does the amount of ceremony. Match the pattern to the app's complexity.

______________________________________________________________________

## Choosing an Architecture

Architecture is a series of trade-offs. When in doubt:

1. **Start simple.** Monolith + single database handles more load than you'd think.
1. **Split when you have evidence.** Scale, team size, or release coupling should force the split — not a blog post.
1. **Match complexity to team size.** Microservices without DevOps discipline is chaos.
1. **Optimize for change.** The best architecture is the one you can evolve without rewriting.
