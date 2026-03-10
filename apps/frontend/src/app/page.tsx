"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Globe,
  Image,
  Menu,
  Snowflake,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import NextImage from "next/image";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { SUGGESTED_PROMPTS } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const FEATURES = [
  {
    num: "01",
    title: "Decentralized Backend",
    desc: "Your database and logic live on Avalanche. No AWS bills, no single points of failure — just immutable infrastructure that runs forever.",
  },
  {
    num: "02",
    title: "AI Smart Contracts",
    desc: "Describe your logic in plain English. Polar selects from vetted Solidity templates and parameterizes them for your use case.",
  },
  {
    num: "03",
    title: "Instant Deployment",
    desc: "From prompt to live dApp in minutes. Compiling, deploying, and verification happen automatically on Avalanche Fuji.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const submitPrompt = () => {
    const cleaned = prompt.trim();
    if (!cleaned) return;
    router.push(`/app/new?prompt=${encodeURIComponent(cleaned)}`);
  };

  const motionInitial = prefersReducedMotion ? "visible" : "hidden";

  return (
    <div
      className={`${dmSans.variable} ${spaceGrotesk.variable} min-h-screen bg-[#0B101B] text-[#b8bcc6]`}
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#0B101B]"
      >
        Skip to content
      </a>

      {/* ─── Nav ─── */}
      <motion.nav
        aria-label="Main navigation"
        initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0B101B]/90 backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Snowflake className="h-6 w-6 text-[#E84142]" />
            <span className="text-display text-xl font-bold tracking-tight text-white">
              POLAR
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a className="px-1 py-2 text-xs font-medium text-[#8b919e] transition-colors hover:text-white" href="#" onClick={(e) => e.preventDefault()}>
              Features
            </a>
            <a className="px-1 py-2 text-xs font-medium text-[#8b919e] transition-colors hover:text-white" href="#" onClick={(e) => e.preventDefault()}>
              Showcase
            </a>
            <a className="px-1 py-2 text-xs font-medium text-[#8b919e] transition-colors hover:text-white" href="#" onClick={(e) => e.preventDefault()}>
              Docs
            </a>
            <Link
              href="/app/new"
              className="rounded-full bg-[#E84142] px-5 py-2 text-xs font-medium text-white shadow-lg shadow-red-900/20 transition-colors hover:bg-red-600"
            >
              Launch App
            </Link>
          </div>

          <button
            className="p-2 text-[#8b919e] hover:text-white md:hidden"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 px-4 pb-4 pt-2 md:hidden">
            <div className="flex flex-col space-y-3">
              <a className="rounded-lg px-3 py-2 text-sm font-medium text-[#8b919e] transition-colors hover:bg-white/5 hover:text-white" href="#" onClick={(e) => e.preventDefault()}>
                Features
              </a>
              <a className="rounded-lg px-3 py-2 text-sm font-medium text-[#8b919e] transition-colors hover:bg-white/5 hover:text-white" href="#" onClick={(e) => e.preventDefault()}>
                Showcase
              </a>
              <a className="rounded-lg px-3 py-2 text-sm font-medium text-[#8b919e] transition-colors hover:bg-white/5 hover:text-white" href="#" onClick={(e) => e.preventDefault()}>
                Docs
              </a>
              <Link
                href="/app/new"
                className="rounded-lg bg-[#E84142] px-3 py-2 text-center text-sm font-medium text-white transition-all hover:bg-red-600"
              >
                Launch App
              </Link>
            </div>
          </div>
        )}
      </motion.nav>

      <main id="main">
        {/* ─── Hero ─── */}
        <div className="relative flex h-screen flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <NextImage
              alt="Majestic snowy mountain landscape"
              className="h-full w-full object-cover opacity-50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5O49QrKH-qB3ziL7XX6rMotMvVLnHK-A3WaZKqel-F19elGC1IKL8Nus2HoOwbhENA1UDAyjhOIrSkhkEdNUfyu8sZO5qVQoKgqEDcubqFwFw9K2OaZaQiVXqUcbtIXDQZxXRhTVv5FNgSSnugxGY5ZnBPmzPAunW2RDuJdvvsttnbTdkP4x8jxOeXnF1nudaqdaN8s2Uxh3L4B-bxWc8wWs3MZV2Lsqi5HnRLrLU3fbDqYi8v8ySm7KFMqEyiFXfGVp8wUr0hA4"
              fill
              priority
              sizes="100vw"
            />
            <div className="bg-hero-gradient absolute inset-0" />
          </div>

          <motion.div
            initial={motionInitial}
            animate="visible"
            transition={{ staggerChildren: 0.08, delayChildren: 0.3 }}
            className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-24 text-center sm:px-6 lg:px-8"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#E84142]" />
              <span className="text-[11px] font-medium uppercase tracking-wide text-[#8b919e]">
                Powered by Avalanche
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-display mb-4 text-4xl leading-tight font-bold tracking-tight text-white md:text-6xl"
            >
              {["Build", "apps", "that"].map((word, i) => (
                <motion.span
                  key={word}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 12 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                    delay: prefersReducedMotion ? 0 : 0.5 + i * 0.1,
                  }}
                  className="mr-[0.3em] inline-block"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              {["live", "forever"].map((word, i) => (
                <motion.span
                  key={word}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 12 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                    delay: prefersReducedMotion ? 0 : 0.8 + i * 0.1,
                  }}
                  className="mr-[0.3em] inline-block text-[#E84142]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-10 max-w-xl text-base font-light text-[#8b919e] md:text-lg"
            >
              Describe your idea. Polar generates, deploys, and hosts your
              decentralized application on Avalanche — instantly.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mx-auto flex w-full max-w-3xl flex-col items-center"
            >
              <div className="glass-panel mb-5 flex w-full flex-col rounded-2xl border border-white/15 p-6 shadow-xl shadow-black/20">
                <textarea
                  aria-label="Describe your web3 app"
                  className="h-32 w-full resize-none rounded-lg border-none bg-transparent px-2 py-2 text-lg font-light text-white placeholder-[#5c6370] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E84142]/40"
                  placeholder="Ask Polar to build a prototype of..."
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      submitPrompt();
                    }
                  }}
                />
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 overflow-x-auto">
                    <button className="flex items-center gap-1.5 text-[#5c6370] hover:text-white transition-colors text-xs py-2 px-1" type="button" aria-label="Attach image">
                      <Image className="h-4 w-4" />
                      <span className="hidden sm:inline">Attach</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-[#5c6370] hover:text-white transition-colors text-xs py-2 px-1" type="button" aria-label="Quick actions">
                      <Zap className="h-4 w-4" />
                    </button>
                    <button className="flex items-center gap-1.5 text-[#5c6370] hover:text-white transition-colors text-xs py-2 px-1" type="button" aria-label="Build mode">
                      <Wrench className="h-4 w-4" />
                      <span className="hidden sm:inline">Build</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-[#5c6370] hover:text-white transition-colors text-xs py-2 px-1" type="button" aria-label="Visibility">
                      <Globe className="h-4 w-4" />
                      <span className="hidden sm:inline">Public</span>
                    </button>
                  </div>
                  <button
                    className="flex items-center justify-center rounded-full bg-[#E84142] p-3 text-white shadow-lg transition-colors hover:bg-red-500"
                    onClick={submitPrompt}
                    type="button"
                    aria-label="Submit prompt"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mb-6 flex flex-wrap items-center justify-center gap-2.5"
              >
                <span className="flex items-center gap-1 text-xs text-[#5c6370]">
                  Try one <ArrowRight className="h-3 w-3" />
                </span>
                {SUGGESTED_PROMPTS.map((item) => (
                  <button
                    key={item.label}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-[#b8bcc6] transition-colors hover:bg-white/10"
                    onClick={() => setPrompt(item.prompt)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>

              <motion.p
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="text-sm font-medium text-[#8b919e] opacity-80"
              >
                Trusted by 100k+ users
              </motion.p>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── How It Works ─── */}
        <section className="relative bg-[#0B101B] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={motionInitial}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              variants={fadeUp}
              className="mb-16"
            >
              <h2 className="text-display text-3xl font-bold text-white md:text-5xl">
                How it works
              </h2>
              <p className="mt-4 max-w-2xl text-[#8b919e]">
                From idea to deployed dApp in three steps. No DevOps, no
                infrastructure management.
              </p>
            </motion.div>

            <motion.div
              initial={motionInitial}
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ staggerChildren: 0.12 }}
              className="grid gap-x-12 gap-y-16 md:grid-cols-3"
            >
              {FEATURES.map((feature) => (
                <motion.div
                  key={feature.num}
                  variants={fadeUp}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <span className="text-display text-5xl font-bold text-[#E84142]/20">
                    {feature.num}
                  </span>
                  <h3 className="text-display mt-4 text-xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#8b919e]">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── The Engine ─── */}
        <section className="overflow-hidden bg-gradient-to-b from-[#0B101B] to-[#0f1520] py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <motion.div
              initial={
                prefersReducedMotion ? false : { opacity: 0, x: -40 }
              }
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="mb-4 inline-block rounded-full border border-[#E84142]/20 bg-[#E84142]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#E84142]">
                The Engine
              </div>
              <h2 className="text-display mb-6 text-4xl leading-tight font-bold text-white md:text-5xl">
                Built for the <br />
                <span className="text-[#E84142]">Crypto-Native</span> Future
              </h2>
              <p className="mb-8 text-lg text-[#8b919e]">
                Traditional apps are fragile. They rely on centralized servers
                that can be turned off. Polar apps are built on Avalanche,
                inheriting the security and durability of the network itself.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle2 className="mr-4 mt-1 h-5 w-5 shrink-0 text-[#E84142]" />
                  <div>
                    <h4 className="font-semibold text-white">
                      Censorship Resistant
                    </h4>
                    <p className="text-sm text-[#8b919e]">
                      Your code belongs to you and the network. No one can take
                      it down.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="mr-4 mt-1 h-5 w-5 shrink-0 text-[#E84142]" />
                  <div>
                    <h4 className="font-semibold text-white">
                      Composability First
                    </h4>
                    <p className="text-sm text-[#8b919e]">
                      Integrate with existing protocols like Trader Joe, Benqi,
                      and Aave.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={
                prefersReducedMotion ? false : { opacity: 0, x: 40 }
              }
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-transform duration-500 hover:rotate-0 lg:rotate-1">
                <NextImage
                  alt="Code editor showing deployed smart contract"
                  className="w-full object-cover opacity-90 transition-opacity hover:opacity-100"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuARXA6UvVeg_dm7STvvv33ASgUAQz6SwYjqGQttuDOErIq654aflL92zZE-Niw0qsvw-M3uhtLRGMv9Q1ZwaqraRE5_a76mpFAXR236y5mVnr1hX2ni0IfX65APJOzvcr7lOLtfhkOVvkrNxnITYPIWrSHaMikUrvd-Rf42_obMkvQLJLiSpABqj8PiPLzVuJ-89aYQdmOUO3dk1yGx7OVTQMLo4O4ITA2Ls_y67jrFjt3gnWIz-6T_g1h8KXKc8PEnrkce-_Rvs2U"
                  width={800}
                  height={600}
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute right-6 bottom-6 left-6 rounded-xl border border-white/10 bg-[#0B101B]/90 p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs tracking-wide text-[#8b919e]">
                      Contract Status
                    </span>
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                      Live
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
                    <div className="h-full w-full bg-[#E84142]" />
                  </div>
                  <div className="mt-2 break-all font-mono text-xs text-[#5c6370]">
                    0x1A4...9e2F deployed to Avalanche C-Chain
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B101B] via-[#0B101B]/95 to-[#0f1520]" />

          <motion.div
            initial={motionInitial}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.12 }}
            className="relative z-10 mx-auto max-w-4xl px-4"
          >
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-display mb-12 text-4xl font-bold text-white"
            >
              Start building today
            </motion.h2>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full overflow-hidden rounded-2xl border border-white/10"
            >
              <div className="grid items-center md:grid-cols-2">
                <div className="bg-[#111827] p-8 text-left md:p-12">
                  <p className="mb-8 text-[#8b919e]">
                    Deploy unstoppable applications with AI-generated smart
                    contracts and instant Avalanche deployment.
                  </p>
                  <ul className="mb-8 space-y-4">
                    <li className="flex items-center text-sm text-[#b8bcc6]">
                      <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-[#E84142]" />
                      Zero-config environment
                    </li>
                    <li className="flex items-center text-sm text-[#b8bcc6]">
                      <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-[#E84142]" />
                      Gas-optimized contracts
                    </li>
                    <li className="flex items-center text-sm text-[#b8bcc6]">
                      <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-[#E84142]" />
                      One-click verification
                    </li>
                  </ul>
                  <Link
                    href="/app/new"
                    className="inline-block w-full rounded-lg bg-white py-3 text-center font-bold text-[#0B101B] transition-colors hover:bg-gray-100"
                  >
                    Get Started
                  </Link>
                </div>

                <div className="relative h-64 overflow-hidden md:h-full">
                  <NextImage
                    alt="Mountain landscape representing permanence"
                    className="h-full w-full scale-110 object-cover transition-transform duration-700 hover:scale-100"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr2gWYOIES5kU1WFw-eRWgFxhhFUge3HDFufQhWgSUvyz-JFPrpKEH2Kit_yAEOrWVtOtvZGcsqFOuN_1afStX0um4sqVkeAZEV2Xqp6QPg69Bdr0gBJxA6YVJ9vHjTjUYSEXn_UUV5eCHpA-HCPRDhnLS2a548z8oGgLv805xiPeUbvcLuO4bJRZ77oKmKUIUyLFvFTUFG7XVkCpczZJz83KxgNhufxlsb0PR_MCo8d9SCVsIsqg-VwE7l2_E__vuPl7X2i_82uA"
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/80 to-transparent" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <motion.footer
        initial={motionInitial}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        variants={fadeIn}
        className="border-t border-white/5 bg-[#05080f] py-10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-[#E84142]" />
              <span className="text-display text-lg font-bold text-white">
                POLAR
              </span>
            </div>
            <p className="text-xs text-[#5c6370]">
              © 2026 Polar Labs · Built on Avalanche · Build Games 2026
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
