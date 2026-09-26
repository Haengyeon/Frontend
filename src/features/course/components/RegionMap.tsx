"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import CourseCard from "@/features/course/components/CourseCard";
import RegionColorMap from "@/features/course/components/RegionColorMap";
import ExperienceCellsCollector from "@/features/course/components/ExperienceCellsCollector";
import HorizontalScroller from "@/components/ui/HorizontalScroller";
import { useCourseHistory } from "@/features/course/api/useCourseApi";
import { useStamps } from "@/features/reward/api/useRewardApi";
import { ApiError } from "@/lib/api/client";

export default function RegionMap() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useCourseHistory();
  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const { data: stamps, isError: isStampsError, error: stampsError, refetch: refetchStamps } = useStamps();
  const visitedCodes = new Set(
    stamps?.stamps.flatMap((stamp) => stamp.mapSigunguCodes) ?? [],
  );

  // 체험 매칭 완료 코스는 스탬프가 안 찍혀서(의도적) 지도에 안 잡힌다 — 목록엔
  // isExperience가 없어서 코스마다 상세를 따로 확인해야 안다(ExperienceCellsCollector).
  // 실제 스탬프와는 다른 색으로 구분해서 보여준다.
  const [experienceCellsByCourse, setExperienceCellsByCourse] = useState<Record<string, string[]>>({});
  const handleExperienceCells = useCallback((courseId: string, cells: string[]) => {
    setExperienceCellsByCourse((prev) =>
      prev[courseId]?.join(",") === cells.join(",") ? prev : { ...prev, [courseId]: cells },
    );
  }, []);
  const experienceCodes = new Set(Object.values(experienceCellsByCourse).flat());

  return (
    <div className="flex flex-col gap-8">
      {items.map((course) => (
        <ExperienceCellsCollector key={course.id} courseId={course.id} onCells={handleExperienceCells} />
      ))}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink">다녀온 지역</span>
          {stamps ? (
            <span className="text-xs text-muted">
              {stamps.collectedCount}/{stamps.totalCount}칸 · {stamps.regionCount}/{stamps.totalRegionCount}개 시도
            </span>
          ) : null}
        </div>
        {isStampsError ? (
          <div className="flex flex-col items-center gap-2 py-6 text-sm text-muted">
            <p>{stampsError instanceof ApiError ? stampsError.message : "지역 정보를 불러오지 못했어요."}</p>
            <button
              type="button"
              onClick={() => refetchStamps()}
              className="rounded-full border border-line px-4 py-2 text-xs text-ink"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <>
            <RegionColorMap visitedCodes={visitedCodes} experienceCodes={experienceCodes} />
            {experienceCodes.size > 0 ? (
              <div className="flex items-center gap-4 text-[11px] text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-forest" />
                  실제로 다녀온 곳
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-forest/45" />
                  체험으로 다녀온 곳
                </span>
              </div>
            ) : null}
          </>
        )}
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
