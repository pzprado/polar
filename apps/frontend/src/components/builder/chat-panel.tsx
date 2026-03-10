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
    <div className="flex h-full min-h-0 flex-col border-r-0 md:border-r border-white/10 bg-[#0B101B]">
      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold text-white">Chat</h2>
        <p className="text-xs text-[#5c6370]">Describe what you want to build</p>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-4">
        <div className="space-y-4 py-4">
          {messages.length === 0 && !generating && (
            <div className="flex flex-col items-center gap-3 py-12">
              <p className="text-sm text-[#8b919e]">What do you want to build today?</p>
              <div className="flex flex-wrap justify-center gap-2">
                {([
                  { text: "A token for my community", hoverBorder: "hover:border-[#FBBF24]/30", hoverText: "hover:text-[#FBBF24]" },
                  { text: "An NFT collection", hoverBorder: "hover:border-[#60A5FA]/30", hoverText: "hover:text-[#60A5FA]" },
                  { text: "A tipping jar", hoverBorder: "hover:border-[#34D399]/30", hoverText: "hover:text-[#34D399]" },
                ] as const).map((suggestion) => (
                  <button
                    key={suggestion.text}
                    onClick={() => onSendMessage(suggestion.text)}
                    className={`rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#8b919e] transition-colors ${suggestion.hoverBorder} ${suggestion.hoverText}`}
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
                    : "border-l-2 border-[#60A5FA]/30 bg-[#60A5FA]/5 text-[#b8bcc6]"
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

      <div className="border-t border-white/10 p-3">
        <PromptInput onSubmit={onSendMessage} disabled={generating} />
      </div>
    </div>
  );
}
