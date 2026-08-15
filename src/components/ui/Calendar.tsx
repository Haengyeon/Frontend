type CalendarProps = {
  selected?: string[];
  onChange?: (dates: string[]) => void;
};

export default function Calendar({}: CalendarProps) {
  return (
    <div className="grid grid-cols-7 gap-2 rounded-2xl border border-zinc-100 p-4 text-center text-sm text-zinc-400">
      캘린더 placeholder
    </div>
  );
}
