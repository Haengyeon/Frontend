"use client";

import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { formatPeriod } from "@/features/events/lib/formatPeriod";
import type { Festival } from "@/features/events/types";

type FestivalDetailSheetProps = {
  festival: Festival | null;
  onClose: () => void;
};

export default function FestivalDetailSheet({ festival, onClose }: FestivalDetailSheetProps) {
  return (
    <BottomSheet open={Boolean(festival)} onClose={onClose} labelledBy="festival-detail-heading">
      {festival ? (
        <div className="flex flex-col gap-4">
          <div className="relative mx-auto aspect-[3/4] w-40 overflow-hidden rounded-2xl bg-forest-light">
            <Image
              src={festival.imageUrl}
              alt={festival.name}
              fill
              sizes="160px"
              className="object-contain"
            />
          </div>

          <h2 id="festival-detail-heading" className="text-center text-base font-semibold text-ink">
            {festival.name}
          </h2>

          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-cream p-4">
            <div className="flex items-center gap-2 text-sm text-ink">
              <CalendarDays size={16} strokeWidth={1.5} className="shrink-0 text-forest" />
              {formatPeriod(festival.startDate, festival.endDate)}
            </div>
            <div className="flex items-start gap-2 text-sm text-ink">
              <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-forest" />
              {festival.address}
            </div>
          </div>

          <p className="text-center text-[11px] text-muted">출처: 한국관광공사</p>
        </div>
      ) : null}
    </BottomSheet>
  );
}
