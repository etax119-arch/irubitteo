# TanStack Query 가이드

## 도입 배경

기업/관리자 대시보드는 라우트 기반 탭 구조(`Link` 컴포넌트)를 사용합니다. 탭 전환 시 이전 페이지가 언마운트되고 새 페이지가 마운트되면서 매번 API를 다시 호출하여 로딩이 발생했습니다.

TanStack Query의 캐싱을 도입하여 탭 전환 시 캐시된 데이터를 즉시 표시하고, 데이터 변경(mutation) 시에만 refetch하도록 개선합니다.

---

## 설정 구조

```
lib/query/
├── client.ts          # QueryClient 설정 (브라우저 싱글턴)
├── QueryProvider.tsx   # 'use client' Provider 래퍼
└── keys.ts            # Query Key 팩토리
```

### QueryClient 기본 설정 (`lib/query/client.ts`)

| 옵션 | 값 | 설명 |
|------|----|------|
| `staleTime` | `Infinity` | mutation의 `invalidateQueries` 호출 전까지 refetch 없음 |
| `gcTime` | `30 * 60 * 1000` | 탭 이동 후 30분간 캐시 유지 |
| `refetchOnWindowFocus` | `false` | 윈도우 포커스 시 자동 refetch 비활성화 |

### Provider (`app/layout.tsx`)

```tsx
<body className="antialiased">
  <QueryProvider>
    {children}
  </QueryProvider>
  <ToastContainer />  {/* Zustand 기반이므로 QueryProvider 밖에 유지 */}
</body>
```

---

## 캐시 정책

- **staleTime: Infinity** — 데이터가 "stale"로 표시되지 않으므로, 컴포넌트 마운트/언마운트 시 refetch하지 않음
- **mutation 성공 시 `invalidateQueries`** — 캐시를 무효화하면 마운트된 쿼리가 자동 refetch
- **gcTime: 30분** — 언마운트된 쿼리의 캐시를 30분간 보관 (탭 복귀 시 즉시 표시)

### 서버 사이드 페이지네이션 패턴

페이지네이션 파라미터(page, limit, search)를 Query Key에 포함하여 페이지별 캐시를 분리합니다:

```typescript
// Query Key에 페이지네이션 파라미터 포함
employeeKeys.list({ filter, search, page, limit })
companyKeys.list({ filter, search, page, limit })
adminKeys.monthlyStats(year, month, page, search)
adminKeys.dailyAttendance(date, page, search)
attendanceKeys.myHistory({ page, limit, startDate, endDate })
```

- **`placeholderData: keepPreviousData`** — 페이지 전환 시 이전 데이터를 유지하여 깜빡임 방지
- **검색 디바운싱 (300ms)** — 입력마다 API 호출하지 않고 300ms 대기 후 요청
- **`PaginationBar` 컴포넌트** — `@/components/ui/PaginationBar`로 이전/다음 네비게이션 제공

### 도메인별 staleTime 가이드

실시간성이 필요한 도메인은 `staleTime`을 개별 쿼리에서 오버라이드합니다:

| 도메인 | staleTime | 이유 |
|--------|-----------|------|
| 근무일정 | `Infinity` | 등록/수정 시에만 변경 |
| 공지사항 | `Infinity` | 발송 시에만 변경 |
| 근로자 목록 | `5min` | 다른 사용자에 의한 변경 가능 |
| 대시보드 (출퇴근 현황) | `60s` | 실시간성 필요 |

---

## Query Key 규칙

`lib/query/keys.ts`에 도메인별 키 팩토리를 정의합니다:

```typescript
export const authKeys = {
  all: ['auth'] as const,
  me: () => ['auth', 'me'] as const,
};

export const employeeKeys = {
  all: ['employees'] as const,
  me: () => ['employees', 'me'] as const,
  lists: () => ['employees', 'list'] as const,
  active: () => ['employees', 'list', 'active'] as const,
  list: (params: { filter, search, page, limit }) =>
    ['employees', 'list', 'filtered', params] as const,
  companyList: (params: { search, page, limit }) =>
    ['employees', 'list', 'company', params] as const,
  detail: (id: string) => ['employees', id] as const,
  files: (id: string) => ['employees', id, 'files'] as const,
};

export const companyKeys = {
  all: ['companies'] as const,
  lists: () => ['companies', 'list'] as const,
  list: (params?: { filter, search, page, limit }) => [...],
  detail: (id: string) => ['companies', id] as const,
  employees: (id: string, params?: { page, limit }) => [...],
  files: (id: string) => ['companies', id, 'files'] as const,
};

export const adminKeys = {
  // 페이지네이션 파라미터 포함 키
  dailyAttendance: (date, page?, search?) => ['admin', 'daily-attendance', date, { page, search }],
  monthlyStats: (year, month, page?, search?) => ['admin', 'monthly-stats', year, month, { page, search }],
  // ...
};
```

### 규칙

1. `all` — 해당 도메인의 모든 캐시를 무효화할 때 사용
2. `lists()` — 목록 쿼리만 무효화할 때 사용 (상세/파일 캐시는 유지)
3. 세부 키는 `all`의 prefix를 공유하여 계층적 무효화 가능
4. 파라미터가 있는 키는 함수로 정의

### 캐시 무효화 전략

목록 변경 mutation 시 `lists()` 단위로 무효화하여 범위를 최소화합니다:

