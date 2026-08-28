import ProfileSummaryCard from "@/features/mypage/components/ProfileSummaryCard";
import MenuList from "@/features/mypage/components/MenuList";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-6">
      <ProfileSummaryCard />
      <MenuList />
    </div>
  );
}
