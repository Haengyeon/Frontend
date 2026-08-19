"use client";

import { useState } from "react";
import { Lock, MapPinOff, type LucideIcon } from "lucide-react";
import MissionStoryPath from "@/features/course/components/MissionStoryPath";
import MissionCard from "@/features/course/components/MissionCard";
import { MOCK_MISSIONS } from "@/features/course/mocks";
import { getDaysUntilTrip } from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

function GuideNotice({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-cream-card p-8 text-center">
      <Icon size={28} strokeWidth={1.5} className="text-muted" />
      <p className="text-sm font-medium text-ink">{title}</p>
      {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : null}
    </div>
  );
}

export default function CourseGuide() {
  const availableDates = useMatchingDraftStore((state) => state.availableDates);
  const daysUntilTrip = getDaysUntilTrip(availableDates);
  const [selectedMissionId, setSelectedMissionId] = useState(MOCK_MISSIONS[0].missionId);

  if (daysUntilTrip === null) {
    return <GuideNotice icon={MapPinOff} title="진행중인 코스가 없어요" />;
  }

  if (daysUntilTrip > 1) {
    return (
      <GuideNotice
        icon={Lock}
        title="코스는 여행 하루 전(D-1)부터 확인할 수 있어요"
        subtitle={`현재 D-${daysUntilTrip}`}
      />
    );
  }

  const selectedMission =
    MOCK_MISSIONS.find((mission) => mission.missionId === selectedMissionId) ?? MOCK_MISSIONS[0];

  return (
    <div className="flex flex-col gap-5">
      <MissionStoryPath
        missions={MOCK_MISSIONS}
        selectedMissionId={selectedMission.missionId}
        onSelect={setSelectedMissionId}
      />
      <MissionCard mission={selectedMission} />
    </div>
  );
}
