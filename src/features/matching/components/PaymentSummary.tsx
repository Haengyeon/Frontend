"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, Clover } from "lucide-react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Countdown from "@/components/ui/Countdown";
import InfoRow from "@/features/matching/components/InfoRow";
import {
  MOCK_MATCH_PROFILE,
  MOCK_DECIDED_THEME_IDS,
  MATCHING_SERVICE_FEE,
  formatDateLabel,
  getEarliestCommonDate,
  getThemeLabels,
} from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

export default function PaymentSummary() {
  const router = useRouter();
  const { availableDates, paymentDeadlineAt, setStatus } = useMatchingDraftStore();
  const profile = MOCK_MATCH_PROFILE;

  const matchedDate = getEarliestCommonDate(availableDates, profile.availableDates);
  const isPaymentExpired = paymentDeadlineAt !== null && Date.now() > paymentDeadlineAt;

  const handlePay = () => {
    if (isPaymentExpired) return;
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
          value={matchedDate ? formatDateLabel(matchedDate) : "미정"}
        />
        <InfoRow icon={Clover} label="결정된 테마" value={getThemeLabels(MOCK_DECIDED_THEME_IDS)} />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-cream-card p-5">
        <div className="flex items-center justify-between text-base font-semibold">
          <span className="text-ink">결제 금액 (부가세 포함)</span>
          <span className="text-forest">{MATCHING_SERVICE_FEE.toLocaleString()}원</span>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-2">
        {paymentDeadlineAt ? (
          <p className="text-xs text-muted">
            <Countdown deadlineAt={paymentDeadlineAt} /> 이내에 결제하지 않으면 매칭이 자동으로
            취소돼요.
          </p>
        ) : null}
        <Button
          variant="kakao"
          className="w-full"
          disabled={isPaymentExpired}
          onClick={handlePay}
        >
          {isPaymentExpired ? "결제 시간이 만료됐어요" : "카카오페이로 결제하기"}
        </Button>
      </div>
    </div>
  );
}
