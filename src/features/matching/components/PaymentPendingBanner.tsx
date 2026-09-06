"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Countdown from "@/components/ui/Countdown";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { useMatchAttempt } from "@/features/matching/api/useMatchingApi";

export default function PaymentPendingBanner() {
  const router = useRouter();
  const matchingId = useMatchingDraftStore((state) => state.matchingId);
  const matchAttemptId = useMatchingDraftStore((state) => state.matchAttemptId);
  const paymentDeadlineAt = useMatchingDraftStore((state) => state.paymentDeadlineAt);
  const { data } = useMatchAttempt(matchAttemptId);
  const partner = data?.partner;

  return (
    <div className="mx-6 flex flex-col items-center gap-3 rounded-3xl bg-forest-light p-6 text-center">
      {partner ? (
        <Avatar src={partner.fullBodyImageUrl} alt={partner.name} size={64} />
      ) : (
        <div className="h-16 w-16 animate-pulse rounded-full bg-forest/10" />
      )}

      <p className="text-base font-semibold text-forest">결제를 완료해주세요</p>
      <p className="text-sm text-forest/70">
        {partner ? `${partner.name}님과의 매칭을` : "매칭을"} 확정하려면 결제가 필요해요.
      </p>
      {paymentDeadlineAt ? (
        <p className="text-xs text-forest/60">
          <Countdown deadlineAt={paymentDeadlineAt} /> 이내에 결제하지 않으면 매칭이 자동으로
          취소돼요.
        </p>
      ) : null}

      <Button
        className="mt-2 px-6"
        disabled={!matchingId}
        onClick={() => router.push(`/matching/${matchingId}/payment`)}
      >
        결제하러 가기
      </Button>
    </div>
  );
}
