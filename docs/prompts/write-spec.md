# Playbook: write an exact spec for an issue

Human says: **"Spec issue #N."** Best run with the strongest available model, so any agent can implement the result reliably.

The goal is that an implementer needs **zero design decisions**. Add a `## Spec` section to the issue (`gh issue edit N --body-file …`) containing:

1. **Files / area:** exact paths to create or modify, and paths that must not be touched.
2. **Types:** any new or changed types, written out in TypeScript.
3. **Function signatures:** exported functions with full TypeScript signatures and a one-line doc each.
4. **Behavior:** rules as a numbered list, including edge cases (empty input, refunds, ties, timezones, currencies, month boundaries).
5. **Test cases:** a table of input → expected output, at least one per rule, written as concrete values in cents.
6. **Out of scope:** what *not* to build.
7. **Dependencies:** allowed new packages (default: none) and which issues must merge first.
8. **Acceptance criteria:** checkboxes the reviewer will verify.

Before writing, read `AGENTS.md`, `EXECUTION_CONTRACT.md`, `docs/architecture.md`, and the current code in the area. Keep the spec consistent with existing types in `src/budget/types.ts`.
