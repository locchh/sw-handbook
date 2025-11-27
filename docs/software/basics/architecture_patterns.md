# Architecture patterns

## System-Level Architecture Patterns

System-level architecture patterns define how entire systems, services, and components are organized and communicate with each other. These patterns address concerns like scalability, reliability, maintainability, and distributed system challenges.

### 1. Event-Driven Architecture

**Overview**: Components communicate through events rather than direct calls. Events represent something that happened in the system.

```mermaid
flowchart LR
    ServiceA[Service A] -->|publishes event| EventBus[Event Bus]
    EventBus -->|delivers event| ServiceB[Service B]
    EventBus -->|delivers event| ServiceC[Service C]
    EventBus -->|delivers event| ServiceD[Service D]
    
    style EventBus fill:#FFD700
    style ServiceA fill:#90EE90
    style ServiceB fill:#ADD8E6
    style ServiceC fill:#ADD8E6
    style ServiceD fill:#ADD8E6
```

**Key Components**:
- **Event Producers**: Generate and publish events
- **Event Consumers**: Subscribe to and process events
- **Event Bus/Broker**: Routes events between producers and consumers
- **Event Store**: Optionally persists events for replay

**When to Use**:
- Real-time systems requiring immediate responses
- Microservices that need loose coupling
- Systems with complex workflows
- Applications requiring audit trails

**Pros**:
- Loose coupling between components
- High scalability and responsiveness
- Easy to add new consumers
- Natural audit trail

**Cons**:
- Complex debugging (async flow)
- Event ordering challenges
- Potential for event storms

### 2. Microservices Architecture

**Overview**: Application is decomposed into small, independent services that communicate over well-defined APIs.

```mermaid
flowchart TB
    Client[Client Application] --> Gateway[API Gateway]
    Gateway --> UserService[User Service]
    Gateway --> OrderService[Order Service]
    Gateway --> PaymentService[Payment Service]
    Gateway --> NotificationService[Notification Service]
    
    UserService --> UserDB[(User DB)]
    OrderService --> OrderDB[(Order DB)]
    PaymentService --> PaymentDB[(Payment DB)]
    NotificationService --> MessageQueue[Message Queue]
    
    style Gateway fill:#FFD700
    style UserService fill:#90EE90
    style OrderService fill:#ADD8E6
    style PaymentService fill:#FFB6C1
    style NotificationService fill:#DDA0DD
```

**Key Characteristics**:
- **Single Responsibility**: Each service owns a specific business capability
- **Decentralized**: Independent deployment and scaling
- **Technology Agnostic**: Services can use different tech stacks
- **Fault Tolerant**: Failure in one service doesn't crash the system

**When to Use**:
- Large, complex applications
- Multiple development teams
- Different scaling requirements per feature
- Need for rapid, independent deployments

**Pros**:
- Independent scaling and deployment
- Technology diversity
- Team autonomy
- Fault isolation

**Cons**:
- Operational complexity
- Network latency overhead
- Data consistency challenges
- Testing complexity

### 3. Monolithic Architecture

**Overview**: All components of an application are packaged and deployed as a single unit.

```mermaid
flowchart TB
    Client[Client] --> LoadBalancer[Load Balancer]
    LoadBalancer --> App1[Monolithic App Instance 1]
    LoadBalancer --> App2[Monolithic App Instance 2]
    LoadBalancer --> App3[Monolithic App Instance 3]
    
    App1 --> Database[(Shared Database)]
    App2 --> Database
    App3 --> Database
    
    subgraph "Monolithic Application"
        UI[UI Layer]
        Business[Business Layer]
        Data[Data Layer]
    end
    
    style LoadBalancer fill:#FFD700
    style Database fill:#ADD8E6
```

**When to Use**:
- Small to medium applications
- Simple business logic
- Limited team size
- Rapid prototyping

**Pros**:
- Simple deployment and testing
- Easy debugging
- Better performance (no network calls)
- Simpler development initially

**Cons**:
- Difficult to scale specific components
- Technology lock-in
- Large codebase becomes unwieldy
- Deployment of small changes affects entire system

### 4. Service-Oriented Architecture (SOA)

**Overview**: Services communicate through well-defined interfaces and protocols, typically with enterprise service bus.

```mermaid
flowchart TB
    Client1[Web Client] --> ESB[Enterprise Service Bus]
    Client2[Mobile Client] --> ESB
    Client3[Partner API] --> ESB
    
    ESB --> Service1[Customer Service]
    ESB --> Service2[Inventory Service]
    ESB --> Service3[Billing Service]
    ESB --> Service4[Reporting Service]
    
    Service1 --> DB1[(Customer DB)]
    Service2 --> DB2[(Inventory DB)]
    Service3 --> DB3[(Billing DB)]
    Service4 --> DataWarehouse[(Data Warehouse)]
    
    style ESB fill:#FFD700
    style Service1 fill:#90EE90
    style Service2 fill:#ADD8E6
    style Service3 fill:#FFB6C1
    style Service4 fill:#DDA0DD
```

