"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Info } from "lucide-react";
import CourseCard from "@/features/course/components/CourseCard";
import RegionColorMap from "@/features/course/components/RegionColorMap";
import ExperienceCellsCollector, {
  type CourseExperienceResult,
} from "@/features/course/components/ExperienceCellsCollector";
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

  // 완료 코스 목록엔 isExperience가 없어서(스펙엔 있다는데 실서버 DTO엔 빠짐), "실제 완료"와
  // "체험으로 완료"를 나누려면 코스마다 상세를 따로 확인해야 한다(ExperienceCellsCollector).
  // 체험은 스탬프가 안 찍혀서(의도적) 지도 카운트(0/229칸 등)엔 안 들어가지만, 지도 색으로는
  // 별도 표시한다 — 숫자는 실제 기록만, 시각적 미리보기는 체험도 포함하는 절충.
  const [courseInfo, setCourseInfo] = useState<Record<string, CourseExperienceResult>>({});
  const handleResult = useCallback((courseId: string, result: CourseExperienceResult) => {
    setCourseInfo((prev) => {
      const existing = prev[courseId];
      if (
        existing &&
        existing.isExperience === result.isExperience &&
        existing.cells.join(",") === result.cells.join(",")
      ) {
        return prev;
      }
      return { ...prev, [courseId]: result };
    });
  }, []);

  const experienceCodes = new Set(
    Object.values(courseInfo).flatMap((info) => info.cells),
  );
  // 아직 상세 조회가 안 끝난 항목은 일단 "실제"로 취급한다 — 목록이 잠깐 비어 보이는 것보다
  // 나중에 체험 다시보기로 옮겨가는 편이 자연스럽다.
  const realItems = items.filter((course) => courseInfo[course.id]?.isExperience !== true);
  const experienceItems = items.filter((course) => courseInfo[course.id]?.isExperience === true);

  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {items.map((course) => (
        <ExperienceCellsCollector key={course.id} courseId={course.id} onResult={handleResult} />
      ))}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-ink">다녀온 지역</span>
            {experienceCodes.size > 0 ? (
              <button
                type="button"
                onClick={() => setShowLegend((prev) => !prev)}
                aria-label="지도 색상 안내"
                className="text-muted"
              >
                <Info size={13} strokeWidth={1.5} />
              </button>
            ) : null}
          </div>
          {stamps ? (
            <span className="text-xs text-muted">
              {stamps.collectedCount}/{stamps.totalCount}칸 · {stamps.regionCount}/{stamps.totalRegionCount}개 시도
            </span>
          ) : null}
        </div>
        {showLegend && experienceCodes.size > 0 ? (
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
          <RegionColorMap visitedCodes={visitedCodes} experienceCodes={experienceCodes} />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-ink">완료한 코스</span>
        {isLoading ? (
          <p className="text-sm text-muted">불러오는 중...</p>
        ) : realItems.length === 0 ? (
          <p className="text-sm text-muted">아직 완료한 코스가 없어요</p>
        ) : (
          <div className="-mx-6">
            <HorizontalScroller className="gap-3 px-6 pb-2">
              {realItems.map((course) => (
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

      {experienceItems.length > 0 ? (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-ink">체험 다시보기</span>
          <div className="-mx-6">
            <HorizontalScroller className="gap-3 px-6 pb-2">
              {experienceItems.map((course) => (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <CourseCard
                    title={course.title}
                    region={`${course.regionLabel} ${course.sigunguNames.join("·")}`.trim()}
                    imageUrl={course.thumbnailUrl ?? ""}
                  />
                </Link>
              ))}
            </HorizontalScroller>
          </div>
        </div>
      ) : null}
    </div>
  );
}
