import { string } from "zod";

export function diffDays(
  date_start: string | Date,
  date_end: string | Date
): number {
  if (typeof date_start == "string") {
    date_start = new Date(date_start);
  }
  if (typeof date_end == "string") {
    date_end = new Date(date_end);
  }
  const timeDiff = Math.abs(date_end.getTime() - date_start.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}
export function createStringDateByFormat(
  date: string,
  format: "en" | "fa" = "fa",
  separator: string = "-"
): string {
  const tDate = new Date(date);
  let options: [{ day: string }, { month: string }, { year: string }] = [
    { day: "numeric" },
    { month: "numeric" },
    { year: "numeric" },
  ];
  function formatter(option: { [key: string]: string }): string {
    let formatter = new Intl.DateTimeFormat(format, option);
    return formatter.format(tDate);
  }

  return options.map(formatter).join(separator);
}
