/**
 * Probe the PayPal sandbox to see which data our agent can actually read with the credentials in .env.
 * Run: npm run probe:paypal
 *
 * Prints the HTTP status and a short summary per endpoint. No data is written or sent anywhere.
 */
import "node:process";

const BASE = "https://api-m.sandbox.paypal.com";
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENVIRONMENT } = process.env;

if (PAYPAL_ENVIRONMENT && PAYPAL_ENVIRONMENT !== "sandbox") throw new Error("Probe only runs against sandbox.");
if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) throw new Error("Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env");

const tokenRes = await fetch(`${BASE}/v1/oauth2/token`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
});
const token = (await tokenRes.json()) as { access_token?: string; scope?: string; error_description?: string };
if (!token.access_token) throw new Error(`Auth failed: ${tokenRes.status} ${token.error_description ?? ""}`);

console.log("Granted scopes:");
for (const s of (token.scope ?? "").split(" ").sort()) console.log(`  ${s}`);

const end = new Date();
const start = new Date(end.getTime() - 30 * 24 * 3600 * 1000); // Transaction Search allows max 31 days per call
const iso = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, "Z");

const probes: Array<[label: string, path: string]> = [
  ["Transactions (last 30d)", `/v1/reporting/transactions?start_date=${iso(start)}&end_date=${iso(end)}&fields=all&page_size=5`],
  ["Balances", `/v1/reporting/balances`],
  ["Subscription plans (merchant-created)", `/v1/billing/plans?page_size=5`],
  ["Products catalog", `/v1/catalogs/products?page_size=5`],
  ["Invoices", `/v2/invoicing/invoices?page_size=5`],
  ["Disputes", `/v1/customer/disputes?page_size=5`],
  ["User info (identity)", `/v1/identity/oauth2/userinfo?schema=paypalv1.1`],
];

console.log("\nEndpoint probes:");
for (const [label, path] of probes) {
  const res = await fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${token.access_token}` } });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const detail = res.ok
    ? Object.entries(body)
        .filter(([, v]) => Array.isArray(v))
        .map(([k, v]) => `${k}: ${(v as unknown[]).length}`)
        .join(", ") || "ok"
    : String(body.message ?? body.name ?? body.error_description ?? "");
  console.log(`  ${res.ok ? "✓" : "✗"} ${res.status} ${label.padEnd(40)} ${detail}`);
}

console.log(
  "\nNote: these calls run as the account that owns the REST app (normally a sandbox business account)." +
    "\nIf Transactions returns 403, enable 'Transaction search' under the app's Features in the Developer Dashboard.",
);
