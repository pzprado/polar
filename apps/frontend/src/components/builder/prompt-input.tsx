"use client";

import { KeyboardEvent, useState } from "react";
import { Send } from "lucide-react";
import { motion } from "motion/react";

interface PromptInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function PromptInput({
  onSubmit,
  disabled = false,
  placeholder = "Describe what you want to build...",
}: PromptInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-[44px] max-h-[120px] flex-1 resize-none rounded-lg border border-black/[0.06] bg-black/[0.02] px-3 py-2.5 text-sm text-[#1C1917] placeholder-[#A8A29E] focus-visible:outline-none disabled:opacity-50"
        rows={1}
      />
      <motion.button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        whileHover={!disabled && value.trim() ? { scale: 1.05 } : undefined}
        whileTap={!disabled && value.trim() ? { scale: 0.92 } : undefined}
        transition={{ duration: 0.12 }}
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg bg-[#E84142] text-white transition-colors hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Send prompt"
        type="button"
      >
        <Send className="h-4 w-4" />
      </motion.button>
    </div>
  );
}
