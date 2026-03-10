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
    <div className="flex h-full min-h-0 flex-col border-r border-white/10 bg-[#0B101B]">
      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold text-white">Chat</h2>
        <p className="text-xs text-[#5c6370]">Describe what you want to build</p>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-4">
        <div className="space-y-4 py-4">
          {messages.length === 0 && !generating && (
            <p className="py-8 text-center text-sm text-[#5c6370]">Send a message to start building</p>
          )}

          {messages.map((message, index) => (
            <div key={`${message.timestamp}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user" ? "bg-[#E84142] text-white" : "bg-white/5 text-[#b8bcc6]"
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
