"use client";

import { Sparkles } from "lucide-react";
import { useMyPoints, usePointHistory } from "@/features/reward/api/useRewardApi";
import { ApiError } from "@/lib/api/client";

function formatDate(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function PointHistoryList() {
  const { data: points, isError: isPointsError, error: pointsError, refetch: refetchPoints } = useMyPoints();
  const {
    data,
    isLoading,
    isError: isHistoryError,
    error: historyError,
    refetch: refetchHistory,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePointHistory();
  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const isError = isPointsError || isHistoryError;
  const activeError = isPointsError ? pointsError : historyError;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-cream-card p-6 text-center">
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Sparkles size={14} strokeWidth={1.5} className="text-forest" />
          누적 포인트
        </span>
        <p className="text-2xl font-semibold text-ink">
          {isPointsError ? "-" : `${(points?.points ?? 0).toLocaleString()}P`}
        </p>
      </div>

      {isLoading ? (
        <p className="pt-4 text-center text-sm text-muted">불러오는 중...</p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 pt-4 text-center text-sm text-muted">
          <p>{activeError instanceof ApiError ? activeError.message : "포인트 정보를 불러오지 못했어요."}</p>
          <button
            type="button"
            onClick={() => {
              if (isPointsError) refetchPoints();
              if (isHistoryError) refetchHistory();
            }}
            className="rounded-full border border-line px-4 py-2 text-xs text-ink"
          >
            다시 시도
          </button>
        </div>
      ) : items.length === 0 ? (
        <p className="pt-4 text-center text-sm text-muted">포인트 내역이 없어요.</p>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-cream-card">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3.5">
                <div className="flex flex-col">
                  <span className="text-sm text-ink">{item.reason}</span>
                  <span className="text-xs text-muted">{formatDate(item.createdAt)}</span>
                </div>
                <span className={`text-sm font-semibold ${item.amount >= 0 ? "text-forest" : "text-muted"}`}>
                  {item.amount >= 0 ? "+" : ""}
                  {item.amount.toLocaleString()}P
                </span>
              </div>
            ))}
          </div>
          {hasNextPage ? (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="self-center text-xs text-muted underline underline-offset-2 disabled:opacity-50"
            >
              {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
