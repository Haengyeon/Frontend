"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserX } from "lucide-react";
import Chip from "@/components/ui/Chip";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { REPORT_CATEGORIES } from "@/features/mypage/mocks";
import type { ReportCategory } from "@/features/mypage/types";

export default function ReportForm() {
  const router = useRouter();
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [content, setContent] = useState("");
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const canSubmit = category !== null && content.trim().length > 0;

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">신고·문의 유형</span>
        <div className="flex flex-wrap gap-2">
          {REPORT_CATEGORIES.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={category === item}
              onClick={() => setCategory(item)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">내용</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          placeholder="신고하거나 문의하실 내용을 자세히 적어주세요."
          className="resize-none rounded-2xl border border-line bg-cream-card p-4 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none"
        />
      </div>

      {category === "매칭 상대" ? (
        <button
          type="button"
          onClick={() => setBlockModalOpen(true)}
          disabled={blocked}
          className="flex items-center justify-center gap-1.5 rounded-2xl border border-line py-3 text-sm text-muted disabled:opacity-50"
        >
          <UserX size={16} strokeWidth={1.5} />
          {blocked ? "차단 완료" : "이 사용자 차단하기"}
        </button>
      ) : null}

      <Button
        className="mt-auto w-full"
        disabled={!canSubmit}
        onClick={() => router.push("/mypage")}
      >
        제출하기
      </Button>

      <Modal open={blockModalOpen} onClose={() => setBlockModalOpen(false)}>
        <p className="mb-2 text-sm font-semibold text-ink">이 사용자를 차단할까요?</p>
        <p className="mb-4 text-sm text-muted">
          차단하면 상대방과 더 이상 매칭되거나 채팅을 주고받을 수 없어요.
        </p>
        <Button
          className="w-full"
          onClick={() => {
            setBlocked(true);
            setBlockModalOpen(false);
          }}
        >
          차단하기
        </Button>
      </Modal>
    </div>
  );
}
