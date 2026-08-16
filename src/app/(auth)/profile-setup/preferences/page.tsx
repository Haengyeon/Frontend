import PreferencesForm from "@/features/auth/components/PreferencesForm";
import OnboardingProgress from "@/features/auth/components/OnboardingProgress";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-6 text-center text-sm font-semibold tracking-wide text-ink">
        LOGO
      </div>
      <OnboardingProgress step={3} total={3} />
      <PreferencesForm />
    </div>
  );
}
