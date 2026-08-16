import BasicInfoForm from "@/features/auth/components/BasicInfoForm";
import OnboardingProgress from "@/features/auth/components/OnboardingProgress";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-6 text-center text-sm font-semibold tracking-wide text-ink">
        LOGO
      </div>
      <OnboardingProgress step={1} total={3} />
      <BasicInfoForm />
    </div>
  );
}
