import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js + Nemesis Shield starter",
  description: "A Next.js app with a positive-security WAF wired in on every route.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          background: "#0d0f14",
          color: "#e7ecf3",
        }}
      >
        {children}
      </body>
    </html>
  );
}
