import Link from "next/link";
import CourseCard from "@/features/course/components/CourseCard";
import RegionColorMap from "@/features/course/components/RegionColorMap";
import { RECOMMENDED_COURSES } from "@/features/course/mocks";

export default function RegionMap() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-ink">다녀온 지역</span>
        <RegionColorMap />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-ink">완료한 코스</span>
        <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2">
          {RECOMMENDED_COURSES.map((course) => (
            <Link key={course.courseId} href={`/course/${course.courseId}?from=stamp`}>
              <CourseCard {...course} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
