import { NextResponse } from "next/server";

// A normal API route. Nothing special here — it's protected because the Nemesis Shield
// middleware in src/middleware.ts wraps EVERY route (pages + API) automatically. Add as many
// routes as you like; they're all in the WAF's scope without any per-route wiring.
export function GET() {
  return NextResponse.json({
    ok: true,
    message: "This API route is behind Nemesis Shield.",
    protected: Boolean(process.env.NEMESIS_TOKEN),
  });
}
