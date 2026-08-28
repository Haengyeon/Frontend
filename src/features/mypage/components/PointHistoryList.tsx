import { Sparkles } from "lucide-react";
import { MOCK_POINTS, POINT_HISTORY } from "@/features/mypage/mocks";

export default function PointHistoryList() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-cream-card p-6 text-center">
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Sparkles size={14} strokeWidth={1.5} className="text-forest" />
          누적 포인트
        </span>
        <p className="text-2xl font-semibold text-ink">{MOCK_POINTS.toLocaleString()}P</p>
      </div>

      {POINT_HISTORY.length === 0 ? (
        <p className="pt-4 text-center text-sm text-muted">포인트 내역이 없어요.</p>
      ) : (
        <div className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-cream-card">
          {POINT_HISTORY.map((point) => (
            <div key={point.pointId} className="flex items-center justify-between px-4 py-3.5">
              <div className="flex flex-col">
                <span className="text-sm text-ink">{point.reason}</span>
                <span className="text-xs text-muted">{point.date}</span>
              </div>
              <span className="text-sm font-semibold text-forest">+{point.amount}P</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
