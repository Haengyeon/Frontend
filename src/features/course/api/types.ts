// public/img/API명세_코스.md 기준. region/theme enum은 매칭 API와 동일한 서버 enum을 쓴다.
import type { ApiRegion, ApiTheme } from "@/features/matching/api/types";

// 문서엔 nickname으로 돼있지만 실서버는 name으로 내려준다.
export type CoursePartner = {
  name: string;
  profileImageUrl: string;
};

export type CourseStatus = "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
export type CourseViewType = "LOCKED" | "PREVIEW" | "FULL";
export type VideoStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

// 주의: GET /courses/current 응답(CurrentCourseDto, 백엔드 course-list-response.dto.ts)엔
// isExperience가 없다 — GET /courses/{id}에만 있다. 여기서 체험 여부가 필요하면
// matchingDraftStore의 isExperience(매칭 응답 기준)를 대신 써야 한다.
export type CurrentCourseSummary = {
  id: string;
  matchAttemptId?: string;
  title: string;
  region: ApiRegion;
  regionLabel: string;
  sigunguNames: string[];
  theme: ApiTheme;
  themeLabel: string;
  travelDate: string;
  dday: number;
  status: CourseStatus;
  thumbnailUrl: string | null;
  partner: CoursePartner;
  progress: { completedMissions: number; totalMissions: number };
};

export type CurrentCourseResponse = {
  generating: boolean;
  course: CurrentCourseSummary | null;
};

export type CoursePreviewInfo = {
  isIndoor: boolean;
  estimatedTime: string;
  dressTip: string;
};

export type MissionPhoto = {
  id: string;
  imageUrl: string;
  comment: string | null;
  isMine: boolean;
  createdAt: string;
};

export type CourseMission = {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  photoUploaded: boolean;
  partnerPhotoUploaded: boolean;
  photos: MissionPhoto[];
};

export type CourseSpot = {
  id: string;
  contentId: string;
  order: number;
  role: string;
  name: string;
  category: string;
  description: string | null;
  address: string;
  sigunguName: string | null;
  mapSigunguCode: string | null;
  latitude: number;
  longitude: number;
  imageUrl: string;
  stayMinutes: number;
  moveMinutesFromPrevious: number | null;
  reviewCount: number;
  reviewWritten: boolean;
  mission: CourseMission;
};

export type CourseVideo = {
  status: VideoStatus;
  videoUrl: string | null;
  thumbnailUrl: string | null;
} | null;

// GET /courses/{courseId}/video 전용 응답. course.video와 달리 완료 시
// GCS 서명 URL로 재발급된 videoUrl/thumbnailUrl을 준다 — 실제 재생은 이 값을 써야 한다.
export type VideoDetail = {
  id: string;
  status: VideoStatus;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  errorMessage: string | null;
  completedAt: string | null;
};

export type PartnerReviewSummary = {
  id: string;
  content: string;
  createdAt: string;
};

export type SpotReviewSummary = {
  id: string;
  spotId: string;
  contentId: string;
  spotName: string;
  content: string;
};

export type CourseReviewState = {
  courseId: string;
  myPartnerReview: PartnerReviewSummary | null;
  partnerReviewArrived: boolean;
  receivedPartnerReview: PartnerReviewSummary | null;
  myCourseReview: string | null;
  mySpotReviews: SpotReviewSummary[];
};

// 공통 필드 — LOCKED에도 나간다
type CourseDetailBase = {
  id: string;
  matchAttemptId?: string;
  region: ApiRegion;
  regionLabel: string;
  sigunguNames: string[];
  theme: ApiTheme;
  themeLabel: string;
  travelDate: string;
  dday: number;
  partner: CoursePartner;
  isExperience: boolean;
};

export type CourseDetailLocked = CourseDetailBase & { viewType: "LOCKED" };

export type CourseDetailPreview = CourseDetailBase & {
  viewType: "PREVIEW";
  title: string;
  description: string;
  thumbnailUrl: string;
  preview: CoursePreviewInfo;
};

/** 당일 "여행 완료하기" 버튼 상태. FULL 코스 상세에만 있다. */
export type CompletionRequestState = {
  /** 내가 완료 버튼을 눌렀는지 */
  mine: boolean;
  /** 상대가 눌렀는지 — true면 "OO님이 완료 버튼을 눌렀어요" 안내 */
  partner: boolean;
  /** 내가 누를 수 있는지(여행 당일 이후 + 내 사진·한마디 2개 이상). false면 버튼을 끈다 */
  available: boolean;
};

