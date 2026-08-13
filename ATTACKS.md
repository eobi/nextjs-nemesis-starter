# The attacks your app can't block on its own

Your CDN/WAF (Cloudflare, AWS WAF, ModSecurity) matches a list of **known-bad patterns** — SQL keywords,
XSS payloads, path-traversal strings. But most real breaches don't look like that. They are
**perfectly well-formed requests** that your app happily answers. There is no signature to match, so
your WAF waves them through, and your app has no idea anything is wrong.

**Positive security is the opposite.** [Nemesis Shield](https://nemesislabs.xyz/shield) learns what your
app's *normal* traffic looks like — which routes exist, what shapes their requests and responses take,
who is authenticated — and blocks anything that deviates. The attack fails because it isn't normal, not
because someone wrote a rule for it.

> ⚠️ **Test your own app only.** The checks below are for an app **you own or are explicitly authorized
> to test**. Running them against systems you don't own is illegal. This is a self-audit guide.

Try these against your own app. If any of them work, nothing in front of your app is stopping them.

---

### 1. Broken Object Level Authorization (BOLA / IDOR) — the #1 API risk

Ask for an object that isn't yours. The request is valid; only the *authorization* is wrong.

```bash
# Log in as user A, then request user B's resource by changing the id:
curl https://your-app.com/api/orders/1002 -H "authorization: Bearer <user-A-token>"
```
**Vulnerable if:** you get back user B's order. **Your WAF can't see it** — it's a normal GET.
**Nemesis:** flags the access pattern as a deviation from what user A normally reads.

### 2. Broken Function Level Authorization

Call a privileged endpoint as an ordinary user.

```bash
curl -X POST https://your-app.com/api/admin/refund \
  -H "authorization: Bearer <normal-user-token>" -d '{"orderId":"1002","amount":50000}'
```
**Vulnerable if:** it works. **Your WAF can't see it** — the route and payload look fine.
**Nemesis:** a normal user hitting an admin route is off-baseline → blocked.

### 3. Mass Assignment / Broken Object Property Level Authorization (BOPLA)

Send fields the UI never sends and see if they stick.

```bash
curl -X PATCH https://your-app.com/api/users/me \
  -H "authorization: Bearer <normal-user-token>" \
  -d '{"name":"Jane","role":"admin","isAdmin":true,"balance":9999999}'
```
**Vulnerable if:** your role, admin flag, or balance changes. **Your WAF can't see it** — extra JSON
keys are not a signature. **Nemesis:** the request shape gained fields it never normally has → blocked.

### 4. Business-logic abuse (price, quantity, refunds)

Bend the rules with legal-looking values.

```bash
curl -X POST https://your-app.com/api/checkout \
  -H "authorization: Bearer <token>" -d '{"item":"sku_1","price":0,"quantity":-1}'
```
**Vulnerable if:** you check out for free, or a negative quantity credits your account. **Your WAF can't
see it** — `price:0` is a valid number. **Nemesis / Omniguard:** values and sequences outside the
learned/normal envelope → review or block, with an AML/fraud trail for money flows.

### 5. Excessive data exposure

Hit an API endpoint directly and read the raw JSON — it usually returns far more than the screen shows.

```bash
curl https://your-app.com/api/users/me -H "authorization: Bearer <token>"
```
**Vulnerable if:** the response includes password hashes, other users' emails, internal flags, tokens.
**Your WAF can't see it** — it's your own API answering. **Nemesis:** a response shape that leaks fields
it doesn't normally return is a deviation.

### 6. Unrestricted resource consumption (no rate limit / pagination abuse)

```bash
# Hammer an endpoint, or ask for everything at once:
curl "https://your-app.com/api/search?limit=1000000&q=a"
for i in $(seq 1 500); do curl -s https://your-app.com/api/login -d '{"email":"a@b.c","password":"x"}' & done
```
**Vulnerable if:** it doesn't rate-limit, or a huge `limit` dumps the table / spikes your bill. **Nemesis:**
velocity and volume outside normal → throttled/blocked.

### 7. Server-Side Request Forgery (SSRF)

```bash
curl -X POST https://your-app.com/api/fetch -d '{"url":"http://169.254.169.254/latest/meta-data/"}'
```
**Vulnerable if:** your server fetches internal metadata/services. **Your WAF can't see it** — it's an
outbound call your app makes. **Nemesis:** an app suddenly talking to an internal address is off-baseline.

### 8. Zero-day exploitation of a dependency you haven't patched

A new CVE drops in a library you use. The exploit is a request your app has never legitimately received.
**Your signature WAF has no rule for it yet.** **Nemesis:** it deviates from the learned baseline, so the
*exploitation* is blocked **before you patch the code**.

### 9. Injection that isn't in the signature list

Signature WAFs catch textbook `' OR 1=1`. They miss novel encodings, nested JSON injection, NoSQL
operators (`{"$gt":""}`), and app-specific sinks. **Nemesis:** a parameter whose *shape* changes from
its learned normal is caught regardless of the exact payload.

---

## So… is your app exposed?

Most apps answer "yes" to several of the above, because a signature WAF and the app itself are both
blind to well-formed requests. That's the entire category positive security exists to close.

**Two ways to find out and fix it in minutes:**

1. **Passive scan** (no setup): [`https://nemesislabs.xyz/protect`](https://nemesislabs.xyz/protect) —
   fingerprints your stack, real CVEs, and whether you have any protection.
2. **Add the one-line WAF** (this starter already has it):
   ```ts
   // src/middleware.ts — every route, one line
   export default withShield(() => NextResponse.next(), { token: process.env.NEMESIS_TOKEN });
   ```
   Observe mode by default (blocks nothing), fail-open, free to start. Learn a baseline, approve it,
   flip to enforce — now every attack above is caught as a deviation.

Get a free token at [shield.nemesislabs.xyz](https://shield.nemesislabs.xyz). Manage it from your editor
with the [Nemesis MCP server](https://nemesislabs.xyz/mcp): `npx -y @nemesis-shield-autogon/mcp`.
