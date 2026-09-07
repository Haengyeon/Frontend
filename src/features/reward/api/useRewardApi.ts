"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getPoints, getPointHistory, getStamps } from "./rewardApi";

const POINTS_KEY = ["rewards", "points"] as const;
const POINT_HISTORY_KEY = ["rewards", "points", "history"] as const;
const STAMPS_KEY = ["rewards", "stamps"] as const;

export function useMyPoints() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: POINTS_KEY,
    queryFn: getPoints,
    enabled: Boolean(accessToken),
  });
}

export function usePointHistory() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useInfiniteQuery({
    queryKey: POINT_HISTORY_KEY,
    queryFn: ({ pageParam }) => getPointHistory({ cursor: pageParam ?? undefined, limit: 20 }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(accessToken),
  });
}

// 페이징이 없고(명세: 상한이 지도 칸 수라 전부 한 번에 내려줌) 자주 안 바뀌는 데이터라 일반 쿼리로 충분하다.
export function useStamps() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: STAMPS_KEY,
    queryFn: getStamps,
    enabled: Boolean(accessToken),
  });
}
