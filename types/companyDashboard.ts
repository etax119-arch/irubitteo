export interface AddWorkerForm {
  name: string;
  ssn: string;
  phone: string;
  gender: string;
  addressCity: string;
  addressDistrict: string;
  addressDetail: string;
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

export type TabId = 'dashboard' | 'employees' | 'attendance' | 'notices';
