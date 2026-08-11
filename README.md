# Blue-IQ Parser — Product Platform

The customer-facing surface of the Blue-IQ Resume Parser: the marketing site, the
API documentation, and the dashboard where customers manage their integration.

This is where a staffing customer signs up, gets an API key, points a webhook at
their system, and watches their usage — the whole self-serve lifecycle around the
parser, without a support ticket.

| | |
|---|---|
| **Marketing site** | What the parser does, who it is for, and why healthcare résumés need a healthcare parser |
| **API documentation** | Live `/docs` reference: the submit → poll contract, every field of the response, error codes, webhook payloads |
| **Dashboard** | API keys (issue, download as ready-to-use `.csv`, revoke), webhook registrations, usage and token spend, profile |
| **Admin** | Operator views for customer accounts, per-key attribution, and direct DynamoDB inspection |
| **Auth** | Amazon Cognito, email sign-in, httpOnly cookie sessions verified server-side |

---

## Pages

| Route | Purpose |
|---|---|
| `/` | Marketing landing page |
| `/docs` | Full API reference |
| `/login`, `/signup` | Cognito authentication |
| `/dashboard` | Usage overview at a glance |
| `/dashboard/keys` | Issue, download and revoke API keys |
| `/dashboard/webhooks` | Register and manage webhook endpoints |
| `/dashboard/analytics` | Parse volume, token spend and outcomes |
| `/dashboard/profile` | Account details |
| `/dashboard/admin/*` | Operator-only: customers, per-customer detail, DynamoDB browser |

---

## Quick start

```bash
cp .env.example .env.local   # backend URL, admin token, Cognito IDs
npm install
npm run dev                  # http://localhost:3000
```

Node 20+ is required (Next.js 16).

---

## Documentation

**Everything else is documented once, for the whole platform, in the
[Blue-IQ Platform Handbook](../resume-parser-blue-iq-dev/docs/PLATFORM.md)** — environment variables,
Cognito requirements, Amplify deployment, the parse contract, and operations.
Please add platform documentation there rather than here.

- [Platform Handbook](../resume-parser-blue-iq-dev/docs/PLATFORM.md) — setup,
  environment, deploy, operations
- [Design Reference](../resume-parser-blue-iq-dev/docs/DESIGN.md) — the visual
  language. This app owns its own `components/` and `app/globals.css`; the other
  front end keeps matching copies, so **mirror any visual change there** to keep
  the two reading as one product
- [Parser API](../resume-parser-blue-iq-dev/README.md) — the engine behind this app

---

## License

**Proprietary.** © Ocean Blue Solutions. All rights reserved. Built exclusively
for BlueIQ; not licensed for redistribution or use outside that engagement.
