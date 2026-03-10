"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/lib/types";
import { GenerationStatus } from "./generation-status";
import { PromptInput } from "./prompt-input";

interface ChatPanelProps {
  messages: ChatMessage[];
  generating: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatPanel({ messages, generating, onSendMessage }: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, generating]);

  return (
    <div className="flex h-full min-h-0 flex-col border-r-0 md:border-r border-black/[0.06] bg-[#F8F6F3]">
      <div className="border-b border-black/[0.06] px-4 py-3">
        <h2 className="text-sm font-semibold text-[#1C1917]">Chat</h2>
        <p className="text-xs text-[#A8A29E]">Describe what you want to build</p>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-4">
        <div className="space-y-4 py-4">
          {messages.length === 0 && !generating && (
            <div className="flex flex-col items-center gap-3 py-12">
              <p className="text-sm text-[#78716C]">What do you want to build today?</p>
              <div className="flex flex-wrap justify-center gap-2">
                {([
                  { text: "A rewards program", hoverBorder: "hover:border-[#D97706]/30", hoverText: "hover:text-[#D97706]" },
                  { text: "A fan membership", hoverBorder: "hover:border-[#2563EB]/30", hoverText: "hover:text-[#2563EB]" },
                  { text: "A tipping page", hoverBorder: "hover:border-[#059669]/30", hoverText: "hover:text-[#059669]" },
                ] as const).map((suggestion) => (
                  <button
                    key={suggestion.text}
                    onClick={() => onSendMessage(suggestion.text)}
                    className={`rounded-full border border-black/[0.06] bg-black/[0.03] px-3 py-1.5 text-xs text-[#78716C] transition-colors ${suggestion.hoverBorder} ${suggestion.hoverText}`}
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={`${message.timestamp}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-[#E84142] text-white"
                    : "border-l-2 border-[#2563EB]/20 bg-[#2563EB]/[0.04] text-[#57534E]"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {generating && <GenerationStatus />}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-black/[0.06] p-3">
        <PromptInput onSubmit={onSendMessage} disabled={generating} />
      </div>
    </div>
  );
}
