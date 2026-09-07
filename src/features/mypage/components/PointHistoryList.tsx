"use client";

import { Sparkles } from "lucide-react";
import { useMyPoints, usePointHistory } from "@/features/reward/api/useRewardApi";

function formatDate(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function PointHistoryList() {
  const { data: points } = useMyPoints();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = usePointHistory();
  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-cream-card p-6 text-center">
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Sparkles size={14} strokeWidth={1.5} className="text-forest" />
          누적 포인트
        </span>
        <p className="text-2xl font-semibold text-ink">{(points?.points ?? 0).toLocaleString()}P</p>
      </div>

      {isLoading ? (
        <p className="pt-4 text-center text-sm text-muted">불러오는 중...</p>
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
