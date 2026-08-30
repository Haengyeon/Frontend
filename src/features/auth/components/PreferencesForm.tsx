"use client";

import { useRouter } from "next/navigation";
import StepNavButtons from "@/components/ui/StepNavButtons";
import MbtiSelector from "@/features/auth/components/MbtiSelector";
import InterestTags from "@/features/auth/components/InterestTags";

export default function PreferencesForm() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 pb-8">
      <InterestTags />
      <MbtiSelector />

      <div className="mt-auto">
        <StepNavButtons onNext={() => router.push("/home")} />
      </div>
    </div>
  );
}
