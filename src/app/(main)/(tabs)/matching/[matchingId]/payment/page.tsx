import Header from "@/components/layout/Header";
import PaymentSummary from "@/features/matching/components/PaymentSummary";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="결제" />
      <PaymentSummary />
    </div>
  );
}
