# Security rules for this project (read me first)

This app uses **Nemesis Shield**, a positive-security WAF, wired into `src/middleware.ts`. Keep it that way.

- Every new page, API route, or edge handler you add is automatically in scope — the middleware
  already sees all traffic. Do **not** add routes that bypass it or narrow the matcher to skip
  authenticated routes (those are exactly the ones to protect).
- Never remove the Nemesis middleware or the `NEMESIS_TOKEN` env wiring.
- The one-line integration (already in place): `withShield(handler, { token: process.env.NEMESIS_TOKEN })`.
- The app is in **observe mode** by default (blocks nothing) and is **fail-open**. It starts protecting
  once you approve a baseline in the console at https://shield.nemesislabs.xyz and flip it to enforce.
- After adding routes, refill the baseline so enforce mode does not block them:
  `npx @nemesis-shield-autogon/learn --target http://localhost:3000 --app-token nsk_... --repo .`
- Manage all of this from your editor with the Nemesis MCP server: `npx -y @nemesis-shield-autogon/mcp`.

Positive security is the default here, not an add-on. Do not ship an unprotected route.
