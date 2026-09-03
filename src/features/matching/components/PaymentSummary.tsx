"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, Clover } from "lucide-react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Countdown from "@/components/ui/Countdown";
import InfoRow from "@/features/matching/components/InfoRow";
import { MATCHING_SERVICE_FEE, formatDateLabel, getThemeLabels } from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { useMatchAttempt } from "@/features/matching/api/useMatchingApi";
import { jobCategoryToLocal } from "@/features/matching/api/enumMap";

export default function PaymentSummary() {
  const router = useRouter();
  const { matchAttemptId, themeIds, paymentDeadlineAt, setStatus } = useMatchingDraftStore();
  const { data } = useMatchAttempt(matchAttemptId);
  const partner = data?.partner;

  const handlePay = () => {
    setStatus("confirmed");
    router.push("/home");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-cream-card p-4">
        {partner ? (
          <>
            <Avatar src={partner.fullBodyImageUrl} alt={partner.name} size={48} />
            <div>
              <p className="text-sm font-semibold text-ink">{partner.name}</p>
              <p className="text-xs text-muted">
                {partner.age}세{partner.jobCategory ? ` · ${jobCategoryToLocal(partner.jobCategory)}` : ""}
              </p>
            </div>
          </>
        ) : (
          <div className="h-12 w-12 animate-pulse rounded-full bg-forest/10" />
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
        <InfoRow
          icon={CalendarDays}
          label="여행 날짜"
          value={data?.travelDate ? formatDateLabel(data.travelDate) : "미정"}
        />
        <InfoRow icon={Clover} label="결정된 테마" value={getThemeLabels(themeIds)} />
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
        <Button variant="kakao" className="w-full" onClick={handlePay}>
          카카오페이로 결제하기
        </Button>
      </div>
    </div>
  );
}
