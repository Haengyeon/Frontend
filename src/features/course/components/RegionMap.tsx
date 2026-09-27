"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Info, ChevronDown } from "lucide-react";
import CourseCard from "@/features/course/components/CourseCard";
import RegionColorMap from "@/features/course/components/RegionColorMap";
import CourseExperienceProbe from "@/features/course/components/CourseExperienceProbe";
import HorizontalScroller from "@/components/ui/HorizontalScroller";
import Modal from "@/components/ui/Modal";
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
  // "체험으로 완료"를 갤러리로 나누려면 코스마다 상세를 따로 확인해야 한다(CourseExperienceProbe).
  // 지도(스탬프)는 체험을 반영하지 않는다 — 실제 기록만 채워진다.
  const [isExperienceById, setIsExperienceById] = useState<Record<string, boolean>>({});
  const handleResult = useCallback((courseId: string, isExperience: boolean) => {
    setIsExperienceById((prev) => (prev[courseId] === isExperience ? prev : { ...prev, [courseId]: isExperience }));
  }, []);

  // 아직 상세 조회가 안 끝난 항목은 일단 "실제"로 취급한다 — 목록이 잠깐 비어 보이는 것보다
  // 나중에 체험 다시보기로 옮겨가는 편이 자연스럽다.
  const realItems = items.filter((course) => isExperienceById[course.id] !== true);
  const experienceItems = items.filter((course) => isExperienceById[course.id] === true);

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {items.map((course) => (
        <CourseExperienceProbe key={course.id} courseId={course.id} onResult={handleResult} />
      ))}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-ink">다녀온 지역</span>
            <button
              type="button"
              onClick={() => setIsInfoOpen(true)}
              aria-label="지도 안내"
              className="text-muted"
            >
              <Info size={13} strokeWidth={1.5} />
            </button>
          </div>
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
          <RegionColorMap visitedCodes={visitedCodes} />
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
          <button
            type="button"
            onClick={() => setIsExperienceOpen((prev) => !prev)}
            aria-expanded={isExperienceOpen}
            className="flex items-center gap-1 self-start text-sm font-medium text-muted"
          >
            체험한 코스 다시보기
            <ChevronDown
              size={14}
              strokeWidth={1.5}
              className={`transition-transform ${isExperienceOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isExperienceOpen ? (
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
          ) : null}
        </div>
      ) : null}

      <Modal open={isInfoOpen} onClose={() => setIsInfoOpen(false)}>
        <h3 className="text-base font-semibold text-ink">지도는 실제로 다녀온 곳만 채워져요</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          실제 매칭으로 완료한 코스는 아래 이미지처럼 지도에 스탬프로 남아요. 체험 매칭은
          서비스를 미리 둘러보는 용도라 지도·스탬프에는 반영되지 않아요.
        </p>
        <div className="relative mt-4 aspect-[876/944] w-full overflow-hidden rounded-2xl border border-line">
          <Image src="/map-example.png" alt="다녀온 지역이 일부 채워진 지도 예시" fill sizes="400px" className="object-cover" />
        </div>
      </Modal>
    </div>
  );
}
