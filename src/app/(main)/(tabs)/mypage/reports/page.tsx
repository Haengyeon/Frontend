import { Suspense } from "react";
import Header from "@/components/layout/Header";
import ReportForm from "@/features/mypage/components/ReportForm";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="신고 및 문의" />
      <Suspense fallback={null}>
        <ReportForm />
      </Suspense>
    </div>
  );
}
