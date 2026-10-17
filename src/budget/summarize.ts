import type { Budget, Cents, Transaction } from "./types.js";

export interface CategorySpend {
  category: string;
  spent: Cents;
  limit?: Cents;
  remaining?: Cents;
  overBudget: boolean;
}

/** Total outgoing spend per category (as positive cents), joined with budgets. Sorted by spend, highest first. */
export function summarizeSpending(transactions: Transaction[], budgets: Budget[] = []): CategorySpend[] {
  const spent = new Map<string, Cents>();
  for (const tx of transactions) {
    if (tx.amount >= 0) continue;
    const category = tx.category ?? "Uncategorized";
    spent.set(category, (spent.get(category) ?? 0) - tx.amount);
  }
  for (const b of budgets) if (!spent.has(b.category)) spent.set(b.category, 0);

  const limits = new Map(budgets.map((b) => [b.category, b.limit]));
  return [...spent.entries()]
    .map(([category, total]) => {
      const limit = limits.get(category);
      return {
        category,
        spent: total,
        limit,
        remaining: limit === undefined ? undefined : limit - total,
        overBudget: limit !== undefined && total > limit,
      };
    })
    .sort((a, b) => b.spent - a.spent);
}
