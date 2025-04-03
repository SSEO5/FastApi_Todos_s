export function formatDate(dateString: string) {
  const [, month, day] = dateString.split("-");
  return `${parseInt(month)}월 ${parseInt(day)}일`;
}
