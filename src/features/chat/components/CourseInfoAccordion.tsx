"use client";

import { useState } from "react";
import { ChevronDown, Map as MapIcon, Clock, Footprints } from "lucide-react";
import type { ChatCourseInfo } from "@/features/chat/types";

type CourseInfoAccordionProps = {
  courseInfo: ChatCourseInfo;
};

export default function CourseInfoAccordion({ courseInfo }: CourseInfoAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mx-6 mt-3 rounded-2xl border border-line bg-cream-card/70 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-5 py-3"
      >
        <span className="text-sm font-medium text-ink">📍 {courseInfo.courseTitle}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="flex flex-col gap-2 px-5 pb-4 text-sm text-ink/80">
          <span className="flex items-center gap-1.5">
            <Footprints size={14} strokeWidth={1.5} />
            {courseInfo.modeLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} strokeWidth={1.5} />
            {courseInfo.durationLabel}
          </span>
          <span className="text-muted">{courseInfo.stopOrder.join(" → ")}</span>
          <button type="button" className="flex items-center gap-1 self-start text-forest">
            <MapIcon size={14} strokeWidth={1.5} />
            지도 보기
          </button>
        </div>
      ) : null}
    </div>
  );
}
