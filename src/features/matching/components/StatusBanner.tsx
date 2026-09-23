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
import { useCurrentCourse } from "@/features/course/api/useCourseApi";
import { matchingStatusToLocal } from "@/features/matching/api/enumMap";
import type { MatchingStatus } from "@/features/matching/types";
import { ApiError } from "@/lib/api/client";

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
  const setIsExperience = useMatchingDraftStore((state) => state.setIsExperience);
  const syncDeadlines = useMatchingDraftStore((state) => state.syncDeadlines);

  // GET /matchings/me를 폴링해서 서버 상태를 로컬 상태에 그대로 반영한다 —
  // "탐색 중 → 매칭 발견" 같은 전환은 더 이상 가짜 타이머가 아니라 실제 서버 응답으로 일어난다.
  const { data, isError, error } = useMyMatching();
  const attemptId = data?.currentAttempt?.id ?? null;
  // WAITING_RESPONSE 하나로는 "내가 아직 응답 안 함(found)"과 "내가 이미 수락하고 상대를
  // 기다리는 중(pending)"을 구분할 수 없어서, 상세 조회의 myResponded로 둘을 나눈다.
  const { data: attempt } = useMatchAttempt(attemptId);
  // 매칭 자체엔 "여행이 끝났다"는 상태가 없다 — CONFIRMED에 계속 머문다. 여행이 끝났는지는
  // 코스 쪽 상태(Course.status)로만 알 수 있어서, confirmed일 때만 코스를 같이 확인한다.
  const { data: currentCourse } = useCurrentCourse();

  useEffect(() => {
    // 코스가 COMPLETED면 무조건 "여행 완료"를 우선한다. 매칭이 완료 처리와 함께(또는 그
    // 직후) endedAt 처리돼서 GET /matchings/me가 404를 내도(체험 코스는 지금 이렇게 된다),
    // data가 없다는 이유로 아래 매칭 기반 분기를 못 타 상태가 옛날 값에 멈춰있으면 안 된다.
    // 단, 캐시에 남은 완료 코스가 "이번" 매칭 시도의 것인지 확인한다 — 새 매칭을 시작한
    // 직후에는 이전 매칭의 COMPLETED 코스가 캐시에 남아있을 수 있어서, matchAttemptId가
    // 다르면(=이전 시도 것이면) 완료 처리를 건너뛰고 아래에서 새 매칭 상태를 반영한다.
    const completedCourseAttemptId = currentCourse?.course?.matchAttemptId;
    const isCompletedForCurrentAttempt =
      currentCourse?.course?.status === "COMPLETED" &&
      (!data ||
        (completedCourseAttemptId != null && completedCourseAttemptId === data.currentAttempt?.id));

    if (isCompletedForCurrentAttempt) {
      setStatus("completed");
      return;
    }

    if (!data) {
      // 매칭이 진짜로 끝나서(예: 코스 완료 처리 시 endedAt까지 정리됨) /matchings/me가
      // 404를 내는데, 보여줄 완료 코스도 이미 24시간 창을 넘겨 캐시에 없는 경우.
      // 이때 아무 것도 안 하면 status가 예전 값("확정"/"완료" 등)에 그대로 멈춰서,
      // 실제로는 매칭이 하나도 없는데 화면은 계속 예전 매칭을 보여주게 된다.
      if (isError && error instanceof ApiError && error.statusCode === 404) {
        setStatus("none");
      }
      return;
    }
    setMatchingId(data.id);
    setMatchAttemptId(attemptId);
    setIsExperience(data.isExperience);
    const baseStatus = matchingStatusToLocal(data.status);
    const resolvedStatus =
      baseStatus === "found" && attempt?.myResponded ? "pending" : baseStatus;
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
  }, [
    data,
    isError,
    error,
    attempt,
    attemptId,
    currentCourse,
    setMatchingId,
    setMatchAttemptId,
    setIsExperience,
    setStatus,
    syncDeadlines,
  ]);

  const Banner = STATUS_BANNERS[status];
  if (Banner) return <Banner />;

  return (
    <div className="mx-6 rounded-3xl border border-line bg-cream-card p-6 text-sm text-muted">
      매칭 상태({status}) 배너는 준비 중입니다.
    </div>
  );
}
