# Study Guide

## How to start with Coding Assistant

### Project kickoff
1. I want to start a new project follow my {design_document}, What should I do first?

2. What is the codebase structure? Give me step by step instructions to set up the project.

3. Give me a template for the project.

4. What exact commands do I run to set up the project on a fresh machine (OS, package manager, env vars)?

5. What minimal Dockerfile and docker-compose should I use for local development?

6. What branching strategy and commit message format should we follow? Provide examples.

7. Which linters, formatters, and pre-commit hooks should we enforce and how to configure them?

8. How should I configure local dev environment to mirror production (secrets, DB fixtures, sample data)?

### Code Implementation
9. Give me a plan to implement the project or implement the feature {feature_name}.

10. Implement {functionality} in {language} with tests and inline comments — include edge cases.

11. I see this error: {error_message} with stack trace {stack_trace} — how do I reproduce and fix it?

12. Suggest monitoring, alerting thresholds, and runbook steps for common incidents.

11. What logs/metrics/traces should I add to understand failures in {component}? Provide example log lines and metric names.

### Code Review
12. Give me a checklist for PR review (security, tests, docs, performance).

### CI/CD
13. What CI/CD pipeline (GitHub Actions/GitLab/etc.) do you recommend — include YAML config and key steps.

### Docs, learning & collaboration

14. Write a short onboarding doc for new devs: setup, run, test, deploy.
15. Explain {concept} (e.g., dependency injection, event sourcing) with code examples and analogies.
16. Produce a changelog entry or release notes for this PR.
17. Create API documentation (OpenAPI/Swagger) for the endpoints in this repo.


## Top Level CodeBase Questions

1. What is the overall purpose and functionality (features) of this codebase?

2. What is the architecture and high-level structure of the codebase?

3. What are the core modules/components and how do they interact?

4. What are the entry points to the application?

5. What technologies, frameworks, and languages are used?

6. What are the coding standards and patterns used throughout the project?

7. How is the project configured for different environments (development, testing, production)?

8. How to run the codebase locally?

9. What are the data models and how is data flowing through the system?

10. **Explain about the project's architecture and how it works**

11. **Explain about the relationship between the code components in this sub-package**

12. How is the codebase tested and what is the test coverage?

## Top Level Platform Questions

1. What is the overall purpose and business value of the platform?

2. What are the main components of the platform and what function does each serve?

3. How do the different components communicate and integrate with each other?

4. What are the dependencies between components and what is the deployment order?

5. What are the entry points and interfaces for each component?

6. How is authentication and authorization handled across the platform?

7. What are the common failure points and how is resilience built into the system?

8. How is the platform monitored and what observability tools are available?

9. What is the deployment and scaling strategy for each component?

10. How is data shared and synchronized across platform components?

## Universal Learning Formula

### Find the Right Resources

To learn any new technology effectively, focus on these three key resources:

* **Official Documentation:** Builds a solid foundation by explaining concepts, features, and usage as intended by the creators.
* **Example Codebases:** Helps you see how others use the technology in real-world scenarios and exposes you to best practices.
* **Open Source Implementations:** Allows you to dive deeper into the internals, core concepts, and underlying patterns.

### Rapid Learning Framework

#### Master the Fundamentals => Ask Coding Assisstant
- Grasp the core concepts before tackling advanced topics.
- Understand the problem the technology aims to solve.
- Learn essential mental models and paradigms (OOP, functional, reactive, etc.).

#### Apply the 80/20 Rule =>Ask Coding Assisstant
- Focus on the 20% of features that deliver 80% of the value.
- Prioritize high-impact concepts: data structures, algorithms, and design patterns.
- Leave rare or edge-case features for later, when necessary.

#### Build Projects Gradually
- Start small, using core features in simple projects.
- Increase project complexity as your confidence grows.
- Rebuild features from apps you admire to deepen understanding.

#### Practice with Intention
- Set clear learning goals with measurable outcomes.
- Use time management techniques like Pomodoro to stay focused.
- Regularly review and reinforce what you’ve learned.

#### Adopt a Testing Mindset
- Learn to write effective tests for your code.
- Understand testing frameworks and methodologies.
- Practice Test-Driven Development (TDD) when suitable.

#### Leverage Documentation Wisely
- Start with official tutorials and beginner guides.
- Use API references regularly during practice.
- Explore sections on architecture and design philosophy for deeper insights.

#### Learn from the community
- Analyze open-source projects that use the technology
- Follow thought leaders and contributors on social media
- Participate in forums, Discord channels, and Stack Overflow

#### Master the tooling ecosystem
- Learn the build tools, package managers, and deployment pipelines
- Understand debugging and profiling tools
- Get comfortable with the IDE/editor features specific to the technology

#### Maintain a learning journal
- Document challenges, solutions, and insights
- Create cheat sheets for quick reference
- Build a personal knowledge base of patterns and anti-patterns

#### Prepare for interviews specifically
- Study common interview questions for the technology
- Practice explaining complex concepts in simple terms
- Prepare code samples demonstrating your proficiency

### Accelerated Learning Techniques

- **Spaced repetition**: Review concepts at increasing intervals
- **Teaching others**: Explain concepts to reinforce your understanding
- **Pair programming**: Work with more experienced developers
- **Code reviews**: Have your code reviewed and review others' code
- **Timeboxed exploration**: Set a time limit for solving problems before seeking help

### Confidence-Building Strategies

- Start contributing to open-source projects
- Build and deploy a complete application using the technology
- Create technical content (blog posts, videos) explaining concepts
- Participate in hackathons or coding competitions
- Conduct mock interviews with peers

### Measuring Progress

- Track the complexity of problems you can solve independently
- Monitor how quickly you can implement new features
- Note how often you need to reference documentation
- Gauge your ability to debug issues efficiently
- Assess how well you can explain the technology to others

### Additional aspects

#### Security Considerations

Neither the CodeBase nor Platform sections address security concerns specifically. You might want to add questions about:

- What are the security measures implemented in the codebase/platform?
- How are vulnerabilities identified and addressed?
- What is the process for security reviews and audits?

### Documentation Standards

While coding standards are mentioned, documentation standards are equally important:

- How is the codebase/platform documented?
- What documentation tools and formats are used?
- Where can I find up-to-date documentation?

### Onboarding Process

A section on onboarding could be valuable:

- What's the recommended path for new developers to get familiar with the codebase/platform?
- Are there any mentorship or buddy systems in place?
- What resources are available for newcomers?

### Troubleshooting and Debugging

Consider adding specific questions about:

- What are common issues and their solutions?
- What debugging tools and techniques are recommended?
- Where to look for logs and how to interpret them?

### Performance Considerations

Questions about:

- What are the performance bottlenecks?
- How is performance measured and monitored?
- What optimization techniques are used?
    
### Community and Support

While community learning is mentioned in the learning framework, you might want to add specific questions about:

- Where to get help when stuck?
- What are the active community channels?
- Who are the key maintainers or experts to follow? 

### Version Control and Collaboration

Consider adding questions about:

- What version control system is used and how?
- What is the branching strategy?
- How are code reviews conducted? 