**Key Principles**:
- **Service Contracts**: Well-defined interfaces
- **Service Autonomy**: Services control their own logic
- **Service Reusability**: Services can be reused across applications
- **Service Composability**: Services can be combined to create new functionality

**When to Use**:
- Enterprise environments
- Legacy system integration
- Need for service reuse across multiple applications
- Governance and compliance requirements

### 5. Client-Server Architecture

**Overview**: Clients request services from servers, which process requests and return responses.

```mermaid
flowchart LR
    Client1[Web Browser] --> Server[Web Server]
    Client2[Mobile App] --> Server
    Client3[Desktop App] --> Server
    
    Server --> AppServer[Application Server]
    AppServer --> Database[(Database)]
    AppServer --> FileSystem[File System]
    
    style Server fill:#FFD700
    style AppServer fill:#90EE90
    style Database fill:#ADD8E6
```

**Variants**:
- **2-Tier**: Client directly communicates with database
- **3-Tier**: Client → Application Server → Database
- **N-Tier**: Multiple intermediate layers

**When to Use**:
- Traditional web applications
- Database-driven applications
- Need for centralized data management

### 6. Peer-to-Peer (P2P) Architecture

**Overview**: Nodes act as both clients and servers, sharing resources directly with each other.

```mermaid
flowchart LR
    Peer1[Peer 1] <--> Peer2[Peer 2]
    Peer2 <--> Peer3[Peer 3]
    Peer3 <--> Peer4[Peer 4]
    Peer4 <--> Peer1
    Peer1 <--> Peer3
    Peer2 <--> Peer4
    
    style Peer1 fill:#90EE90
    style Peer2 fill:#ADD8E6
    style Peer3 fill:#FFB6C1
    style Peer4 fill:#DDA0DD
```

**When to Use**:
- File sharing systems
- Blockchain networks
- Distributed computing
- Systems requiring high availability without central points of failure

**Pros**:
- No single point of failure
- Highly scalable
- Cost-effective (no central infrastructure)

**Cons**:
- Security challenges
- Difficult to maintain consistency
- Network complexity

### 7. Pipe and Filter Architecture

**Overview**: Data flows through a series of processing stages (filters) connected by pipes.

```mermaid
flowchart LR
    Input[Raw Data] --> Filter1[Parse Data]
    Filter1 --> Filter2[Validate Data]
    Filter2 --> Filter3[Transform Data]
    Filter3 --> Filter4[Enrich Data]
    Filter4 --> Output[Processed Data]
    
    style Input fill:#FFD700
    style Filter1 fill:#90EE90
    style Filter2 fill:#ADD8E6
    style Filter3 fill:#FFB6C1
    style Filter4 fill:#DDA0DD
    style Output fill:#98FB98
```

**When to Use**:
- Data processing pipelines
- Stream processing
- Batch processing systems
- ETL (Extract, Transform, Load) operations

**Pros**:
- Easy to understand and modify
- Reusable filters
- Parallel processing possible
- Good for batch processing

**Cons**:
- Not suitable for interactive systems
- Overhead of data transformation between filters

### 8. Serverless Architecture

**Overview**: Application logic runs in stateless compute containers managed by cloud providers.

```mermaid
flowchart TB
    Client[Client] --> Gateway[API Gateway]
    Gateway --> Function1[Lambda Function 1]
    Gateway --> Function2[Lambda Function 2]
    Gateway --> Function3[Lambda Function 3]
    
    Function1 --> Database[(Managed Database)]
    Function2 --> Storage[Object Storage]
    Function3 --> Queue[Message Queue]
    
    Event[Event Source] --> Function1
    Schedule[Scheduled Event] --> Function2
    
    style Gateway fill:#FFD700
    style Function1 fill:#90EE90
    style Function2 fill:#ADD8E6
    style Function3 fill:#FFB6C1
```

**When to Use**:
- Event-driven applications
- Unpredictable or sporadic traffic
- Rapid prototyping
- Cost optimization for low-traffic applications

**Pros**:
- No server management
- Automatic scaling
- Pay-per-use pricing
- Fast deployment

**Cons**:
- Vendor lock-in
- Cold start latency
- Limited execution time
- Debugging challenges

### 9. Architecture Pattern Comparison

| Pattern | Scalability | Complexity | Cost | Best For |
|---------|-------------|------------|------|----------|
| **Monolithic** | Limited | Low | Low | Small apps, prototypes |
| **Microservices** | High | High | High | Large, complex systems |
| **SOA** | Medium | Medium | Medium | Enterprise integration |
| **Event-Driven** | High | Medium | Medium | Real-time systems |
| **Client-Server** | Medium | Low | Low | Traditional web apps |
| **P2P** | High | High | Low | Distributed systems |
| **Serverless** | Auto | Low | Variable | Event-driven, sporadic load |

### Choosing the Right Pattern

**Consider These Factors**:

1. **Team Size & Expertise**
   - Small teams: Monolithic or Client-Server
   - Large teams: Microservices or SOA

2. **System Complexity**
   - Simple: Monolithic
   - Complex: Microservices or Event-Driven

3. **Scalability Requirements**
   - Low: Monolithic
   - High: Microservices, Event-Driven, or Serverless

