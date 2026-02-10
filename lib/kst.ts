const kstTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Seoul',
});

const kstMonthDayFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'numeric',
  day: 'numeric',
  timeZone: 'Asia/Seoul',
});

/**
 * UTC 타임스탬프(ISO string) → KST "HH:mm"
 * clockIn/clockOut 표시용
 */
export function formatUtcTimestampAsKST(isoString: string): string {
  const date = new Date(isoString);
  const parts = kstTimeFormatter.formatToParts(date);
  const h = parts.find(p => p.type === 'hour')?.value ?? '00';
  const m = parts.find(p => p.type === 'minute')?.value ?? '00';
  return `${h}:${m}`;
}

/**
 * UTC 타임스탬프(ISO string) → KST "M월 D일" 형식
 * WorkRecordCard 날짜 표시용
 */
export function formatUtcTimestampAsKSTDate(isoString: string): string {
  return kstMonthDayFormatter.format(new Date(isoString));
}

/**
 * KST 날짜 + 시간 → ISO 8601 문자열 (KST 오프셋 포함)
 * 출퇴근 시간 수정 API 전송용
 */
export function buildKSTTimestamp(date: string, time: string): string {
  const hhmm = time.slice(0, 5);
  return `${date}T${hhmm}:00+09:00`;
}

const kstDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Seoul',
});

/**
 * Date 객체 → KST "YYYY-MM-DD" 문자열
 * UTC 기준이 아닌 KST 기준 날짜 반환
 */
export function formatDateAsKST(date: Date): string {
  const parts = kstDateFormatter.formatToParts(date);
  const y = parts.find(p => p.type === 'year')?.value;
  const m = parts.find(p => p.type === 'month')?.value;
  const d = parts.find(p => p.type === 'day')?.value;
  return `${y}-${m}-${d}`;
}

/**
 * UTC 타임스탬프(ISO string) → KST "YYYY.MM.DD" 형식
 * 공지사항 날짜 표시용
 */
export function formatKSTDate(isoString: string): string {
  const date = new Date(isoString);
  const parts = kstDateFormatter.formatToParts(date);
  const y = parts.find(p => p.type === 'year')?.value;
  const m = parts.find(p => p.type === 'month')?.value;
  const d = parts.find(p => p.type === 'day')?.value;
  return `${y}.${m}.${d}`;
}

/**
 * UTC 타임스탬프(ISO string) → KST 날짜+시간 문자열
 * 공지사항 발송 기록 표시용
 */
export function formatKSTDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  });
}
