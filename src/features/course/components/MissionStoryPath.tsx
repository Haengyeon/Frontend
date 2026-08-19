import Image from "next/image";
import { Check } from "lucide-react";
import type { Mission } from "@/features/course/types";

type MissionStoryPathProps = {
  missions: Mission[];
  selectedMissionId: string;
  completedMissionIds: string[];
  onSelect: (missionId: string) => void;
};

export default function MissionStoryPath({
  missions,
  selectedMissionId,
  completedMissionIds,
  onSelect,
}: MissionStoryPathProps) {
  const total = missions.length;

  return (
    <div className="flex items-end gap-1.5 pt-2">
      {missions.map((mission) => {
        const isSelected = mission.missionId === selectedMissionId;
        const grow = isSelected ? "flex-[2]" : "flex-1";

        return (
          <button
            key={mission.missionId}
            type="button"
            onClick={() => onSelect(mission.missionId)}
            aria-pressed={isSelected}
            className={`flex min-w-0 flex-col items-center gap-1.5 ${grow}`}
          >
            <div
              className={`relative aspect-[3/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-forest-light to-forest/40 ${
                isSelected ? "ring-2 ring-forest ring-offset-2 ring-offset-cream" : ""
              }`}
            >
              {mission.imageUrl ? (
                <Image
                  src={mission.imageUrl}
                  alt={mission.placeName}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              ) : null}
              <span className="absolute left-1.5 top-1.5 rounded-full bg-forest px-2 py-0.5 text-xs font-medium text-white">
                {mission.order}/{total}
              </span>
              {completedMissionIds.includes(mission.missionId) ? (
                <span className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-forest text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              ) : null}
            </div>
            <span className="w-full truncate text-center text-xs text-muted">
              {mission.placeName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
