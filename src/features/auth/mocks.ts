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
// 백엔드 prisma/seed.ts 기준(2026-09-13, 18명으로 확대됨). 전부 프로필이 이미 있는 상태라
// 온보딩(회원가입) 화면을 새로 테스트하려면 계정 하나의 Profile을 지워야 한다.
export const DEV_SEED_USERS = [
  { userId: "1", name: "김민준" },
  { userId: "2", name: "이도윤" },
  { userId: "3", name: "박현우" },
  { userId: "4", name: "최우진" },
  { userId: "9", name: "오지호" },
  { userId: "10", name: "신재현" },
  { userId: "11", name: "배준영" },
  { userId: "12", name: "임태균" },
  { userId: "13", name: "노시윤" },
  { userId: "5", name: "장정운" },
  { userId: "6", name: "곽소정" },
  { userId: "7", name: "한서연" },
  { userId: "8", name: "윤아름" },
  { userId: "14", name: "유하린" },
  { userId: "15", name: "서지안" },
  { userId: "16", name: "강예린" },
  { userId: "17", name: "조민서" },
  { userId: "18", name: "백가온" },
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
