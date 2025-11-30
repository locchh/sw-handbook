# Error Handling

Error handling is a critical aspect of software development that deals with anticipating, detecting, and resolving errors that occur during program execution. Proper error handling makes software more robust, maintainable, and user-friendly.

## Why Error Handling Matters

- **Reliability:** Prevents unexpected crashes and data corruption
- **User Experience:** Provides meaningful feedback instead of cryptic failures
- **Debugging:** Makes it easier to identify and fix issues
- **Security:** Prevents information leakage through unhandled exceptions
- **Maintainability:** Clear error paths make code easier to understand and modify

## Types of Errors

### 1. Syntax Errors

Errors detected during parsing/compilation before the program runs. These violate the language's grammar rules.

```python
# Missing colon
if x == 5
    print("five")
```

### 2. Runtime Errors (Exceptions)

Errors that occur during program execution. The code is syntactically correct but encounters an unexpected condition.

```python
# Division by zero
result = 10 / 0

# File not found
file = open("nonexistent.txt")

# Index out of bounds
items = [1, 2, 3]
print(items[10])
```

### 3. Logic Errors

The program runs without crashing but produces incorrect results. These are the hardest to detect.

```python
# Incorrect calculation (should be width * height)
def calculate_area(width, height):
    return width + height  # Bug: using + instead of *
```

## Error Handling Strategies

### 1. Fail-Fast

Stop execution immediately when an error is detected. This prevents cascading failures and makes debugging easier.

**When to use:** Development, critical systems where partial results are dangerous.

```python
def process_payment(amount):
    if amount <= 0:
        raise ValueError("Payment amount must be positive")
    # Continue processing...
```

### 2. Graceful Degradation

Continue operating with reduced functionality when errors occur.

**When to use:** User-facing applications, non-critical features.

```python
def get_user_avatar(user_id):
    try:
        return fetch_avatar_from_server(user_id)
    except NetworkError:
        return DEFAULT_AVATAR  # Fallback to default
```

### 3. Retry with Backoff

Automatically retry failed operations with increasing delays.

**When to use:** Transient failures (network issues, temporary unavailability).

```python
import time

def fetch_with_retry(url, max_retries=3):
    for attempt in range(max_retries):
        try:
            return fetch(url)
        except NetworkError:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)  # Exponential backoff: 1s, 2s, 4s
```

### 4. Circuit Breaker

Stop calling a failing service temporarily to prevent resource exhaustion and allow recovery.

**When to use:** Distributed systems, external service calls.

```
States: CLOSED → OPEN → HALF-OPEN → CLOSED

CLOSED: Normal operation, requests pass through
OPEN: Failures exceeded threshold, requests fail immediately
HALF-OPEN: After timeout, allow limited requests to test recovery
```

## Best Practices

### 1. Catch Specific Exceptions

Avoid catching generic exceptions; be specific about what you're handling.

```python
# Bad
try:
    process_data()
except Exception:
    pass

# Good
try:
    process_data()
except ValueError as e:
    logger.error(f"Invalid data format: {e}")
except IOError as e:
    logger.error(f"File operation failed: {e}")
```

### 2. Don't Swallow Exceptions Silently

Always log or handle exceptions meaningfully.

```python
# Bad - silent failure
try:
    save_to_database(data)
except DatabaseError:
    pass

# Good - log and handle
try:
    save_to_database(data)
except DatabaseError as e:
    logger.error(f"Database save failed: {e}")
    notify_admin(e)
    raise  # Re-raise if caller needs to know
```

### 3. Use Finally for Cleanup

Ensure resources are released regardless of success or failure.

```python
file = None
try:
    file = open("data.txt")
    process(file)
except IOError as e:
    logger.error(f"File error: {e}")
finally:
    if file:
        file.close()
```

### 4. Provide Context in Error Messages

Include relevant information for debugging.

```python
# Bad
raise ValueError("Invalid input")

# Good
raise ValueError(f"Invalid user ID '{user_id}': must be a positive integer")
```

### 5. Fail at the Right Level

Handle errors at the level where you have enough context to deal with them appropriately.