export type CourseDetailFull = CourseDetailBase & {
  viewType: "FULL";
  title: string;
  description: string;
  thumbnailUrl: string;
  preview: CoursePreviewInfo;
  status: CourseStatus;
  completionRequest: CompletionRequestState;
  durationMinutes: number;
  totalDistanceKm: number;
  mapSigunguCodes: string[];
  mapCenter: { latitude: number; longitude: number };
  spots: CourseSpot[];
  video: CourseVideo;
  review: CourseReviewState;
};

export type CourseDetail = CourseDetailLocked | CourseDetailPreview | CourseDetailFull;

export type RegenerateCourseResponse = {
  id: string;
};

/** 체험 코스에서 상대 미션 사진으로 채워지는 가상 데이터. id가 "experience-"로 시작하면
 * 실제 DB 레코드가 아니라는 뜻이라 신고·삭제 같은 요청을 보내면 안 된다. */
export function isExperiencePhotoId(photoId: string): boolean {
  return photoId.startsWith("experience-");
}

export type ExperienceSampleVideo = {
  videoUrl: string;
  thumbnailUrl: string;
};

// POST /courses/{courseId}/experience/finish 응답. 체험을 마치고 미리 만들어둔 샘플
// 추억영상을 받는다 — 실제 코스처럼 AI가 만드는 게 아니라 고정된 예시 영상이다.
// URL은 24시간 서명이라 다시 볼 때마다 이 API를 새로 호출해야 한다.
export type ExperienceFinishResponse = {
  courseId: string;
  status: CourseStatus;
  sampleVideo: ExperienceSampleVideo;
};

export type EarnedStamp = {
  region: ApiRegion;
  regionLabel: string;
  sigunguName: string | null;
  mapSigunguCodes: string[];
  earnedAt: string;
};

/** 코스가 완료되는 순간(자동 완료든 완료 버튼이든)의 결과. 사진 업로드/한마디 수정/완료
 * 버튼 응답 전부 이 모양의 completion 필드를 같이 내려줄 수 있다 — 4곳 모두 두 사람의
 * 사진·한마디가 그 요청으로 다 채워지면 그 자리에서 바로 완료 처리되기 때문이다. */
export type CourseCompletion = {
  id: string;
  status: CourseStatus;
  completedAt: string | null;
  earnedStamps: EarnedStamp[];
  earnedPoints: number;
  pointsAfter: number;
};

export type UploadMissionPhotoResponse = {
  id: string;
  missionId: string;
  imageUrl: string;
  comment: string | null;
  createdAt: string;
  missionCompleted: boolean;
  courseProgress: { completedMissions: number; totalMissions: number };
  /** 이 업로드로 코스가 완료됐으면 결과, 아니면 null */
  completion: CourseCompletion | null;
};

/** PATCH .../photos/{photoId} 응답 — 업로드 응답과 모양이 같다(한마디로도 완료될 수 있어서) */
export type UpdateMissionPhotoResponse = UploadMissionPhotoResponse;

/** POST /courses/{courseId}/completions ("여행 완료하기" 버튼) 응답 */
export type RequestCourseCompletionResponse = {
  /** 두 사람 다 눌러 코스가 끝났는지 */
  completed: boolean;
  /** 상대가 이미 눌렀는지 — 아직이면 이번 요청으로 상대에게 알림이 감 */
  partnerRequested: boolean;
  /** 이 요청으로 완료됐으면 결과, 아니면 null */
  completion: CourseCompletion | null;
};

export type SubmitCourseReviewRequest = {
  partnerReview: string;
  courseReview?: string;
  spotReviews?: { spotId: string; content: string }[];
};

export type SubmitCourseReviewResponse = {
  id: string;
  courseId: string;
  partnerReview: string;
  courseReview: string | null;
  spotReviews: SpotReviewSummary[];
  partnerNotified: boolean;
  createdAt: string;
  partnerReviewArrived: boolean;
  receivedPartnerReview: PartnerReviewSummary | null;
};

export type CourseHistoryItem = {
  id: string;
  matchAttemptId?: string;
  title: string;
  region: ApiRegion;
  regionLabel: string;
  sigunguNames: string[];
  theme: ApiTheme;
  themeLabel: string;
  travelDate: string;
  completedAt: string;
  thumbnailUrl: string | null;
  partner: CoursePartner;
  photoCount: number;
  hasReview: boolean;
  video: { status: VideoStatus } | null;
};

export type CourseHistoryResponse = {
  items: CourseHistoryItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type RecommendedSpot = {
  contentId: string;
  name: string;
  region: ApiRegion | null;
  category: string | null;
  description: string | null;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
};

export type RecommendedSpotsResponse = {
  items: RecommendedSpot[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type SpotReviewItem = {
  id: string;
  content: string;
  createdAt: string;
  isMine: boolean;
};

export type SpotReviewsResponse = {
  contentId: string;
  totalCount: number;
  items: SpotReviewItem[];
  nextCursor: string | null;
  hasMore: boolean;
};
