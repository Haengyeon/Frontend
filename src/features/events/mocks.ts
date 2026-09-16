import type { FestivalEvent } from "./types";

// 백엔드 축제/공연/행사 API가 아직 없어서(2026-09) 홈 배너를 mock 데이터로 채운다.
// API가 생기면 이 배열을 지우고 EventBannerSection을 실제 훅으로 바꾸면 된다.
export const MOCK_FESTIVAL_EVENTS: FestivalEvent[] = [
  {
    id: "1",
    title: "제4회 칠곡 트랜스미디어 축제",
    imageUrl: "https://placehold.co/400x300/c9d98a/2f3a20?text=%EC%B9%A0%EA%B3%A1",
    period: "2026. 9. 15. ~ 2026. 10. 25.",
  },
  {
    id: "2",
    title: "제18회 서울건축문화제",
    imageUrl: "https://placehold.co/400x300/1f2a44/e8b923?text=SAF+2026",
    period: "2026. 9. 15. ~ 2026. 10. 11.",
  },
  {
    id: "3",
    title: "포천 한탄강 가든페스타",
    imageUrl: "https://placehold.co/400x300/4c7a3f/ffffff?text=%ED%8F%AC%EC%B2%9C",
    period: "2026. 9. 12. ~ 2026. 11. 1.",
  },
];
