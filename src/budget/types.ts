/** Shared domain types. Changing these affects both agents' work — call it out in the PR. */

/** Amounts are integer minor units (cents). Negative = money out, positive = money in. */
export type Cents = number;

export interface Transaction {
  id: string;
  /** ISO 8601 date-time */
  date: string;
  amount: Cents;
  currency: string;
  merchant: string;
  category?: string;
}

export interface Budget {
  category: string;
  /** Monthly limit, positive cents */
  limit: Cents;
}
