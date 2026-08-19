"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import { MOCK_MISSIONS } from "@/features/course/mocks";
import type { CourseSummary } from "@/features/course/types";

type CourseDetailProps = {
  course: CourseSummary;
};

export default function CourseDetail({ course }: CourseDetailProps) {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest-light">
        {course.imageUrl ? (
          <Image src={course.imageUrl} alt={course.title} fill className="object-cover" />
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-ink">{course.title}</h2>
        <span className="flex items-center gap-1 text-sm text-muted">
          <MapPin size={14} strokeWidth={1.5} />
          {course.region}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-ink/80">{course.description}</p>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-ink">다녀온 장소</span>
        <div className="grid grid-cols-2 gap-3">
          {MOCK_MISSIONS.map((mission) => (
            <div
              key={mission.missionId}
              className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-forest-light to-forest/40"
            >
              {mission.imageUrl ? (
                <Image
                  src={mission.imageUrl}
                  alt={mission.placeName}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              ) : null}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <span className="text-xs font-medium text-white">{mission.placeName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        className="mt-auto w-full"
        onClick={() => router.push(`/course/${course.courseId}/review`)}
      >
        후기 작성하기
      </Button>
    </div>
  );
}
