# Playbook: implement an issue

Human says: **"Start issue #N"** (or "Follow docs/prompts/implement-issue.md for #N").
Follow every step in order. Don't skip the plan or the tests.

## 1. Load context
- Read `AGENTS.md`, `EXECUTION_CONTRACT.md` (§2 features, §3 no-touch zones), and `docs/architecture.md`.
- `gh issue view N --comments`. If it has no **Spec** section with function signatures and test cases, stop and tell your human: "Issue #N needs a spec first. Ask a teammate to run `docs/prompts/write-spec.md` on it." Don't guess at the design.
- If it's already assigned to someone else, stop and say so.

## 2. Claim and branch
```bash
gh issue edit N --add-assignee @me
git switch main && git pull --rebase origin main
git switch -c <github-username>/N-<short-slug>
```

## 3. Plan (write it out before you code)
List: files you'll create or change (must match the issue's "Files / area"), functions with signatures, and test cases. If you need to touch a file outside the area or change `src/budget/types.ts`, ask your human first.

## 4. Tests first
Write the test cases from the spec in a `*.test.ts` next to the code. Run `npm test`; they should fail.

## 5. Implement
- Smallest code that passes the tests. Match existing style in `src/`.
- Money in integer cents only. No floats, no LLM math.
- No new dependencies unless the spec allows them.

## 6. Verify
```bash
npm run check
```
Must pass. Fix and repeat. Never weaken or delete a test to make it pass. If a spec test seems wrong, ask.

## 7. Self-review the diff
`git diff main...HEAD` and check: only in-scope files, no secrets/`.env`, no `console.log` of transaction data, no `any`, no TODOs left without an issue.

## 8. Ship
```bash
git fetch origin && git rebase origin/main   # resolve per AGENTS.md conflict rules
npm run check
git push -u origin HEAD
gh pr create --fill --body "Closes #N

## What changed
<bullets>

## How it was tested
- [x] npm run check passes
<new test names>

## Authored by
<Claude Code | Codex CLI>"
```

## 9. Report
Tell your human in one or two sentences: PR link, CI status, and anything the reviewer should look at.
