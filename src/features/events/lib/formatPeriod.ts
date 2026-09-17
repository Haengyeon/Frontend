function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

export function formatPeriod(startDate: string, endDate: string) {
  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
}
