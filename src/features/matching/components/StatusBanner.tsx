"use client";

import { useEffect, type ComponentType } from "react";
import NoMatchBanner from "@/features/matching/components/NoMatchBanner";
import SearchingLoader from "@/features/matching/components/SearchingLoader";
import MatchFoundBanner from "@/features/matching/components/MatchFoundBanner";
import MatchPendingBanner from "@/features/matching/components/MatchPendingBanner";
import RetryReadyBanner from "@/features/matching/components/RetryReadyBanner";
import PaymentPendingBanner from "@/features/matching/components/PaymentPendingBanner";
import MatchConfirmedSummary from "@/features/matching/components/MatchConfirmedSummary";
import TripCompleteSummary from "@/features/matching/components/TripCompleteSummary";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";
import { useMyMatching, useMatchAttempt } from "@/features/matching/api/useMatchingApi";
import { matchingStatusToLocal } from "@/features/matching/api/enumMap";
import type { MatchingStatus } from "@/features/matching/types";

const STATUS_BANNERS: Partial<Record<MatchingStatus, ComponentType>> = {
  none: NoMatchBanner,
  searching: SearchingLoader,
  found: MatchFoundBanner,
  pending: MatchPendingBanner,
  retry_ready: RetryReadyBanner,
  payment_pending: PaymentPendingBanner,
  confirmed: MatchConfirmedSummary,
  completed: TripCompleteSummary,
};

export default function StatusBanner() {
  const status = useMatchingDraftStore((state) => state.status);
  const setStatus = useMatchingDraftStore((state) => state.setStatus);
  const setMatchingId = useMatchingDraftStore((state) => state.setMatchingId);
  const setMatchAttemptId = useMatchingDraftStore((state) => state.setMatchAttemptId);
  const syncDeadlines = useMatchingDraftStore((state) => state.syncDeadlines);

  // GET /matchings/me를 폴링해서 서버 상태를 로컬 상태에 그대로 반영한다 —
  // "탐색 중 → 매칭 발견" 같은 전환은 더 이상 가짜 타이머가 아니라 실제 서버 응답으로 일어난다.
  const { data } = useMyMatching();
  const attemptId = data?.currentAttempt?.id ?? null;
  // WAITING_RESPONSE 하나로는 "내가 아직 응답 안 함(found)"과 "내가 이미 수락하고 상대를
  // 기다리는 중(pending)"을 구분할 수 없어서, 상세 조회의 myResponded로 둘을 나눈다.
  const { data: attempt } = useMatchAttempt(attemptId);

  useEffect(() => {
    if (!data) return;
    setMatchingId(data.id);
    setMatchAttemptId(attemptId);
    const baseStatus = matchingStatusToLocal(data.status);
    const resolvedStatus = baseStatus === "found" && attempt?.myResponded ? "pending" : baseStatus;
    setStatus(resolvedStatus);

    // setStatus는 상태가 막 바뀐 시점에만 로컬 추정 만료 시각(12h/6h)을 잡아준다 — 새로고침
    // 등으로 이미 진행 중이던 카운트다운을 다시 읽는 경우엔 서버가 내려준 실제 만료 시각으로
    // 덮어써서, 추정치 때문에 만료 시간이 잘못 연장되어 보이는 일이 없게 한다.
    const respondDeadlineAt = data.currentAttempt?.respondDeadlineAt ?? null;
    const paymentDeadlineAt = attempt?.paymentDeadlineAt ?? data.currentAttempt?.paymentDeadlineAt ?? null;
    if (resolvedStatus === "pending" && respondDeadlineAt) {
      syncDeadlines({ matchDeadlineAt: new Date(respondDeadlineAt).getTime() });
    } else if (resolvedStatus === "payment_pending" && paymentDeadlineAt) {
      syncDeadlines({ paymentDeadlineAt: new Date(paymentDeadlineAt).getTime() });
    }
  }, [data, attempt, attemptId, setMatchingId, setMatchAttemptId, setStatus, syncDeadlines]);

  const Banner = STATUS_BANNERS[status];
  if (Banner) return <Banner />;

  return (
    <div className="mx-6 rounded-3xl border border-line bg-cream-card p-6 text-sm text-muted">
      매칭 상태({status}) 배너는 준비 중입니다.
    </div>
  );
}
