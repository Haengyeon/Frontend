"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getFestivals } from "./eventsApi";

export function useFestivals() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useInfiniteQuery({
    queryKey: ["festivals"],
    queryFn: ({ pageParam }) => getFestivals({ cursor: pageParam ?? undefined, limit: 10 }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(accessToken),
  });
}
