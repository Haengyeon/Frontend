import CourseCard from "@/features/course/components/CourseCard";
import { RECOMMENDED_COURSES } from "@/features/course/mocks";

export default function RecommendedCoursesSection() {
  return (
    <div className="flex flex-col gap-3 px-6">
      <span className="text-sm font-medium text-ink">추천 코스</span>
      <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2">
        {RECOMMENDED_COURSES.map((course) => (
          <CourseCard key={course.courseId} {...course} />
        ))}
      </div>
    </div>
  );
}
