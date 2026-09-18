"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  getCourseVideo,
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

/**
 * 추억 영상 제작 상태. 코스 상세의 video 필드가 이미 null이 아닐 때만(=
 * 백엔드가 이미 CourseVideo 행을 만들어둔 상태) 호출해서, 아직 만들어지지도
 * 않은 영상을 조회해 매번 404를 받는 걸 피한다. 완료 전까지는 짧게 폴링한다.
 */
export function useCourseVideo(courseId: string | null, options: { enabled?: boolean } = {}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: [...courseDetailKey(courseId ?? ""), "video"],
    queryFn: () => getCourseVideo(courseId as string),
    enabled: Boolean(accessToken) && Boolean(courseId) && (options.enabled ?? true),
    retry: false,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "PENDING" || status === "PROCESSING" ? 5000 : false;
    },
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
