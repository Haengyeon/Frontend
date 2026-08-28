import Header from "@/components/layout/Header";
import ProfileEditForm from "@/features/mypage/components/ProfileEditForm";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="프로필 수정" />
      <ProfileEditForm />
    </div>
  );
}
