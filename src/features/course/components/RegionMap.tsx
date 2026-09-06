"use client";

import Link from "next/link";
import CourseCard from "@/features/course/components/CourseCard";
import RegionColorMap from "@/features/course/components/RegionColorMap";
import HorizontalScroller from "@/components/ui/HorizontalScroller";
import { useCourseHistory, useVisitedDistrictCodes } from "@/features/course/api/useCourseApi";

export default function RegionMap() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useCourseHistory();
  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const visitedCodes = useVisitedDistrictCodes(items.map((item) => item.id));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-ink">다녀온 지역</span>
        <RegionColorMap visitedCodes={visitedCodes} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-ink">완료한 코스</span>
        {isLoading ? (
          <p className="text-sm text-muted">불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted">아직 완료한 코스가 없어요</p>
        ) : (
          <div className="-mx-6">
            <HorizontalScroller className="gap-3 px-6 pb-2">
              {items.map((course) => (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <CourseCard
                    title={course.title}
                    region={`${course.regionLabel} ${course.sigunguNames.join("·")}`.trim()}
                    imageUrl={course.thumbnailUrl ?? ""}
                  />
                </Link>
              ))}
              {hasNextPage ? (
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="shrink-0 self-center whitespace-nowrap text-xs text-muted underline disabled:opacity-50"
                >
                  {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
                </button>
              ) : null}
            </HorizontalScroller>
          </div>
        )}
      </div>
    </div>
  );
}
