"use client";

import Avatar from "@/components/ui/Avatar";
import { useMyReports, useMyBlocks } from "@/features/safety/api/useSafetyApi";
import type { ReportStatus } from "@/features/safety/api/types";
import { ApiError } from "@/lib/api/client";

const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: "검토 대기",
  REVIEWED: "검토 중",
  RESOLVED: "처리 완료",
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function SafetyHistoryList() {
  const {
    data: reportData,
    isLoading: isReportsLoading,
    isError: isReportsError,
    error: reportsError,
    refetch: refetchReports,
  } = useMyReports();
  const {
    data: blockData,
    isLoading: isBlocksLoading,
    isError: isBlocksError,
    error: blocksError,
    refetch: refetchBlocks,
  } = useMyBlocks();
  const reports = reportData?.items ?? [];
  const blocks = blockData?.items ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-ink">내 신고 내역</span>
        {isReportsLoading ? (
          <p className="text-sm text-muted">불러오는 중...</p>
        ) : isReportsError ? (
          <div className="flex flex-col items-center gap-2 py-4 text-sm text-muted">
            <p>{reportsError instanceof ApiError ? reportsError.message : "신고 내역을 불러오지 못했어요."}</p>
            <button
              type="button"
              onClick={() => refetchReports()}
              className="rounded-full border border-line px-4 py-2 text-xs text-ink"
            >
              다시 시도
            </button>
          </div>
        ) : reports.length === 0 ? (
          <p className="text-sm text-muted">신고한 내역이 없어요.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-cream-card">
            {reports.map((report) => (
              <div key={report.reportId} className="flex items-center gap-3 px-4 py-3.5">
                <Avatar
                  src={report.reportedUser.profileImageUrl || undefined}
                  alt={report.reportedUser.name}
                  size={40}
                />
                <div className="flex-1">
                  <p className="text-sm text-ink">
                    {report.reportedUser.name} · {report.reason}
                  </p>
                  <p className="text-xs text-muted">{formatDate(report.createdAt)}</p>
                </div>
                <span className="shrink-0 rounded-full bg-forest-light px-2.5 py-1 text-xs text-forest">
                  {STATUS_LABELS[report.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-ink">내 차단 목록</span>
        {isBlocksLoading ? (
          <p className="text-sm text-muted">불러오는 중...</p>
        ) : isBlocksError ? (
          <div className="flex flex-col items-center gap-2 py-4 text-sm text-muted">
            <p>{blocksError instanceof ApiError ? blocksError.message : "차단 목록을 불러오지 못했어요."}</p>
            <button
              type="button"
              onClick={() => refetchBlocks()}
              className="rounded-full border border-line px-4 py-2 text-xs text-ink"
            >
              다시 시도
            </button>
          </div>
        ) : blocks.length === 0 ? (
          <p className="text-sm text-muted">차단한 상대가 없어요.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-cream-card">
            {blocks.map((block) => (
              <div key={block.blockId} className="flex items-center gap-3 px-4 py-3.5">
                <Avatar
                  src={block.blockedUser.profileImageUrl || undefined}
                  alt={block.blockedUser.name}
                  size={40}
                />
                <div className="flex-1">
                  <p className="text-sm text-ink">{block.blockedUser.name}</p>
                  <p className="text-xs text-muted">{formatDate(block.createdAt)} 차단</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
