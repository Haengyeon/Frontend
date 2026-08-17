"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { MOCK_MATCHING_ID, MOCK_MATCH_PROFILE } from "@/features/matching/mocks";

export default function PaymentPendingBanner() {
  const router = useRouter();
  const profile = MOCK_MATCH_PROFILE;

  return (
    <div className="mx-6 flex flex-col items-center gap-3 rounded-3xl bg-forest-light p-6 text-center">
      <Avatar src={profile.photoUrl} alt={profile.name} size={64} />

      <p className="text-base font-semibold text-forest">결제를 완료해주세요</p>
      <p className="text-sm text-forest/70">
        {profile.name}님과의 매칭을 확정하려면 결제가 필요해요.
      </p>

      <Button
        className="mt-2 px-6"
        onClick={() => router.push(`/matching/${MOCK_MATCHING_ID}/payment`)}
      >
        결제하러 가기
      </Button>
    </div>
  );
}
