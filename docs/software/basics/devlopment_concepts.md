
# Development Concepts

## Application Types and Delivery Channels

```
┌────────────────────────┐
│   Core Logic           │
│ (domain/use-cases/libs)│
└───────┬────────────────┘
        │
        ├── Backend Services (FastAPI, Django, Flask, gRPC, Serverless)
        │     ├── API-only Service (REST/GraphQL/gRPC)
        │     ├── Background Jobs / Workers / Schedulers
        │     └── BFF (Backend for Frontend)
        │
        ├── Web Application
        │     ├── Browser-based UI (SPA/SSR; or Jupyter, MLflow)
        │     └── Consumes Backend APIs
        │
        ├── Mobile Application
        │     └── iOS/Android app consuming Backend/BFF APIs
        │
        ├── Desktop Application
        │     ├── Native GUI (PyQt/PySide6, wxPython, Tkinter)
        │     └── Webview/Electron/Tauri-style
        │
        ├── Command Line Application (CLI: click, typer, argparse)
        │
        └── Integrations / Services
              ├── MCP Server
              └── External APIs, Messaging, etc.
```

## Environments
- **Local**: Your development machine (e.g., `<your_name>/dev` branch)

- **Staging**: A copy of production, used for testing (`dev` branch, or `staging` branch)

- **Production**: The live environment (`main` branch or `prod` branch)

## Requirements
- **Business Requirement**: A request for a new feature or change to an existing feature
- **Technical Requirement**: A request for a new feature or change to an existing feature
- **System Requirement**: A request for a new feature or change to an existing feature
- **Code Requirement**: A request for a new feature or change to an existing feature

## Development Roles

- **Developer**: Develop the code (front-end, back-end, machine learning enginer, data engineer, data scientist, data analyst, etc.)
- **BA**: Business Analyst
- **QA**: Quality Assurance
- **DevOps**: Deploy the code (DevOps, MLOps, LLMOps, System Administrator, etc.)
- **Architect**: Design the system
- **PM**: Project Manager
- **PO**: Product Owner
- **Scrum Master**: Scrum Master
- **UX/UI Designer**: Design the user interface
- **Tech Lead**: Lead the development team

## Development Actions

- **Develop**: Develop the code

- **Review**: Code review process (2 approvals)

- **Rewrite**: Rewrite the code to improve the code quality

- **Refactor**: Refactor the code to improve the code structure

- **Rebuild**: Rebuild the code to improve the code performance

- **Reproduce**: Reproduce the error to fix it

- **Test**: Test the code to ensure it works as expected

- **Deploy**: Deploy the code to the production environment

- **Release**: Release the code to the production environment


## Organization Strategies

### By Component
**Focus:** Grouping code by business feature or domain (e.g., `user-management`, `order-processing`). The goal is to create self-contained, independent components.

**Key principle:** Each component should be highly independent with a clear, minimal interface. This minimizes dependencies between different parts of the system, allowing developers to work on one feature without impacting others.

**Example:**
```
src/
├── graph/
│   ├── Graph.java
│   ├── GraphService.java
│   └── GraphPersister.java        # interface defining the minimal needs of graph
├── graph-storage/
│   ├── FileGraphPersister.java    # implements GraphPersister
│   └── StorageConfig.java
└── app/
    └── AppModule.java             # wires GraphService with a GraphPersister impl
```
Note: The `graph` component depends only on its own `GraphPersister` interface; the storage implementation depends on that interface (no mutual dependency). This mirrors the article’s emphasis on isolating components via minimal interfaces and eliminating cyclic deps.

### By Toolbox
**Focus:** Grouping a set of related and often interchangeable tools that serve a common purpose. The classes are technically independent but are bundled together for consumer convenience.

**Key principle:** Provides a collection of complementary implementations (e.g., different types of collection lists, various log appenders). The consumer can choose the best tool for their specific need from this "toolbox." This strategy is effective when the tools are related but don't warrant their own separate, larger components.

