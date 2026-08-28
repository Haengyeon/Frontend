import Header from "@/components/layout/Header";
import SettingsForm from "@/features/mypage/components/SettingsForm";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="환경설정" />
      <SettingsForm />
    </div>
  );
}
