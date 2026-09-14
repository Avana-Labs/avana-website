/** Format an English content date in the target locale. */
export function formatContentDate(date: string, locale: string, compact = false): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: compact ? "short" : "long",
      day: "numeric",
    }).format(parsed)
  } catch {
    return date
  }
}
