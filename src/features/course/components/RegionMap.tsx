import { MapPin } from "lucide-react";
import CourseCard from "@/features/course/components/CourseCard";
import { STAMP_REGIONS, RECOMMENDED_COURSES } from "@/features/course/mocks";

export default function RegionMap() {
  const visitedCount = STAMP_REGIONS.filter((region) => region.visited).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink">다녀온 지역</span>
          <span className="text-xs text-muted">
            {visitedCount}/{STAMP_REGIONS.length}개 지역 방문
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {STAMP_REGIONS.map((region) => (
            <div
              key={region.name}
              className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-xs ${
                region.visited
                  ? "border-forest bg-forest-light text-forest"
                  : "border-line text-muted"
              }`}
            >
              <MapPin
                size={16}
                strokeWidth={1.5}
                fill={region.visited ? "currentColor" : "none"}
              />
              {region.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-ink">완료한 코스</span>
        <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2">
          {RECOMMENDED_COURSES.map((course) => (
            <CourseCard key={course.courseId} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
}
