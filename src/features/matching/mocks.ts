import type { MatchingCondition, MatchingTheme, MatchProfile } from "./types";

export const AGE_RANGE_MIN = 20;
export const AGE_RANGE_MAX = 70;

// 나이(20~70+) 범위를 출생연도 범위로 변환 — 나이가 어릴수록 연도는 크다(최근)
export const CURRENT_YEAR = new Date().getFullYear();
export const MIN_BIRTH_YEAR = CURRENT_YEAR - AGE_RANGE_MAX;
export const MAX_BIRTH_YEAR = CURRENT_YEAR - AGE_RANGE_MIN;

export function formatAgeRange([low, high]: [number, number]) {
  return `${low}세 - ${high}${high >= AGE_RANGE_MAX ? "세+" : "세"}`;
}

export const GENDER_OPTIONS: {
  value: MatchingCondition["preferredGender"];
  label: string;
  icon: string;
}[] = [
  { value: "male", label: "남성", icon: "♂" },
  { value: "female", label: "여성", icon: "♀" },
  { value: "any", label: "상관없음", icon: "♥" },
];

export function getGenderLabel(value: MatchingCondition["preferredGender"]) {
  return GENDER_OPTIONS.find((option) => option.value === value)?.label ?? "";
}

export const MAX_THEMES = 3;
export const MAX_REGIONS = 3;

export const MATCHING_THEMES: MatchingTheme[] = [
  {
    id: "nature",
    label: "자연 힐링",
    description: "숲, 바다, 호수, 공원, 수목원",
    imageUrl: "/테마_자연.png",
  },
  {
    id: "history",
    label: "역사 문화",
    description: "고궁, 유적지, 박물관, 전통문화",
    imageUrl: "/테마_문화.png",
  },
  { id: "night", label: "야경 데이트", description: "전망대, 야경 명소, 밤산책", imageUrl: "" },
  { id: "photo", label: "사진 명소", description: "인생샷 스팟, 포토존", imageUrl: "" },
  {
    id: "local",
    label: "로컬 맛집 · 전통시장",
    description: "시장 구경, 먹거리, 지역 상권 체험",
    imageUrl: "/테마_카페.png",
  },
  { id: "activity", label: "액티비티", description: "레저, 체험, 스포츠, 놀이시설", imageUrl: "" },
  { id: "walk", label: "걷기 여행", description: "골목길, 둘레길, 산책로, 마을길", imageUrl: "" },
  { id: "art", label: "예술 감성", description: "전시, 미술관, 공방, 사진 명소", imageUrl: "" },
];

export function getThemeLabels(themeIds: string[]) {
  return themeIds
    .map((id) => MATCHING_THEMES.find((theme) => theme.id === id)?.label)
    .filter(Boolean)
    .join(", ");
}

export const REGIONS = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function toDateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatDateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return `${date.getMonth() + 1}/${date.getDate()}(${WEEKDAY_LABELS[date.getDay()]})`;
}

export const AVAILABLE_DATE_RANGE_DAYS = 30;

export function getAvailableDateOptions(days = 14) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + 1);

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return { value, label: formatDateLabel(value) };
  });
}

export function getDaysUntilTrip(availableDates: string[]): number | null {
  if (availableDates.length === 0) return null;
  const earliest = [...availableDates].sort()[0];
  const target = new Date(`${earliest}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

// 서로 가능한 날짜 중 가장 빠른 겹치는 날짜 — 매칭이 확정되는 실제 여행 날짜
export function getEarliestCommonDate(datesA: string[], datesB: string[]): string | null {
  const setB = new Set(datesB);
  const common = datesA.filter((date) => setB.has(date));
  return common.length > 0 ? [...common].sort()[0] : null;
}

export const MOCK_MATCHING_ID = "mock-matching-1";

export const MOCK_MATCH_PROFILE: MatchProfile = {
  attemptId: "mock-attempt-1",
  name: "유지민",
  age: 26,
  job: "디자이너",
  mbti: "ENFP",
  interestTags: ["사진찍기", "독서", "카페투어"],
  bio: "안녕하세요? 반가워요! 좋은 사람이에요",
  photoUrl: "/유지민.png",
  fullBodyPhotoUrl: "/유지민_전신.png",
  // 상대방은 항상 다음 30일 모두 가능하다고 가정해, 내가 어떤 날짜를 골라도 겹치도록 함
  availableDates: getAvailableDateOptions(AVAILABLE_DATE_RANGE_DAYS).map((option) => option.value),
};

// 매칭이 확정되면 백엔드가 내려주는 최종 테마 — 내가 매칭 조건에서 고른 themeIds와는 별개
export const MOCK_DECIDED_THEME_IDS = ["history"];

// 부가세 포함 총 결제 금액
export const MATCHING_SERVICE_FEE = 25000;
