"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Chip from "@/components/ui/Chip";
import Button from "@/components/ui/Button";
import { REPORT_CATEGORIES } from "@/features/mypage/mocks";
import { useCreateReport } from "@/features/safety/api/useSafetyApi";
import type { ReportReasonCode } from "@/features/safety/api/types";
import { ApiError } from "@/lib/api/client";
import type { ReportCategory } from "@/features/mypage/types";

const REASON_LABELS: Record<ReportReasonCode, string> = {
  INAPPROPRIATE_PROFILE: "부적절한 프로필",
  NO_SHOW: "노쇼",
  ABUSE_HARASSMENT: "폭언·희롱",
  SEXUAL_HARASSMENT: "성희롱·성적 불쾌감",
  SUSPECTED_FRAUD: "사기 의심",
  OTHER: "기타",
};

const REASON_CODES = Object.keys(REASON_LABELS) as ReportReasonCode[];
const MAX_DESCRIPTION_LENGTH = 500;

function PartnerReportForm({ matchAttemptId, partnerName }: { matchAttemptId: string; partnerName: string }) {
  const router = useRouter();
  const createReport = useCreateReport();
  const [reasonCode, setReasonCode] = useState<ReportReasonCode | null>(null);
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = reasonCode !== null && !createReport.isPending;

  const handleSubmit = () => {
    if (!reasonCode) return;
    setErrorMessage(null);
    createReport.mutate(
      { matchAttemptId, reasonCode, description: description.trim() || undefined },
      { onError: (error) => setErrorMessage(error instanceof ApiError ? error.message : "신고 접수에 실패했어요.") },
    );
  };

  if (createReport.isSuccess) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-base font-semibold text-ink">신고가 접수됐어요.</p>
        <p className="text-sm text-muted">운영자 검토 후 처리 결과를 안내드릴게요.</p>
        <Button className="w-full" onClick={() => router.back()}>
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <p className="text-sm text-ink">
        <span className="font-semibold">{partnerName}</span>님을 신고합니다.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">신고 사유</span>
        <div className="flex flex-wrap gap-2">
          {REASON_CODES.map((code) => (
            <Chip
              key={code}
              label={REASON_LABELS[code]}
              selected={reasonCode === code}
              onClick={() => setReasonCode(code)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">상세 사유 (선택)</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          maxLength={MAX_DESCRIPTION_LENGTH}
          placeholder="어떤 일이 있었는지 자세히 적어주세요."
          className="resize-none rounded-2xl border border-line bg-cream-card p-4 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none"
        />
      </div>

      {errorMessage ? <p className="text-center text-sm text-red-500">{errorMessage}</p> : null}

      <Button className="mt-auto w-full" disabled={!canSubmit} onClick={handleSubmit}>
        {createReport.isPending ? "접수 중..." : "신고 접수하기"}
      </Button>
    </div>
  );
}

function GeneralInquiryForm() {
  const router = useRouter();
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [content, setContent] = useState("");

  const isPartnerCategory = category === "매칭 상대";
  const canSubmit = category !== null && !isPartnerCategory && content.trim().length > 0;

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">신고·문의 유형</span>
        <div className="flex flex-wrap gap-2">
          {REPORT_CATEGORIES.map((item) => (
            <Chip key={item} label={item} selected={category === item} onClick={() => setCategory(item)} />
          ))}
        </div>
      </div>

      {isPartnerCategory ? (
        <p className="text-sm text-muted">
          매칭 상대 신고는 채팅방 상단의 신고 아이콘을 눌러 접수해주세요.
        </p>
      ) : (
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
      )}

      <Button className="mt-auto w-full" disabled={!canSubmit} onClick={() => router.push("/mypage")}>
        제출하기
      </Button>
    </div>
  );
}

export default function ReportForm() {
  const searchParams = useSearchParams();
  const matchAttemptId = searchParams.get("matchAttemptId");
  const partnerName = searchParams.get("partnerName");

  if (matchAttemptId && partnerName) {
    return <PartnerReportForm matchAttemptId={matchAttemptId} partnerName={partnerName} />;
  }

  return <GeneralInquiryForm />;
}
