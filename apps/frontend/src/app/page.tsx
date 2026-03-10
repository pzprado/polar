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
import { Snowfall } from "@/components/shared/snowfall";
import { SUGGESTED_PROMPTS } from "@/lib/constants";
import { AnimatedPlaceholder } from "@/components/shared/animated-placeholder";

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
    title: "Permanent Backend",
    desc: "Your app logic runs on infrastructure that never shuts down. No AWS bills, no servers to babysit — just code that keeps running.",
    numColor: "text-[#E84142]/25",
  },
  {
    num: "02",
    title: "AI-Powered Code",
    desc: "Describe what you want in plain English. Polar picks the right architecture and writes the code for you.",
    numColor: "text-[#2563EB]/25",
  },
  {
    num: "03",
    title: "Instant Launch",
    desc: "From prompt to live app in minutes. Building, testing, and publishing happen automatically.",
    numColor: "text-[#D97706]/25",
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
      className={`${dmSans.variable} ${spaceGrotesk.variable} min-h-screen bg-[#F8F6F3] text-[#57534E]`}
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-[#1C1917] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      {/* ─── Nav ─── */}
      <motion.nav
        aria-label="Main navigation"
        initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full border-b border-black/[0.06] bg-[#F8F6F3]/90 backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Snowflake className="h-6 w-6 text-[#E84142]" />
            <span className="text-display text-xl font-bold tracking-tight text-[#1C1917]">
              POLAR
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a className="px-1 py-2 text-xs font-medium text-[#78716C] transition-colors hover:text-[#1C1917]" href="#" onClick={(e) => e.preventDefault()}>
              Features
            </a>
            <a className="px-1 py-2 text-xs font-medium text-[#78716C] transition-colors hover:text-[#1C1917]" href="#" onClick={(e) => e.preventDefault()}>
              Showcase
            </a>
            <a className="px-1 py-2 text-xs font-medium text-[#78716C] transition-colors hover:text-[#1C1917]" href="#" onClick={(e) => e.preventDefault()}>
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
            className="p-2 text-[#78716C] hover:text-[#1C1917] md:hidden"
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
          <div className="border-t border-black/[0.06] px-4 pb-4 pt-2 md:hidden">
            <div className="flex flex-col space-y-3">
              <a className="rounded-lg px-3 py-2 text-sm font-medium text-[#78716C] transition-colors hover:bg-black/[0.03] hover:text-[#1C1917]" href="#" onClick={(e) => e.preventDefault()}>
                Features
              </a>
              <a className="rounded-lg px-3 py-2 text-sm font-medium text-[#78716C] transition-colors hover:bg-black/[0.03] hover:text-[#1C1917]" href="#" onClick={(e) => e.preventDefault()}>
                Showcase
              </a>
              <a className="rounded-lg px-3 py-2 text-sm font-medium text-[#78716C] transition-colors hover:bg-black/[0.03] hover:text-[#1C1917]" href="#" onClick={(e) => e.preventDefault()}>
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

          <Snowfall />

          <motion.div
            initial={motionInitial}
            animate="visible"
            transition={{ staggerChildren: 0.08, delayChildren: 0.3 }}
            className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-24 text-center sm:px-6 lg:px-8"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#E84142]" />
              <span className="text-[11px] font-medium uppercase tracking-wide text-[#78716C]">
                Powered by Avalanche
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-display mb-4 text-4xl leading-tight font-bold tracking-tight text-[#1C1917] md:text-6xl"
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
              className="mb-10 max-w-xl text-base font-light text-[#78716C] md:text-lg"
            >
              Describe your idea. Polar builds, publishes, and hosts your
              app — permanently. No servers. No hosting fees. Ever.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mx-auto flex w-full max-w-3xl flex-col items-center"
            >
              <div className="glass-panel mb-5 flex w-full flex-col rounded-2xl border border-black/[0.08] p-6 shadow-xl shadow-black/20">
                <div className="relative text-left">
                  <AnimatedPlaceholder visible={prompt.length === 0} />
                  <textarea
                    autoFocus
                    aria-label="Describe your app"
                    className="relative z-10 h-32 w-full resize-none rounded-lg border-none bg-transparent px-2 py-2 text-lg font-light text-[#1C1917] focus-visible:outline-none"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        submitPrompt();
                      }
                    }}
                  />
                </div>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/[0.04]">
                  <div className="flex items-center gap-3 overflow-x-auto">
                    <button className="flex items-center gap-1.5 text-[#A8A29E] hover:text-[#2563EB] transition-colors text-xs py-2 px-1" type="button" aria-label="Attach image">
                      <Image className="h-4 w-4" />
                      <span className="hidden sm:inline">Attach</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-[#A8A29E] hover:text-[#D97706] transition-colors text-xs py-2 px-1" type="button" aria-label="Quick actions">
                      <Zap className="h-4 w-4" />
                    </button>
                    <button className="flex items-center gap-1.5 text-[#A8A29E] hover:text-[#E84142] transition-colors text-xs py-2 px-1" type="button" aria-label="Build mode">
                      <Wrench className="h-4 w-4" />
                      <span className="hidden sm:inline">Build</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-[#A8A29E] hover:text-[#2563EB] transition-colors text-xs py-2 px-1" type="button" aria-label="Visibility">
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
                <span className="flex items-center gap-1 text-xs text-[#A8A29E]">
                  Try one <ArrowRight className="h-3 w-3" />
                </span>
                {SUGGESTED_PROMPTS.map((item, i) => {
                  const chipColors = [
                    "hover:border-[#E84142]/30 hover:bg-[#E84142]/10 hover:text-[#E84142]",
                    "hover:border-[#2563EB]/30 hover:bg-[#2563EB]/10 hover:text-[#2563EB]",
                    "hover:border-[#D97706]/30 hover:bg-[#D97706]/10 hover:text-[#D97706]",
                    "hover:border-[#2563EB]/30 hover:bg-[#2563EB]/10 hover:text-[#2563EB]",
                  ];
                  return (
                    <button
                      key={item.label}
                      className={`rounded-full border border-black/[0.06] bg-black/[0.03] px-4 py-2 text-xs text-[#57534E] transition-colors ${chipColors[i % chipColors.length]}`}
                      onClick={() => setPrompt(item.prompt)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  );
                })}
              </motion.div>

              <motion.p
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="text-sm font-medium text-[#78716C] opacity-80"
              >
                Trusted by 100k+ users
              </motion.p>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── How It Works ─── */}
        <section className="relative bg-[#F8F6F3] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={motionInitial}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              variants={fadeUp}
              className="mb-16"
            >
              <h2 className="text-display text-3xl font-bold text-[#1C1917] md:text-5xl">
                How it works
              </h2>
              <p className="mt-4 max-w-2xl text-[#78716C]">
                From idea to live app in three steps. No DevOps, no
                infrastructure to manage.
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
                  <span className={`text-display text-5xl font-bold ${feature.numColor}`}>
                    {feature.num}
                  </span>
                  <h3 className="text-display mt-4 text-xl font-bold text-[#1C1917]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#78716C]">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── The Engine ─── */}
        <section className="overflow-hidden bg-gradient-to-b from-[#F8F6F3] to-[#F0EDEA] py-32">
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
                Why Polar
              </div>
              <h2 className="text-display mb-6 text-4xl leading-tight font-bold text-[#1C1917] md:text-5xl">
                Built to <br />
                <span className="text-[#E84142]">Last Forever</span>
              </h2>
              <p className="mb-8 text-lg text-[#78716C]">
                Traditional apps depend on servers that cost money and can go
                offline. Polar apps run on permanent infrastructure — once
                published, they can't be taken down.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle2 className="mr-4 mt-1 h-5 w-5 shrink-0 text-[#E84142]" />
                  <div>
                    <h4 className="font-semibold text-[#1C1917]">
                      Always Online
                    </h4>
                    <p className="text-sm text-[#78716C]">
                      Your code runs independently. No company, no server, no
                      single point of failure.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="mr-4 mt-1 h-5 w-5 shrink-0 text-[#2563EB]" />
                  <div>
                    <h4 className="font-semibold text-[#1C1917]">
                      Zero Maintenance
                    </h4>
                    <p className="text-sm text-[#78716C]">
                      No servers to manage, no databases to back up, no hosting
                      bills to pay.
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
              <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] shadow-2xl transition-transform duration-500 hover:rotate-0 lg:rotate-1">
                <NextImage
                  alt="Code editor showing deployed smart contract"
                  className="w-full object-cover opacity-90 transition-opacity hover:opacity-100"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuARXA6UvVeg_dm7STvvv33ASgUAQz6SwYjqGQttuDOErIq654aflL92zZE-Niw0qsvw-M3uhtLRGMv9Q1ZwaqraRE5_a76mpFAXR236y5mVnr1hX2ni0IfX65APJOzvcr7lOLtfhkOVvkrNxnITYPIWrSHaMikUrvd-Rf42_obMkvQLJLiSpABqj8PiPLzVuJ-89aYQdmOUO3dk1yGx7OVTQMLo4O4ITA2Ls_y67jrFjt3gnWIz-6T_g1h8KXKc8PEnrkce-_Rvs2U"
                  width={800}
                  height={600}
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute right-6 bottom-6 left-6 rounded-xl border border-black/[0.06] bg-[#F8F6F3]/90 p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs tracking-wide text-[#78716C]">
                      App Status
                    </span>
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                      Live
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E7E5E4]">
                    <div className="h-full w-full bg-[#E84142]" />
                  </div>
                  <div className="mt-2 break-all font-mono text-xs text-[#A8A29E]">
                    polar-app-9e2F published and running
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F3] via-[#F8F6F3]/95 to-[#F0EDEA]" />

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
              className="text-display mb-12 text-4xl font-bold text-[#1C1917]"
            >
              Start building today
            </motion.h2>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full overflow-hidden rounded-2xl border border-black/[0.06]"
            >
              <div className="grid items-center md:grid-cols-2">
                <div className="bg-[#1C1917] p-8 text-left md:p-12">
                  <p className="mb-8 text-[#A8A29E]">
                    Build permanent apps with AI-generated code and instant
                    publishing. No infrastructure to set up or maintain.
                  </p>
                  <ul className="mb-8 space-y-4">
                    <li className="flex items-center text-sm text-[#D6D3D1]">
                      <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-[#E84142]" />
                      Zero-config environment
                    </li>
                    <li className="flex items-center text-sm text-[#D6D3D1]">
                      <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-[#2563EB]" />
                      No hosting costs
                    </li>
                    <li className="flex items-center text-sm text-[#D6D3D1]">
                      <CheckCircle2 className="mr-3 h-4 w-4 shrink-0 text-[#D97706]" />
                      One-click publishing
                    </li>
                  </ul>
                  <Link
                    href="/app/new"
                    className="inline-block w-full rounded-lg bg-[#E84142] py-3 text-center font-bold text-white shadow-lg shadow-red-900/25 transition-colors hover:bg-red-500"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/80 to-transparent" />
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
        className="border-t border-black/[0.06] bg-[#EFEDEA] py-10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-[#E84142]" />
              <span className="text-display text-lg font-bold text-[#1C1917]">
                POLAR
              </span>
            </div>
            <p className="text-xs text-[#A8A29E]">
              © 2026 Polar Labs · Powered by Avalanche · Build Games 2026
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
