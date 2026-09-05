// 추천 관광지 API는 address 원문(예: "경상북도 구미시 낙동강변로 694-2 (비산동)")만 주고
// 시군구를 따로 안 잘라준다. 국내 주소는 "시/도 시/군/구 ..." 순서라 두 번째 토큰이 시군구다.
export function extractDistrict(address: string): string | null {
  const [, district] = address.trim().split(/\s+/);
  return district ?? null;
}