```typescript
// 좋은 예: lists() 단위 무효화 → 상세/파일 캐시 보존
queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });

// 나쁜 예: all 단위 무효화 → 불필요한 상세/파일 refetch 발생
queryClient.invalidateQueries({ queryKey: employeeKeys.all });
```

`invalidateQueries`는 prefix matching이므로 `lists()`를 무효화하면 `list(params)`, `active()`, `companyList(params)` 등 하위 키가 모두 무효화됩니다.

---

## 새 도메인 마이그레이션 가이드

### 1단계: Query Key 추가 (`lib/query/keys.ts`)

```typescript
export const noticeKeys = {
  all: ['notices'] as const,
  list: () => ['notices', 'list'] as const,
};
```

### 2단계: Query 훅 작성

파일 위치: 여러 라우트에서 공유하면 `hooks/`, 단일 라우트 전용이면 `app/{route}/_hooks/`

```typescript
export function useNotices() {
  return useQuery({
    queryKey: noticeKeys.list(),
    queryFn: () => noticeApi.getAll(),
    select: (data) => data.notices,
  });
}
```

### 3단계: Mutation 훅 작성 (Query와 같은 위치에 배치)

```typescript
export function useCreateNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NoticeCreateInput) => noticeApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
  });
}
```

### 4단계: 페이지 리팩토링

- `useEffect` + `fetchXxx` 패턴 제거
- `useQuery` 훅으로 대체 (year/month 등 파라미터 변경 시 자동 fetch)
- `useState`의 `isSaving` → `mutation.isPending`으로 대체
- try/catch 보일러플레이트 → `mutate()` + `onSuccess`/`onError` 콜백

### 5단계: 기존 훅 삭제

기존 `useState`/`useCallback` 기반 훅 파일 삭제.

---

## 마이그레이션 대상

### 완료

| 페이지 | 파일 |
|--------|------|
| `/company/schedule` | `app/company/_hooks/useScheduleQuery.ts`, `app/company/_hooks/useScheduleMutations.ts` |
| `/company/notices` | `app/company/_hooks/useNoticeQuery.ts`, `app/company/_hooks/useNoticeMutations.ts` |
| `/company/employees` | `hooks/useEmployeeQuery.ts`, `hooks/useEmployeeMutations.ts` (공유) |
| `/company/dashboard` | `app/company/_hooks/useDashboardQuery.ts` (staleTime: 60s + 리프레시 버튼) |
| `/admin/companies` | `app/admin/_hooks/useCompanyQuery.ts`, `app/admin/_hooks/useCompanyMutations.ts`, `app/admin/_hooks/useCompanyFiles.ts` |
| `/admin/employees` | `hooks/useEmployeeQuery.ts` — `useAdminEmployees` (공유, staleTime: 5min + refresh + debounced search) |
| `/admin/dashboard` | `app/admin/_hooks/useAdminDashboardQuery.ts` — `useAdminStats`, `useAdminDailyAttendance`, `useAbsenceAlerts` (staleTime: 60s + refresh) |
| `/admin/workstats` | `app/admin/_hooks/useAdminWorkstats.ts` — `useAdminMonthlyStats`, `useCalculateMonthlyStats`, `useUpdateMonthlyStats` (staleTime: Infinity + optimistic update) |
| `/admin/notifications` | `app/admin/_hooks/useAdminNotificationQuery.ts` — 3 queries, `app/admin/_hooks/useAdminNotificationMutations.ts` — 3 mutations (staleTime: 30s) |
| `/admin/reports` | `app/admin/_hooks/useAdminReports.ts` — 1 query + 2 mutations (staleTime: Infinity) |
| `/company/employees/[id]` | `hooks/useEmployeeQuery.ts`, `hooks/useEmployeeMutations.ts`, `hooks/useEmployeeFiles.ts`, `hooks/useAttendanceQuery.ts`, `hooks/useAttendanceMutations.ts` (공유) |
| 인증 (`useAuth`) | `hooks/useAuthQuery.ts` — `useAuthQuery` (staleTime: 5분, retry: false), `hooks/useAuth.ts` — Zustand 동기화 |
| `/employee` (출퇴근 앱) | `app/employee/_hooks/useMyAttendanceQuery.ts` — `useMyTodayAttendance`, `useMyAttendanceHistory` (staleTime: 30s, status=checkout 서버 필터, 페이지네이션 limit=20), `app/employee/_hooks/useMyAttendanceMutations.ts` — `useClockIn`, `useClockOut`, `useAddPhotos`, `useDeletePhoto`, `app/employee/_hooks/useMyScheduleToday.ts` — `useMyScheduleToday` (staleTime: 5min, 휴일 판정), `app/employee/_hooks/useMyProfile.ts` — `useMyProfile` (staleTime: 5min, workDays 비근무일 판정) |

### 네이밍 규칙

| 파일 구성 | 네이밍 패턴 | 예시 |
|-----------|------------|------|
| Query만 | `use{Domain}Query.ts` | `useNoticeQuery.ts`, `useDashboardQuery.ts` |
| Mutation만 | `use{Domain}Mutations.ts` | `useNoticeMutations.ts`, `useScheduleMutations.ts` |
| Query + Mutation 혼합 | `use{Domain}.ts` (Query 접미사 없음) | `useAdminWorkstats.ts`, `useCompanyFiles.ts`, `useEmployeeFiles.ts` |
