import ReviewForm from "@/features/course/components/ReviewForm";

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  return <ReviewForm courseId={courseId} />;
}
