"use client";

import { useState } from "react";
import { MapPinOff, MapPin, Clover, Clock, Shirt, Lock, type LucideIcon } from "lucide-react";
import MissionStoryPath from "@/features/course/components/MissionStoryPath";
import MissionCard from "@/features/course/components/MissionCard";
import InfoRow from "@/features/matching/components/InfoRow";
import { MOCK_MISSIONS, MOCK_COURSE_DURATION, MOCK_COURSE_DRESS_CODE } from "@/features/course/mocks";
import { MOCK_DECIDED_THEME_IDS, getThemeLabels } from "@/features/matching/mocks";
import { useDaysUntilTrip } from "@/features/matching/hooks/useDaysUntilTrip";
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

// D-2 이상: 지역/테마만 · D-1: 소요 시간·복장 추천까지 · D-Day: 전체 코스(다른 곳에서 렌더)
function CoursePreview({
  notice,
  regionLabel,
  themeLabel,
  showDetails,
}: {
  notice: string;
  regionLabel: string;
  themeLabel: string;
  showDetails: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-cream-card p-5">
      <span className="flex items-center gap-1.5 text-xs text-muted">
        <Lock size={13} strokeWidth={1.5} />
        {notice}
      </span>
      <InfoRow icon={MapPin} label="지역" value={regionLabel} />
      <InfoRow icon={Clover} label="테마" value={themeLabel} />
      {showDetails ? (
        <>
          <InfoRow icon={Clock} label="예상 소요 시간" value={MOCK_COURSE_DURATION} />
          <InfoRow icon={Shirt} label="복장 추천" value={MOCK_COURSE_DRESS_CODE} />
        </>
      ) : null}
    </div>
  );
}

export default function CourseGuide() {
  const daysUntilTrip = useDaysUntilTrip();
  const regions = useMatchingDraftStore((state) => state.regions);
  const [selectedMissionId, setSelectedMissionId] = useState(MOCK_MISSIONS[0].missionId);
  const [capturedMissionIds, setCapturedMissionIds] = useState(() =>
    MOCK_MISSIONS.filter((mission) => mission.done).map((mission) => mission.missionId),
  );
  const [comments, setComments] = useState<Record<string, string>>({});

  if (daysUntilTrip === null) {
    return <GuideNotice icon={MapPinOff} title="진행중인 코스가 없어요" />;
  }

  const regionLabel = regions.join(", ") || "미정";
  const themeLabel = getThemeLabels(MOCK_DECIDED_THEME_IDS);

  if (daysUntilTrip >= 2) {
    return (
      <CoursePreview
        notice={`코스 세부 일정은 만나기 하루 전(D-1)부터 확인할 수 있어요 · 현재 D-${daysUntilTrip}`}
        regionLabel={regionLabel}
        themeLabel={themeLabel}
        showDetails={false}
      />
    );
  }

  if (daysUntilTrip === 1) {
    return (
      <CoursePreview
        notice="코스 세부 일정은 당일에 공개돼요"
        regionLabel={regionLabel}
        themeLabel={themeLabel}
        showDetails
      />
    );
  }

  const selectedIndex = MOCK_MISSIONS.findIndex(
    (mission) => mission.missionId === selectedMissionId,
  );
  const selectedMission = MOCK_MISSIONS[selectedIndex] ?? MOCK_MISSIONS[0];

  return (
    <div className="flex flex-col gap-5">
      <MissionStoryPath
        missions={MOCK_MISSIONS}
        selectedMissionId={selectedMission.missionId}
        onSelect={setSelectedMissionId}
      />
      <MissionCard
        mission={selectedMission}
        isCaptured={capturedMissionIds.includes(selectedMission.missionId)}
        onCapture={() =>
          setCapturedMissionIds((prev) =>
            prev.includes(selectedMission.missionId) ? prev : [...prev, selectedMission.missionId],
          )
        }
        comment={comments[selectedMission.missionId] ?? ""}
        onCommentChange={(comment) =>
          setComments((prev) => ({ ...prev, [selectedMission.missionId]: comment }))
        }
      />
    </div>
  );
}
