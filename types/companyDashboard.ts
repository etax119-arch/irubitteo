/** @todo 서버 일정 API 구현 후 재정의 — 현재는 디자인 목업 기준 */
export interface ScheduleEntry {
  workType: string;
  startTime: string;
  endTime: string;
  workers: number;
  color: string;
}

/** @todo 서버 공지 API 구현 후 재정의 — 현재는 디자인 목업 기준 */
export interface SentNotice {
  id: number;
  date: string;
  workers: string[];
  content: string;
  sender: string;
}

export interface AddWorkerForm {
  name: string;
  ssn: string;
  phone: string;
  gender: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  disabilityType: string;
  disabilitySeverity: string;
  hireDate: string;
  recognitionDate: string;
  workDays: string[];
  workStartTime: string;
  workerId: string;
}

/** @todo 서버 일정 API 구현 후 재정의 */
export interface ScheduleForm {
  workType: string;
}

/** @todo 서버 API 구현 후 재정의 */
export type TabId = 'dashboard' | 'employees' | 'attendance' | 'notices';
