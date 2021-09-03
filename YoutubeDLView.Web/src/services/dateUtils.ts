export const convertShortYTDate = (ytDate: string): string | null => {
  if (ytDate.length !== 8) return null;
  const year = +ytDate.substring(0, 4);
  const month = +ytDate.substring(4, 6);
  const day = +ytDate.substring(6, 8);
  const date = new Date(year, month, day);
  return date.toDateString();
};