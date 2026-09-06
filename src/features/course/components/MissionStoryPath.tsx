import Image from "next/image";
import type { CourseSpot } from "@/features/course/api/types";

type MissionStoryPathProps = {
  spots: CourseSpot[];
  selectedSpotId: string;
  onSelect: (spotId: string) => void;
};

export default function MissionStoryPath({ spots, selectedSpotId, onSelect }: MissionStoryPathProps) {
  const total = spots.length;

  return (
    <div className="flex items-center gap-1.5">
      {spots.map((spot) => {
        const isSelected = spot.id === selectedSpotId;

        return (
          <button
            key={spot.id}
            type="button"
            onClick={() => onSelect(spot.id)}
            aria-pressed={isSelected}
            className={`flex min-w-0 flex-col overflow-hidden rounded-2xl ${
              isSelected ? "flex-[2] border-2 border-forest" : "flex-1"
            }`}
          >
            <div className="relative aspect-[3/5] w-full bg-gradient-to-br from-forest-light to-forest/40">
              {spot.imageUrl ? (
                <Image
                  src={spot.imageUrl}
                  alt={spot.name}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              ) : null}
              <span className="absolute right-1.5 top-1.5 rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-ink shadow-sm">
                {spot.order}/{total}
              </span>
            </div>

            <div className="bg-white px-2 py-3 text-center">
              {isSelected ? (
                <>
                  <p className="text-base font-semibold text-ink">{spot.name}</p>
                  <p className="text-xs text-muted">{spot.sigunguName ?? spot.address}</p>
                </>
              ) : (
                <p className="truncate text-xs font-medium text-ink">{spot.name}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
