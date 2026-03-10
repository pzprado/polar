"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CheckCircle2,
  Database,
  Menu,
  Rocket,
  Snowflake,
  Sparkles,
} from "lucide-react";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const submitPrompt = () => {
    const cleaned = prompt.trim();
    if (!cleaned) return;
    router.push(`/app/new?prompt=${encodeURIComponent(cleaned)}`);
  };

  return (
    <div
      className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen bg-[#0B101B] text-slate-100`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <nav className="glass-panel fixed top-0 z-50 w-full border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Snowflake className="h-7 w-7 text-[#E84142]" />
            <span className="text-display text-2xl font-bold tracking-tight text-white">POLAR</span>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <a className="text-sm font-medium text-gray-300 transition-colors hover:text-white" href="#">
              Features
            </a>
            <a className="text-sm font-medium text-gray-300 transition-colors hover:text-white" href="#">
              Showcase
            </a>
            <a className="text-sm font-medium text-gray-300 transition-colors hover:text-white" href="#">
              Docs
            </a>
            <button
              className="rounded-full bg-[#E84142] px-5 py-2 text-sm font-medium text-white shadow-lg shadow-red-900/20 transition-all hover:bg-red-600"
              onClick={() => router.push("/app/new")}
              type="button"
            >
              Launch App
            </button>
          </div>

          <button className="text-gray-300 hover:text-white md:hidden" type="button">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            alt="Majestic snowy mountain landscape"
            className="h-full w-full object-cover opacity-60"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5O49QrKH-qB3ziL7XX6rMotMvVLnHK-A3WaZKqel-F19elGC1IKL8Nus2HoOwbhENA1UDAyjhOIrSkhkEdNUfyu8sZO5qVQoKgqEDcubqFwFw9K2OaZaQiVXqUcbtIXDQZxXRhTVv5FNgSSnugxGY5ZnBPmzPAunW2RDuJdvvsttnbTdkP4x8jxOeXnF1nudaqdaN8s2Uxh3L4B-bxWc8wWs3MZV2Lsqi5HnRLrLU3fbDqYi8v8ySm7KFMqEyiFXfGVp8wUr0hA4"
          />
          <div className="bg-hero-gradient absolute inset-0" />
          <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/30 px-4 py-1.5 glass-panel">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#E84142]" />
            <span className="text-xs font-medium uppercase tracking-wide text-blue-200">Powered by Avalanche</span>
          </div>

          <h1 className="text-display mb-6 text-5xl leading-tight font-bold tracking-tight text-white drop-shadow-2xl md:text-7xl">
            Build apps that <br />
            <span className="bg-gradient-to-r from-white via-[#A5C9E5] to-blue-400 bg-clip-text text-transparent">
              live forever
            </span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg font-light text-gray-300 md:text-xl">
            Describe your idea. Polar AI generates, deploys, and hosts your decentralized application on Avalanche
            instantly. No downtime, ever.
          </p>

          <div className="group relative w-full max-w-3xl">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-400 to-[#E84142] opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200" />
            <div className="relative flex items-center rounded-2xl border border-white/10 bg-gray-900/80 p-2 shadow-2xl backdrop-blur-xl">
              <Sparkles className="ml-4 h-5 w-5 text-gray-400" />
              <input
                className="w-full border-none bg-transparent px-4 py-4 text-lg font-light text-white placeholder-gray-500 focus:outline-none"
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") submitPrompt();
                }}
                placeholder="Describe the app you want to build (e.g. 'A decentralized marketplace for digital ice sculptures')"
                type="text"
                value={prompt}
              />
              <button
                className="flex shrink-0 items-center gap-2 rounded-xl bg-[#E84142] px-6 py-3 font-medium text-white transition-colors hover:bg-red-600"
                onClick={submitPrompt}
                type="button"
              >
                <span>Generate</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-8 border-t border-white/10 pt-8 opacity-70 md:grid-cols-4 md:gap-16">
            <div className="text-center">
              <p className="text-display text-3xl font-bold text-white">100%</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-display text-3xl font-bold text-white">&lt;1s</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">Finality</p>
            </div>
            <div className="text-center">
              <p className="text-display text-3xl font-bold text-white">0</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">Server Costs</p>
            </div>
            <div className="text-center">
              <p className="text-display text-3xl font-bold text-white">Infinite</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">Scale</p>
            </div>
          </div>
        </div>
      </div>

      <section className="relative bg-[#0B101B] py-24">
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[#E84142]/10 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-display mb-4 text-3xl font-bold text-white md:text-5xl">Code Freeze Technology</h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Our AI handles the complexity of decentralized infrastructure. Your apps are frozen in perfection.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="glass-panel group rounded-2xl border border-white/5 p-8 transition-all hover:border-[#E84142]/50">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900/50 transition-transform group-hover:scale-110">
                <Database className="h-5 w-5 text-blue-300" />
              </div>
              <h3 className="text-display mb-3 text-xl font-bold text-white">Decentralized Backend</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                Say goodbye to AWS bills. Your database and logic live on the Avalanche blockchain, immutable and
                unstoppable.
              </p>
            </div>

            <div className="glass-panel group relative overflow-hidden rounded-2xl border border-white/5 p-8 transition-all hover:border-[#E84142]/50">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/5 blur-2xl transition-colors group-hover:bg-[#E84142]/10" />
              <div className="relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900/50 transition-transform group-hover:scale-110">
                <Bot className="h-5 w-5 text-blue-300" />
              </div>
              <h3 className="text-display relative z-10 mb-3 text-xl font-bold text-white">AI Smart Contracts</h3>
              <p className="relative z-10 text-sm leading-relaxed text-gray-400">
                Describe the logic in plain English. Polar generates secure, audited Solidity contracts tailored to
                your needs.
              </p>
            </div>

            <div className="glass-panel group rounded-2xl border border-white/5 p-8 transition-all hover:border-[#E84142]/50">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900/50 transition-transform group-hover:scale-110">
                <Rocket className="h-5 w-5 text-blue-300" />
              </div>
              <h3 className="text-display mb-3 text-xl font-bold text-white">Instant Deployment</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                From prompt to live dApp in minutes. We handle the compiling, deploying, and verification
                automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-gradient-to-b from-[#0B101B] to-slate-900 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-4 inline-block rounded-full border border-[#E84142]/20 bg-[#E84142]/10 px-3 py-1 text-xs font-semibold tracking-wider text-[#E84142] uppercase">
              The Engine
            </div>
            <h2 className="text-display mb-6 text-4xl leading-tight font-bold text-white md:text-5xl">
              Built for the <br />
              <span className="text-[#A5C9E5]">Crypto-Native</span> Future
            </h2>
            <p className="mb-8 text-lg text-gray-400">
              Traditional apps are fragile. They rely on centralized servers that can be turned off. Polar apps are
              built on Avalanche, inheriting the security and durability of the network itself.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle2 className="mt-1 mr-4 h-5 w-5 text-[#E84142]" />
                <div>
                  <h4 className="font-semibold text-white">Censorship Resistant</h4>
                  <p className="text-sm text-gray-500">Your code belongs to you and the network. No one can take it down.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="mt-1 mr-4 h-5 w-5 text-[#E84142]" />
                <div>
                  <h4 className="font-semibold text-white">Composability First</h4>
                  <p className="text-sm text-gray-500">
                    Easily integrate with existing protocols like Trader Joe, Benqi, and Aave.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <a
                className="inline-flex items-center border-b border-[#E84142] pb-1 text-white transition-colors hover:text-[#E84142]"
                href="#"
              >
                Explore Documentation <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-transform duration-500 hover:rotate-0 lg:rotate-1">
              <img
                alt="Frozen futuristic laptop with code"
                className="w-full object-cover opacity-90 transition-opacity hover:opacity-100"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuARXA6UvVeg_dm7STvvv33ASgUAQz6SwYjqGQttuDOErIq654aflL92zZE-Niw0qsvw-M3uhtLRGMv9Q1ZwaqraRE5_a76mpFAXR236y5mVnr1hX2ni0IfX65APJOzvcr7lOLtfhkOVvkrNxnITYPIWrSHaMikUrvd-Rf42_obMkvQLJLiSpABqj8PiPLzVuJ-89aYQdmOUO3dk1yGx7OVTQMLo4O4ITA2Ls_y67jrFjt3gnWIz-6T_g1h8KXKc8PEnrkce-_Rvs2U"
              />
              <div className="glass-panel absolute right-6 bottom-6 left-6 rounded-xl border border-white/20 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-xs text-blue-300">Contract Status</span>
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" /> Live
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
                  <div className="h-full w-full bg-[#E84142]" />
                </div>
                <div className="mt-2 break-all font-mono text-xs text-gray-400">
                  0x1A4...9e2F deployed to Avalanche C-Chain
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB13MbSy6aXx7swN-UE9FjPbrVc38LmYicM1TCXM8DZC-Qm-0KI6HCDo0CRFe39Hyl2PyKzJFGrklSfQeDR80wtNZ3igVrUlHGL5qTh112ahQvy4sX3sli7m4263quxv3dFXPM2vJ2a6F5CI8jbqhu0xm6g-83KpIIOJWNwrrh3SswZK6k7gHGN_Oobzmj5ESexBDvAaPv15EhEjAo1vpp-N_lyVo7eLHw7GqcYeSBuR-75Utdc2MHqms51sw_qZtviJf27EX3V6RE')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B101B] via-[#0B101B]/90 to-[#0B101B]/80" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-display mb-12 text-4xl font-bold text-white">Win the Infinite Game</h2>
          <div className="glass-panel inline-block w-full rounded-3xl border border-white/10 p-1">
            <div className="grid items-center overflow-hidden rounded-2xl bg-slate-900/50 md:grid-cols-2">
              <div className="p-8 text-left md:p-12">
                <h3 className="mb-4 text-2xl font-bold text-white">Start Building Today</h3>
                <p className="mb-8 text-gray-400">
                  Join thousands of developers using AI to deploy unstoppable applications. The ice is set, the tools
                  are ready.
                </p>
                <ul className="mb-8 space-y-4">
                  <li className="flex items-center text-sm text-gray-300">
                    <BadgeCheck className="mr-3 h-4 w-4 text-[#E84142]" />
                    Zero-config environment
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <BadgeCheck className="mr-3 h-4 w-4 text-[#E84142]" />
                    Gas-optimized contracts
                  </li>
                  <li className="flex items-center text-sm text-gray-300">
                    <BadgeCheck className="mr-3 h-4 w-4 text-[#E84142]" />
                    One-click verification
                  </li>
                </ul>
                <button className="w-full rounded-lg bg-white py-3 font-bold text-[#0B101B] transition-colors hover:bg-gray-100" type="button">
                  Get Early Access
                </button>
              </div>

              <div className="relative h-64 overflow-hidden md:h-full">
                <img
                  alt="Frozen trophy prize"
                  className="h-full w-full scale-110 object-cover transition-transform duration-700 hover:scale-100"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr2gWYOIES5kU1WFw-eRWgFxhhFUge3HDFufQhWgSUvyz-JFPrpKEH2Kit_yAEOrWVtOtvZGcsqFOuN_1afStX0um4sqVkeAZEV2Xqp6QPg69Bdr0gBJxA6YVJ9vHjTjUYSEXn_UUV5eCHpA-HCPRDhnLS2a548z8oGgLv805xiPeUbvcLuO4bJRZ77oKmKUIUyLFvFTUFG7XVkCpczZJz83KxgNhufxlsb0PR_MCo8d9SCVsIsqg-VwE7l2_E__vuPl7X2i_82uA"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-[#05080f] pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4 flex items-center gap-2">
                <Snowflake className="h-6 w-6 text-[#E84142]" />
                <span className="text-display text-xl font-bold text-white">POLAR</span>
              </div>
              <p className="mb-4 text-sm text-gray-500">Building the immutable web, one AI prompt at a time.</p>
              <div className="flex space-x-4">
                <a className="text-gray-500 transition-colors hover:text-white" href="#">
                  <span className="text-sm">Twitter</span>
                </a>
                <a className="text-gray-500 transition-colors hover:text-white" href="#">
                  <span className="text-sm">Discord</span>
                </a>
                <a className="text-gray-500 transition-colors hover:text-white" href="#">
                  <span className="text-sm">GitHub</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a className="transition-colors hover:text-[#E84142]" href="#">
                    AI Builder
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-[#E84142]" href="#">
                    Templates
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-[#E84142]" href="#">
                    Pricing
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-[#E84142]" href="#">
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a className="transition-colors hover:text-[#E84142]" href="#">
                    Documentation
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-[#E84142]" href="#">
                    API Reference
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-[#E84142]" href="#">
                    Community
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-[#E84142]" href="#">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a className="transition-colors hover:text-[#E84142]" href="#">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-[#E84142]" href="#">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-[#E84142]" href="#">
                    Cookie Settings
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
            <p className="text-center text-xs text-gray-600 md:text-left">
              © 2024 Polar Labs. All rights reserved. Powered by Avalanche.
            </p>
            <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-400">Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .text-display {
          font-family: var(--font-space-grotesk);
        }

        .glass-panel {
          background: rgba(18, 26, 43, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bg-hero-gradient {
          background: linear-gradient(to bottom, rgba(11, 16, 27, 0.3), rgba(11, 16, 27, 1));
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0b101b;
        }

        ::-webkit-scrollbar-thumb {
          background: #2d3a52;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #3e4c66;
        }
      `}</style>
    </div>
  );
}
