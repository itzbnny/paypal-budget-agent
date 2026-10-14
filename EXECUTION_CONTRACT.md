# Execution Contract

The binding agreement for **what** we build, **in what order**, and **what counts as done**. It applies to every human and coding agent (Claude Code, Codex CLI) on the project. `AGENTS.md` covers *how* we work; this file covers *what* we deliver. Change it only through a PR approved by both humans.

## 1. Goal

**Conversational banking inside PayPal:** a chat agent that does everything Rocket Money does, built around the PayPal account. It doesn't rebuild screens PayPal already has. It understands your money, talks you through it, and sends you to the right PayPal screen when you need to act.

Hackathon fit: meaningfully uses PayPal and AI, runs as a working demo, deadline **Nov 12, 2026, 12:00pm PST**. Our internal deadline is **Nov 10**.

## 2. Feature contract

Status: ✅ confirmed working · 🔬 needs probe/verification · ⛔ not possible → alternative

| # | Rocket Money feature | Our version | Data source | Status |
|---|---|---|---|---|
| F1 | Subscription detection | Find recurring charges, price increases, duplicates, and likely-unused subscriptions | PayPal Transaction Search (sandbox) and/or PayPal activity CSV import | 🔬 `npm run probe:paypal` |
| F2 | Subscription cancellation | PayPal can't cancel for the user, so the agent drafts the cancellation, links to the merchant's cancel page, and links to PayPal's "unlink for future payments" | Merchant links + PayPal deep links | ✅ design only, no API needed |
| F3 | Budgets (food, gas, fun money…) | Conversational envelope budgets: "You have $34 left for dining this week" | `src/budget/` + local storage | ✅ |
| F4 | Spending insights | "Where did my money go?" with categories, trends, comparisons | F1 data + `src/budget/` | ✅ once F1 is resolved |
| F5 | Bank balance (PayPal lacks this) | Linked-bank balances and overdraft forecasts before upcoming charges | **Plaid** sandbox (Balance) | 🔬 sandbox keys |
| F6 | Credit score (PayPal lacks this) | Credit report and score summary, plus utilization advice ("put this on Card B") | **Experian** developer sandbox (static test data), Plaid Liabilities for utilization | 🔬 sandbox signup; Equifax needs a corporate email |
| F7 | Smart pay advisor (our differentiator) | For an upcoming charge or checkout, recommend which funding source to use based on balance, utilization, and budget | F3 + F5 + F6 | ✅ once F5/F6 work |
| F8 | Agentic checkout guard | Agent-initiated purchase through PayPal Orders, checked against budget, balance, and utilization, then confirmed by the user | PayPal Agent Toolkit `create_order` | ✅ sandbox |

**Must ship for submission:** F1, F2, F3, F4, F7 (with F5 at minimum), F8.
**Ship if verified:** F6. If the Experian sandbox fails, F6 falls back to utilization only, from Plaid Liabilities.

## 3. AI no-touch zones (hard rules)

The agent must **never** read, call, automate, or deep-link actions in these areas:

- Add Money / Transfer money in or out
- Rewards and cashback
- Account info, password, security, 2FA, recovery
- Connected apps and sites, and login permissions
- Payment preferences and default funding source *changes* (it may *recommend*; the user changes them in PayPal)

The agent may only **propose** these, and each needs explicit user confirmation through the approval gate:

- Any PayPal order or payment (F8)
- Any change involving a subscription (cancel request, unlink)

No real credentials, no live mode, no real people's financial or credit data. **Sandbox only, everywhere.**

## 4. Definition of done (every feature)

1. Its GitHub Issue's acceptance criteria are met.
2. Money math is in `src/budget/`, uses integer cents, and has unit tests.
3. `npm run check` passes in CI.
4. Cross-reviewed (Claude ↔ Codex) and merged by a human.
5. Works end to end in the sandbox demo, with seeded data if needed.
6. README updated if setup or env vars changed.

## 5. Milestones

| Dates | Milestone | Exit criteria |
|---|---|---|
| Oct 13–19 | **M0 Verify** | PayPal probe run and F1 data source decided; Plaid and Experian sandbox keys obtained; LLM and framework chosen |
| Oct 20–26 | **M1 Data** | Transactions flowing (API or CSV); Plaid balances; recurring-charge detection (F1) |
| Oct 27–Nov 2 | **M2 Agent** | Chat loop with tools for F1–F5; approval gate; budgets (F3) |
| Nov 3–8 | **M3 Differentiators** | F6, F7, F8; UI polish; hosted demo (Render) |
| Nov 9–10 | **M4 Submit-ready** | Seeded demo data, README complete, demo video under 3 minutes recorded |
| Nov 11 | **Submit** | Devpost form submitted one day early |

## 6. Ownership

| Area | Owner (human + agent) |
|---|---|
| `src/agent/`, tools, approval gate | _TBD_ |
| `src/paypal/`, Plaid, Experian integrations | _TBD_ |
| `src/budget/` | shared, tests required |
| UI, demo, video | _TBD_ |

## 7. Changing this contract

Scope changes (adding or dropping a feature, moving a milestone, changing a no-touch zone) go through a PR to this file with both humans approving. Coding agents must not edit this file on their own initiative.
