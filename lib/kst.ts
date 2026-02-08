const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * UTC 타임스탬프(ISO string) → KST "HH:mm"
 * clockIn/clockOut 표시용
 */
export function formatUtcTimestampAsKST(isoString: string): string {
  const date = new Date(isoString);
  const kst = new Date(date.getTime() + KST_OFFSET_MS);
  const h = kst.getUTCHours().toString().padStart(2, '0');
  const m = kst.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * UTC 타임스탬프(ISO string) → KST "M월 D일" 형식
 * WorkRecordCard 날짜 표시용
 */
export function formatUtcTimestampAsKSTDate(isoString: string): string {
  const date = new Date(isoString);
  const kst = new Date(date.getTime() + KST_OFFSET_MS);
  const month = kst.getUTCMonth() + 1;
  const day = kst.getUTCDate();
  return `${month}월 ${day}일`;
}

/**
 * KST 날짜 + 시간 → ISO 8601 문자열 (KST 오프셋 포함)
 * 출퇴근 시간 수정 API 전송용
 */
export function buildKSTTimestamp(date: string, time: string): string {
  const hhmm = time.slice(0, 5);
  return `${date}T${hhmm}:00+09:00`;
}

/**
 * Date 객체 → KST "YYYY-MM-DD" 문자열
 * UTC 기준이 아닌 KST 기준 날짜 반환
 */
export function formatDateAsKST(date: Date): string {
  const kst = new Date(date.getTime() + KST_OFFSET_MS);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
