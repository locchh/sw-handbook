# Data Classification & Security

**Classification** labels data by how sensitive it is; **security** applies controls proportional to that label. The two are inseparable — the label is what tells you how hard to protect something. Sits under [governance](https://locchh.github.io/sw-handbook/data/basics/data_governance/index.md), which sets the policy this page enforces. For app-level security see [Security](https://locchh.github.io/sw-handbook/software/basics/security/index.md).

## What It Is

Classification sorts data into sensitivity tiers so protection can be proportionate:

| Tier             | Meaning                     | Example              | If leaked            |
| ---------------- | --------------------------- | -------------------- | -------------------- |
| **Public**       | intended for anyone         | marketing page       | no harm              |
| **Internal**     | staff only                  | org chart            | minor                |
| **Confidential** | need-to-know                | contracts, salaries  | serious              |
| **Restricted**   | regulated / PII / PHI / PCI | health, card numbers | legal + reputational |

Controls then follow the label, layered defence-in-depth:

- **Encryption** — at rest and in transit, by default.
- **Access control** — RBAC/ABAC and **least privilege**: grant the minimum, review it.
- **De-identification** — masking, tokenization, anonymization, pseudonymization for non-prod and analytics.
- **Audit & DLP** — log who touched what; detect exfiltration.

## Frameworks That Apply

- **ISO/IEC 27001** — the ISMS standard for managing information security end to end.
- **NIST** — Cybersecurity Framework (Identify-Protect-Detect-Respond-Recover) and SP 800-60 for mapping data to categories.
- **Regulations** — GDPR (EU personal data), HIPAA (US health), PCI-DSS (card data), CCPA. These often *mandate* classification and specific controls.

## Golden Lesson

**You can't protect what you haven't classified.** Label first, then let the label drive the controls — automatically, not by memory. Default to encrypted and least-privilege; opening access later is easy, un-leaking data is impossible.

## Learn More

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) — the Identify–Protect–Detect–Respond–Recover model.
- [NIST SP 800-60 — Mapping Information to Security Categories](https://csrc.nist.gov/pubs/sp/800/60/v1/r1/final) — a concrete method for classifying data.
- [ISO/IEC 27001](https://www.iso.org/standard/27001) — the international standard for information security management.
- [GDPR — full text (gdpr-info.eu)](https://gdpr-info.eu/) — the EU regulation that drives much of modern data protection.
