import { CURRENT_YEAR } from "@/features/matching/mocks";
import type { ProfileDraft } from "./types";

export const MOCK_MY_PROFILE: ProfileDraft = {
  basicInfo: {
    name: "정우진",
    birthYear: CURRENT_YEAR - 27,
    gender: "male",
    jobCategory: "IT・개발",
    isJobCategoryPrivate: false,
  },
  photos: [],
  bio: "함께 걸으며 이야기 나누는 걸 좋아해요",
  mbti: { EI: "E", SN: "N", TF: "F", JP: "P" },
  isMbtiPrivate: false,
  interestTags: ["카페", "사진", "바다"],
};

export const JOB_CATEGORIES = [
  "IT・개발",
  "디자인",
  "마케팅",
  "교육",
  "의료・보건",
  "법률",
  "금융",
  "건축・공학",
  "예술・창작",
  "프리랜서",
  "학생",
  "연구",
  "공공・행정",
  "미디어・출판",
  "서비스업",
];

// [개발용] 카카오 계정 없이 dev-token으로 로그인할 수 있는 시드 계정 (isDummy=true만 발급됨)
export const DEV_SEED_USERS = [
  { userId: "1", name: "김민준" },
  { userId: "2", name: "이도윤" },
  { userId: "3", name: "박현우" },
  { userId: "4", name: "최우진" },
  { userId: "5", name: "장정운" },
  { userId: "6", name: "곽소정" },
  { userId: "7", name: "한서연" },
  { userId: "8", name: "윤아름" },
];

export const MAX_INTEREST_TAGS = 5;

export const INTEREST_TAGS = [
  "예술",
  "카페",
  "맛집",
  "독서",
  "운동",
  "IT",
  "요리",
  "바다",
  "영화",
  "전시",
  "사진",
  "동물",
  "음악",
  "액티비티",
  "역사",
];
