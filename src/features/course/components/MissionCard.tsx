"use client";

import Image from "next/image";
import { Camera, CheckCircle2 } from "lucide-react";
import type { Mission } from "@/features/course/types";

type MissionCardProps = {
  mission: Mission;
  isCaptured: boolean;
  onCapture: () => void;
  comment: string;
  onCommentChange: (comment: string) => void;
};

export default function MissionCard({
  mission,
  isCaptured,
  onCapture,
  comment,
  onCommentChange,
}: MissionCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-forest-light">
          {mission.imageUrl ? (
            <Image
              src={mission.imageUrl}
              alt={mission.placeName}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="flex-1">
          <p className="text-base font-semibold text-ink">{mission.placeName}</p>
          <p className="text-sm text-muted">{mission.location}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-ink/80">{mission.description}</p>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Camera size={16} strokeWidth={1.5} />
            사진 미션
          </span>
          <p className="text-xs leading-relaxed text-muted">{mission.photoMissionHint}</p>
        </div>

        {isCaptured ? (
          <div className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-forest-light px-6 py-4 text-forest">
            <CheckCircle2 size={20} strokeWidth={1.5} />
            <span className="text-sm font-medium">완료!</span>
          </div>
        ) : (
          <label className="flex shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl bg-forest px-6 py-4 text-white focus-within:ring-2 focus-within:ring-forest focus-within:ring-offset-2 focus-within:ring-offset-cream">
            <Camera size={20} strokeWidth={1.5} />
            <span className="text-sm font-medium">사진 촬영하기</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(e) => {
                if (e.target.files?.[0]) onCapture();
              }}
            />
          </label>
        )}
      </div>

      <input
        type="text"
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        maxLength={50}
        placeholder="이 순간을 한 줄로 남겨보세요 (선택)"
        className="rounded-xl border border-line bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-forest focus:outline-none"
      />
    </div>
  );
}
