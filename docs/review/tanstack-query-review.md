# TanStack Query 사용 현황 리뷰

## 1. 인프라 구성

### QueryClient 설정 (`lib/query/client.ts`)

| 옵션 | 값 | 비고 |
|------|-----|------|
| `staleTime` | `Infinity` | 명시적 invalidate 없이는 refetch 안 함 |
| `gcTime` | 30분 | 비활성 쿼리 30분 후 GC |
| `refetchOnWindowFocus` | `false` | 탭 전환 시 refetch 방지 |
| `retry` | `1` | 1회 재시도 |

### Query Keys (`lib/query/keys.ts`)

8개 도메인에 대한 팩토리 패턴 정의:

```
authKeys       - all, me()
scheduleKeys   - all, monthly(year, month)
noticeKeys     - all, list()
employeeKeys   - all, lists(), active(), list(params), companyList(params), detail(id), files(id)
attendanceKeys - companyDaily(date), employeeHistory(employeeId, params?),
                 myToday(), myHistoryAll(), myHistory(params)
companyKeys    - all, lists(), list(params?), detail(id), employees(id), files(id)
adminKeys      - all, stats(), dailyAttendance(date, page?, search?), accounts(),
                 absenceAlerts(), noteUpdates(), notifAbsenceAlerts(),
                 monthlyStats(year, month, page?, search?), files(category)
inquiryKeys    - pending()
```

### QueryProvider (`lib/query/QueryProvider.tsx`)

- 싱글턴 패턴의 `QueryClient` 사용
- `ReactQueryDevtools` 포함 (lazy import)

---

## 2. staleTime 현황

### 기본값 (Infinity) 사용 훅

| 훅 | 데이터 특성 | 평가 |
|-----|-----------|------|
| `useNotices` | 공지 목록 | mutation 시 invalidate → 단일 세션 OK |
| `useMonthlySchedules` | 월간 일정 | mutation 시 invalidate → OK |
| `useEmployeeDetail` | 근로자 상세 | mutation 시 invalidate → OK |
| `useCompanyDetail` | 회원사 상세 | mutation 시 invalidate → OK |
| `useCompanyEmployees` | 회원사 소속 근로자 | mutation 시 invalidate → OK |
| `useCompanyFilesQuery` | 회원사 파일 | mutation 시 invalidate → OK |
| `useEmployeeFilesQuery` | 근로자 파일 | mutation 시 invalidate → OK |
| `useAdminMonthlyStats` | 월간 통계 | mutation 시 invalidate → OK |
| `useAdminFiles` | 리포트 파일 | mutation 시 invalidate → OK |
| `useCompanies` | 회원사 목록 | mutation 시 invalidate → OK |
| `useActiveEmployees` | 활성 근로자 | 호출 시 override 가능 (5분) |

### 명시적 staleTime 설정 훅

| staleTime | 훅 | 적절성 |
|-----------|-----|--------|
| **30초** | `useEmployeeAttendanceHistory` | 적절 - 출퇴근 기록은 자주 변경 |
| **30초** | `useMyTodayAttendance` | 적절 - 근무 중 상태 변경 |
| **30초** | `useMyAttendanceHistory` | 적절 - 활동 기록 조회 (페이지네이션 limit=20) |
| **30초** | `useNoteUpdateAlerts` | 적절 - 실시간성 필요 |
| **30초** | `useNotifAbsenceAlerts` | 적절 - 실시간성 필요 |
| **30초** | `usePendingInquiries` | 적절 - 새 문의 빠른 반영 |
| **60초** | `useAdminStats` | 적절 - 대시보드 요약 |
| **60초** | `useAdminDailyAttendance` | 적절 - 일일 출퇴근 현황 |
| **60초** | `useAbsenceAlerts` | 적절 - 대시보드 알림 |
| **60초** | `useCompanyDaily` | 적절 - 기업 대시보드 |
| **5분** | `useAuthQuery` | 적절 - 인증 상태 확인 주기 |
| **5분** | `useAdminEmployees` | 적절 - 관리자 근로자 목록 |

### staleTime 종합 평가

