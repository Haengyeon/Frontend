"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type ChatComposerProps = {
  limited: boolean;
  onSend: (content: string) => void;
  disabled?: boolean;
};

const MAX_LENGTH = 300;

export default function ChatComposer({ limited, onSend, disabled = false }: ChatComposerProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const content = value.trim();
    if (!content || disabled) return;
    onSend(content);
    setValue("");
  };

  return (
    <div className="flex flex-col gap-1 p-3">
      <div className="flex items-center gap-2 rounded-full border border-line bg-cream-card px-4 py-1.5">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          maxLength={limited ? MAX_LENGTH : undefined}
          disabled={disabled}
          placeholder="메시지 입력..."
          className="h-8 flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="전송"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-white disabled:opacity-40"
        >
          <Send size={14} strokeWidth={1.5} />
        </button>
      </div>
      {limited ? (
        <span className="self-end pr-1 text-[11px] text-muted">
          {value.length}/{MAX_LENGTH}
        </span>
      ) : null}
    </div>
  );
}
