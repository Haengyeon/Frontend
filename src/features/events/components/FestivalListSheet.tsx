"use client";

import Image from "next/image";
import BottomSheet from "@/components/ui/BottomSheet";
import { formatPeriod } from "@/features/events/lib/formatPeriod";
import type { Festival } from "@/features/events/types";

type FestivalListSheetProps = {
  open: boolean;
  festivals: Festival[];
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => void;
  onSelect: (festival: Festival) => void;
  onClose: () => void;
};

export default function FestivalListSheet({
  open,
  festivals,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  onSelect,
  onClose,
}: FestivalListSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} labelledBy="festival-list-heading">
      <h2 id="festival-list-heading" className="mb-4 text-base font-semibold text-ink">
        전국의 축제 · 공연 · 행사
      </h2>
      <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
        {festivals.map((festival) => (
          <button
            key={festival.contentId}
            type="button"
            onClick={() => onSelect(festival)}
            className="flex items-center gap-3 rounded-xl border border-line p-2 text-left"
          >
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-forest-light">
              <Image src={festival.imageUrl} alt={festival.name} fill sizes="48px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-semibold text-ink">{festival.name}</p>
              <p className="text-xs text-muted">{formatPeriod(festival.startDate, festival.endDate)}</p>
            </div>
          </button>
        ))}
        {hasNextPage ? (
          <button
            type="button"
            onClick={onFetchNextPage}
            disabled={isFetchingNextPage}
            className="self-center py-2 text-xs text-muted underline disabled:opacity-50"
          >
            {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
          </button>
        ) : null}
      </div>
    </BottomSheet>
  );
}
