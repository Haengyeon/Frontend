// 2026-09-03 실제 서버(/api-json)에서 확인한 스키마 기준. 문서(API명세_매칭.md)의 예시값과
// 다르면 이 파일이 맞다 — region/themes 등은 여기 적힌 값이 서버가 실제로 검증하는 전체 enum이다.

export type ApiRegion =
  | "SEOUL"
  | "BUSAN"
  | "DAEGU"
  | "INCHEON"
  | "GWANGJU"
  | "DAEJEON"
  | "ULSAN"
  | "SEJONG"
  | "GYEONGGI"
  | "GANGWON"
  | "CHUNGBUK"
  | "CHUNGNAM"
  | "JEONBUK"
  | "JEONNAM"
  | "GYEONGBUK"
  | "GYEONGNAM"
  | "JEJU";

export type ApiTheme =
  | "NATURE_HEALING"
  | "HISTORY_CULTURE"
  | "NIGHT_DATE"
  | "PHOTO_SPOT"
  | "LOCAL_FOOD_MARKET"
  | "ACTIVITY"
  | "WALKING_TRIP"
  | "ART_SENSIBILITY";

export type ApiPreferredGender = "MALE" | "FEMALE" | "ANY";
export type ApiPartnerGender = "MALE" | "FEMALE";

export type ApiJobCategory =
  | "IT_DEVELOPMENT"
  | "DESIGN"
  | "MARKETING"
  | "EDUCATION"
  | "MEDICAL_HEALTH"
  | "LAW"
  | "FINANCE"
  | "ARCHITECTURE_ENGINEERING"
  | "ART_CREATIVE"
  | "FREELANCER"
  | "STUDENT"
  | "RESEARCH"
  | "PUBLIC_ADMINISTRATION"
  | "MEDIA_PUBLISHING"
  | "SERVICE";

export type ApiHobby =
  | "ART"
  | "CAFE"
  | "FOOD"
  | "READING"
  | "EXERCISE"
  | "IT"
  | "COOKING"
  | "SEA"
  | "MOVIE"
  | "EXHIBITION"
  | "PHOTO"
  | "ANIMAL"
  | "MUSIC"
  | "ACTIVITY"
  | "HISTORY";

export type ApiMatchingStatus =
  | "SEARCHING"
  | "WAITING_RESPONSE"
  | "RETRY_READY"
  | "PAYMENT_PENDING"
  | "CONFIRMED"
  | "EXHAUSTED"
  | "CANCELLED";

export type ApiDecision = "ACCEPTED" | "REJECTED";

export type CreateMatchingRequest = {
  regions: ApiRegion[];
  ageMin: number;
  ageMax: number;
  preferredGender: ApiPreferredGender;
  themes: ApiTheme[];
  availableDates: string[];
};

export type UpdateMatchingRequest = Partial<CreateMatchingRequest>;

export type CurrentMatchAttempt = {
  id: string;
  status: string; // "WAITING_RESPONSE" | "PAYMENT_PENDING" (서버 문서상 명시적 enum 아님)
  respondDeadlineAt: string;
  paymentDeadlineAt: string | null;
};

export type MatchingResponse = {
  id: string;
  regions: ApiRegion[];
  ageMin: number;
  ageMax: number;
  preferredGender: ApiPreferredGender;
  themes: ApiTheme[];
  availableDates: string[];
  status: ApiMatchingStatus;
  createdAt: string;
  currentAttempt: CurrentMatchAttempt | null;
};

export type PartnerProfile = {
  name: string;
  age: number;
  gender: ApiPartnerGender;
  jobCategory: ApiJobCategory | null;
  mbti: string | null;
  introduce: string;
  hobbies: ApiHobby[];
  fullBodyImageUrl: string;
};

export type MatchAttemptDetail = {
  id: string;
  status: string;
  travelDate: string;
  /** 두 사람의 조건으로 확정된 코스 테마 (내가 고른 후보 목록이 아니라 최종 하나) */
  theme: ApiTheme;
  /** 수락 시 1인당 결제해야 하는 금액(원) */
  paymentAmount: number;
  paymentDeadlineAt: string | null;
  myResponded: boolean;
  myDecision: ApiDecision | null;
  partner: PartnerProfile;
};

export type RespondRequest = {
  decision: ApiDecision;
};
