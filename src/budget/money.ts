import type { Cents } from "./types.js";

/** Parse a PayPal-style decimal string ("12.34", "-5.00") into integer cents without float math. */
export function toCents(value: string): Cents {
  const match = /^(-)?(\d+)(?:\.(\d{1,2}))?$/.exec(value.trim());
  if (!match) throw new Error(`Invalid amount: ${value}`);
  const [, sign, whole, frac = ""] = match;
  const cents = Number(whole) * 100 + Number(frac.padEnd(2, "0"));
  return sign && cents !== 0 ? -cents : cents;
}

export function formatCents(cents: Cents, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}
