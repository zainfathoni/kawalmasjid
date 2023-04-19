import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

require("dayjs/locale/id");

dayjs.extend(relativeTime);

export { dayjs };

export function getCurrentYear() {
  return new Date().getFullYear();
}

/**
 * Date time format
 */

export function formatDateTime(date: string | Date | undefined) {
  return dayjs(date).locale("id").format("H:mm [on] D MMM YYYY");
}

export function formatDateTimeTimezone(date: string | Date | undefined) {
  return dayjs(date).locale("id").format("D MMM YYYY, H:mm:ss Z");
}

export function formatDate(date: string | Date | undefined) {
  return dayjs(date).locale("id").format("D MMM YYYY");
}

export function formatDateLastMod(date: string | Date | undefined) {
  return dayjs(date).locale("id").format("YYYY-MM-DD");
}

/**
 * Relative time
 */

export function formatRelativeTime(date: string | Date | undefined) {
  return dayjs(date).locale("id").fromNow();
}

/**
 * Converter
 */

export function convertDaysToSeconds(days: number) {
  // seconds * minutes * hours * days
  return 60 * 60 * 24 * days;
}
