# AGENTS.md — rules for every coding agent in this repo

Two coding agents work on this repo, **Claude Code** and **OpenAI Codex CLI**, alongside the humans on the team. Both read this file: Codex reads `AGENTS.md` directly, and `CLAUDE.md` imports it. Put shared rules here, not in an agent-specific file.

## What we're building

Conversational banking for PayPal users, built for the PayPal AI Hackathon (deadline **Nov 12, 2026, 12:00pm PST**): a chat agent that does what Rocket Money does (subscriptions, budgets, spending insights, bank balance, credit health) without rebuilding screens PayPal already has. Any action that moves money needs explicit user confirmation first.

**Scope, features, milestones, and no-touch zones are binding and live in `EXECUTION_CONTRACT.md`. Read it before starting any issue.** See `docs/architecture.md` for the design. In short:

- **Agent loop** (LLM + tools) decides *what* to do.
- **Deterministic TypeScript** in `src/budget/` does all money math. The LLM never adds, subtracts, or forecasts amounts itself; it calls a tool that does.
- **Approval gate.** Any tool that creates, pays, refunds, cancels, or sends something must go through the confirm step in `src/agent/`. Never call those PayPal actions directly from the loop.

## Layout

```
src/budget/   pure functions: categorize, summarize, budgets, forecasts (no I/O, fully unit-tested)
src/paypal/   PayPal access (Agent Toolkit + REST); the only place that talks to PayPal
src/agent/    the LLM agent loop, tool definitions, approval gate
src/index.ts  entry point
scripts/      dev scripts (e.g., seeding sandbox transactions)
docs/         architecture and decisions
```

## Commands

```
npm install
npm run check      # typecheck + tests — must pass before every PR
npm test           # vitest
npm run dev        # run locally with reload
```

## Workflow (required)

1. **Work from a GitHub Issue.** Pick or create one, then comment that you're taking it so the other agent doesn't start the same thing.
2. **Branch per issue:** `<agent-or-person>/<issue#>-<short-slug>`, e.g. `claude/12-spending-summary`, `codex/14-budget-alerts`, `ian/9-demo-script`.
3. **Never commit to `main` directly.** Open a PR that says `Closes #<issue>`.
4. **Keep PRs small:** one issue each, ideally under ~400 changed lines.
5. **`npm run check` must pass** locally and in CI.
6. **Cross-review:** the agent that didn't write the PR reviews it, and a human merges.
7. Before starting work, `git pull --rebase origin main`. Rebase your branch before opening the PR.
8. **Don't modify files outside your issue's scope.** If you need to change a shared contract (types in `src/budget/types.ts`, tool schemas), call it out in the PR description.

## Code rules

- TypeScript, ESM, `strict` mode. No `any` without a comment explaining why.
- **Money is integer minor units (cents) in code.** Convert from PayPal's string amounts at the boundary in `src/paypal/`. Never use floats for money.
- Every function in `src/budget/` gets unit tests. Add a test with every bug fix.
- Tool definitions need clear names, descriptions, and zod schemas, since the LLM reads them.
- Keep dependencies minimal. Ask in the PR before adding a large one.

## Secrets and safety

- **Respect the AI no-touch zones in `EXECUTION_CONTRACT.md` §3** (Add Money, rewards, account and security settings, connected apps, payment-preference changes). Never write code that automates them.
- Don't edit `EXECUTION_CONTRACT.md` unless your issue explicitly asks for it.
- **Sandbox only.** `PAYPAL_ENVIRONMENT` must be `sandbox`. Never add live-mode credentials or code paths that default to live.
- Never commit `.env`, keys, tokens, or real personal or financial data. Use `.env.example` for new variables.
- Don't log full transaction payloads or credentials.

## Hackathon submission requirements (don't break these)

- The repo stays **public** with the MIT `LICENSE` at the root.
- The README needs complete setup and run instructions so judges can run it themselves.
- The README must list which AI tools and models are used and how.
- Demo video under 3 minutes (not stored in the repo).
