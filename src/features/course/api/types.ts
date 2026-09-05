// public/img/API명세_코스.md 기준. region/theme enum은 매칭 API와 동일한 서버 enum을 쓴다.
import type { ApiRegion, ApiTheme } from "@/features/matching/api/types";

export type CoursePartner = {
  nickname: string;
  profileImageUrl: string;
};

export type CourseStatus = "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
export type CourseViewType = "LOCKED" | "PREVIEW" | "FULL";
export type VideoStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

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
};

export type CourseDetailLocked = CourseDetailBase & { viewType: "LOCKED" };

export type CourseDetailPreview = CourseDetailBase & {
  viewType: "PREVIEW";
  title: string;
  description: string;
  thumbnailUrl: string;
  preview: CoursePreviewInfo;
};

export type CourseDetailFull = CourseDetailBase & {
  viewType: "FULL";
  title: string;
  description: string;
  thumbnailUrl: string;
  preview: CoursePreviewInfo;
  status: CourseStatus;
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

export type UploadMissionPhotoResponse = {
  id: string;
  missionId: string;
  imageUrl: string;
  comment: string | null;
  createdAt: string;
  missionCompleted: boolean;
  courseProgress: { completedMissions: number; totalMissions: number };
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
