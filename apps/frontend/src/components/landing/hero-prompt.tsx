"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SUGGESTED_PROMPTS } from "@/lib/constants";

export function HeroPrompt() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const submitPrompt = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned) return;
    router.push(`/app/new?prompt=${encodeURIComponent(cleaned)}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitPrompt(prompt);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitPrompt(prompt);
    }
  };

  return (
    <section id="prompt" className="space-y-8 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          What can <span className="text-[#E84142]">Polar</span> build for you?
        </h1>
        <p className="text-base text-gray-600 sm:text-lg">
          Describe your app in plain English. We&apos;ll generate the code and deploy it to Avalanche.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={5}
            placeholder="Describe your web3 app on Avalanche..."
            className="min-h-[132px] resize-none border-0 bg-transparent px-3 py-3 text-base shadow-none focus-visible:ring-0"
          />
          <div className="flex justify-end px-2 pb-1">
            <Button type="submit" className="bg-[#E84142] text-white hover:bg-[#d13a3b]" disabled={!prompt.trim()}>
              Build
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-gray-500">Try one →</span>
          {SUGGESTED_PROMPTS.map((item) => (
            <Button
              key={item.label}
              type="button"
              variant="outline"
              className="rounded-full border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              onClick={() => setPrompt(item.prompt)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </form>
    </section>
  );
}
