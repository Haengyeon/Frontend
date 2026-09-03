import { REGIONS, MATCHING_THEMES } from "@/features/matching/mocks";
import { JOB_CATEGORIES, INTEREST_TAGS } from "@/features/auth/mocks";
import type {
  ApiRegion,
  ApiTheme,
  ApiPreferredGender,
  ApiJobCategory,
  ApiHobby,
  ApiMatchingStatus,
} from "./types";
import type { MatchingStatus } from "@/features/matching/types";

// 실제 서버 enum과 기존 국문 목록(REGIONS, MATCHING_THEMES, JOB_CATEGORIES, INTEREST_TAGS)의
// 순서가 정확히 1:1로 대응해서(백엔드 설계가 이 순서를 그대로 따라감), 인덱스로 안전하게 짝지을 수 있다.
function buildBiMap<K extends string, V extends string>(keys: readonly K[], values: readonly V[]) {
  if (keys.length !== values.length) {
    throw new Error("enum 매핑 배열 길이가 서로 달라요 — REGIONS/MATCHING_THEMES 등이 바뀌었는지 확인 필요");
  }
  const toApi = new Map<K, V>();
  const toLocal = new Map<V, K>();
  keys.forEach((key, index) => {
    toApi.set(key, values[index]);
    toLocal.set(values[index], key);
  });
  return { toApi, toLocal };
}

const API_REGIONS: readonly ApiRegion[] = [
  "SEOUL",
  "BUSAN",
  "DAEGU",
  "INCHEON",
  "GWANGJU",
  "DAEJEON",
  "ULSAN",
  "SEJONG",
  "GYEONGGI",
  "GANGWON",
  "CHUNGBUK",
  "CHUNGNAM",
  "JEONBUK",
  "JEONNAM",
  "GYEONGBUK",
  "GYEONGNAM",
  "JEJU",
];

const API_THEMES: readonly ApiTheme[] = [
  "NATURE_HEALING",
  "HISTORY_CULTURE",
  "NIGHT_DATE",
  "PHOTO_SPOT",
  "LOCAL_FOOD_MARKET",
  "ACTIVITY",
  "WALKING_TRIP",
  "ART_SENSIBILITY",
];

const API_JOB_CATEGORIES: readonly ApiJobCategory[] = [
  "IT_DEVELOPMENT",
  "DESIGN",
  "MARKETING",
  "EDUCATION",
  "MEDICAL_HEALTH",
  "LAW",
  "FINANCE",
  "ARCHITECTURE_ENGINEERING",
  "ART_CREATIVE",
  "FREELANCER",
  "STUDENT",
  "RESEARCH",
  "PUBLIC_ADMINISTRATION",
  "MEDIA_PUBLISHING",
  "SERVICE",
];

const API_HOBBIES: readonly ApiHobby[] = [
  "ART",
  "CAFE",
  "FOOD",
  "READING",
  "EXERCISE",
  "IT",
  "COOKING",
  "SEA",
  "MOVIE",
  "EXHIBITION",
  "PHOTO",
  "ANIMAL",
  "MUSIC",
  "ACTIVITY",
  "HISTORY",
];

const regionMap = buildBiMap(REGIONS, API_REGIONS);
const themeMap = buildBiMap(
  MATCHING_THEMES.map((theme) => theme.id),
  API_THEMES,
);
const jobCategoryMap = buildBiMap(JOB_CATEGORIES, API_JOB_CATEGORIES);
const hobbyMap = buildBiMap(INTEREST_TAGS, API_HOBBIES);

export function regionToApi(region: string): ApiRegion {
  const value = regionMap.toApi.get(region);
  if (!value) throw new Error(`알 수 없는 지역: ${region}`);
  return value;
}

export function regionToLocal(region: ApiRegion): string {
  return regionMap.toLocal.get(region) ?? region;
}

export function themeIdToApi(themeId: string): ApiTheme {
  const value = themeMap.toApi.get(themeId);
  if (!value) throw new Error(`알 수 없는 테마: ${themeId}`);
  return value;
}

export function themeToLocalId(theme: ApiTheme): string {
  return themeMap.toLocal.get(theme) ?? theme;
}

export function jobCategoryToLocal(jobCategory: ApiJobCategory): string {
  return jobCategoryMap.toLocal.get(jobCategory) ?? jobCategory;
}

export function hobbyToLocal(hobby: ApiHobby): string {
  return hobbyMap.toLocal.get(hobby) ?? hobby;
}

const GENDER_TO_API: Record<"male" | "female" | "any", ApiPreferredGender> = {
  male: "MALE",
  female: "FEMALE",
  any: "ANY",
};

export function preferredGenderToApi(gender: "male" | "female" | "any"): ApiPreferredGender {
  return GENDER_TO_API[gender];
}

const API_TO_GENDER: Record<ApiPreferredGender, "male" | "female" | "any"> = {
  MALE: "male",
  FEMALE: "female",
  ANY: "any",
};

export function preferredGenderToLocal(gender: ApiPreferredGender): "male" | "female" | "any" {
  return API_TO_GENDER[gender];
}

export function partnerGenderToLocal(gender: "MALE" | "FEMALE"): "male" | "female" {
  return gender === "MALE" ? "male" : "female";
}

// WAITING_RESPONSE는 "상대 프로필을 확인/응답해야 하는 상태" 전반을 뜻해서 일단 found로 매핑한다.
// 이미 내가 응답을 보내고 상대를 기다리는 세부 상태(pending)는 MatchAttemptDetail의
// myResponded/myDecision을 화면에서 직접 보고 구분한다 (상위 status만으론 알 수 없음).
const MATCHING_STATUS_TO_LOCAL: Record<ApiMatchingStatus, MatchingStatus> = {
  SEARCHING: "searching",
  WAITING_RESPONSE: "found",
  RETRY_READY: "retry_ready",
  PAYMENT_PENDING: "payment_pending",
  CONFIRMED: "confirmed",
  EXHAUSTED: "retry_ready",
  CANCELLED: "none",
};

export function matchingStatusToLocal(status: ApiMatchingStatus): MatchingStatus {
  return MATCHING_STATUS_TO_LOCAL[status];
}
