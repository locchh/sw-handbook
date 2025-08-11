
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

## Coding Workflow

```
Feature -> Workflow -> Code Components -> Develop -> Unit Test -> Code Review
```

## Development Workflow

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

**Semantic Versioning**
- `v1.2.3` means `Major.Minor.Patch`, where `Major` is when you make incompatible API changes, `Minor` is when you add functionality in a backwards-compatible manner, and `Patch` is when you make backwards-compatible bug fixes

**Version Control Workflow**

```
Alpha -> Beta -> RC1 -> RC2 -> ... -> RCn -> Release
```

`Alpha` is the initial version, `Beta` is the second version, `RC1` is the first release candidate, `RC2` is the second release candidate, and so on. `Release` is the final version.

## Testing

- **Unit Testing**: Testing individual units of code in isolation to ensure they function correctly.
- **Stress Testing**: Testing the code with high load to ensure it works as expected
- **Integration Testing**: Testing how individual units or components interact with each other to ensure they work together properly. It focuses on verifying that different parts of the application integrate correctly and data flows appropriately between components.
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
