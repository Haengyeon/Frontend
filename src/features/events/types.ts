// 실서버(/api-json) GET /festivals 기준.
export type Festival = {
  contentId: string;
  name: string;
  startDate: string;
  endDate: string;
  /** 공공누리 제3유형 포스터 — 출처(한국관광공사) 표시 필수, 이미지 변형(자르기 등) 금지 */
  imageUrl: string;
  address: string;
};

export type FestivalListResponse = {
  items: Festival[];
  nextCursor: string | null;
  hasMore: boolean;
};
