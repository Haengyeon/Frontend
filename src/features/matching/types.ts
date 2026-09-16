export type MatchingStatus =
  | "none"
  | "searching"
  | "found"
  | "pending"
  | "retry_ready"
  | "payment_pending"
  | "confirmed"
  | "completed";

/** 희망 지역 하나. 배열 안 순서가 곧 우선순위다(앞일수록 1순위에 가깝다, 최대 5개). */
export type RegionPreference = {
  /** REGIONS 배열의 국문 라벨(예: "서울") */
  region: string;
  sigunguCode: string;
  sigunguName: string;
};

export type MatchingCondition = {
  regionPreferences: RegionPreference[];
  ageRange: [number, number];
  preferredGender: "male" | "female" | "any";
  availableDates: string[];
  themeIds: string[];
};

export type MatchingTheme = {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
};

