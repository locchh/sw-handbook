# AI Tools

Choose AI tools by the part of the workflow that needs help: changing code, running a model, evaluating its answers, or operating a deployed system. A coding assistant and an inference server solve different problems; an evaluation suite tells you whether either change helped your application.

See [The LLM Landscape](../basics/landscape.md) for the broader architecture and [Software Tools](../../software/tool_tip/tools.md) for environments, checks, and local services.

## Choose by task

| Task | Starting point | Decision to make |
|---|---|---|
| Work on a codebase | [Claude Code](claude_code.md), [Codex](codex.md) | Which tool fits your editor, repository instructions, and permission boundaries? |
| Understand unfamiliar code | [DeepWiki](https://deepwiki.com/) | Can you verify its explanation against the relevant source and revision? |
| Supply library documentation | [Context7](https://github.com/upstash/context7) | Does the retrieved documentation match the project's dependency version? |
| Explore models and datasets | [Hugging Face](https://huggingface.co/docs) | Does the model's license, size, and intended use fit the task? |
| Experiment with local inference | [Ollama](https://docs.ollama.com/) | Does the model fit your hardware and produce acceptable answers? |
| Serve models on shared infrastructure | [vLLM](https://docs.vllm.ai/en/latest/) | Can the server meet concurrency, latency, and memory requirements? |
| Compare prompts and models | [Promptfoo](https://www.promptfoo.dev/docs/intro/) | Which examples and assertions define success? |
| Track experiments and application behavior | [MLflow](https://mlflow.org/docs/latest/) | What parameters, artifacts, metrics, and traces explain each result? |

## Coding assistants

Use one assistant on a bounded change first. Give it the goal, relevant files, constraints, and commands that demonstrate success. Read its diff and run those commands before accepting the result.

```text
Goal: handle an empty result in the search page.
Context: start with the search component and its existing tests.
Constraints: keep the public API and avoid new dependencies.
Verification: add a regression case, run the relevant tests,
then run the project's lint and build commands.
Report: summarize the behavior change and anything not verified.
```

The detailed [Claude Code](claude_code.md) and [Codex](codex.md) guides cover their repository context and execution controls. Use [Spec-Driven Development](spec_driven_development.md) when a change needs explicit acceptance criteria across several steps.

Community collections such as [AITmpl](https://www.aitmpl.com/agents) and [Playbooks](https://playbooks.com/) can provide starting points for configuration and reusable instructions. Read the commands, hooks, and integration requirements before importing them; keep only the parts that match your workflow.

## Local inference and serving

**Ollama** is a starting point for experimenting with models on your own machine. **vLLM** is an option for serving supported models with attention to throughput and concurrent requests. Check model support and hardware requirements in their official docs before choosing a runtime: [Ollama documentation](https://docs.ollama.com/) and [vLLM documentation](https://docs.vllm.ai/en/latest/).

Before downloading or deploying a model, record:

- The exact model identifier, revision, license, and quantization.
- Available RAM or GPU memory, intended context length, and request concurrency.
- A small set of representative prompts with expected behavior.
- Measured latency and answer quality on your hardware.

Model weights are only part of memory usage; context and concurrent requests also consume capacity. Compare candidates using the same workload. A smaller model that meets the task's criteria can be more useful than a larger model that exceeds the deployment budget.

Use [Hugging Face model cards](https://huggingface.co/docs/hub/model-cards) to inspect intended uses and limitations. For a shared service, add authentication, request limits, monitoring, and a recovery procedure; [Running a Server](../../software/tool_tip/server_operations.md) covers the operational groundwork.

## Evaluate before expanding

Start with a small versioned dataset of real tasks: ordinary inputs, empty inputs, ambiguous requests, and known failures. Define an expected answer or observable property for each case before tuning prompts.

| Dimension | Example check |
|---|---|
| Correctness | Extracted fields match a labeled example |
| Format | Output parses and satisfies the required schema |
| Grounding | Claims are supported by the supplied reference material |
| Tool behavior | The assistant selects the intended tool and valid arguments |
| Failure handling | Missing information produces a useful fallback |
| Performance | Latency and token use remain within the task's budget |

[Promptfoo](https://www.promptfoo.dev/docs/intro/) supports comparing prompts and models using test cases and assertions. Use deterministic checks where possible and human review for judgments that require interpretation. If you use a model as a judge, test that judge against examples you have already labeled.

Keep a baseline and change one major variable at a time. Record the prompt version, model configuration, dataset revision, and result. Repeat enough cases to see whether the improvement survives variation; a single impressive response is not a regression suite.

## Track and deploy

[MLflow](https://mlflow.org/docs/latest/) provides experiment tracking and tools for tracing and evaluating AI applications. Use tracking when you need to explain which configuration produced a result or where a request failed. Decide what data may be stored in traces before collecting real user prompts or retrieved documents.

A practical release loop:

1. Version the application, prompt, and evaluation dataset.
2. Run application tests and the evaluation suite against the proposed configuration.
3. Compare quality, latency, and cost with the baseline.
4. Deploy a known version with a rollback path.
5. Inspect failures and add representative cases to the evaluation set.

[CI/CD Platforms](../../software/tool_tip/cicd.md) covers build and deployment automation. Keep credentials in environment variables or the deployment platform's secret store. Document variable names and placeholder values without committing keys.

## A minimal starting setup

For **AI-assisted software development**, start with your normal toolchain, one coding assistant, repository instructions, and executable checks. For **an AI application**, start with one model interface, a small evaluation dataset, and recorded results. Add retrieval, orchestration frameworks, self-hosting, or more agents when a measured requirement calls for them.
