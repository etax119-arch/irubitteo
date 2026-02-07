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
  id: string;
  name: string;
  phone: string;
  disability: string | null;
  hireDate: string;
  contractEndDate: string | null;
  status: 'checkin' | 'checkout' | 'absent' | 'resigned';
  checkinTime: string | null;
  checkoutTime: string | null;
  uniqueCode: string;
  companyNote: string | null;
  isActive: boolean;
  resignDate: string | null;
  resignReason: string | null;
  workDays: number[];
  workStartTime: string | null;
  disabilityType: string | null;
  disabilitySeverity: string | null;
  disabilityRecognitionDate: string | null;
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
