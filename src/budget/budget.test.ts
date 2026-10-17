import { describe, expect, it } from "vitest";
import { formatCents, toCents } from "./money.js";
import { summarizeSpending } from "./summarize.js";
import type { Transaction } from "./types.js";

describe("toCents", () => {
  it("parses PayPal decimal strings without float error", () => {
    expect(toCents("12.34")).toBe(1234);
    expect(toCents("0.1")).toBe(10);
    expect(toCents("-5.00")).toBe(-500);
    expect(toCents("19")).toBe(1900);
  });
  it("rejects malformed amounts", () => {
    expect(() => toCents("1.234")).toThrow();
    expect(() => toCents("abc")).toThrow();
  });
});

describe("formatCents", () => {
  it("formats USD", () => expect(formatCents(123456)).toBe("$1,234.56"));
});

describe("summarizeSpending", () => {
  const tx = (amount: number, category?: string): Transaction => ({
    id: String(Math.random()),
    date: "2026-10-01T00:00:00Z",
    amount,
    currency: "USD",
    merchant: "x",
    category,
  });

  it("totals outgoing spend per category and ignores income", () => {
    const result = summarizeSpending([tx(-1000, "Dining"), tx(-500, "Dining"), tx(-200), tx(5000, "Income")]);
    expect(result).toEqual([
      { category: "Dining", spent: 1500, limit: undefined, remaining: undefined, overBudget: false },
      { category: "Uncategorized", spent: 200, limit: undefined, remaining: undefined, overBudget: false },
    ]);
  });

  it("flags categories over budget and includes untouched budgets", () => {
    const result = summarizeSpending([tx(-3500, "Dining")], [
      { category: "Dining", limit: 3000 },
      { category: "Groceries", limit: 40000 },
    ]);
    expect(result.find((r) => r.category === "Dining")).toMatchObject({ remaining: -500, overBudget: true });
    expect(result.find((r) => r.category === "Groceries")).toMatchObject({ spent: 0, remaining: 40000, overBudget: false });
  });
});
