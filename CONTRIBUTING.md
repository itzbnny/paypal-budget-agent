# Getting started (for teammates)

You don't need to know git. **Your coding agent (Codex or Claude Code) runs every git command.** You tell it what you want in plain English, and it follows the rules in `AGENTS.md` and the playbooks in `docs/prompts/`.

---

## 1. One-time setup (≈15 min)

### Install the tools

| Tool | Check it's installed | Install |
|---|---|---|
| Git | `git --version` | https://git-scm.com/downloads |
| Node.js 20+ | `node --version` | https://nodejs.org (LTS) |
| GitHub CLI | `gh --version` | https://cli.github.com |
| Codex CLI | `codex --version` | `npm i -g @openai/codex` |

### Sign in and download the project

```bash
gh auth login --web --git-protocol https     # pick GitHub.com, log in in the browser
gh repo clone itzbnny/paypal-budget-agent
cd paypal-budget-agent
npm install
npm run check                                # should end with "Tests  5 passed"
```

### Make your secrets file

```bash
cp .env.example .env
```

Fill in only the keys your current issue needs (each issue says which). **`.env` never goes to GitHub.** It's already ignored, and the agent is told never to commit it. Never paste keys into an issue, PR, or chat.

### Start your agent

```bash
cd paypal-budget-agent
codex
```

Always start it **inside the project folder** so it reads `AGENTS.md`. Model setting: the cheaper model on **medium** reasoning is fine for issues that have a spec. Switch to a stronger model only when you're stuck.

---

## 2. Your daily loop: just say these

| You want to… | Say to the agent |
|---|---|
| Start a task | **"Start issue #N. Follow docs/prompts/implement-issue.md."** |
| Finish and send it for review | **"Ship it."** (it runs checks and opens a PR) |
| Review your teammate's work | **"Review PR #N. Follow docs/prompts/review-pr.md."** |
| Fix review comments | **"Address the review comments on my PR #N."** |
| See where things stand | **"Explain my git status in plain words."** |
| Something looks wrong | **"Stop. Don't change anything. Explain what happened."** |

**One issue = one agent session.** When a PR is open, quit the agent (`/exit` or Ctrl+C) and start fresh for the next issue. That keeps token use low.

### Picking an issue

- Go to **Issues** on GitHub: https://github.com/itzbnny/paypal-budget-agent/issues
- Pick one that has **no assignee** and has a **Spec** section. The agent assigns it to you when it starts.
- No spec yet? Ask itzbnny to spec it. The agent will refuse to guess.

### Merging (humans only)

When your teammate's PR is approved and CI shows a green ✓:
open the PR on GitHub → **Squash and merge** → **Confirm**. The branch deletes itself.

---

## 3. Rules that keep us out of trouble

1. **Never work on `main`.** The agent makes a branch for every issue, and GitHub blocks direct pushes to `main` anyway.
2. **Never touch your teammate's branch.** Need their work? Wait until it's merged.
3. **Stay inside the issue's "Files / area."** Different files means no conflicts.
4. **Sandbox only.** No real PayPal, bank, or credit accounts. Ever.
5. **AI no-touch zones** (Add Money, rewards, account and security settings, connected apps, payment-preference changes) are off-limits. See `EXECUTION_CONTRACT.md` §3.

---

## 4. When something goes wrong

| What you see | What to do |
|---|---|
| CI shows a red ✗ on your PR | Say: "CI failed on PR #N. Find out why and fix it." |
| Agent says there's a **merge conflict** it can't resolve | Don't guess. Post in the team chat and tag itzbnny with the PR link |
| Agent stopped with "stuck rule" | Normal. It tried twice. Share its message with itzbnny |
| You think you lost work | Say: "Stop. Don't change anything. Show me git status and recent commits." Nothing is lost once it's committed |
| `npm run check` fails right after setup | Run `npm install` again; check `node --version` is 20+ |

## Git words in one line each

- **Repo:** the project folder, synced with GitHub.
- **Branch:** your private copy for one issue. Changes there don't affect anyone else.
- **Commit:** a saved checkpoint of your changes.
- **Push:** upload your branch to GitHub.
- **PR (pull request):** "please review and merge my branch into `main`."
- **CI:** robot that runs the tests on every PR (green ✓ = good).
- **Merge conflict:** two people changed the same lines; someone decides which version to keep.
- **Rebase:** bring your branch up to date with the latest `main`.
