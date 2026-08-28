import Header from "@/components/layout/Header";
import PaymentHistoryList from "@/features/mypage/components/PaymentHistoryList";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="결제 내역" />
      <div className="px-6 pb-8 pt-4">
        <PaymentHistoryList />
      </div>
    </div>
  );
}
