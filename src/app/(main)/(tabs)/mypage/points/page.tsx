import Header from "@/components/layout/Header";
import PointHistoryList from "@/features/mypage/components/PointHistoryList";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="포인트 내역" />
      <div className="px-6 pb-8 pt-4">
        <PointHistoryList />
      </div>
    </div>
  );
}
