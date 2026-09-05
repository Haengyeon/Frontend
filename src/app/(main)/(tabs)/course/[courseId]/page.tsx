import CourseDetail from "@/features/course/components/CourseDetail";

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  return <CourseDetail courseId={courseId} />;
}
