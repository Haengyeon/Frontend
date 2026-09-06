"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MapPin, Clover, ArrowRight } from "lucide-react";
import { useCurrentCourse } from "@/features/course/api/useCourseApi";

export default function CourseInfoAccordion() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useCurrentCourse();
  const course = data?.course;

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

          <Link href={`/course/${course.id}`} className="flex items-center gap-1 self-start text-forest">
            코스 보러가기
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
