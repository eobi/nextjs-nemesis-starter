const protectedByNemesis = Boolean(process.env.NEMESIS_TOKEN);

const card: React.CSSProperties = {
  border: "1px solid #232833",
  background: "#141821",
  borderRadius: 14,
  padding: "20px 22px",
};
const mono: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontSize: 13.5,
};

export default function Home() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px 96px" }}>
      <p
        style={{
          ...mono,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#5aa2ff",
          fontSize: 12,
          margin: 0,
        }}
      >
        Next.js + Nemesis Shield
      </p>
      <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: "14px 0 0", letterSpacing: "-0.02em" }}>
        This app ships with a WAF already built in.
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: "#aab4c2", marginTop: 18 }}>
        A single <code style={mono}>middleware.ts</code> wraps every route in{" "}
        <strong>Nemesis Shield</strong>, a positive-security WAF. It learns this app&apos;s normal
        behavior and blocks the rest, catching IDOR/BOLA, broken auth, and business-logic abuse that a
        signature firewall never sees. Observe mode by default, fail-open, one line.
      </p>

      <div style={{ marginTop: 28, display: "grid", gap: 12 }}>
        <div style={card}>
          <div style={{ ...mono, fontSize: 12, color: "#7d8b9c", marginBottom: 8 }}>
            src/middleware.ts
          </div>
          <pre style={{ ...mono, margin: 0, whiteSpace: "pre-wrap", color: "#c8d3e0" }}>
{`import { withShield } from "@nemesis-shield-autogon/edge";
import { NextResponse } from "next/server";

export const config = { matcher: "/:path*" };
export default withShield(() => NextResponse.next(), {
  token: process.env.NEMESIS_TOKEN,
});`}
          </pre>
        </div>

        <div style={{ ...card, display: "flex", gap: 12, alignItems: "center" }}>
          <span
            style={{
              ...mono,
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 999,
              background: protectedByNemesis ? "rgba(63,176,108,.16)" : "rgba(226,167,51,.16)",
              color: protectedByNemesis ? "#5fd08a" : "#e9b44a",
              border: `1px solid ${protectedByNemesis ? "#2f6f4e" : "#7a5f2a"}`,
            }}
          >
            {protectedByNemesis ? "NEMESIS_TOKEN set" : "NEMESIS_TOKEN not set"}
          </span>
          <span style={{ color: "#aab4c2", fontSize: 14 }}>
            {protectedByNemesis
              ? "Protection is active in observe mode. Approve a baseline in the console, then flip to enforce."
              : "The app runs fine unprotected (fail-open). Add NEMESIS_TOKEN to start protecting it."}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 26, display: "flex", gap: 22, flexWrap: "wrap", ...mono, fontSize: 14 }}>
        <a href="https://shield.nemesislabs.xyz" style={{ color: "#5aa2ff" }}>
          Get a free token →
        </a>
        <a href="/api/hello" style={{ color: "#5aa2ff" }}>
          Try the protected API →
        </a>
        <a href="https://nemesislabs.xyz/shield" style={{ color: "#5aa2ff" }}>
          How positive security works →
        </a>
      </div>

      <p style={{ marginTop: 40, color: "#6c7889", fontSize: 13, lineHeight: 1.6 }}>
        Deployed from the{" "}
        <a href="https://github.com/eobi/nextjs-nemesis-starter" style={{ color: "#8aa0b8" }}>
          nextjs-nemesis-starter
        </a>{" "}
        template. Every new route you add is protected automatically. Manage it from your editor with
        the Nemesis MCP server: <code style={mono}>npx -y @nemesis-shield-autogon/mcp</code>.
      </p>
    </main>
  );
}
