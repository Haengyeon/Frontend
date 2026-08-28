"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

const LEGAL_DOCS = [
  {
    id: "terms",
    title: "서비스 이용약관",
    content:
      "행연 서비스 이용약관입니다. 매칭 성사 및 결제, 코스 진행에 관한 세부 조항이 여기에 안내됩니다.",
  },
  {
    id: "refund",
    title: "노쇼 환불정책",
    content:
      "매칭 상대가 약속 장소에 나타나지 않는 노쇼가 발생한 경우의 환불 절차와 기준을 안내합니다.",
  },
];

export default function SettingsForm() {
  const router = useRouter();
  const reset = useMatchingDraftStore((state) => state.reset);
  const [notifyEnabled, setNotifyEnabled] = useState(true);
  const [openLegalId, setOpenLegalId] = useState<string | null>(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const handleWithdraw = () => {
    reset();
    router.push("/splash");
  };

  const handleLogout = () => {
    reset();
    router.push("/splash");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="flex items-center justify-between rounded-2xl border border-line bg-cream-card p-4">
        <span className="text-sm text-ink">카카오 알림 수신 동의</span>
        <Toggle checked={notifyEnabled} onChange={setNotifyEnabled} />
      </div>

      <div className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-cream-card">
        {LEGAL_DOCS.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => setOpenLegalId(doc.id)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm text-ink"
          >
            {doc.title}
            <ChevronRight size={16} strokeWidth={1.5} className="text-muted" />
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleLogout}
          className="text-center text-sm text-ink underline underline-offset-2"
        >
          로그아웃
        </button>
        <button
          type="button"
          onClick={() => setIsWithdrawOpen(true)}
          className="text-center text-sm text-muted underline underline-offset-2"
        >
          회원탈퇴
        </button>
      </div>

      {LEGAL_DOCS.map((doc) => (
        <Modal key={doc.id} open={openLegalId === doc.id} onClose={() => setOpenLegalId(null)}>
          <p className="mb-3 text-sm font-medium text-ink">{doc.title}</p>
          <p className="max-h-80 overflow-y-auto text-sm text-ink/80">{doc.content}</p>
        </Modal>
      ))}

      <Modal open={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)}>
        <p className="mb-2 text-sm font-semibold text-ink">정말 탈퇴하시겠어요?</p>
        <p className="mb-4 text-sm text-muted">
          탈퇴하면 프로필, 매칭·결제 내역이 모두 삭제되고 복구할 수 없어요.
        </p>
        <Button className="w-full" onClick={handleWithdraw}>
          탈퇴하기
        </Button>
      </Modal>
    </div>
  );
}
