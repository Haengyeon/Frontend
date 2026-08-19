"use client";

import { useState } from "react";
import { MapPin, Camera, CheckCircle2 } from "lucide-react";
import type { Mission } from "@/features/course/types";

type MissionCardProps = {
  mission: Mission;
};

export default function MissionCard({ mission }: MissionCardProps) {
  const [isCaptured, setIsCaptured] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-ink">{mission.placeName}</p>
        {mission.location ? (
          <span className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={13} strokeWidth={1.5} />
            {mission.location}
          </span>
        ) : null}
      </div>

      <p className="text-sm leading-relaxed text-ink/80">{mission.description}</p>

      <div className="flex items-center justify-between gap-3 rounded-xl bg-forest-light p-4">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-sm font-medium text-forest">
            <Camera size={16} strokeWidth={1.5} />
            사진 미션
          </span>
          <p className="text-xs text-forest/70">인증샷을 남겨서 소중한 추억을 만들어보세요.</p>
        </div>

        {isCaptured ? (
          <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-forest">
            <CheckCircle2 size={16} strokeWidth={1.5} />
            완료!
          </span>
        ) : (
          <label className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-forest px-4 text-sm font-medium text-white">
            <Camera size={16} strokeWidth={1.5} />
            사진 촬영하기
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) setIsCaptured(true);
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}