**Example:**
```
src/
├── collections/
│   ├── List.java                  # interface
│   ├── ArrayList.java             # implementation
│   ├── LinkedList.java            # implementation
│   ├── Map.java                   # interface
│   ├── HashMap.java               # implementation
│   └── TreeMap.java               # implementation
└── log-appenders/
    ├── LogAppender.java           # interface
    ├── ConsoleAppender.java       # implementation
    ├── FileAppender.java          # implementation
    └── HttpAppender.java          # implementation
```
Note: A toolbox favors external cohesion and consumer convenience: interchangeable implementations share common interfaces. This reflects the article’s examples (collections and logging appenders).

### By Layer
**Focus:** Organizing code based on its technical role within the application architecture (e.g., `presentation`, `business`, `data`).

**Key principle:** Code is separated into horizontal layers, where each layer has a specific responsibility. A request flows down through the layers, and changes often require modifications in multiple layers.

**Example:**
```
src/
├── presentation/
│   ├── UserController.java
│   └── ErrorMapper.java           # map domain errors to i18n messages
├── application/
│   ├── PlaceOrderUseCase.java
│   └── DtoMapper.java             # map DTOs to domain early
├── domain/
│   ├── Order.java
│   ├── OrderService.java
│   └── OrderRepository.java       # interface
└── infrastructure/
    ├── JdbcOrderRepository.java   # implements OrderRepository
    └── MessageBusClient.java
```
Note: The article warns that most changes often cut across layers (tight coupling). One mitigation it suggests is sequestering layer-specific concerns at boundaries (e.g., central error/i18n mapping, early DTO-to-domain mapping) rather than letting them infiltrate the codebase.

### By Kind (Considered Harmful)
**Focus:** Grouping classes into arbitrary buckets based on their technical type (e.g., `interfaces`, `exceptions`, `managers`) instead of their business function.

**Key principle:** This is an anti-pattern that ignores the actual relationships and dependencies between classes. While it appears to create order, it actually hides complexity and results in tightly coupled packages, as a single feature change often requires modifying files in every bucket. It forces classes into artificial roles (e.g., a `Helper` or `Manager`) just to fit a category.

**Example (Anti-pattern):**
```
src/
├── interfaces/
│   ├── UserInterface.java
│   ├── OrderInterface.java
│   ├── ProductInterface.java
│   └── PaymentInterface.java
├── entities/
│   ├── User.java
│   ├── Order.java
│   ├── Product.java
│   └── Payment.java
├── managers/
│   ├── UserManager.java
│   ├── OrderManager.java
│   ├── ProductManager.java
│   └── PaymentManager.java
├── helpers/
│   ├── ValidationHelper.java
│   ├── ConversionHelper.java
│   └── UtilityHelper.java
└── exceptions/
    ├── UserException.java
    ├── OrderException.java
    └── ValidationException.java
```
Note: As the article states, this seems neat but hides conceptual relationships and typically increases coupling; most changes cut across all buckets.

### Key Takeaways
- **Component organization** is the strongest strategy, emphasizing true separation and minimal coupling
- **Toolbox organization** works well for complementary implementations
- **Layer organization** should be used cautiously as it often increases complexity
- **Kind organization** is an anti-pattern that groups unrelated classes by technical type, which hides complexity and increases coupling.

