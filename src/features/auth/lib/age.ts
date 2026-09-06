export const MIN_SIGNUP_AGE = 20;

/** 생년월일(YYYY-MM-DD)로 만 나이를 계산한다. 서버가 age를 계산하는 방식과 동일해야 클라이언트 검증이 서버와 어긋나지 않는다. */
export function calculateAge(birthDate: string): number | null {
  const parsed = new Date(birthDate);
  if (Number.isNaN(parsed.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - parsed.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > parsed.getMonth() ||
    (now.getMonth() === parsed.getMonth() && now.getDate() >= parsed.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;

  return age;
}
