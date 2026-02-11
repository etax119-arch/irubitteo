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
export const scheduleKeys = {
  all: ['schedules'] as const,
  monthly: (year: number, month: number) => ['schedules', 'monthly', year, month] as const,
  today: () => ['schedules', 'today'] as const,
};
```

### 규칙

1. `all` — 해당 도메인의 모든 캐시를 무효화할 때 사용
2. 세부 키는 `all`의 prefix를 공유하여 `invalidateQueries({ queryKey: keys.all })`로 일괄 무효화 가능
3. 파라미터가 있는 키는 함수로 정의

---

## 새 도메인 마이그레이션 가이드

### 1단계: Query Key 추가 (`lib/query/keys.ts`)

```typescript
export const noticeKeys = {
  all: ['notices'] as const,
  list: () => ['notices', 'list'] as const,
};
```

### 2단계: Query 훅 작성 (`hooks/use{Domain}Query.ts`)

```typescript
export function useNotices() {
  return useQuery({
    queryKey: noticeKeys.list(),
    queryFn: () => noticeApi.getAll(),
    select: (data) => data.notices,
  });
}
```

### 3단계: Mutation 훅 작성 (`hooks/use{Domain}Mutations.ts`)

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
| `/company/schedule` | `hooks/useScheduleQuery.ts`, `hooks/useScheduleMutations.ts` |
| `/company/notices` | `hooks/useNoticeQuery.ts`, `hooks/useNoticeMutations.ts` |
| `/company/employees` | `hooks/useEmployeeQuery.ts`, `hooks/useEmployeeMutations.ts` |
| `/company/dashboard` | `hooks/useDashboardQuery.ts` (staleTime: 60s + 리프레시 버튼) |
| `/admin/companies` | `hooks/useCompanyQuery.ts`, `hooks/useCompanyMutations.ts` |
| `/admin/employees` | `hooks/useEmployeeQuery.ts` — `useAdminEmployees` (staleTime: 5min + refresh + debounced search) |
| `/admin/dashboard` | `hooks/useAdminDashboardQuery.ts` — `useAdminStats`, `useAdminDailyAttendance`, `useAbsenceAlerts` (staleTime: 60s + refresh) |
| `/admin/workstats` | `hooks/useAdminWorkstatsQuery.ts` — `useAdminMonthlyStats`, `useCalculateMonthlyStats`, `useUpdateMonthlyStats` (staleTime: Infinity + optimistic update) |
| `/admin/notifications` | `hooks/useAdminNotificationsQuery.ts` — 3 queries + 3 mutations (staleTime: 30s) |
| `/admin/reports` | `hooks/useAdminReportsQuery.ts` — 1 query + 2 mutations (staleTime: Infinity) |

### 우선순위 1 — 기업 대시보드
- `/company/employees/[id]` — 다수 훅

### 대상 제외 — 직원 앱

- `/employee` — 탭 기반 라우팅이 아닌 단일 페이지 구조로 캐시 이점 없음. TanStack Query 적용 불필요.
