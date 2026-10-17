# Playbook: review a teammate's PR

Human says: **"Review PR #N."**

1. `gh pr view N --comments` and `gh pr diff N`. Read the linked issue's spec and acceptance criteria.
2. `gh pr checks N` should be green. If CI fails, the review is "request changes: CI failing" plus the cause.
3. Check out locally and run it: `gh pr checkout N && npm install && npm run check`.
4. Review for, in priority order:
   1. **Contract violations:** no-touch zones (EXECUTION_CONTRACT.md §3), money moving without the approval gate, non-sandbox code paths, secrets.
   2. **Correctness:** money in integer cents, edge cases (empty lists, refunds/negatives, currency, month boundaries, timezones), every acceptance criterion met.
   3. **Tests:** do they actually assert the spec's cases? Any test weakened or deleted?
   4. **Scope:** files outside the issue's area, unrelated refactors, new dependencies.
   5. **Clarity:** names, dead code. Keep this short; don't nitpick style that CI allows.
5. Post the review. Put each problem as an inline comment with a concrete fix:
   - Blocking problems → `gh pr review N --request-changes --body "<summary>"`
   - None → `gh pr review N --approve --body "<what you checked>"`
6. Switch back: `git switch main`.
7. Tell your human the verdict in one sentence. **Humans merge**, not agents.
