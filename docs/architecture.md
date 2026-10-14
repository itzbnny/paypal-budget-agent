# Architecture

## Approach: a tool-calling loop over deterministic code, plus an approval gate

| Kind of work | Where it lives | Why |
|---|---|---|
| Open-ended questions ("where did my money go?", "set a $300 dining budget") | Agent loop: the LLM picks tools | Questions vary too much to map out ahead of time |
| Totals, budget math, forecasts, rule-based categorization | `src/budget/`, plain TS | Deterministic and testable; LLMs are bad at arithmetic |
| Anything that moves money (pay, refund, cancel, send invoice) | Approval gate (small state machine) | Fixed steps: propose → user confirms → execute → log |

```
User ──► Agent loop (LLM + tools)
           ├─ get_transactions    → src/paypal  (PayPal list_transactions, sandbox)
           ├─ summarize_spending  → src/budget  (pure, tested)
           ├─ set_budget / check_budget → src/budget + storage
           ├─ categorize          → rules first, LLM only for unknown merchants
           └─ propose_action      → approval gate → PayPal Agent Toolkit action
```

## PayPal integration

- Package: `@paypal/agent-toolkit`. It has adapters for the OpenAI Agents SDK (`/openai`), Vercel AI SDK (`/ai-sdk`, which pins **ai v4**), LangChain, MCP, and Bedrock.
- Read tools for budgeting: `list_transactions` and `get_merchant_insights`. Action tools that need the gate include `create_order`, `pay_order`, `create_refund`, `cancel_subscription`, and `send_invoice`.
- **Constraint:** the toolkit authenticates with a REST app's client ID and secret and reads *that account's* transactions. In the sandbox, that means a **sandbox business account**. Sandbox accounts start with little history, so `scripts/` needs a seeding script to make realistic transactions for the demo.

## Data sources

| Source | Gives us | Notes |
|---|---|---|
| PayPal Transaction Search / Agent Toolkit | Transactions, orders, checkout | Reads the REST app owner's account. Verify with `npm run probe:paypal` |
| PayPal activity CSV (user export) | A personal account's full history | Fallback or complement for F1 if the API can't see consumer data |
| Plaid (sandbox) | Linked bank balances; credit card balances and limits | Balance and Liabilities products |
| Experian developer sandbox | Credit report and score test profiles | Static test data only; production needs approval and FCRA compliance |

## Open decisions (record the answer here when decided)

- [ ] LLM provider and agent framework: OpenAI Agents SDK + `@paypal/agent-toolkit/openai`, or Claude via the Anthropic SDK with our own tool wrappers.
- [ ] UI: CLI chat, web chat (Next.js), or both. An AG Grid transactions table would also qualify for the AG Grid prize.
- [ ] Hosting for the demo URL (Render has sponsor credits).
- [ ] Storage for budgets: JSON file, SQLite, or hosted DB.
- [ ] Target user: individual consumer budgeting vs. freelancer or small seller (fits the business-account constraint better).
