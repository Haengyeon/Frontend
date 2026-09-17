"use client";

import { useCourseHistory } from "@/features/course/api/useCourseApi";
import { MATCHING_SERVICE_FEE } from "@/features/matching/mocks";
import { ApiError } from "@/lib/api/client";

// 결제 내역 전용 조회 API가 백엔드에 없어서, "완료된 코스는 양쪽 결제가 끝난 매칭에서만
// 생긴다"는 사실을 이용해 실제 코스 이력(GET /courses/history)에서 결제 내역을 그대로
// 파생시킨다 — 더 이상 mock이 아니라 실제로 다녀온 코스만 나온다.
// 결제 금액은 매칭 1건당 고정값(MATCHING_SERVICE_FEE)이라 안전하게 그대로 쓸 수 있다.
// 이 화면엔 개별 결제 취소 API로 이어지는 진입점이 없어서(paymentId를 모름) "결제 취소"
// 버튼은 넣지 않는다 — 결제 직후 화면(PaymentSummary)에서만 취소를 지원한다.
export default function PaymentHistoryList() {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCourseHistory();
  const items = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return <p className="pt-8 text-center text-sm text-muted">불러오는 중...</p>;
  }

  if (isError) {
    return (
      <p className="pt-8 text-center text-sm text-muted">
        {error instanceof ApiError ? error.message : "결제 내역을 불러오지 못했어요."}
      </p>
    );
  }

  if (items.length === 0) {
    return <p className="pt-8 text-center text-sm text-muted">결제 내역이 없어요.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((course) => (
        <div
          key={course.id}
          className="flex flex-col gap-1 rounded-2xl border border-line bg-cream-card p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">{course.title}</span>
            <span className="rounded-full bg-forest-light px-2.5 py-1 text-xs font-medium text-forest">
              결제완료
            </span>
          </div>
          <span className="text-xs text-muted">
            {course.partner.name}님과의 매칭 · {course.travelDate}
          </span>
          <span className="mt-1 text-base font-semibold text-ink">
            {MATCHING_SERVICE_FEE.toLocaleString()}원
          </span>
        </div>
      ))}

      {hasNextPage ? (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="self-center text-xs text-muted underline disabled:opacity-50"
        >
          {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
        </button>
      ) : null}
    </div>
  );
}
