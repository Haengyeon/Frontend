import { apiRequest } from "@/lib/api/client";
import type {
  CurrentCourseResponse,
  CourseDetail,
  RegenerateCourseResponse,
  UploadMissionPhotoResponse,
  SubmitCourseReviewRequest,
  SubmitCourseReviewResponse,
  CourseHistoryResponse,
  RecommendedSpotsResponse,
  SpotReviewsResponse,
} from "./types";

type PageParams = { limit?: number; cursor?: string | null };

function withQuery(path: string, params: PageParams) {
  const query = new URLSearchParams();
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.cursor) query.set("cursor", params.cursor);
  const qs = query.toString();
  return qs ? `${path}?${qs}` : path;
}

export function getCurrentCourse() {
  return apiRequest<CurrentCourseResponse>("/courses/current");
}

export function getCourseDetail(courseId: string) {
  return apiRequest<CourseDetail>(`/courses/${courseId}`);
}

/** 개발용 — 코스를 다시 만든다 */
export function regenerateCourse(matchAttemptId: string) {
  return apiRequest<RegenerateCourseResponse>("/courses/regenerate", {
    method: "POST",
    body: { matchAttemptId },
  });
}

export function uploadMissionPhoto(
  courseId: string,
  missionId: string,
  file: File,
  comment?: string,
) {
  const formData = new FormData();
  formData.append("file", file);
  if (comment) formData.append("comment", comment);
  return apiRequest<UploadMissionPhotoResponse>(
    `/courses/${courseId}/missions/${missionId}/photos`,
    { method: "POST", body: formData },
  );
}

export function submitCourseReview(courseId: string, payload: SubmitCourseReviewRequest) {
  return apiRequest<SubmitCourseReviewResponse>(`/courses/${courseId}/reviews`, {
    method: "POST",
    body: payload,
  });
}

export function getCourseHistory(params: PageParams = {}) {
  return apiRequest<CourseHistoryResponse>(withQuery("/courses/history", params));
}

export function getRecommendedSpots(params: PageParams = {}) {
  return apiRequest<RecommendedSpotsResponse>(withQuery("/courses/recommended", params));
}

export function getSpotReviews(contentId: string, params: PageParams = {}) {
  return apiRequest<SpotReviewsResponse>(withQuery(`/courses/spots/${contentId}/reviews`, params));
}
