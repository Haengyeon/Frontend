import Header from "@/components/layout/Header";
import SafetyHistoryList from "@/features/mypage/components/SafetyHistoryList";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="신고·차단 내역" />
      <div className="px-6 pb-8 pt-4">
        <SafetyHistoryList />
      </div>
    </div>
  );
}
