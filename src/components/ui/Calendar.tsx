type CalendarProps = {
  selected?: string[];
  onChange?: (dates: string[]) => void;
};

export default function Calendar({}: CalendarProps) {
  return (
    <div className="grid grid-cols-7 gap-2 rounded-2xl border border-line p-4 text-center text-sm text-muted">
      캘린더 placeholder
    </div>
  );
}
