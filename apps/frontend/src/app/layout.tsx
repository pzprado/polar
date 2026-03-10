import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polar — Build Web3 Apps on Avalanche",
  description:
    "Describe your web3 app in plain English. Polar generates the code and deploys it to Avalanche — instantly.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://polar-app.vercel.app"),
  openGraph: {
    title: "Polar — Build Web3 Apps on Avalanche",
    description:
      "Describe your idea. Polar generates, deploys, and hosts your decentralized application on Avalanche — instantly.",
    type: "website",
    siteName: "Polar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Polar — Build Web3 Apps on Avalanche",
    description:
      "AI-powered web3 app builder. From prompt to live dApp on Avalanche in minutes.",
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
