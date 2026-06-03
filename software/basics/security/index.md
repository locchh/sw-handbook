# Security

Security is a cross-cutting concern, not a feature bolted on at the end. The goal is the **CIA triad**: **Confidentiality** (only the right people read it), **Integrity** (no one tampers with it), **Availability** (it stays up). This page is the application view; for the security *layer* in a system see [Architecture](https://locchh.github.io/sw-handbook/software/basics/architecture/index.md).

## Authentication vs Authorization

|              | **Authentication (AuthN)**  | **Authorization (AuthZ)** |
| ------------ | --------------------------- | ------------------------- |
| Question     | *Who are you?*              | *What may you do?*        |
| Mechanism    | passwords, MFA, tokens, SSO | roles, permissions, ACLs  |
| HTTP failure | 401                         | 403                       |

Modern web auth usually means a token (a [JWT](https://locchh.github.io/sw-handbook/software/basics/abbreviations/index.md)) or session issued after login, often via **OAuth 2.0 / OIDC** for delegated access:

```
sequenceDiagram
    participant U as User
    participant A as App
    participant Auth as Auth Server
    participant API as Resource API
    U->>A: log in
    A->>Auth: redirect for consent
    Auth-->>A: authorization code
    A->>Auth: code + client secret
    Auth-->>A: access token
    A->>API: request + access token
    API-->>A: protected data
```

## Common Risks (OWASP, condensed)

| Risk                         | What                                 | Defense                                          |
| ---------------------------- | ------------------------------------ | ------------------------------------------------ |
| **Broken access control**    | acting beyond your permissions       | check authz on every request, server-side        |
| **Injection** (SQL, command) | untrusted input runs as code         | parameterized queries; never concatenate input   |
| **XSS**                      | injected script runs in a page       | escape output; Content-Security-Policy           |
| **CSRF**                     | forged request from a logged-in user | CSRF tokens, `SameSite` cookies                  |
| **SSRF**                     | server tricked into making requests  | allowlist outbound calls; block internal IPs     |
| **Auth failures**            | weak or leaked credentials           | MFA, hashed passwords, rate-limit logins         |
| **Misconfiguration**         | defaults, verbose errors             | harden settings, hide internals, least privilege |
| **Vulnerable dependencies**  | known CVEs in libraries              | scan and patch (Dependabot, `audit` tools)       |

## Crypto Basics

| Tool                      | Purpose                     | Examples                                        |
| ------------------------- | --------------------------- | ----------------------------------------------- |
| **Hashing** (one-way)     | passwords, integrity checks | bcrypt, argon2 (passwords); SHA-256 (integrity) |
| **Symmetric encryption**  | fast confidentiality        | AES                                             |
| **Asymmetric encryption** | key exchange, identity      | RSA, ECC                                        |
| **Signing**               | authenticity + integrity    | HMAC, digital signatures                        |

- **Passwords** → always a *slow, salted* hash (bcrypt/argon2), never plain MD5/SHA.
- **Encrypt in transit** (TLS) **and at rest** (sensitive data, secrets).
- **Never roll your own crypto** — use vetted libraries.

## Rule of Thumb

- **Least privilege** — grant the minimum access needed.
- **Defense in depth** — no single control is enough.
- **Validate every input; never trust the client.** Fail closed (deny by default).
- **Manage secrets properly** — never commit them to git; use environment variables or a secret manager, and rotate them.
- **Patch dependencies** — most breaches exploit a known, already-fixed hole.
