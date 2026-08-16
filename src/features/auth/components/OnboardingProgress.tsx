type OnboardingProgressProps = {
  step: number;
  total: number;
};

export default function OnboardingProgress({ step, total }: OnboardingProgressProps) {
  return (
    <div className="flex justify-center gap-1.5 pt-4">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`h-1.5 w-1.5 rounded-full ${index < step ? "bg-forest" : "bg-line"}`}
        />
      ))}
    </div>
  );
}
