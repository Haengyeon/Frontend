"use client";

import { useEffect, type ComponentType } from "react";
import NoMatchBanner from "@/features/matching/components/NoMatchBanner";
import SearchingLoader from "@/features/matching/components/SearchingLoader";
import MatchFoundBanner from "@/features/matching/components/MatchFoundBanner";
import PaymentPendingBanner from "@/features/matching/components/PaymentPendingBanner";
import MatchConfirmedSummary from "@/features/matching/components/MatchConfirmedSummary";
import TripCompleteSummary from "@/features/matching/components/TripCompleteSummary";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import type { MatchingStatus } from "@/features/matching/types";

const SEARCHING_DELAY_MS = 2500;

const STATUS_BANNERS: Partial<Record<MatchingStatus, ComponentType>> = {
  none: NoMatchBanner,
  searching: SearchingLoader,
  found: MatchFoundBanner,
  payment_pending: PaymentPendingBanner,
  confirmed: MatchConfirmedSummary,
  completed: TripCompleteSummary,
};

export default function StatusBanner() {
  const status = useMatchingDraftStore((state) => state.status);
  const setStatus = useMatchingDraftStore((state) => state.setStatus);

  useEffect(() => {
    if (status !== "searching") return;
    const timer = setTimeout(() => setStatus("found"), SEARCHING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [status, setStatus]);

  const Banner = STATUS_BANNERS[status];
  if (Banner) return <Banner />;

  return (
    <div className="mx-6 rounded-3xl border border-line bg-cream-card p-6 text-sm text-muted">
      매칭 상태({status}) 배너는 준비 중입니다.
    </div>
  );
}
