import type { WorkDay, WorkTimeEntry, WorkTimesMap } from '@/types/employee';

export const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const;

export const LABEL_TO_NUM: Record<string, WorkDay> = {
  '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6, '일': 7,
};

export const NUM_TO_LABEL: Record<number, string> = {
  1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토', 7: '일',
};

export const DEFAULT_WORK_START = '09:00';
export const DEFAULT_WORK_END = '18:00';

/** "HH:mm" → 자정 기준 경과 분. 형식이 어긋나면 NaN */
export function hhmmToMinutes(hhmm: string): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm);
  if (!match) return NaN;
  return Number(match[1]) * 60 + Number(match[2]);
}

/** 한글 라벨 배열 → 요일 번호 오름차순 배열 */
export function labelsToSortedNums(labels: string[]): WorkDay[] {
  return labels
    .map((label) => LABEL_TO_NUM[label])
    .filter((n): n is WorkDay => n !== undefined)
    .sort((a, b) => a - b);
}

/** 요일 번호 배열 → 한글 라벨 배열 */
export function numsToLabels(days: number[]): string[] {
  return days.map((n) => NUM_TO_LABEL[n]).filter(Boolean);
}

/** 같은 시간대끼리 묶은 조회용 표시 데이터 */
export type GroupedWorkTime = { days: WorkDay[]; time: WorkTimeEntry };

/**
 * 근무요일을 같은 출퇴근 시간끼리 묶는다.
 * 요일별 값이 없는 날은 건너뛴다 — 단일 시간 컬럼은 서버가 도출한 대표 범위라
 * 그걸 특정 요일의 시간으로 표시하면 실제로 일하지 않는 시간대가 나온다.
 *
 * 예) 월·수·금 09:00~18:00 / 화·목 13:00~18:00 → 2개 그룹
 */
export function groupWorkTimes(
  workDays: WorkDay[],
  workTimes: WorkTimesMap,
): GroupedWorkTime[] {
  const groups: GroupedWorkTime[] = [];

  for (const day of workDays) {
    const time = workTimes[`${day}`];
    if (!time) continue;

    const existing = groups.find(
      (g) => g.time.start === time.start && g.time.end === time.end,
    );
    if (existing) {
      existing.days.push(day);
    } else {
      groups.push({ days: [day], time });
    }
  }

  return groups;
}

/** 요일별 맵 → 대표 범위 (가장 이른 출근 ~ 가장 늦은 퇴근) */
export function deriveWorkTimeRange(map: WorkTimesMap): WorkTimeEntry {
  const entries = Object.values(map).filter(Boolean) as WorkTimeEntry[];
  return {
    start: entries.map((e) => e.start).sort()[0],
    end: entries.map((e) => e.end).sort().at(-1)!,
  };
}

/** 요일별 모드를 켤 때, 아직 값이 없는 근무요일을 기본 시간으로 채운다 */
export function fillMissingWorkTimes(
  map: WorkTimesMap,
  days: WorkDay[],
  fallback: WorkTimeEntry,
): WorkTimesMap {
  const next: WorkTimesMap = { ...map };
  for (const day of days) {
    if (!next[`${day}`]) next[`${day}`] = { ...fallback };
  }
  return next;
}

/** 한 요일의 출근 또는 퇴근 시간만 갱신한다 */
export function patchWorkTime(
  map: WorkTimesMap,
  day: WorkDay,
  field: 'start' | 'end',
  value: string,
  fallback: WorkTimeEntry,
): WorkTimesMap {
  const current = map[`${day}`] ?? fallback;
  return { ...map, [`${day}`]: { ...current, [field]: value } };
}

export type WorkTimesPayload =
  | { ok: true; workTimes: WorkTimesMap | null; start: string; end: string }
  | { ok: false; message: string };

/**
 * 저장 직전 검증 + 전송할 근무시간 페이로드 생성.
 *
 * 서버 400 왕복을 피하려고 같은 규칙을 클라이언트에서 먼저 확인한다.
 * 요일별 모드일 때 단일 시간 컬럼은 대표 범위로 맞춰 보낸다
 * (서버도 동일하게 도출하지만, 요청과 응답이 어긋나 보이지 않게 함).
 *
 * @param requireEnd 퇴근 시간 필수 여부 — 근로자 등록은 선택 입력이다
 */
export function buildWorkTimesPayload(params: {
  days: WorkDay[];
  perDayEnabled: boolean;
  workTimes: WorkTimesMap;
  start: string;
  end: string;
  requireEnd?: boolean;
}): WorkTimesPayload {
  const { days, perDayEnabled, workTimes, start, end, requireEnd = true } = params;

  if (days.length === 0) {
    return { ok: false, message: '근무 요일을 1개 이상 선택해주세요.' };
  }

  if (!perDayEnabled) {
    if (!start || (requireEnd && !end)) {
      return { ok: false, message: '출퇴근 시간을 입력해주세요.' };
    }
    if (end && hhmmToMinutes(start) >= hhmmToMinutes(end)) {
      return { ok: false, message: '퇴근 시간은 출근 시간보다 늦어야 합니다.' };
    }
    return { ok: true, workTimes: null, start, end };
  }

  const picked: WorkTimesMap = {};
  for (const day of days) {
    const entry = workTimes[`${day}`];
    if (!entry?.start || !entry?.end) {
      return { ok: false, message: '모든 근무 요일의 출퇴근 시간을 입력해주세요.' };
    }
    if (hhmmToMinutes(entry.start) >= hhmmToMinutes(entry.end)) {
      return {
        ok: false,
        message: `${NUM_TO_LABEL[day]}요일의 퇴근 시간은 출근 시간보다 늦어야 합니다.`,
      };
    }
    picked[`${day}`] = entry;
  }

  return { ok: true, workTimes: picked, ...deriveWorkTimeRange(picked) };
}
