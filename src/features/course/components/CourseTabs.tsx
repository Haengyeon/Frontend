"use client";

import { useState } from "react";
import CourseGuide from "@/features/course/components/CourseGuide";
import RegionMap from "@/features/course/components/RegionMap";

const TABS = [
  { value: "guide", label: "코스안내" },
  { value: "stamp", label: "스탬프" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export default function CourseTabs() {
  const [tab, setTab] = useState<TabValue>("guide");

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-6">
      <div className="flex rounded-full bg-forest-light p-1">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTab(item.value)}
            aria-pressed={tab === item.value}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              tab === item.value ? "bg-forest text-white" : "text-forest"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "guide" ? <CourseGuide /> : <RegionMap />}
    </div>
  );
}
