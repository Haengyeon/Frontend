import { useEffect, useState } from "react";
import { getDaysUntilTrip } from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

export function useDaysUntilTrip() {
  const availableDates = useMatchingDraftStore((state) => state.availableDates);
  const [dayKey, setDayKey] = useState(() => new Date().toDateString());

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const timeoutId = window.setTimeout(
      () => setDayKey(new Date().toDateString()),
      Math.max(0, nextMidnight.getTime() - now.getTime()),
    );
    return () => window.clearTimeout(timeoutId);
  }, [dayKey]);

  return getDaysUntilTrip(availableDates);
}
