# Error Handling

Anticipate what can go wrong, detect it early, report it clearly. Good error handling makes the difference between a crash that corrupts data and a failure that is logged, contained, and recoverable.

## Why It Matters

- **Reliability** — avoid crashes and data corruption.
- **User experience** — meaningful feedback beats cryptic failures.
- **Debuggability** — good error messages point straight at the problem.
- **Security** — unhandled exceptions leak internals (stack traces, query text).

## Kinds of Errors

| Kind                     | When it happens                                                               | Example                                               |
| ------------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Syntax**               | Parse / compile time, before the program runs.                                | `if x == 5` (missing colon in Python).                |
| **Runtime (exceptions)** | During execution. Code is valid but something unexpected occurred.            | Dividing by zero, file not found, index out of range. |
| **Logic**                | Program runs without crashing but produces the wrong answer. Hardest to find. | `def area(w, h): return w + h`                        |

## Handling Strategies

### Fail Fast

Stop as soon as an invariant is violated. Prevents cascading failures and makes the root cause easy to find.

```
def process_payment(amount):
    if amount <= 0:
        raise ValueError("Payment amount must be positive")
    ...
```

Use when a partial result would be dangerous or misleading.

### Graceful Degradation

Continue with reduced functionality when non-critical subsystems fail.

```
def get_user_avatar(user_id):
    try:
        return fetch_avatar(user_id)
    except NetworkError:
        return DEFAULT_AVATAR
```

Use for user-facing features where some answer is better than none.

### Retry with Backoff

For transient failures — flaky networks, rate limits, temporary unavailability.

```
def fetch_with_retry(url, max_retries=3):
    for attempt in range(max_retries):
        try:
            return fetch(url)
        except NetworkError:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)   # 1s, 2s, 4s
```

Only retry idempotent operations; add jitter in production to avoid thundering herds.

### Circuit Breaker

Stop calling a failing dependency for a while so it can recover and so you don't waste resources waiting on it.

```
CLOSED    — normal, requests pass through
OPEN      — failures exceeded threshold; fail fast
HALF-OPEN — after a cooldown, try a few requests to test recovery
```

Essential for calls to external services in a distributed system.

## Best Practices

1. **Catch specific exceptions**, not `Exception` or bare `except`. You should know exactly what you are handling.
1. **Never swallow errors silently.** At minimum, log them. If you can't handle an error here, let it propagate.
1. **Always clean up resources** — `finally`, context managers, or RAII depending on the language.
1. **Put context in messages.** `Invalid user ID 'abc': must be a positive integer` beats `Invalid input`.
1. **Handle errors at the right level.** Low-level code *raises*; high-level code *decides* what to do about it.
1. **Prefer exceptions over sentinel values** (`None`, `-1`). Sentinels are easy to ignore.

```
# Fail fast, with context
def parse_config(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Config file not found: {path}")
    ...

# Decide at the top level
def initialize_app():
    try:
        config = parse_config("config.yaml")
    except FileNotFoundError:
        logger.warning("Config not found, using defaults")
        config = DEFAULT_CONFIG
```

## Python Specifics

### `try / except / else / finally`

```
try:
    result = risky_operation()
except ValueError as e:
    log.error("bad value: %s", e)
except (TypeError, KeyError) as e:
    log.error("type or key: %s", e)
else:
    log.info("success: %s", result)   # only if no exception
finally:
    cleanup()                          # always runs
```

### Exception Hierarchy (the shape, not the full tree)

```
BaseException
├── SystemExit, KeyboardInterrupt, GeneratorExit   ← rarely catch these
└── Exception                                      ← catch this or a subclass
    ├── ArithmeticError (ZeroDivisionError, …)
    ├── LookupError (IndexError, KeyError)
    ├── OSError (FileNotFoundError, PermissionError, …)
    ├── TypeError, ValueError, AttributeError
    └── ...
```

Catch `Exception` for a catch-all at a boundary. Catch specific subclasses everywhere else.

### Raising and Chaining

```
# Raise with cause — preserves the original traceback
try:
    data = json.loads(raw)
except json.JSONDecodeError as e:
    raise ValueError("Invalid configuration format") from e

# Re-raise while adding a log
try:
    process()
except Exception:
    logger.exception("processing failed")
    raise
```

### Custom Exceptions

Domain-specific exceptions make callers more precise.

```
class DatabaseError(Exception): ...
class ConnectionError(DatabaseError): ...
class QueryError(DatabaseError): ...
```

### Context Managers

Context managers guarantee cleanup even on errors.

```
with open("file.txt") as f:
    content = f.read()   # f.close() runs even if read() raises

from contextlib import contextmanager

@contextmanager
def timer(label):
    start = time.time()
    try:
        yield
    finally:
        print(f"{label}: {time.time() - start:.3f}s")
```

### EAFP vs LBYL

Python favors **EAFP** — *Easier to Ask Forgiveness than Permission*:

```
# EAFP — Pythonic
try:
    value = d[key]
except KeyError:
    value = default
```

vs **LBYL** — *Look Before You Leap*:

```
# LBYL — also fine for simple cases
value = d[key] if key in d else default
```

EAFP wins when the exceptional case is rare. For trivial checks, `dict.get(key, default)` or `getattr(obj, "x", default)` is cleaner than either.

## Anti-Patterns

```
# ❌ Bare except — catches KeyboardInterrupt, SystemExit too
try:
    ...
except:
    pass

# ❌ Too broad
try:
    value = int(user_input)
except Exception:   # catches way more than ValueError
    ...

# ❌ Exceptions as control flow for expected conditions
try:
    process(items[0])
except IndexError:
    pass            # just check `if items:`

# ❌ Losing the original cause
try:
    parse_config()
except ConfigError:
    raise RuntimeError("config failed")   # lost the cause
# ✓ raise RuntimeError("config failed") from e
```

## Comparison Across Languages

| Language   | Mechanism                        | Style                            |
| ---------- | -------------------------------- | -------------------------------- |
| **Python** | Exceptions                       | EAFP, `try / except`             |
| **Java**   | Exceptions (checked + unchecked) | `try / catch`, explicit `throws` |
| **Go**     | Error values                     | `if err != nil { return err }`   |
| **Rust**   | `Result<T, E>`                   | Pattern match or `?` operator    |

```
result, err := doSomething()
if err != nil {
    return fmt.Errorf("operation failed: %w", err)
}
```

```
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 { Err("divide by zero".into()) } else { Ok(a / b) }
}

let result = divide(10.0, 2.0)?;   // propagate with ?
```

**Big picture:** Python and Java use exceptions as the default; Go and Rust make errors values in the type system. The trade-off is between terser happy paths (exceptions) and explicit handling at every call site (values). Both approaches, used well, produce reliable software.
