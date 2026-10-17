/**
 * SANDBOX ONLY: sends one $1.23 test payout from the sandbox business account, to check that
 * outgoing payments show up as debits in Transaction Search (issue #1). Play money, no real funds.
 * Run: npx tsx --env-file=.env scripts/sandbox-payout-test.ts
 */
const BASE = "https://api-m.sandbox.paypal.com";
if (process.env.PAYPAL_ENVIRONMENT !== "sandbox") throw new Error("Refusing to run: PAYPAL_ENVIRONMENT must be 'sandbox'.");

const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
const token = (await (
  await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  })
).json()) as { access_token: string };

const res = await fetch(`${BASE}/v1/payments/payouts`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    sender_batch_header: { sender_batch_id: `probe-${Date.now()}`, email_subject: "probe" },
    items: [
      {
        recipient_type: "EMAIL",
        amount: { value: "1.23", currency: "USD" },
        receiver: "probe-merchant@personal.example.com",
        note: "Netflix test charge",
      },
    ],
  }),
});
const body = (await res.json()) as { batch_header?: { batch_status: string; payout_batch_id: string }; message?: string };
console.log(res.status, body.batch_header?.batch_status ?? body.message, body.batch_header?.payout_batch_id ?? "");
