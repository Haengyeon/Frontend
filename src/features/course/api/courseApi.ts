import { apiRequest } from "@/lib/api/client";
import type {
  CurrentCourseResponse,
  CourseDetail,
  RegenerateCourseResponse,
  UploadMissionPhotoResponse,
  UpdateMissionPhotoResponse,
  RequestCourseCompletionResponse,
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

// [개발용] 코스 상세와 응답이 같지만 여행일 잠금(LOCKED/PREVIEW) 없이 항상 FULL로 준다.
// 매칭 확정 직후 장소·미션을 미리 확인하고 싶을 때 쓴다.
export function getCourseFullDetail(courseId: string) {
  return apiRequest<CourseDetail>(`/courses/${courseId}/full`);
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

// 올린 인증샷에 한마디를 쓰거나 고친다. 내 사진만 되고, 빈 문자열이면 지운다. 이 한마디로
// 4곳 모두 두 사람의 사진·한마디가 다 차면 코스가 그 자리에서 바로 완료돼서 응답의
// completion이 채워진다.
export function updateMissionPhotoComment(
  courseId: string,
  missionId: string,
  photoId: string,
  comment: string,
) {
  return apiRequest<UpdateMissionPhotoResponse>(
    `/courses/${courseId}/missions/${missionId}/photos/${photoId}`,
    { method: "PATCH", body: { comment } },
  );
}

// 당일 "여행 완료하기" 버튼. 내가 누르면 상대에게 알림이 가고, 둘 다 누르면 코스가
// 완료된다(추억영상·스탬프·포인트, 다시 매칭 가능). 누르려면 내 사진 중 한마디까지 쓴
// 사진이 2장 이상이어야 한다 — 코스 상세의 completionRequest.available로 미리 확인한다.
export function requestCourseCompletion(courseId: string) {
  return apiRequest<RequestCourseCompletionResponse>(`/courses/${courseId}/completions`, {
    method: "POST",
  });
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