현재 **단일 사용자 기준**으로는 대부분 적절하다. Infinity 설정 훅들은 mutation 시 `queryClient.invalidateQueries()`를 호출하여 캐시를 갱신하고 있다.

**다중 사용자 동시 편집**이 필요해진다면 상세 페이지(`useEmployeeDetail`, `useCompanyDetail`)에 5~10분의 staleTime 추가를 권장한다.

---

## 3. 훅 사용 효율성

### 잘 적용된 패턴

1. **`enabled` 플래그**: `enabled: !!id` 패턴으로 ID 없을 때 불필요한 요청 방지
2. **`select` 옵션**: API 응답에서 pagination wrapper를 제거하고 데이터만 추출
3. **낙관적 업데이트**: 파일 mutation에서 `setQueryData` 활용 (삭제 시 즉시 UI 반영)
4. **`onMutate`/`onError` 롤백**: `useAdminWorkstats`의 노트 업데이트에서 낙관적 업데이트 + 에러 시 롤백
5. **`useMemo` 데이터 변환**: 출퇴근 기록 변환 등에서 불필요한 재계산 방지

### 개선 가능한 점

#### 3-0. 활성 근로자 전체 스캔 최적화 (개선 완료)

`useActiveEmployees`가 호출하는 `fetchAllActiveEmployees()`는 순차 `while` 루프로 페이지를 하나씩 조회하여 waterfall 지연이 발생했다.

- **기존**: `while` 루프로 page 1→2→3→… 순차 요청 (MAX_PAGES=100 하드코딩)
- **개선**: 첫 페이지 조회 후 서버 `totalPages` 기반으로 나머지 페이지를 `MAX_CONCURRENCY(3)`개씩 배치 병렬 요청 (`Promise.allSettled`)
- **효과**: 10페이지 기준 ~10 RTT → ~4 RTT로 감소, 불필요한 MAX_PAGES 상수 제거
- **부분 실패 허용**: `Promise.allSettled`로 단일 페이지 실패 시에도 성공한 페이지 데이터 보존

#### 3-1. 캐시 무효화 범위 (개선 완료 + 잔여)

**개선 완료**: `employeeKeys.all` → `employeeKeys.lists()`, `companyKeys.all` → `companyKeys.lists()`로 범위 축소하여 상세/파일 캐시 불필요 refetch 방지.

**잔여 항목**:

| mutation | 현재 무효화 | 최적 무효화 |
|----------|-----------|-----------|
| `useCreateSchedule` | `scheduleKeys.all` | `scheduleKeys.monthly(year, month)` |
| `useUpdateSchedule` | `scheduleKeys.all` | `scheduleKeys.monthly(year, month)` |
| `useDeleteSchedule` | `scheduleKeys.all` | `scheduleKeys.monthly(year, month)` |

#### 3-2. 알림 키 중복

`adminKeys.absenceAlerts()`와 `adminKeys.notifAbsenceAlerts()`가 유사한 데이터를 별도 키로 관리한다.
- `absenceAlerts`: 대시보드용 (간략한 정보)
- `notifAbsenceAlerts`: 알림센터용 (상세 정보 + dismiss 기능)
- dismiss mutation 시 양쪽 키를 동기화해야 하므로 주의 필요

#### 3-3. mutation onError 콜백 부재

대부분의 mutation 훅에 `onError` 콜백이 정의되어 있지 않다. 에러 처리는 컴포넌트 레벨의 `.catch()`나 `mutateAsync` try-catch에 의존하고 있다.

---

## 4. 훅 파일 구조

### 현재 구조

