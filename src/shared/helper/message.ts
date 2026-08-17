export function isPresentBefore(beforeLast: string, code: string) {
  return beforeLast?.startsWith(code);
}
export const convertDateTime = (date: string) => {
  if (typeof window === "undefined") return;
  // hydration error can be occrred
  const today = new Date().getDate();
  const thisMonth = new Date().getMonth();

  const postedDay = new Date(date).getDate();
  const postedMonth = new Date(date).getMonth();
  const dayToModify = new Date(date);

  const day =
    today == postedDay && postedMonth == thisMonth
      ? "Today"
      : postedDay == today - 1
        ? "Yesterday"
        : "";

  if (
    (today == postedDay && postedMonth == thisMonth) ||
    postedDay == today - 1
  ) {
    const hour = dayToModify.getHours();
    const min = String(dayToModify.getMinutes()).padStart(2, "0");
    return `${day} at ${hour}:${min}`;
  }
  return dayToModify.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
