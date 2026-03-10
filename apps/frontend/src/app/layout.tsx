import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polar — Build Web3 Apps on Avalanche",
  description:
    "Describe your web3 app in plain English. Polar generates the code and deploys it to Avalanche.",
  openGraph: {
    title: "Polar — Build Web3 Apps on Avalanche",
    description: "AI-powered web3 app builder for Avalanche",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
