# Networking & the Web

How bytes get from one machine to another — and what actually happens between typing a URL and seeing the page.

> Load balancers, CDNs, and rate limiting build on these basics — see [Architecture](https://locchh.github.io/sw-handbook/software/basics/architecture/index.md). For the contract layer on top of HTTP, see [APIs](https://locchh.github.io/sw-handbook/software/basics/apis/index.md).

## The TCP/IP Model

Networking is layered; each layer talks to its peer and ignores the rest.

| Layer           | Job                     | Examples             |
| --------------- | ----------------------- | -------------------- |
| **Application** | app-level protocols     | HTTP, DNS, SSH, SMTP |
| **Transport**   | host-to-host channels   | TCP, UDP             |
| **Internet**    | routing across networks | IP, ICMP             |
| **Link**        | local physical delivery | Ethernet, Wi-Fi      |

## TCP vs UDP

|             | **TCP**                        | **UDP**           |
| ----------- | ------------------------------ | ----------------- |
| Connection  | yes (handshake)                | none              |
| Reliability | ordered, retransmits lost data | best-effort       |
| Overhead    | higher                         | low               |
| Use         | web, APIs, file transfer       | video, games, DNS |

## What Happens When You Open a URL

```
sequenceDiagram
    participant B as Browser
    participant D as DNS
    participant S as Server
    B->>D: resolve example.com
    D-->>B: 93.184.x.x
    B->>S: TCP handshake (SYN / SYN-ACK / ACK)
    B->>S: TLS handshake (certificate + keys)
    B->>S: GET / HTTP/2
    S-->>B: 200 OK + HTML
    Note over B: parse HTML, fetch CSS/JS/images, render
```

- **DNS** resolves a name to an IP by walking resolver → root → TLD → authoritative server (results are cached).
- **TCP handshake** establishes the connection. **TLS handshake** then proves the server's identity (its certificate) and negotiates encryption keys.
- **TLS** gives **confidentiality** (eavesdroppers see nothing), **integrity** (tampering is detected), and **authentication** (you're talking to the real server). HTTPS = HTTP over TLS.

## HTTP Methods

| Method     | Use             | Safe | Idempotent |
| ---------- | --------------- | ---- | ---------- |
| **GET**    | read            | ✓    | ✓          |
| **POST**   | create / action | ✗    | ✗          |
| **PUT**    | replace         | ✗    | ✓          |
| **PATCH**  | partial update  | ✗    | ✗          |
| **DELETE** | remove          | ✗    | ✓          |

*Safe* = no side effects; *idempotent* = repeating it has the same effect as doing it once (this is what makes retries safe — see [APIs](https://locchh.github.io/sw-handbook/software/basics/apis/index.md)). HTTP/2 and /3 add multiplexing so many requests share one connection; status codes live in [APIs](https://locchh.github.io/sw-handbook/software/basics/apis/index.md).

## Rule of Thumb

- **Latency is dominated by round trips, not bandwidth.** Cut them: keep-alive, HTTP/2 multiplexing, CDNs near users, fewer requests.
- **The public internet is hostile.** Treat every connection as untrusted until TLS proves otherwise, and never send secrets over plain HTTP.
