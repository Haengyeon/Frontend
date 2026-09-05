// 추천 관광지 API는 address 원문(예: "경상북도 구미시 낙동강변로 694-2 (비산동)")만 주고
// 시군구를 따로 안 잘라준다. "세종특별자치시 한누리대로 2130"처럼 시/도 하나로 끝나는
// 주소도 있어서, 두 번째 토큰을 그대로 쓰지 않고 시/군/구로 끝나는 토큰 중 가장 뒤(가장
// 구체적인 값)를 찾는다.
export function extractDistrict(address: string): string | null {
  const districts = address
    .trim()
    .split(/\s+/)
    .filter((part) => /(?:시|군|구)$/.test(part));

  return districts.length > 0 ? districts[districts.length - 1] : null;
}