The article emphasizes that the main goal is reducing complexity through proper separation, not just making packages smaller. Read the [blog post](https://medium.com/@msandin/strategies-for-organizing-code-2c9d690b6f33) for more details.


## Workflow

### Coding Workflow

```
+---------+      +-----------+      +-------------+      +-----------------+
| Feature | ---> | Workflow  | ---> | Data Models | ---> | Code Components |
+---------+      +-----------+      +-------------+      +-----------------+
                                                             |
                                                             v
                                                      +--------------+
                                                      |   Develop    |
                                                      +--------------+
                                                             |
                                                             v
                                                      +--------------+
                                                      |  Unit Test   |
                                                      +--------------+
                                                             |
                                                             v
                                                      +--------------+
                                                      | Code Review  |
                                                      +--------------+
```

### Development Workflow

```ascii
            +--------------------------------+
            |        Feature Request         |
            |         (Jira Ticket)          |
            +---------------+----------------+
                            |
                            v
            +--------------------------------+
            | Create `feature/*` from `dev`  |
            +---------------+----------------+
                            |
                            v
            +--------------------------------+
            |      Implement & Unit Test     |
            +---------------+----------------+
                            |
                            v
            +--------------------------------+
            |         Pull Request           |
            |   (feature/* -> develop)       |
            +---------------+----------------+
                            |
   +------------------------+---------------------------+
   |                        |                           |
   v                        v                           v
+-----------------+  +----------------+  +----------------+
|   Code Review   |  |   CI Checks    |  | Peer Feedback  |
|  (2 Approvals)  |  | (Lint, Tests)  |  |                |
+-----------------+  +----------------+  +----------------+
   |                        |                           |
   +------------------------+---------------------------+
                            |
                            v
            +--------------------------------+
            |      Merge to `develop`        |
            +---------------+----------------+
                            |
                            v
            +--------------------------------+
            |      Deploy to Staging         |
            +---------------+----------------+
                            |
                            v
            +--------------------------------+
            |     QA & Acceptance Testing    |
            +---------------+----------------+
                            |
                            v
            +--------------------------------+
            |Create `release/*` from `develop`|
            +---------------+----------------+
                            |
                            v
            +--------------------------------+
            |        Merge to `main`         |
            |          & Tag Release         |
            +---------------+----------------+
                            |
                            v
            +--------------------------------+
            |       Deploy to Production     |
            +--------------------------------+
```

## Version Control

**Version control tools**
- Git
- dvc (Data Version Control)
- svn (Subversion)


**Semantic Versioning**
- `v1.2.3` means `Major.Minor.Patch`, where `Major` is when you make incompatible API changes, `Minor` is when you add functionality in a backwards-compatible manner, and `Patch` is when you make backwards-compatible bug fixes

**Version Control Workflow**

```
Alpha -> Beta -> RC1 -> RC2 -> ... -> RCn -> Release
```

`Alpha` is the initial version, `Beta` is the second version, `RC1` is the first release candidate, `RC2` is the second release candidate, and so on. `Release` is the final version.

- Read more about [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
- Read more about [Write Better Commits, Build Better Projects](https://github.blog/developer-skills/github/write-better-commits-build-better-projects/)

## Testing

- **Unit Testing**: Testing individual units of code in isolation to ensure they function correctly.
- **Functional Testing**: Testing the code to ensure it performs its intended functions correctly.
- **Non-Functional Testing**: Testing the code to ensure it performs its intended functions correctly.
- **Integration Testing**: Testing how individual units or components interact with each other to ensure they work together properly. It focuses on verifying that different parts of the application integrate correctly and data flows appropriately between components.
- **Stress Testing**: Testing the code with high load to ensure it works as expected
- **System Testing**: Testing the entire system as a whole to ensure all components work together as expected
- **Acceptance Testing**: Testing performed to determine if the requirements of a specification or contract are met. It's the final verification before the software is delivered to the customer.

## CI/CD

- **CI**: Continuous Integration
- **CD**: Continuous Deployment

## Resource Attributes

**Host System Information:**

- Host Name: Machine hostname
- Host System: Operating system (Windows, macOS, Linux)
- Host Version: OS version details
- Host Processor: CPU architecture information
- Host Machine: Machine type identifier

**Performance Metrics:**

- CPU Count: Number of available CPU cores
- CPU Percent: CPU utilization at trace start
- Memory Total: Total system memory
- Memory Available: Available system memory
- Memory Used: Currently used memory
- Memory Percent: Memory utilization percentage

**Dependencies:**

- Imported Libraries: List of Python packages imported in your environment

## Implementation Patterns

1) SSR

- Common names: Server-side rendering (SSR), Backend-rendered UI, Monolithic web app
- When to use: Simple flows, SEO-friendly pages, minimal interactivity, faster first paint
- Pros: Simple deploy, fewer moving parts, great SEO, no CORS concerns
- Cons: Limited rich interactivity, backend tightly coupled to UI

2) Decoupled

- Common names: Decoupled architecture, Frontend–backend separation, SPA + API, Headless backend
- When to use: Rich UX, complex state, team separation, mobile + web reuse
- Pros: Independent scaling/deploy, modern DX, reusable API
- Cons: More infra (CORS, versioning), SEO needs SSR/SSG, higher complexity

3) MPA (Multi-Page Application)

- Common names: Multi-page application (MPA), Client-side routing, Static site generation (SSG). Hybrid approach using server-side routing with client-side rendering. Each page is a separate mini-application with its own entry point.
- When to use: Large applications, complex state, team separation, mobile + web reuse
- Pros: Better initial load performance than SPAs for large applications, Easier code-splitting as each page loads only what it needs, SEO-friendly without extra complexity (each route has its own HTML), Progressive enhancement - pages can work even before JS loads.
- Cons: Page transitions require full reloads (slower than SPA navigation), More complex routing setup (need both server and client routes), Potential code duplication across pages, Session/state management more complex across page boundaries.

## Deployment Options

Deployment architecture determines how your application components are distributed across infrastructure. The choice affects scalability, maintainability, cost, and operational complexity.

### All-in-One Server (Monolithic Deployment)

**Architecture**: Single server hosts all application components - web server, application logic, database, and file storage.

```
┌──────────────────────────────────────┐
│           Single Server              │
│  ┌─────────────────────────────────┐ │
│  │        Web Server               │ │
│  │     (Nginx/Apache)              │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │     Application Server          │ │
│  │   (Django/Flask/FastAPI)        │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │        Database                 │ │
│  │    (PostgreSQL/MySQL)           │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │      File Storage               │ │
│  │     (Local Disk)                │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**When to Use**:

- Small to medium applications

- Limited budget or resources

- Simple deployment requirements

- Proof of concepts or MVPs

- Teams with limited DevOps expertise

**Pros**:

- **Simple deployment**: Single artifact to deploy

- **Low operational overhead**: One server to manage

- **Cost-effective**: Minimal infrastructure costs

- **Fast development**: No network latency between components

- **Easy debugging**: All logs in one place

- **No network complexity**: No inter-service communication issues

**Cons**:

- **Single point of failure**: Server down = entire app down

- **Limited scalability**: Can only scale vertically

- **Resource contention**: Database and app compete for CPU/memory

- **Technology lock-in**: All components must use compatible tech stack

- **Deployment risk**: Any update affects entire system

**Example Stack**:
```bash
# Docker Compose for all-in-one deployment
version: '3.8'
services:
  app:
    build: .
    ports:
      - "80:8000"
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    environment:
      - DATABASE_URL=sqlite:///app/data/app.db
```

### Split DB into its own server (Database Separation)

**Architecture**: Application server and database run on separate machines, connected via network.

```
┌──────────────────────────────────────┐    ┌──────────────────────────────────────┐
│        Application Server            │    │         Database Server              │
│  ┌─────────────────────────────────┐ │    │  ┌─────────────────────────────────┐ │
│  │        Web Server               │ │    │  │        Database                 │ │
│  │     (Nginx/Apache)              │ │    │  │    (PostgreSQL/MySQL)           │ │
│  └─────────────────────────────────┘ │    │  │                                 │ │
│  ┌─────────────────────────────────┐ │    │  │  - Optimized for DB workloads   │ │
│  │     Application Logic           │◄┼────┼──┤  - Dedicated storage (SSD)      │ │
│  │   (Django/Flask/FastAPI)        │ │    │  │  - Memory tuned for caching     │ │
│  └─────────────────────────────────┘ │    │  │  - Regular backups              │ │
│  ┌─────────────────────────────────┐ │    │  └─────────────────────────────────┘ │
│  │      File Storage               │ │    └──────────────────────────────────────┘
│  │     (Local/Cloud)               │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**When to Use**:

- Growing applications with database performance issues

- Need for database-specific optimizations

- Different scaling requirements for app vs. database

- Security requirements (database isolation)

- Multiple applications sharing same database

**Pros**:

- **Independent scaling**: Scale app and DB separately

- **Specialized optimization**: DB server tuned for database workloads

- **Better resource utilization**: No competition between app and DB

- **Enhanced security**: Database isolated from web-facing server

- **Backup flexibility**: Database backups don't affect app performance

- **Technology flexibility**: Can use managed database services

**Cons**:

- **Network latency**: Communication overhead between app and DB

- **Increased complexity**: Two servers to manage and monitor

- **Network security**: Need secure connection between servers

- **Higher costs**: Additional server infrastructure

- **Deployment coordination**: Changes may require coordinating both servers

**Example Configuration**:
```python
# Application server configuration
DATABASE_CONFIG = {
    'host': 'db-server.internal',
    'port': 5432,
    'database': 'myapp',
    'user': 'app_user',
    'password': os.environ['DB_PASSWORD'],
    'pool_size': 20,
    'max_overflow': 30
}
```

### Each service on its own server (Microservices Architecture)

**Architecture**: Application broken into independent services, each deployed on separate infrastructure.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Service  │    │  Order Service  │    │ Payment Service │
│                 │    │                 │    │                 │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │    API    │  │    │  │    API    │  │    │  │    API    │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
│  ┌───────────┐  │    │  ┌───────────┐  │    │  ┌───────────┐  │
│  │ User DB   │  │    │  │ Order DB  │  │    │  │Payment DB │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                ┌─────────────────────────────────┐
                │         API Gateway             │
                │      (Load Balancer)            │
                └─────────────────────────────────┘
                                 │
                ┌─────────────────────────────────┐
                │         Frontend/Client         │
                └─────────────────────────────────┘
```

**When to Use**:

- Large, complex applications

- Multiple development teams

- Different scaling requirements per service

- Need for technology diversity

- High availability requirements

- Rapid development and deployment cycles

**Pros**:

- **Independent scaling**: Scale each service based on demand

- **Technology diversity**: Each service can use optimal tech stack

- **Team autonomy**: Teams can develop and deploy independently

- **Fault isolation**: Failure in one service doesn't crash entire system

- **Easier maintenance**: Smaller, focused codebases

- **Continuous deployment**: Deploy services independently

**Cons**:

- **Operational complexity**: Many services to monitor and manage

- **Network overhead**: Inter-service communication latency

- **Data consistency**: Distributed transactions are complex

- **Service discovery**: Need mechanisms to find and connect services

- **Testing complexity**: Integration testing across services

- **Debugging difficulty**: Tracing issues across multiple services

**Supporting Infrastructure**:
```yaml
# Kubernetes deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: myapp/user-service:v1.2.3
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: user-db-secret
              key: url
```

### Additional Deployment Patterns

#### Serverless/Function-as-a-Service (FaaS)

**Architecture**: Application logic deployed as individual functions that execute on-demand.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  Lambda/Cloud   │    │   Database      │
│                 │    │    Functions    │    │   Service       │
│  ┌───────────┐  │    │                 │    │                 │
│  │  Routing  │──┼────┼─► Function A    │    │  ┌───────────┐  │
│  │   Rules   │  │    │  Function B ◄───┼────┼──│Managed DB │  │
│  └───────────┘  │    │  Function C     │    │  └───────────┘  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**When to Use**:
- Event-driven applications
- Unpredictable or sporadic traffic
- Cost optimization (pay-per-use)
- Rapid prototyping
- Microservices with minimal infrastructure management

#### Container Orchestration (Docker + Kubernetes)

**Architecture**: Containerized services managed by orchestration platform.

```
┌────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Node 1   │  │    Node 2   │  │    Node 3   │         │
│  │             │  │             │  │             │         │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │         │
│  │ │Pod: App │ │  │ │Pod: App │ │  │ │Pod: DB  │ │         │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │         │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │         │
│  │ │Pod:Cache│ │  │ │Pod:Queue│ │  │ │Pod:Cache│ │         │
│  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└────────────────────────────────────────────────────────────┘
```

### Deployment Decision Matrix

| Factor | All-in-One | Split DB | Microservices | Serverless |
|--------|------------|----------|---------------|------------|
| **Team Size** | 1-3 devs | 3-8 devs | 8+ devs | Any size |
| **App Complexity** | Simple | Medium | Complex | Event-driven |
| **Traffic Pattern** | Predictable | Growing | Variable | Sporadic |
| **Budget** | Low | Medium | High | Variable |
| **Ops Expertise** | Basic | Intermediate | Advanced | Minimal |
| **Scalability Need** | Low | Medium | High | Auto |
| **Development Speed** | Fast | Medium | Slow | Fast |

### Migration Path

```
All-in-One → Split DB → Service Separation → Full Microservices
     ↓           ↓            ↓                    ↓
   Simple    Moderate      Complex           Enterprise
```

**Evolution Strategy**:
1. **Start Simple**: Begin with all-in-one for MVP
2. **Identify Bottlenecks**: Monitor performance and identify constraints
3. **Extract Database**: Move to split DB when database becomes bottleneck
4. **Service Extraction**: Extract high-load or independent features as services
5. **Full Decomposition**: Move to full microservices when team and complexity justify it

## Performance Bottleneck Classification

### Types of Performance Limitations

- **CPU-bound**: Tasks limited by computational power
  - Characteristics: High CPU usage, low I/O wait, processor at/near 100%
  - Examples: Complex calculations, data processing, rendering, compression
  - Solutions: Optimize algorithms, parallelize work, use compiled languages, scale vertically (more CPU power)

- **Memory-bound**: Tasks limited by memory capacity or bandwidth
  - Characteristics: High memory usage, swapping, garbage collection pauses
  - Examples: Large data structures, caching, in-memory databases
  - Solutions: Optimize data structures, reduce memory footprint, memory profiling, vertical scaling (more RAM)

- **I/O-bound**: Tasks limited by input/output operations
  - Characteristics: Low CPU usage, high wait time, processes blocked on I/O
  - Examples: Database queries, file operations, network requests, API calls
  - Solutions: Asynchronous I/O, connection pooling, caching, batching requests

- **Network-bound**: Tasks limited by network throughput or latency
  - Characteristics: Waiting on remote services, bandwidth saturation
  - Examples: Downloading/uploading large files, microservice communication
  - Solutions: Compression, CDNs, edge computing, protocol optimization, connection reuse

- **Disk-bound**: Tasks limited by storage read/write speeds
  - Characteristics: High disk utilization, processes waiting on disk operations
  - Examples: Database writes, log processing, file system operations
  - Solutions: SSDs, RAID configurations, write batching, appropriate file systems

### Identifying Performance Bottlenecks

```
Observe → Measure → Analyze → Optimize → Verify
```

1. **Observation Tools**:
   - CPU: `top`, `htop`, `mpstat`
   - Memory: `free`, `vmstat`
   - I/O: `iostat`, `iotop`
   - Network: `netstat`, `iftop`
   - Comprehensive: `dstat`, `glances`

2. **Profiling Techniques**:
   - Sampling profilers: Capture stack traces at intervals
   - Tracing profilers: Instrument code to track execution
   - Distributed tracing: Track requests across services (Jaeger, Zipkin)
   - Flame graphs: Visualize CPU/memory usage hierarchically

3. **Performance Testing**:
   - Load testing: Simulate expected load (JMeter, Locust)
   - Stress testing: Find breaking points
   - Soak testing: Verify stability under sustained load
   - Spike testing: Test response to sudden load increases