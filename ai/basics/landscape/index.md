# The LLM Landscape

A map of where the pieces sit when you build with large language models. Each layer below is a *choice point* — you pick one option per layer, and the layers stack from the model itself up to the protocols that let agents talk to the outside world.

```
Protocols          — how agents talk to tools and each other
Observability      — how you know it works
CLI Coding Agents  — agents as developer tooling
Frameworks         — orchestration on top of the SDKs
Agent SDKs         — official agent loops
SDKs               — official API clients
Providers          — the models themselves (direct or via cloud)
```

## Official LLM Providers

Buy the model directly from whoever trained it. Lowest latency to new features — new models and API capabilities land here first.

- [GPT](https://platform.openai.com/docs/overview)
- [Claude](https://platform.claude.com/docs/en/home)
- [Mistral](https://docs.mistral.ai/)
- [GLM](https://docs.z.ai/guides/overview/quick-start)

## Cloud Service LLM Providers

The same (or similar) models resold through a hyperscaler. You trade some feature lag for enterprise billing, data residency, IAM, and VPC networking you already have.

- [AWS Bedrock](https://aws.amazon.com/bedrock/)
- [Microsoft Foundry](https://ai.azure.com/doc/?tid=f01e930a-b52e-42b1-b70f-a8882b5d043b)
- [Google Gemini](https://ai.google.dev/gemini-api/docs/libraries)

## Official Provider SDKs

Thin, typed clients over the provider's HTTP API. Start here — most applications never need more.

- [OpenAI SDK](https://github.com/openai/openai-python)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-python)

## Official Agent SDKs

One level up: the provider's own agent loop — tool calling, multi-turn state, and context management handled for you.

- [OpenAI Agents](https://github.com/openai/openai-agents-python)
- [Anthropic Agents](https://github.com/anthropics/claude-agent-sdk-python)
- [Google ADK](https://github.com/google/adk-python)

## Third-party Frameworks

Provider-agnostic orchestration. Worth the abstraction when you need multi-provider portability, graph-shaped control flow, or multi-agent coordination — and a cost when you don't.

- [LangChain](https://docs.langchain.com)
- [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview)
- [AutoGen](https://microsoft.github.io/autogen/stable/)
- [CrewAI](https://docs.crewai.com/)
- [Strands Agents](https://strandsagents.com/latest/documentation/docs/)

## CLI Coding Agents

Agents that live in your terminal and edit your repository. See [AI Tools](https://locchh.github.io/sw-handbook/ai/tool_tip/tools/index.md) and [Spec-Driven Development](https://locchh.github.io/sw-handbook/ai/tool_tip/spec_driven_development/index.md) for the workflows built on top of them.

- [Claude Code](https://github.com/anthropics/claude-code)
- [OpenCode](https://github.com/anomalyco/opencode)
- [CodeX](https://github.com/openai/codex)

## Observability & Evaluation

Tracing, cost tracking, and quality measurement. Non-negotiable once anything reaches production — an LLM app that isn't evaluated is an LLM app you can't safely change.

- [TruLens](https://www.trulens.org/)
- [LangSmith](https://github.com/langchain-ai/langsmith-sdk)

## Protocols

Open standards for connecting models to tools, editors, and other agents — the interoperability layer that keeps you from re-implementing every integration per vendor.

- [Model Context Protocol](https://github.com/modelcontextprotocol/modelcontextprotocol) — connects models to tools and data sources
- [Agent Client Protocol](https://github.com/agentclientprotocol/agent-client-protocol) — connects agents to editors
- [A2A](https://github.com/a2aproject/A2A) — agent-to-agent communication
