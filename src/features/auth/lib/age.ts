export const MIN_SIGNUP_AGE = 20;

/**
 * 생년월일(YYYY-MM-DD)로 만 나이를 계산한다. 서버가 age를 계산하는 방식과 동일해야 클라이언트 검증이 서버와 어긋나지 않는다.
 * `new Date(string)`은 YYYY-MM-DD를 UTC 자정으로 해석해 로컬 타임존에 따라 하루 어긋날 수 있으므로,
 * 연·월·일을 직접 분리해 로컬 달력 날짜로 계산한다.
 */
export function calculateAge(birthDate: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return null;
  }

  const now = new Date();
  let age = now.getFullYear() - parsed.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > parsed.getMonth() ||
    (now.getMonth() === parsed.getMonth() && now.getDate() >= parsed.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;

  return age;
}
