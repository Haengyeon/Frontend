"use client";

import { useState } from "react";
import MissionStoryPath from "@/features/course/components/MissionStoryPath";
import MissionCard from "@/features/course/components/MissionCard";
import type { CourseSpot } from "@/features/course/api/types";

type CourseSpotsPanelProps = {
  courseId: string;
  spots: CourseSpot[];
};

export default function CourseSpotsPanel({ courseId, spots }: CourseSpotsPanelProps) {
  const [selectedSpotId, setSelectedSpotId] = useState(spots[0]?.id ?? "");
  const selectedSpot = spots.find((spot) => spot.id === selectedSpotId) ?? spots[0];

  if (!selectedSpot) return null;

  return (
    <div className="flex flex-col gap-5">
      <MissionStoryPath spots={spots} selectedSpotId={selectedSpot.id} onSelect={setSelectedSpotId} />
      <MissionCard courseId={courseId} spot={selectedSpot} />
    </div>
  );
}
