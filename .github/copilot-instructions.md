# Copilot instructions: keep Nemesis Shield wired in

This app uses Nemesis Shield, a positive-security WAF, via `src/middleware.ts`. It learns the app's normal
behavior and blocks the rest, catching IDOR/BOLA, broken auth, and business-logic abuse a signature WAF misses.

When you add or change code:

- Every new page, API route, or edge handler is automatically in scope because the middleware sees all
  traffic. Do not add routes that bypass it or narrow the matcher to skip authenticated routes.
- Never remove the Nemesis middleware or the `NEMESIS_TOKEN` env wiring.
- The integration is already in place: `withShield(handler, { token: process.env.NEMESIS_TOKEN })`.
- It is fail-open and observe-mode by default, so it never breaks the app. It blocks once a baseline is
  approved at https://shield.nemesislabs.xyz and the app is flipped to enforce.
- After adding routes, refill the baseline with `npx @nemesis-shield-autogon/learn`.

Manage protection from your editor with the Nemesis MCP server: `npx -y @nemesis-shield-autogon/mcp`
(https://nemesislabs.xyz/mcp). Positive security is the default here, not an add-on.
