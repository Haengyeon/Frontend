"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, Clover } from "lucide-react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import InfoRow from "@/features/matching/components/InfoRow";
import {
  MOCK_MATCH_PROFILE,
  MATCHING_SERVICE_FEE,
  REGIONAL_FUND_FEE,
  formatDateLabel,
  getThemeLabels,
} from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

export default function PaymentSummary() {
  const router = useRouter();
  const { availableDates, themeIds, setStatus } = useMatchingDraftStore();
  const profile = MOCK_MATCH_PROFILE;

  const earliestDate = [...availableDates].sort()[0];
  const total = MATCHING_SERVICE_FEE + REGIONAL_FUND_FEE;

  const handlePay = () => {
    setStatus("confirmed");
    router.push("/home");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream-card p-4">
        <Avatar src={profile.photoUrl} alt={profile.name} size={48} />
        <div>
          <p className="text-sm font-semibold text-ink">{profile.name}</p>
          <p className="text-xs text-muted">
            {profile.age}세 · {profile.job}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
        <InfoRow
          icon={CalendarDays}
          label="여행 날짜"
          value={earliestDate ? formatDateLabel(earliestDate) : "미정"}
        />
        <InfoRow icon={Clover} label="선택한 테마" value={getThemeLabels(themeIds) || "미정"} />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-cream-card p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">매칭 서비스 이용료</span>
          <span className="text-ink">{MATCHING_SERVICE_FEE.toLocaleString()}원</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">지역진흥기금</span>
          <span className="text-ink">{REGIONAL_FUND_FEE.toLocaleString()}원</span>
        </div>
        <div className="h-px bg-line" />
        <div className="flex items-center justify-between text-base font-semibold">
          <span className="text-ink">총 결제 금액</span>
          <span className="text-forest">{total.toLocaleString()}원</span>
        </div>
        <p className="text-xs text-muted">
          결제 금액에는 지역진흥기금이 포함되어 있어요. 만남이 지역 경제에도 기여합니다.
        </p>
      </div>

      <div className="mt-auto">
        <Button variant="kakao" className="w-full" onClick={handlePay}>
          카카오페이로 결제하기
        </Button>
      </div>
    </div>
  );
}
