export const authKeys = {
  all: ['auth'] as const,
  me: () => ['auth', 'me'] as const,
};

export const scheduleKeys = {
  all: ['schedules'] as const,
  monthly: (year: number, month: number) => ['schedules', 'monthly', year, month] as const,
  today: () => ['schedules', 'today'] as const,
};

export const noticeKeys = {
  all: ['notices'] as const,
  list: () => ['notices', 'list'] as const,
};

export const employeeKeys = {
  all: ['employees'] as const,
  me: () => ['employees', 'me'] as const,
  lists: () => ['employees', 'list'] as const,
  active: () => ['employees', 'list', 'active'] as const,
  list: (params: { filter: string; search: string; page: number; limit: number }) =>
    ['employees', 'list', 'filtered', params] as const,
  companyList: (params: { search: string; page: number; limit: number }) =>
    ['employees', 'list', 'company', params] as const,
  detail: (id: string) => ['employees', id] as const,
  files: (id: string) => ['employees', id, 'files'] as const,
};

export const attendanceKeys = {
  companyDaily: (date: string) => ['attendances', 'company-daily', date] as const,
  employeeHistory: (employeeId: string, params?: { page?: number; limit?: number; startDate?: string; endDate?: string }) =>
    ['attendances', 'employee', employeeId, params ?? {}] as const,
  myToday: () => ['attendances', 'my', 'today'] as const,
  myHistoryAll: () => ['attendances', 'my', 'history'] as const,
  myHistory: (params: { page: number; limit: number; startDate: string; endDate: string }) =>
    ['attendances', 'my', 'history', params] as const,
};

export const companyKeys = {
  all: ['companies'] as const,
  lists: () => ['companies', 'list'] as const,
  list: (params?: { filter: string; search: string; page: number; limit: number }) =>
    params
      ? (['companies', 'list', 'filtered', params] as const)
      : (['companies', 'list', 'filtered'] as const),
  detail: (id: string) => ['companies', id] as const,
  employees: (id: string, params?: { page: number; limit: number }) =>
    params
      ? (['companies', id, 'employees', params] as const)
      : (['companies', id, 'employees'] as const),
  files: (id: string) => ['companies', id, 'files'] as const,
};

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => ['admin', 'stats'] as const,
  dailyAttendance: (date: string, page?: number, search?: string) =>
    page !== undefined
      ? (['admin', 'daily-attendance', date, { page, search }] as const)
      : (['admin', 'daily-attendance', date] as const),
  accounts: () => ['admin', 'accounts'] as const,
  absenceAlerts: () => ['admin', 'absence-alerts'] as const,
  noteUpdates: () => ['admin', 'note-updates'] as const,
  notifAbsenceAlerts: () => ['admin', 'absence-alerts', 'notif'] as const,
  monthlyStats: (year: number, month: number, page?: number, search?: string) =>
    page !== undefined
      ? (['admin', 'monthly-stats', year, month, { page, search }] as const)
      : (['admin', 'monthly-stats', year, month] as const),
  files: (category: string) => ['admin', 'files', category] as const,
};

export const inquiryKeys = {
  pending: () => ['inquiries', 'pending'] as const,
};

export const resumeKeys = {
  pending: () => ['resumes', 'pending'] as const,
};

export const galleryKeys = {
  all: ['galleries'] as const,
  lists: () => ['galleries', 'list'] as const,
  adminList: (params?: { page: number; limit: number }) =>
    params
      ? (['galleries', 'list', 'admin', params] as const)
      : (['galleries', 'list', 'admin'] as const),
  detail: (id: string) => ['galleries', id] as const,
};

export const newsletterKeys = {
  all: ['newsletters'] as const,
  lists: () => ['newsletters', 'list'] as const,
  publicList: (params: { page: number; limit: number; search?: string }) =>
    ['newsletters', 'list', 'public', params] as const,
  adminList: (params?: { page: number; limit: number }) =>
    params
      ? (['newsletters', 'list', 'admin', params] as const)
      : (['newsletters', 'list', 'admin'] as const),
  detail: (id: string) => ['newsletters', id] as const,
};
