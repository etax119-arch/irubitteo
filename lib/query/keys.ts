export const scheduleKeys = {
  all: ['schedules'] as const,
  monthly: (year: number, month: number) => ['schedules', 'monthly', year, month] as const,
};

export const noticeKeys = {
  all: ['notices'] as const,
  list: () => ['notices', 'list'] as const,
};

export const employeeKeys = {
  all: ['employees'] as const,
  active: () => ['employees', 'active'] as const,
  list: (params: { filter: string; search: string }) =>
    ['employees', 'list', params] as const,
};

export const attendanceKeys = {
  companyDaily: (date: string) => ['attendances', 'company-daily', date] as const,
};

export const companyKeys = {
  all: ['companies'] as const,
  list: () => ['companies', 'list'] as const,
};

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => ['admin', 'stats'] as const,
  dailyAttendance: (date: string) => ['admin', 'daily-attendance', date] as const,
  absenceAlerts: () => ['admin', 'absence-alerts'] as const,
  noteUpdates: () => ['admin', 'note-updates'] as const,
  notifAbsenceAlerts: () => ['admin', 'absence-alerts', 'notif'] as const,
  monthlyStats: (year: number, month: number) => ['admin', 'monthly-stats', year, month] as const,
  files: (category: string) => ['admin', 'files', category] as const,
};

export const inquiryKeys = {
  pending: () => ['inquiries', 'pending'] as const,
};
