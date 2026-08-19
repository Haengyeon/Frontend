import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import CourseDetail from "@/features/course/components/CourseDetail";
import { RECOMMENDED_COURSES } from "@/features/course/mocks";

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = RECOMMENDED_COURSES.find((item) => item.courseId === courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title={course.title} />
      <CourseDetail course={course} />
    </div>
  );
}