```python
# Low-level function: raise exception
def parse_config(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Config file not found: {path}")
    # ...

# High-level function: handle and provide fallback
def initialize_app():
    try:
        config = parse_config("config.yaml")
    except FileNotFoundError:
        logger.warning("Config not found, using defaults")
        config = DEFAULT_CONFIG
```

---

## Python Exception Handling

Python uses exceptions as the primary mechanism for error handling. Understanding Python's exception system is essential for writing robust code.

### Exception Hierarchy

Python's built-in exceptions form a hierarchy. All exceptions inherit from `BaseException`.

```
BaseException
├── SystemExit
├── KeyboardInterrupt
├── GeneratorExit
└── Exception
    ├── StopIteration
    ├── ArithmeticError
    │   ├── ZeroDivisionError
    │   ├── OverflowError
    │   └── FloatingPointError
    ├── AssertionError
    ├── AttributeError
    ├── BufferError
    ├── EOFError
    ├── ImportError
    │   └── ModuleNotFoundError
    ├── LookupError
    │   ├── IndexError
    │   └── KeyError
    ├── MemoryError
    ├── NameError
    │   └── UnboundLocalError
    ├── OSError
    │   ├── FileNotFoundError
    │   ├── PermissionError
    │   ├── TimeoutError
    │   └── ...
    ├── RuntimeError
    │   ├── NotImplementedError
    │   └── RecursionError
    ├── TypeError
    ├── ValueError
    │   └── UnicodeError
    └── Warning
        ├── DeprecationWarning
        ├── UserWarning
        └── ...
```

**Key points:**
- Catch `Exception` to handle most errors (excludes `SystemExit`, `KeyboardInterrupt`)
- Catch `BaseException` only if you need to handle everything (rarely needed)
- More specific exceptions are subclasses of general ones

### try/except/else/finally

The complete syntax for exception handling in Python:

```python
try:
    # Code that might raise an exception
    result = risky_operation()
except ValueError as e:
    # Handle specific exception
    print(f"Value error: {e}")
except (TypeError, KeyError) as e:
    # Handle multiple exception types
    print(f"Type or key error: {e}")
except Exception as e:
    # Catch-all for other exceptions
    print(f"Unexpected error: {e}")
    raise  # Re-raise the exception
else:
    # Executed only if no exception occurred
    print(f"Success: {result}")
finally:
    # Always executed (cleanup)
    print("Cleanup complete")
```

**Execution flow:**

| Scenario | try | except | else | finally |
|:---------|:---:|:------:|:----:|:-------:|
| No exception | ✓ | ✗ | ✓ | ✓ |
| Exception caught | ✓ | ✓ | ✗ | ✓ |
| Exception not caught | ✓ | ✗ | ✗ | ✓ |

### Raising Exceptions

Use `raise` to throw exceptions explicitly.

```python
# Raise a built-in exception
def divide(a, b):
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return a / b

# Raise with cause (exception chaining)
try:
    data = json.loads(raw_input)
except json.JSONDecodeError as e:
    raise ValueError("Invalid configuration format") from e

# Re-raise current exception
try:
    process()
except Exception:
    logger.error("Processing failed")
    raise  # Preserves original traceback
```

### Custom Exceptions

Create custom exceptions for domain-specific errors.

```python
# Simple custom exception
class ValidationError(Exception):
    """Raised when data validation fails."""
    pass

# Custom exception with additional attributes
class APIError(Exception):
    """Raised when an API call fails."""
    
    def __init__(self, message, status_code=None, response=None):
        super().__init__(message)
        self.status_code = status_code
        self.response = response
    
    def __str__(self):
        if self.status_code:
            return f"[{self.status_code}] {self.args[0]}"
        return self.args[0]

# Exception hierarchy for a module
class DatabaseError(Exception):
    """Base exception for database operations."""
    pass

class ConnectionError(DatabaseError):
    """Failed to connect to database."""
    pass

class QueryError(DatabaseError):
    """Query execution failed."""
    pass

# Usage
try:
    connect_to_database()
except ConnectionError as e:
    print(f"Connection failed: {e}")
except DatabaseError as e:
    print(f"Database error: {e}")
```

### Context Managers (with statement)

Context managers ensure proper resource cleanup using `__enter__` and `__exit__` methods.

