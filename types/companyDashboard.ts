import type { WorkTimesMap } from '@/types/employee';

export interface AddWorkerForm {
  name: string;
  ssn: string;
  phone: string;
  gender: '남' | '여' | '';
  addressCity: string;
  addressDistrict: string;
  addressDetail: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  disabilityType: string;
  disabilitySeverity: '중증' | '경증' | '';
  hireDate: string;
  recognitionDate: string;
  workDays: string[];
  workStartTime: string;
  workEndTime: string;
  /** 요일별로 다른 출퇴근 시간을 쓸지 여부 */
  perDayWorkTime: boolean;
  /** perDayWorkTime이 true일 때만 사용 */
  workTimes: WorkTimesMap;
  workerId: string;
  annualLeave: string;
}
