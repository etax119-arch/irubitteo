export interface DailyAttendanceRecord {
  id: number;
  name: string;
  phone: string;
  checkinTime: string | null;
  checkoutTime: string | null;
  status: 'checkin' | 'checkout' | 'absent' | 'pending';
  workDone: string;
}

export interface CompanyEmployee {
  id: number;
  name: string;
  phone: string;
  disability: string;
  hireDate: string;
  contractEnd: string;
  status: 'checkin' | 'checkout' | 'absent' | 'resigned';
  checkinTime: string | null;
  checkoutTime: string | null;
  workerId: string;
  notes: string;
  isResigned: boolean;
  resignDate: string | null;
  resignReason: string | null;
}

export interface ScheduleEntry {
  workType: string;
  startTime: string;
  endTime: string;
  workers: number;
  color: string;
}

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

export interface ScheduleForm {
  workType: string;
}

export type TabId = 'dashboard' | 'employees' | 'attendance' | 'notices';
