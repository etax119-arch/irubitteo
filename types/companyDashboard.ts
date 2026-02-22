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
  workerId: string;
}