```
hooks/                              # 공유 훅 (company + admin 양쪽에서 사용)
├── useAuth.ts                      # useAuthQuery 기반 (Zustand 동기화)
├── useAuthQuery.ts                 # Query만 (staleTime: 5분)
├── useAttendanceQuery.ts           # Query만
├── useAttendanceMutations.ts       # Mutation만
├── useEmployeeQuery.ts             # Query만
├── useEmployeeMutations.ts         # Mutation만
└── useEmployeeFiles.ts             # Query + Mutation 통합

app/employee/_hooks/                # employee 전용 훅
├── useMyAttendanceQuery.ts         # Query만 (staleTime: 30s, status=checkout 서버 필터)
├── useMyAttendanceMutations.ts     # Mutation만 (clockIn, clockOut, addPhotos, deletePhoto)
├── useWorkRecords.ts               # 활동 기록 상태 관리 (React Query + 페이지네이션)
└── useEmployeeNotice.ts            # 직원 공지사항 상태 관리

app/company/_hooks/                 # company 전용 훅
├── useDashboardQuery.ts            # Query만
├── useNoticeQuery.ts               # Query만
├── useNoticeMutations.ts           # Mutation만
├── useScheduleQuery.ts             # Query만
└── useScheduleMutations.ts         # Mutation만

app/company/employees/_hooks/       # 기업 근로자 상세 로컬 훅
├── useAttendanceHistory.ts
├── useEmployeeEditForm.ts
└── useEmployeeFiles.ts

app/admin/_hooks/                   # admin 전용 훅
├── useCompanyQuery.ts              # Query만
├── useCompanyMutations.ts          # Mutation만
├── useCompanyFiles.ts              # Query + Mutation 통합
├── useAdminDashboardQuery.ts       # Query만
├── useAdminNotificationQuery.ts    # Query만
├── useAdminNotificationMutations.ts # Mutation만
├── useAdminReports.ts              # Query + Mutation 통합
└── useAdminWorkstats.ts            # Query + Mutation 통합

app/admin/companies/[id]/_hooks/    # 관리자 회원사 상세 로컬 훅
└── useCompanyDetailUI.ts

app/admin/employees/[id]/_hooks/    # 관리자 근로자 상세 로컬 훅
├── useAdminEditForm.ts
├── useAdminAttendanceHistory.ts
└── useAdminEmployeeFiles.ts
```

### 구조 분석

| 항목 | 현황 |
|------|------|
| **Colocation** | 단일 라우트 전용 훅은 해당 라우트의 `_hooks/`에 배치, 공유 훅만 `hooks/`에 유지 |
| **Query/Mutation 분리** | 범용 도메인은 분리 (`useXxxQuery` + `useXxxMutations`), 단일 리소스 CRUD는 통합 (`useEmployeeFiles`, `useCompanyFiles` 등) |
| **로컬 훅 패턴** | 양호 — 상세 페이지의 UI 상태 + mutation 조합을 로컬 `_hooks/`에 캡슐화 |
| **인증 통합** | `useAuth.ts`가 `useAuthQuery` (TanStack Query)를 사용하여 인증 상태 관리 |
| **레거시 훅** | 없음 — employee 앱도 TanStack Query로 마이그레이션 완료 |

---

## 5. 권장사항

| 우선순위 | 항목 | 설명 |
|---------|------|------|
| ~~**Medium**~~ | ~~Employee/Company 캐시 무효화 범위 축소~~ | ~~완료~~ — `keys.all` → `keys.lists()` 변경 완료 |
| **Low** | Schedule mutation 무효화 범위 축소 | `scheduleKeys.all` → `scheduleKeys.monthly(year, month)` |
| ~~**Low**~~ | ~~Query/Mutation 분리 일관성~~ | ~~완료~~ — 범용 도메인은 분리, 단일 리소스 CRUD는 통합으로 컨벤션 정립 |
| **Low** | mutation onError 표준화 | 공용 훅에 기본 `onError` 추가 또는 컨벤션 문서화 |
| **Info** | 알림 키 구조 문서화 | `absenceAlerts`와 `notifAbsenceAlerts` 관계 주석 추가 |

---

## 6. 전체 평가

TanStack Query가 **체계적으로 적용**되어 있으며, 대부분의 패턴이 적절하다.

- Query Key 팩토리 패턴으로 키 관리 일원화
- `enabled`, `select`, 낙관적 업데이트 등 고급 기능 활용
- staleTime은 데이터 특성에 맞게 차등 적용
- 로컬 훅을 통한 관심사 분리 양호

개선점은 주로 **일관성**과 **세밀한 최적화** 수준이며, 기능적 문제는 없다.
