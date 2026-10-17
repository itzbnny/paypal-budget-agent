# PayPal Budget Agent

An AI budgeting agent for PayPal users, built for the [PayPal AI Hackathon](https://paypalaihackathon.devpost.com/). It reads your PayPal transactions, categorizes spending, tracks budgets, and answers questions in plain language. It never moves money without your confirmation.

> 🚧 Work in progress. Deadline: Nov 12, 2026.

## Quick start

Requires Node.js 20+.

```bash
git clone https://github.com/itzbnny/paypal-budget-agent.git
cd paypal-budget-agent
npm install
cp .env.example .env   # add your PayPal sandbox credentials
npm run check          # typecheck + tests
npm start
```

### Getting PayPal sandbox credentials

1. Sign in at the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/).
2. Under **Apps & Credentials** (Sandbox), create an app tied to a sandbox **business** account.
3. Copy its Client ID and Secret into `.env`.

## How it works

See [docs/architecture.md](docs/architecture.md). An LLM agent loop chooses tools, deterministic TypeScript does all money math, and an approval gate guards every action that moves money.

## AI tools used

| Tool | How it's used |
|---|---|
| PayPal Agent Toolkit (`@paypal/agent-toolkit`) | PayPal API access for the agent: transactions, insights, orders |
| _LLM: TBD_ | Agent reasoning, categorizing unknown merchants, natural-language answers |
| Claude Code and OpenAI Codex CLI | Coding agents that co-developed this repo (see `AGENTS.md`) |

## Contributing

New teammate? Start with [CONTRIBUTING.md](CONTRIBUTING.md). Humans and coding agents follow [AGENTS.md](AGENTS.md): issue → branch → PR → cross-review → merge.

## License

[MIT](LICENSE)
