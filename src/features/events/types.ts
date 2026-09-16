// 백엔드가 아직 축제/공연/행사 API를 안 줘서(2026-09) 정확한 응답 스키마는 모른다.
// 화면에 필요한 필드만 우선 정의해두고, API가 오면 이 타입과 mocks.ts의 사용처를
// 실제 요청/훅으로 교체하면 된다.
export type FestivalEvent = {
  id: string;
  title: string;
  imageUrl: string;
  /** "2026. 9. 15. ~ 2026. 10. 25." 처럼 화면에 바로 쓸 수 있게 이미 포맷된 기간 */
  period: string;
};
