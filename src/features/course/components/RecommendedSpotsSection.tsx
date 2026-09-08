"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageSquare } from "lucide-react";
import HorizontalScroller from "@/components/ui/HorizontalScroller";
import { useRecommendedSpots } from "@/features/course/api/useCourseApi";
import SpotReviewsSheet from "@/features/course/components/SpotReviewsSheet";
import { extractDistrict } from "@/features/course/lib/address";

export default function RecommendedSpotsSection() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useRecommendedSpots();
  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const [openSpot, setOpenSpot] = useState<{ contentId: string; name: string; address: string } | null>(
    null,
  );

  if (!isLoading && items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 px-6">
      <span className="text-sm font-medium text-ink">추천 관광지</span>
      <div className="-mx-6">
        <HorizontalScroller className="items-start gap-3 px-6 pb-2">
          {isLoading
            ? null
            : items.map((spot) => {
                const district = extractDistrict(spot.address);
                const subtitle = [spot.category, district].filter(Boolean).join(" · ") || spot.address;

                return (
                  <button
                    key={spot.contentId}
                    type="button"
                    onClick={() =>
                      setOpenSpot({ contentId: spot.contentId, name: spot.name, address: spot.address })
                    }
                    className="flex w-36 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-forest-light text-left"
                  >
                    <div className="relative aspect-[3/4] w-full">
                      {spot.imageUrl ? (
                        <Image
                          src={spot.imageUrl}
                          alt={spot.name}
                          fill
                          sizes="144px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-forest-light to-forest/40" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 bg-white p-3">
                      <p className="text-base font-semibold text-ink">{spot.name}</p>
                      <p className="text-xs text-ink/70">{subtitle}</p>
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <MessageSquare size={12} strokeWidth={1.5} />
                        후기 보기
                      </span>
                    </div>
                  </button>
                );
              })}
          {!isLoading && hasNextPage ? (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="flex w-16 shrink-0 items-center justify-center whitespace-nowrap text-xs text-muted underline disabled:opacity-50"
            >
              {isFetchingNextPage ? "..." : "더 보기"}
            </button>
          ) : null}
        </HorizontalScroller>
      </div>

      <SpotReviewsSheet
        contentId={openSpot?.contentId ?? null}
        spotName={openSpot?.name ?? ""}
        address={openSpot?.address ?? ""}
        onClose={() => setOpenSpot(null)}
      />
    </div>
  );
}
