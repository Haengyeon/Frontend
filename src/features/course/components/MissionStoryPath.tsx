import Image from "next/image";
import type { Mission } from "@/features/course/types";

type MissionStoryPathProps = {
  missions: Mission[];
  selectedMissionId: string;
  onSelect: (missionId: string) => void;
};

export default function MissionStoryPath({
  missions,
  selectedMissionId,
  onSelect,
}: MissionStoryPathProps) {
  const total = missions.length;

  return (
    <div className="flex items-center gap-1.5">
      {missions.map((mission) => {
        const isSelected = mission.missionId === selectedMissionId;

        return (
          <button
            key={mission.missionId}
            type="button"
            onClick={() => onSelect(mission.missionId)}
            aria-pressed={isSelected}
            className={`flex min-w-0 flex-col overflow-hidden rounded-2xl ${
              isSelected ? "flex-[2] border-2 border-forest" : "flex-1"
            }`}
          >
            <div className="relative aspect-[3/5] w-full bg-gradient-to-br from-forest-light to-forest/40">
              {mission.imageUrl ? (
                <Image
                  src={mission.imageUrl}
                  alt={mission.placeName}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              ) : null}
              <span className="absolute right-1.5 top-1.5 rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-ink shadow-sm">
                {mission.order}/{total}
              </span>
            </div>

            <div className="bg-white px-2 py-3 text-center">
              {isSelected ? (
                <>
                  <p className="text-base font-semibold text-ink">{mission.placeName}</p>
                  <p className="text-xs text-muted">{mission.location}</p>
                </>
              ) : (
                <p className="truncate text-xs font-medium text-ink">{mission.placeName}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
