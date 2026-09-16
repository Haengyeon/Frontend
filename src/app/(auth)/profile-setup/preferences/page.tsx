import PreferencesForm from "@/features/auth/components/PreferencesForm";
import OnboardingProgress from "@/features/auth/components/OnboardingProgress";
import Logo from "@/components/ui/Logo";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-6">
        <Logo size={28} />
      </div>
      <OnboardingProgress step={3} total={3} />
      <PreferencesForm />
    </div>
  );
}
