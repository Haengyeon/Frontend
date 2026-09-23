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
  VideoDetail,
  ExperienceFinishResponse,
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

// 추억 영상은 요청 API가 없다 — 여행을 마치고 인증샷이 한 장이라도 있으면
// 백엔드 스케줄러가 매분 자동으로 만들기 시작한다. 여기선 진행 상태만 조회한다.
export function getCourseVideo(courseId: string) {
  return apiRequest<VideoDetail>(`/courses/${courseId}/video`);
}

// 체험(더미) 코스 전용. 실제 코스와 달리 AI가 영상을 만드는 게 아니라 미리 준비된 샘플
// 추억영상을 즉시 돌려준다. 이미 끝낸 체험이면 상태는 유지된 채 URL만 재발급된다.
// 실제 코스에 호출하면 400("체험 매칭 코스가 아닙니다")이 난다.
export function finishExperienceCourse(courseId: string) {
  return apiRequest<ExperienceFinishResponse>(`/courses/${courseId}/experience/finish`, {
    method: "POST",
  });
}