4. **Performance Requirements**
   - Low latency: Monolithic
   - High throughput: Event-Driven or Microservices

5. **Budget Constraints**
   - Limited: Monolithic or Serverless
   - High: Microservices or SOA

## Application-level UI patterns

What distinguishes MVC, MVP, MVVM, MVVM-C, and VIPER architecture patterns from each other?

These architecture patterns are among the most commonly used in app development, whether on iOS or Android platforms. Developers have introduced them to overcome the limitations of earlier patterns. So, how do they differ?

- MVC, the oldest pattern, dates back almost 50 years

- Every pattern has a "view" (V) responsible for displaying content and receiving user input

- Most patterns include a "model" (M) to manage business data

- "Controller," "presenter," and "view-model" are translators that mediate between the view and the model ("entity" in the VIPER pattern)

- These translators can be quite complex to write, so various patterns have been proposed to make them more maintainable

### 1. MVC (Model View Controller)

The Model-View-Controller pattern separates an application into three interconnected components.

```mermaid
flowchart LR
    User([User]) --> View[View]
    View -->|notify| Controller[Controller]
    Controller -->|update| Model[Model]
    Model -->|get data| View
    
    style View fill:#90EE90
    style Controller fill:#FFB6C1
    style Model fill:#ADD8E6
```

**Components:**
- **Model**: Manages data and business logic
- **View**: Handles the user interface and presentation
- **Controller**: Mediates between Model and View, handles user input

### 2. MVP (Model View Presenter)

The Model-View-Presenter pattern is similar to MVC but with a different flow of communication.

```mermaid
flowchart LR
    User([User]) --> View[View]
    View -->|notify| Presenter[Presenter]
    Presenter -->|update| View
    Presenter -->|update| Model[Model]
    Model -->|get data| Presenter
    
    style View fill:#90EE90
    style Presenter fill:#FFFF99
    style Model fill:#ADD8E6
```

**Components:**
- **Model**: Manages data and business logic
- **View**: Handles the user interface (passive)
- **Presenter**: Contains presentation logic, mediates between View and Model

### 3. MVVM (Model View View-Model)

The Model-View-ViewModel pattern uses data binding to connect the View and ViewModel.

```mermaid
flowchart LR
    User([User]) --> View[View]
    View -->|Data binding| ViewModel[View Model]
    ViewModel -.->|Notify| View
    ViewModel -->|update| Model[Model]
    Model -.->|Notify| ViewModel
    
    style View fill:#90EE90
    style ViewModel fill:#FFFF99
    style Model fill:#ADD8E6
```

**Components:**
- **Model**: Manages data and business logic
- **View**: Handles the user interface with data binding
- **ViewModel**: Exposes data and commands for the View, handles presentation logic

### 4. MVVM-C (Model View View-Model Coordinator)

MVVM-C extends MVVM by adding a Coordinator to handle navigation and flow control.

```mermaid
flowchart TB
    Coordinator[Coordinator] -->|control| MVVM
    
    subgraph MVVM ["MVVM Flow"]
        User([User]) --> View[View]
        View -->|Data binding| ViewModel[View Model]
        ViewModel -.->|Notify| View
        ViewModel -->|update| Model[Model]
        Model -.->|Notify| ViewModel
    end
    
    style View fill:#90EE90
    style ViewModel fill:#FFFF99
    style Model fill:#ADD8E6
    style Coordinator fill:#FFB6C1
```

**Components:**
- **Model**: Manages data and business logic
- **View**: Handles the user interface with data binding
- **ViewModel**: Exposes data and commands for the View
- **Coordinator**: Manages navigation and application flow

### 5. VIPER (View Interactor Presenter Entity Router)

VIPER is a more complex pattern that separates concerns into five distinct components.

```mermaid
flowchart LR
    User([User]) --> View[View]
    View -->|Data binding| Presenter[Presenter]
    Presenter -.->|Notify| View
    Presenter -->|update| Interactor[Interactor]
    Interactor -.->|Notify| Presenter
    Interactor -->|manage| Entity[Entity]
    Entity -.->|notify| Interactor
    Router[Router] -->|manage| Presenter
    
    style View fill:#90EE90
    style Presenter fill:#FFFF99
    style Entity fill:#ADD8E6
    style Router fill:#FFB6C1
    style Interactor fill:#DDA0DD
```

**Components:**
- **View**: Handles the user interface
- **Interactor**: Contains business logic
- **Presenter**: Handles presentation logic and formatting
- **Entity**: Basic data models
- **Router**: Handles navigation and module assembly

### Pattern Comparison

| Pattern | Complexity | Testability | Separation of Concerns | Best Use Case |
|---------|------------|-------------|----------------------|---------------|
| MVC | Low | Medium | Good | Simple applications |
| MVP | Medium | High | Very Good | Applications requiring high testability |
| MVVM | Medium | High | Very Good | Applications with complex UI binding |
| MVVM-C | High | High | Excellent | Large applications with complex navigation |
| VIPER | Very High | Excellent | Excellent | Enterprise applications with complex business logic |
