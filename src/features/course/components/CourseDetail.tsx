"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import MissionStoryPath from "@/features/course/components/MissionStoryPath";
import { MOCK_MISSIONS } from "@/features/course/mocks";
import type { CourseSummary } from "@/features/course/types";

type CourseDetailProps = {
  course: CourseSummary;
};

export default function CourseDetail({ course }: CourseDetailProps) {
  const [selectedMissionId, setSelectedMissionId] = useState(MOCK_MISSIONS[0].missionId);
  const selectedIndex = MOCK_MISSIONS.findIndex(
    (mission) => mission.missionId === selectedMissionId,
  );
  const selectedMission = MOCK_MISSIONS[selectedIndex] ?? MOCK_MISSIONS[0];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-forest-light p-5">
        <h2 className="text-lg font-semibold text-ink">{course.title}</h2>
        <span className="flex items-center gap-1 text-sm text-muted">
          <MapPin size={14} strokeWidth={1.5} />
          {course.region}
        </span>
        <p className="text-sm leading-relaxed text-ink/80">{course.description}</p>
      </div>

      <MissionStoryPath
        missions={MOCK_MISSIONS}
        selectedMissionId={selectedMissionId}
        onSelect={setSelectedMissionId}
      />

      <div className="flex flex-col gap-2 rounded-2xl border border-line bg-cream-card p-5">
        <p className="text-base font-semibold text-ink">{selectedMission.placeName}</p>
        <span className="flex items-center gap-1 text-xs text-muted">
          <MapPin size={13} strokeWidth={1.5} />
          {selectedMission.location}
        </span>
        <p className="text-sm leading-relaxed text-ink/80">{selectedMission.description}</p>
      </div>
    </div>
  );
}
