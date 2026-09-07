"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

type ChatComposerProps = {
  remainingCount: number;
  onSend: (content: string) => Promise<unknown>;
  disabled?: boolean;
};

const MAX_LENGTH = 300;
const MAX_TEXTAREA_HEIGHT = 120;

export default function ChatComposer({ remainingCount, onSend, disabled = false }: ChatComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDisabled = disabled || remainingCount <= 0;

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  };

  const handleSend = () => {
    const content = value.trim();
    if (!content || isDisabled) return;
    onSend(content)
      .then(() => {
        setValue("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
      })
      .catch(() => {
        // 실패 메시지는 ChatRoom이 보여주므로, 여기서는 작성 중인 내용만 보존한다.
      });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-1 p-3">
      <div className="flex items-end gap-2 rounded-2xl border border-line bg-cream-card px-4 py-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            resize(e.target);
          }}
          onKeyDown={handleKeyDown}
          maxLength={MAX_LENGTH}
          disabled={isDisabled}
          placeholder={remainingCount <= 0 ? "메시지를 모두 사용했어요" : "메시지 입력..."}
          className="max-h-[120px] flex-1 resize-none bg-transparent py-1 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:outline-2 focus-visible:outline-forest disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isDisabled || !value.trim()}
          aria-label="전송"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-white disabled:opacity-40"
        >
          <Send size={14} strokeWidth={1.5} />
        </button>
      </div>
      <span className="self-end pr-1 text-[11px] text-muted">
        {value.length}/{MAX_LENGTH} · 남은 메시지 {remainingCount}회
      </span>
    </div>
  );
}
