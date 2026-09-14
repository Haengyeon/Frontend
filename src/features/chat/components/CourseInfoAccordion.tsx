"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MapPin, Clover, ArrowRight } from "lucide-react";
import { useCurrentCourse, useCourseDetail } from "@/features/course/api/useCourseApi";

type CourseInfoAccordionProps = {
  matchAttemptId: string;
};

export default function CourseInfoAccordion({ matchAttemptId }: CourseInfoAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useCurrentCourse();
  // useCurrentCourse는 "현재 진행중인 코스" 하나만 내려주고 채팅방별 코스 조회 API는
  // 아직 없다 — 이 방이 그 코스의 방이 맞는지 matchAttemptId로 대조해서, 종료된
  // 과거 채팅방에 무관한 최신 코스 정보가 뜨는 걸 막는다.
  const course = data?.course?.matchAttemptId === matchAttemptId ? data.course : undefined;
  // 코스가 공개(FULL)됐을 때만 방문 장소 목록을 알 수 있다 — LOCKED/PREVIEW 응답엔 spots가 없다.
  const { data: detail } = useCourseDetail(course?.id ?? null);
  const spots = detail?.viewType === "FULL" ? detail.spots : null;

  if (!course) return null;

  const regionLabel = `${course.regionLabel} ${course.sigunguNames.join("·")}`.trim();

  return (
    <div className="mx-6 mt-3 rounded-2xl border border-line bg-cream-card/70 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-5 py-3"
      >
        <span className="text-sm font-medium text-ink">📍 {course.title}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="flex flex-col gap-3 px-5 pb-4 text-sm text-ink/80">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} strokeWidth={1.5} />
              {regionLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Clover size={14} strokeWidth={1.5} />
              {course.themeLabel}
            </span>
          </div>

          <span className="text-muted">
            인증샷 {course.progress.completedMissions}/{course.progress.totalMissions} 완료
          </span>

          {spots ? (
            <ol className="flex flex-col gap-1.5">
              {spots.map((spot, index) => (
                <li key={spot.id} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-light text-[11px] font-semibold text-forest">
                    {index + 1}
                  </span>
                  <span className="text-ink">
                    코스{index + 1} · {spot.name}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-xs text-muted">코스 세부 일정은 만나기 전날부터 공개돼요.</p>
          )}

          <Link href={`/course/${course.id}`} className="flex items-center gap-1 self-start text-forest">
            코스 보러가기
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
