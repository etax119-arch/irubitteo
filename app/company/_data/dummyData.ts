import type {
  AddWorkerForm,
} from '@/types/companyDashboard';

export const INITIAL_ADD_WORKER_FORM: AddWorkerForm = {
  name: '',
  ssn: '',
  phone: '',
  gender: '',
  emergencyName: '',
  emergencyRelation: '',
  emergencyPhone: '',
  disabilityType: '',
  disabilitySeverity: '',
  hireDate: '',
  recognitionDate: '',
  workDays: [],
  workStartTime: '',
  workerId: '',
};
