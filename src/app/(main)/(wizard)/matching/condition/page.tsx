import Header from "@/components/layout/Header";
import ConditionStepOne from "@/features/matching/components/ConditionStepOne";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="매칭 조건 설정" />
      <ConditionStepOne />
    </div>
  );
}
