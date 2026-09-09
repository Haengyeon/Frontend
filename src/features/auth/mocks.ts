// TODO: 프로필 사진을 업로드하는 API가 아직 없어서(POST /profiles가 URL 문자열만 받음),
// 실제 파일 업로드 대신 고정 URL을 보낸다. 업로드 API가 생기면 실제 업로드 흐름으로 교체.
export const PLACEHOLDER_PROFILE_IMAGE_URL = "https://placehold.co/400x400?text=Profile";
export const PLACEHOLDER_FULL_BODY_IMAGE_URL = "https://placehold.co/400x800?text=FullBody";

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
  { userId: "9", name: "테스트유저(신규가입용)" },
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
