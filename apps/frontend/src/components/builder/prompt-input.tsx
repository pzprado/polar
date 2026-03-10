"use client";

import { KeyboardEvent, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-[44px] max-h-[120px] resize-none text-sm"
        rows={1}
      />
      <Button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        size="sm"
        className="h-[44px] w-[44px] shrink-0 bg-[#E84142] p-0 text-white hover:bg-[#d13a3b]"
        aria-label="Send prompt"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
