import { getDaysUntilTrip } from "@/features/matching/mocks";
import { useMatchingDraftStore } from "@/features/matching/store/matchingDraftStore";

export function useDaysUntilTrip() {
  const availableDates = useMatchingDraftStore((state) => state.availableDates);
  return getDaysUntilTrip(availableDates);
}
