import ProfilePhotosForm from "@/features/auth/components/ProfilePhotosForm";
import OnboardingProgress from "@/features/auth/components/OnboardingProgress";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-6 text-center text-sm font-semibold tracking-wide text-ink">
        LOGO
      </div>
      <OnboardingProgress step={2} total={3} />
      <ProfilePhotosForm />
    </div>
  );
}
