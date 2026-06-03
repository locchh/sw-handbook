# API Design

An API is a **contract**. Good ones are predictable, hard to misuse, and safe to evolve. This page covers the contract details; for where APIs sit in a system see [Architecture](https://locchh.github.io/sw-handbook/software/basics/architecture/index.md), and for the styles in context see [Tech Stacks](https://locchh.github.io/sw-handbook/software/basics/tech_stacks/index.md).

## Styles

| Style       | Shape                                 | Best for                                            |
| ----------- | ------------------------------------- | --------------------------------------------------- |
| **REST**    | resources over HTTP verbs             | public / CRUD APIs, caching, simplicity             |
| **GraphQL** | one endpoint, client picks the fields | varied clients, avoiding over- / under-fetching     |
| **gRPC**    | binary RPC over HTTP/2                | internal service-to-service, low latency, streaming |

## Status Codes

| Class   | Meaning      | Common codes                                                                                                            |
| ------- | ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **2xx** | success      | 200 OK, 201 Created, 204 No Content                                                                                     |
| **3xx** | redirect     | 301 Moved, 304 Not Modified                                                                                             |
| **4xx** | client error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests |
| **5xx** | server error | 500 Internal Error, 503 Unavailable                                                                                     |

> **401 vs 403:** 401 = not authenticated (who are you?); 403 = authenticated but not allowed. See [Security](https://locchh.github.io/sw-handbook/software/basics/security/index.md).

## Idempotency

Retries are inevitable — timeouts and flaky networks guarantee them. An **idempotent** call has the same effect whether it runs once or five times, so it's safe to retry. `GET`, `PUT`, and `DELETE` are naturally idempotent; make `POST` safe by accepting a client-generated **idempotency key** the server deduplicates.

## Versioning

Treat a published API as immutable:

- **Add freely** — new optional fields and new endpoints don't break callers.
- **Never change or remove** in place — ship a new version (`/v2` or a header) and deprecate the old one on a schedule.

## Pagination

| Strategy           | How               | Trade-off                                              |
| ------------------ | ----------------- | ------------------------------------------------------ |
| **Offset / limit** | `?page=3&size=20` | simple; drifts when data changes, slow at deep offsets |
| **Cursor**         | `?after=<token>`  | stable and fast; can't jump to an arbitrary page       |

## Rule of Thumb

- **Design for the caller, not the database.** Consistent naming, predictable shapes.
- **Return structured errors** (`{code, message}`), never HTML or stack traces — see [Error Handling](https://locchh.github.io/sw-handbook/software/basics/error_handling/index.md).
- **Paginate from day one**, and make the wrong call hard to make.
