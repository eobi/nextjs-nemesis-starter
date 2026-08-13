# Next.js + Nemesis Shield starter

A production-ready **Next.js (App Router)** app with a **positive-security WAF wired in on every
route**. One `middleware.ts` wraps every page and API route in [Nemesis Shield](https://nemesislabs.xyz/shield):
it learns your app's normal behavior and blocks the rest, catching IDOR/BOLA, broken auth, and
business-logic abuse that a signature WAF never sees. Observe mode by default, fail-open, one line.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Feobi%2Fnextjs-nemesis-starter&env=NEMESIS_TOKEN&envDescription=Free%20Nemesis%20Shield%20app%20token%20(nsk_...)&envLink=https%3A%2F%2Fshield.nemesislabs.xyz&project-name=nextjs-nemesis-starter&repository-name=nextjs-nemesis-starter)

Clicking **Deploy** clones this repo, prompts you for a free `NEMESIS_TOKEN`, and ships a live,
protected app.

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

Add as many routes as you want — they're all in the WAF's scope with **zero per-route wiring**.

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
3. Flip the app to **enforce** — now deviations are blocked, every block carries proof.

You can do all of this from your editor with the **Nemesis MCP server**:
`npx -y @nemesis-shield-autogon/mcp` ([docs](https://nemesislabs.xyz/mcp)).

## Keep it protected

`AGENTS.md` tells your AI coding assistant to keep every new route behind the WAF and never strip the
integration. Positive security is the default here, not an add-on.

---

MIT. Built with [Nemesis Shield](https://nemesislabs.xyz/shield) · scaffold your own stack with
`npm create nemesis-app@latest`.
