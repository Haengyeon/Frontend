import StatusBanner from "@/features/matching/components/StatusBanner";
import RecommendedSpotsSection from "@/features/course/components/RecommendedSpotsSection";
import EventBannerSection from "@/features/events/components/EventBannerSection";
import Logo from "@/components/ui/Logo";

// 매칭 상황(StatusBanner)이 어떤 상태로 바뀌든, 추천 관광지와 축제/행사 배너는
// 항상 노출되어야 한다 — 두 섹션 다 매칭 상태와 무관한 별도 형제 컴포넌트로 둔다.
export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6 pt-6">
      <Logo size={28} />

      <StatusBanner />

      <EventBannerSection />

      <RecommendedSpotsSection />
    </div>
  );
}
