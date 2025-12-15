export function formatDate(
  value: string | number | Date,
  options: Intl.DateTimeFormatOptions = {},
) {
  const date =
    typeof value === "string" || typeof value === "number"
      ? new Date(value)
      : value;

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    ...options,
  }).format(date);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