```python
# Using built-in context manager
with open("file.txt", "r") as f:
    content = f.read()
# File is automatically closed, even if an exception occurs

# Multiple context managers
with open("input.txt") as src, open("output.txt", "w") as dst:
    dst.write(src.read())

# Custom context manager using class
class DatabaseConnection:
    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.connection = None
    
    def __enter__(self):
        self.connection = connect(self.connection_string)
        return self.connection
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            self.connection.close()
        # Return True to suppress exception, False to propagate
        return False

# Custom context manager using contextlib
from contextlib import contextmanager

@contextmanager
def timer(label):
    start = time.time()
    try:
        yield
    finally:
        elapsed = time.time() - start
        print(f"{label}: {elapsed:.3f}s")

# Usage
with timer("Data processing"):
    process_large_dataset()
```

### Common Patterns

#### Pattern 1: EAFP vs LBYL

**EAFP** (Easier to Ask Forgiveness than Permission) - Pythonic style:

```python
# EAFP - try and handle exception
try:
    value = dictionary[key]
except KeyError:
    value = default_value
```

**LBYL** (Look Before You Leap) - check first:

```python
# LBYL - check before accessing
if key in dictionary:
    value = dictionary[key]
else:
    value = default_value
```

EAFP is preferred in Python when the exceptional case is rare.

#### Pattern 2: Exception as Control Flow (use sparingly)

```python
# Using StopIteration in iterators
class Counter:
    def __init__(self, max_count):
        self.max_count = max_count
        self.count = 0
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.count >= self.max_count:
            raise StopIteration
        self.count += 1
        return self.count
```

#### Pattern 3: Null Object / Default Value

```python
# Using dict.get() instead of try/except
value = config.get("timeout", 30)

# Using getattr with default
method = getattr(obj, "process", lambda x: x)
```

### Anti-Patterns to Avoid

```python
# ❌ Bare except (catches everything including KeyboardInterrupt)
try:
    do_something()
except:
    pass

# ❌ Catching too broad
try:
    value = int(user_input)
except Exception:  # Catches more than intended
    print("Invalid input")

# ❌ Using exceptions for expected conditions
try:
    if items:
        process(items[0])
except IndexError:
    pass  # Should just check if items is non-empty

# ❌ Losing exception context
try:
    parse_config()
except ConfigError:
    raise RuntimeError("Config failed")  # Lost original cause
# ✓ Use: raise RuntimeError("Config failed") from e

# ❌ Returning None to indicate error
def find_user(user_id):
    if not valid(user_id):
        return None  # Caller might forget to check
# ✓ Raise an exception instead
```

---

## Comparison with Other Languages

### Java: try-catch-finally

```java
try {
    FileReader file = new FileReader("file.txt");
    // Process file
} catch (FileNotFoundException e) {
    System.out.println("File not found: " + e.getMessage());
} catch (IOException e) {
    System.out.println("IO error: " + e.getMessage());
} finally {
    // Cleanup
}

// Try-with-resources (like Python's with)
try (FileReader file = new FileReader("file.txt")) {
    // Process file
}
```

**Key difference:** Java has checked exceptions (must be declared or caught).

### Go: Error Returns

```go
result, err := doSomething()
if err != nil {
    return fmt.Errorf("operation failed: %w", err)
}
// Use result
```

**Key difference:** Errors are values, not exceptions. Explicit error checking required.

### Rust: Result Type

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Cannot divide by zero"))
    } else {
        Ok(a / b)
    }
}

// Usage with pattern matching
match divide(10.0, 2.0) {
    Ok(result) => println!("Result: {}", result),
    Err(e) => println!("Error: {}", e),
}

// Or with ? operator for propagation
fn calculate() -> Result<f64, String> {
    let result = divide(10.0, 2.0)?;
    Ok(result * 2.0)
}
```

**Key difference:** Errors must be handled explicitly; compiler enforces error handling.

| Language | Mechanism | Error Handling Style |
|:---------|:----------|:--------------------|
| Python | Exceptions | EAFP, try/except |
| Java | Exceptions (checked/unchecked) | try-catch, throws |
| Go | Error values | Explicit if err != nil |
| Rust | Result<T, E> type | Pattern matching, ? operator |
