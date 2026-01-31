import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// ==========================================
// Configuration
// ==========================================

dayjs.extend(utc);
dayjs.extend(timezone);

// ==========================================
// Constants
// ==========================================

const TIMEZONE = "Asia/Tokyo" as const;
const DATE_FORMAT = "YYYY.MM.DD" as const;

// ==========================================
// Utility Functions
// ==========================================

/**
 * 日付文字列を日本時間のフォーマット済み文字列に変換
 * @param date - ISO 8601形式の日付文字列
 * @returns YYYY.MM.DD形式の日付文字列
 */
export const formatDate = (date: string): string =>
  dayjs(date).tz(TIMEZONE).format(DATE_FORMAT);
