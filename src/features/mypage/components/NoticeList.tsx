"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { NOTICES } from "@/features/mypage/mocks";

export default function NoticeList() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-cream-card">
      {NOTICES.map((notice) => {
        const isOpen = openId === notice.noticeId;
        return (
          <div key={notice.noticeId}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : notice.noticeId)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
            >
              <div className="flex flex-col">
                <span className="text-sm text-ink">{notice.title}</span>
                <span className="text-xs text-muted">{notice.date}</span>
              </div>
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen ? (
              <p className="px-4 pb-4 text-sm text-ink/80">{notice.content}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
