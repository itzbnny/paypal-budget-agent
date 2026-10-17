import { formatCents } from "./budget/money.js";
import { summarizeSpending } from "./budget/summarize.js";

// Placeholder entry point — replaced by the agent loop (see docs/architecture.md).
const sample = summarizeSpending(
  [
    { id: "1", date: "2026-10-01T12:00:00Z", amount: -4250, currency: "USD", merchant: "Corner Cafe", category: "Dining" },
    { id: "2", date: "2026-10-02T12:00:00Z", amount: -12000, currency: "USD", merchant: "FreshMart", category: "Groceries" },
  ],
  [{ category: "Dining", limit: 3000 }],
);
for (const row of sample) {
  console.log(`${row.category.padEnd(12)} ${formatCents(row.spent)}${row.overBudget ? "  ⚠ over budget" : ""}`);
}
