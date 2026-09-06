/** YYYY-MM-DD 날짜 문자열까지 남은 일수. 오늘이면 0, 지났으면 음수. */
export function calculateDday(dateStr: string): number {
  const target = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = target.getTime() - startOfToday.getTime();
  return Math.round(diffMs / (24 * 60 * 60 * 1000));
}
