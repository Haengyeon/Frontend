"use client";

import { MapPin } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { useSpotReviews } from "@/features/course/api/useCourseApi";
import { extractDistrict } from "@/features/course/lib/address";

type SpotReviewsSheetProps = {
  contentId: string | null;
  spotName: string;
  address: string;
  onClose: () => void;
};

export default function SpotReviewsSheet({
  contentId,
  spotName,
  address,
  onClose,
}: SpotReviewsSheetProps) {
  const { data, isLoading } = useSpotReviews(contentId);
  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const district = extractDistrict(address);

  return (
    <BottomSheet open={Boolean(contentId)} onClose={onClose} labelledBy="spot-reviews-heading">
      <div className="mb-4 flex flex-col gap-1">
        <h2 id="spot-reviews-heading" className="text-base font-semibold text-ink">
          {spotName} 후기{totalCount > 0 ? ` (${totalCount})` : ""}
        </h2>
        {district ? (
          <span className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={12} strokeWidth={1.5} />
            {district}
          </span>
        ) : null}
      </div>
      <div className="flex max-h-80 flex-col gap-3 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-muted">불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted">아직 후기가 없어요</p>
        ) : (
          items.map((review) => (
            <div key={review.id} className="rounded-2xl border border-line bg-cream p-3 text-sm text-ink">
              {review.content}
            </div>
          ))
        )}
      </div>
    </BottomSheet>
  );
}
