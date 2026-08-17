import StatusBanner from "@/features/matching/components/StatusBanner";
import RecommendedCoursesSection from "@/features/course/components/RecommendedCoursesSection";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6 pt-6">
      <div className="text-center text-sm font-semibold tracking-wide text-ink">LOGO</div>

      <StatusBanner />

      <RecommendedCoursesSection />
    </div>
  );
}
