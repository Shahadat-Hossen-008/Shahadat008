import { format, isValid, parseISO } from "date-fns";

/** Shared date formatter for Sanity projections and frontend UI. */
export function formatDate(
  value: string | null | undefined,
  pattern = "LLL d, yyyy",
): string | null {
  if (!value) return null;

  const date = parseISO(value);
  return isValid(date) ? format(date, pattern) : null;
}
