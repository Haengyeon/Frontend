"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Heart } from "lucide-react";
import { MOCK_MATCHING_ID, MOCK_MATCH_PROFILE } from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

export default function MatchProfileCard() {
  const router = useRouter();
  const setStatus = useMatchingDraftStore((state) => state.setStatus);
  const profile = MOCK_MATCH_PROFILE;

  const handleReject = () => {
    setStatus("searching");
    router.push("/home");
  };

  const handleAccept = () => {
    // 실제로는 상대 응답을 기다려 pending → 결제 대기로 넘어가지만,
    // 아직 상대측 로직이 없어 양쪽 다 수락했다고 가정하고 바로 결제 화면으로 이동한다.
    setStatus("payment_pending");
    router.push(`/matching/${MOCK_MATCHING_ID}/payment`);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br from-forest-light to-forest/50">
        {profile.photoUrl ? (
          <Image src={profile.photoUrl} alt={profile.name} fill sizes="400px" className="object-cover" />
        ) : null}

        <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-xs text-ink">
          최근 접속
        </span>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 pt-12">
          <p className="text-lg font-semibold text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.4))]">
            {profile.name}{" "}
            <span className="text-sm font-normal text-white/85">
              {profile.age}세 · {profile.job}
            </span>
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.interestTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/25 px-2.5 py-1 text-xs text-white backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-sm leading-relaxed text-ink">{profile.bio}</p>

      <div className="mt-auto flex items-center justify-center gap-8">
        <button
          type="button"
          onClick={handleReject}
          className="flex flex-col items-center gap-1.5 text-muted"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-cream-card">
            <X size={24} strokeWidth={1.5} />
          </span>
          <span className="text-xs">거절</span>
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="flex flex-col items-center gap-1.5 text-forest"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white">
            <Heart size={24} strokeWidth={1.5} fill="currentColor" />
          </span>
          <span className="text-xs">수락</span>
        </button>
      </div>
    </div>
  );
}
