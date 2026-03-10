import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polar — Build Apps That Live Forever",
  description:
    "Describe your app in plain English. Polar generates the code and publishes it — permanently. No servers, no hosting fees.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://polar-app.vercel.app"),
  openGraph: {
    title: "Polar — Build Apps That Live Forever",
    description:
      "Describe your idea. Polar builds, publishes, and hosts your app permanently. No servers, no hosting, no downtime.",
    type: "website",
    siteName: "Polar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Polar — Build Apps That Live Forever",
    description:
      "AI app builder. From prompt to live, permanent app in minutes. No servers needed.",
  },
  appleWebApp: {
    capable: true,
    title: "Polar",
    statusBarStyle: "black-translucent",
  },
  other: {
    "theme-color": "#0B101B",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0B101B] text-foreground antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
