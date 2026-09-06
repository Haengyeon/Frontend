"use client";

import { useInfiniteQuery, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  getCurrentCourse,
  getCourseDetail,
  regenerateCourse,
  uploadMissionPhoto,
  submitCourseReview,
  getCourseHistory,
  getRecommendedSpots,
  getSpotReviews,
} from "./courseApi";
import type { SubmitCourseReviewRequest } from "./types";

const CURRENT_COURSE_KEY = ["courses", "current"] as const;
export const courseDetailKey = (courseId: string) => ["courses", courseId] as const;
const HISTORY_KEY = ["courses", "history"] as const;
const RECOMMENDED_KEY = ["courses", "recommended"] as const;
const spotReviewsKey = (contentId: string) => ["courses", "spots", contentId, "reviews"] as const;

export function useCurrentCourse() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: CURRENT_COURSE_KEY,
    queryFn: getCurrentCourse,
    enabled: Boolean(accessToken),
    // 결제 직후 코스가 비동기로 만들어지는 동안(generating)엔 짧게 폴링한다.
    refetchInterval: (query) => (query.state.data?.generating ? 4000 : false),
  });
}

export function useCourseDetail(courseId: string | null) {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: courseDetailKey(courseId ?? ""),
    queryFn: () => getCourseDetail(courseId as string),
    enabled: Boolean(accessToken) && Boolean(courseId),
    retry: false,
  });
}

export function useRegenerateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (matchAttemptId: string) => regenerateCourse(matchAttemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CURRENT_COURSE_KEY });
    },
  });
}

export function useUploadMissionPhoto(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      missionId,
      file,
      comment,
    }: {
      missionId: string;
      file: File;
      comment?: string;
    }) => uploadMissionPhoto(courseId, missionId, file, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseDetailKey(courseId) });
      queryClient.invalidateQueries({ queryKey: CURRENT_COURSE_KEY });
    },
  });
}

export function useSubmitCourseReview(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitCourseReviewRequest) => submitCourseReview(courseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseDetailKey(courseId) });
      queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });
}

export function useCourseHistory() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useInfiniteQuery({
    queryKey: HISTORY_KEY,
    queryFn: ({ pageParam }) => getCourseHistory({ cursor: pageParam, limit: 10 }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(accessToken),
  });
}

export function useRecommendedSpots() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useInfiniteQuery({
    queryKey: RECOMMENDED_KEY,
    queryFn: ({ pageParam }) => getRecommendedSpots({ cursor: pageParam, limit: 10 }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(accessToken),
  });
}

export function useSpotReviews(contentId: string | null) {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useInfiniteQuery({
    queryKey: spotReviewsKey(contentId ?? ""),
    queryFn: ({ pageParam }) => getSpotReviews(contentId as string, { cursor: pageParam, limit: 10 }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(accessToken) && Boolean(contentId),
  });
}

// /courses/history엔 지도 색칠용 5자리 코드가 없어서(스펙 명시), 완료 코스 각각의
// 상세를 병렬로 불러와 FULL 응답의 mapSigunguCodes를 모아 지도 색칠에 쓴다.
export function useVisitedDistrictCodes(courseIds: string[]) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const results = useQueries({
    queries: courseIds.map((courseId) => ({
      queryKey: courseDetailKey(courseId),
      queryFn: () => getCourseDetail(courseId),
      enabled: Boolean(accessToken) && Boolean(courseId),
    })),
  });

  const codes = new Set<string>();
  for (const result of results) {
    if (result.data?.viewType === "FULL") {
      for (const code of result.data.mapSigunguCodes) codes.add(code);
    }
  }
  return codes;
}
