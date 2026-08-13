# Next.js + Nemesis Shield starter

A production-ready **Next.js (App Router)** app with a **positive-security WAF wired in on every
route**. One `middleware.ts` wraps every page and API route in [Nemesis Shield](https://nemesislabs.xyz/shield):
it learns your app's normal behavior and blocks the rest, catching IDOR/BOLA, broken auth, and
business-logic abuse that a signature WAF never sees. Observe mode by default, fail-open, one line.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Feobi%2Fnextjs-nemesis-starter&env=NEMESIS_TOKEN&envDescription=Free%20Nemesis%20Shield%20app%20token%20(nsk_...)&envLink=https%3A%2F%2Fshield.nemesislabs.xyz&project-name=nextjs-nemesis-starter&repository-name=nextjs-nemesis-starter)

Clicking **Deploy** clones this repo, prompts you for a free `NEMESIS_TOKEN`, and ships a live,
protected app.

## Is your app already exposed?

Most apps are vulnerable to a whole class of attacks that a signature WAF **and** the app itself can't
see, because they're perfectly well-formed requests: IDOR/BOLA (the #1 API risk), broken function-level
auth, mass assignment, business-logic abuse, excessive data exposure, SSRF, and zero-day exploitation.

👉 **[Read the attacks, and test your own app in a few `curl`s](ATTACKS.md).** If any of them work,
nothing in front of your app is stopping them. That's the category positive security closes.

## Where teams use this

The same one-line wrapper covers surfaces that RLS and a signature WAF both miss:

- **Multi-tenant B2B SaaS.** One tenant reading another's records (BOLA/BFLA) is the #1 API risk. Even
  if a code path forgets the check, the request is off that tenant's learned access pattern and is stopped.
- **Vercel API routes holding secrets.** `/api/*` handlers that reach your database or a payment
  provider. Mass assignment and excessive data exposure are caught as shape deviations.
- **Payments and fintech flows.** Business-logic abuse such as a zero price or a negative quantity is
  flagged, and money-movement requests carry a fraud and AML trail.
- **AI and LLM endpoints.** Prompt injection and abuse arrive as off-baseline traffic, not a signature
  you have to guess in advance.
- **Same-day zero-days.** An exploit against a dependency you ship is blocked before you can patch,
  because it does not match your baseline.
- **Compliance evidence.** Every block is proof-carrying, so an auditor sees why a request was refused,
  not just that it was.

## Why teams add it

- **One line, and it is fail-open.** It never takes your app down, even if the service is unreachable.
- **Observe first.** It blocks nothing until you approve a learned baseline, so it cannot break you on day one.
- **Per-app, not a global ruleset.** It learns your normal and blocks the deviation, which is why it
  catches well-formed attacks a shared WAF ruleset cannot.
- **Zero per-route wiring.** Every new page, route, and handler is in scope automatically.

## What's protected

Everything. The middleware matcher covers all pages and API routes:

```ts
// src/middleware.ts
import { withShield } from "@nemesis-shield-autogon/edge";
import { NextResponse } from "next/server";

export const config = { matcher: "/:path*" };
export default withShield(() => NextResponse.next(), {
  token: process.env.NEMESIS_TOKEN,
});
```

Add as many routes as you want, they're all in the WAF's scope with **zero per-route wiring**.

## Run it locally

```bash
npm install
cp .env.example .env.local      # then paste your NEMESIS_TOKEN
npm run dev                     # http://localhost:3000
```

The app runs fine without a token (the WAF is **fail-open**). Set `NEMESIS_TOKEN` to start protecting it.

## Get a free token

1. Sign in at **https://shield.nemesislabs.xyz** and create an app → copy its `nsk_...` token.
2. Add it as `NEMESIS_TOKEN` (in Vercel: Project → Settings → Environment Variables; locally: `.env.local`).

## Observe → enforce

Protection ships in **observe mode** (blocks nothing) so it can never break your app on day one.

1. Let it see some traffic (or run the learn agent to finish the baseline fast):
   `npx @nemesis-shield-autogon/learn --target https://your-app.vercel.app --app-token nsk_... --repo .`
2. **Approve** the learned baseline in the console.
3. Flip the app to **enforce**, now deviations are blocked, every block carries proof.

You can do all of this from your editor with the **Nemesis MCP server**:
`npx -y @nemesis-shield-autogon/mcp` ([docs](https://nemesislabs.xyz/mcp)).

## Keep it protected

`AGENTS.md` tells your AI coding assistant to keep every new route behind the WAF and never strip the
integration. Positive security is the default here, not an add-on.

---

MIT. Built with [Nemesis Shield](https://nemesislabs.xyz/shield) · scaffold your own stack with
`npm create nemesis-app@latest`.
