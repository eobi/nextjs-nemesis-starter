import { withShield } from "@nemesis-shield-autogon/edge";
import { NextResponse } from "next/server";

// Nemesis Shield — positive-security WAF on EVERY route (pages + API).
// It learns this app's normal behavior and blocks the rest (IDOR/BOLA, broken auth,
// business-logic abuse a signature WAF never sees). Observe mode until you approve a
// baseline in the console; fail-open, so if Nemesis is unreachable the app is unaffected.
//
// Do not narrow the matcher to skip auth'd routes — those are exactly the ones to protect.
export const config = { matcher: "/((?!_next/static|_next/image|favicon.ico).*)" };

export default withShield(() => NextResponse.next(), {
  token: process.env.NEMESIS_TOKEN,
});
