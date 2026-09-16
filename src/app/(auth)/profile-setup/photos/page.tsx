import ProfilePhotosForm from "@/features/auth/components/ProfilePhotosForm";
import OnboardingProgress from "@/features/auth/components/OnboardingProgress";
import Logo from "@/components/ui/Logo";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-6">
        <Logo size={28} />
      </div>
      <OnboardingProgress step={2} total={3} />
      <ProfilePhotosForm />
    </div>
  );
}
