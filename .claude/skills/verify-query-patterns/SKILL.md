---
name: verify-query-patterns
description: TanStack Query 패턴을 검증합니다. Query/Mutation 훅 추가, queryKey 변경, API 호출 방식 변경 후 사용.
disable-model-invocation: true
---

# TanStack Query 패턴 검증

## 목적

프로젝트의 TanStack Query 사용 규칙 준수를 검증합니다:

1. **Query Key 팩토리 사용** — 모든 `queryKey`가 `lib/query/keys.ts`의 팩토리에서 가져온 것인지 확인 (하드코딩 금지)
2. **Query/Mutation 파일 분리** — `*Query.ts` 파일에 `useMutation` 혼재 금지, `*Mutations.ts`에 `useQuery` 혼재 금지
3. **API 클라이언트 직접 import 금지** — Hook 파일에서 `@/lib/api/client` 직접 import 금지 (API 함수 통해서만 호출)
4. **invalidateQueries에서 Key 팩토리 사용** — `invalidateQueries` 호출 시 key factory 사용 확인

## 실행 시점

- 새로운 Query 또는 Mutation 훅을 추가한 후
- `lib/query/keys.ts`에 새 키 팩토리를 추가한 후
- API 호출 방식을 변경한 후
- 기존 훅을 리팩토링한 후

## Related Files

| File | Purpose |
|------|---------|
| `lib/query/keys.ts` | Query Key 팩토리 정의 (정규 키 소스) |
| `lib/query/client.ts` | QueryClient 설정 (staleTime, gcTime) |
| `lib/api/client.ts` | Axios 인스턴스 (훅에서 직접 import 금지) |
| `hooks/useAttendanceQuery.ts` | 공용 출퇴근 Query 훅 |
| `hooks/useAttendanceMutations.ts` | 공용 출퇴근 Mutation 훅 |
| `hooks/useEmployeeQuery.ts` | 공용 근로자 Query 훅 |
| `hooks/useEmployeeMutations.ts` | 공용 근로자 Mutation 훅 |
| `hooks/useEmployeeFiles.ts` | 공용 근로자 파일 Query/Mutation 훅 |
| `hooks/useAuth.ts` | 인증 훅 |
| `hooks/useAuthQuery.ts` | 공용 인증 Query 훅 |
| `app/company/_hooks/useDashboardQuery.ts` | 기업 대시보드 Query 훅 |
| `app/company/_hooks/useNoticeQuery.ts` | 기업 공지사항 Query 훅 |
| `app/company/_hooks/useNoticeMutations.ts` | 기업 공지사항 Mutation 훅 |
| `app/company/_hooks/useScheduleQuery.ts` | 기업 근무일정 Query 훅 |
| `app/company/_hooks/useScheduleMutations.ts` | 기업 근무일정 Mutation 훅 |
| `app/admin/_hooks/useCompanyQuery.ts` | 관리자 회원사 Query 훅 |
| `app/admin/_hooks/useCompanyMutations.ts` | 관리자 회원사 Mutation 훅 |
| `app/admin/_hooks/useCompanyFiles.ts` | 관리자 회원사 파일 훅 |
| `app/admin/_hooks/useAdminDashboardQuery.ts` | 관리자 대시보드 Query 훅 |
| `app/admin/_hooks/useAdminNotificationQuery.ts` | 관리자 알림센터 Query 훅 |
| `app/admin/_hooks/useAdminNotificationMutations.ts` | 관리자 알림센터 Mutation 훅 |
| `app/admin/_hooks/useAdminReports.ts` | 관리자 리포트 훅 |
| `app/admin/_hooks/useAdminWorkstats.ts` | 관리자 근무통계 훅 |
| `app/admin/_hooks/useAdminAccountQuery.ts` | 관리자 계정 Query 훅 |
| `app/employee/_hooks/useAttendance.ts` | 직원 출퇴근 훅 |
| `app/employee/_hooks/useEmployeeNotice.ts` | 직원 공지사항 훅 |
| `app/employee/_hooks/useWorkRecords.ts` | 직원 활동 기록 훅 |
| `app/company/employees/_hooks/useAttendanceHistory.ts` | 기업 직원 출퇴근 이력 훅 |
| `app/company/employees/_hooks/useEmployeeEditForm.ts` | 기업 직원 수정 폼 훅 |
| `app/company/employees/_hooks/useEmployeeFiles.ts` | 기업 직원 파일 훅 |
| `app/admin/companies/[id]/_hooks/useCompanyDetailUI.ts` | 관리자 회원사 상세 UI 훅 |
| `app/admin/employees/[id]/_hooks/useAdminAttendanceHistory.ts` | 관리자 직원 출퇴근 이력 훅 |
| `app/admin/employees/[id]/_hooks/useAdminEditForm.ts` | 관리자 직원 수정 폼 훅 |
| `app/admin/employees/[id]/_hooks/useAdminEmployeeFiles.ts` | 관리자 직원 파일 훅 |

## 워크플로우

### Step 1: Query Key 팩토리 사용 확인

**검사:** 모든 `queryKey` 값이 `lib/query/keys.ts`에서 정의된 팩토리 함수를 사용해야 합니다. 하드코딩된 문자열 배열 금지.

**도구:** Grep

```
# queryKey에 하드코딩된 문자열 배열 사용 탐지
pattern: "queryKey:\\s*\\["
glob: "hooks/use*.ts"
```

```
# app 내부 훅에서도 동일 검사
pattern: "queryKey:\\s*\\["
glob: "app/**/_hooks/use*.ts"
```

**PASS 기준:** 매칭 결과 0건
**FAIL 기준:** `queryKey: ['something']` 형태의 하드코딩된 키가 있음

**수정 방법:** `queryKey: ['employees']` → `queryKey: employeeKeys.all` (`lib/query/keys.ts`에서 import)

### Step 2: Query/Mutation 파일 분리 확인

**검사:** 파일명에 `Query`가 포함된 파일에는 `useMutation`이 없어야 하고, `Mutations`가 포함된 파일에는 `useQuery`가 없어야 합니다.

**도구:** Grep (2회 실행)

```
# *Query.ts 파일에서 useMutation 사용 탐지
pattern: "useMutation"
glob: "**/*Query.ts"
```

```
# *Mutations.ts 파일에서 useQuery 호출 탐지 (useQueryClient 제외)
pattern: "useQuery\("
glob: "**/*Mutations.ts"
```

**PASS 기준:** 두 검색 모두 매칭 0건
**FAIL 기준:** Query 파일에 Mutation이 있거나 그 반대

**주의:** `useQuery\(` 패턴은 함수 호출만 탐지합니다. `useQueryClient` import는 Mutation 파일에서 캐시 무효화를 위해 정상적으로 사용되므로 탐지 대상이 아닙니다.

**수정 방법:** 혼재된 훅을 적절한 파일로 분리합니다. (예: `useDashboardQuery.ts`에 있는 `useMutation` → `useDashboardMutations.ts`로 이동)

### Step 3: Hook에서 API 클라이언트 직접 import 금지

**검사:** 훅 파일에서 `@/lib/api/client` 또는 `lib/api/client`를 직접 import하지 않아야 합니다. API 호출은 `lib/api/` 하위의 도메인별 API 함수를 통해서만 수행합니다.

**도구:** Grep (2회 실행)

```
# hooks/ 폴더에서 api/client 직접 import 탐지
pattern: "from '.*api/client'"
path: "hooks/"
```

```
# app/ 내부 _hooks/ 에서 api/client 직접 import 탐지
pattern: "from '.*api/client'"
glob: "app/**/_hooks/*.ts"
```

**PASS 기준:** 두 검색 모두 매칭 0건
**FAIL 기준:** 훅에서 Axios 인스턴스를 직접 import하여 사용

**수정 방법:** `import { apiClient } from '@/lib/api/client'` → `import { fetchEmployees } from '@/lib/api/employees'`처럼 도메인 API 함수를 사용합니다.

### Step 4: invalidateQueries에서 Key 팩토리 사용 확인

**검사:** `invalidateQueries` 호출 시 `queryKey`에 하드코딩된 문자열 배열이 아닌 key factory를 사용해야 합니다.

**도구:** Grep

```
# invalidateQueries에서 하드코딩된 키 사용 탐지
pattern: "invalidateQueries.*queryKey:\\s*\\["
glob: "**/*.ts"
```

**PASS 기준:** 매칭 결과 0건
**FAIL 기준:** `invalidateQueries({ queryKey: ['employees'] })` 형태의 하드코딩

**수정 방법:** `queryKey: ['employees']` → `queryKey: employeeKeys.all` (`lib/query/keys.ts`에서 import)

### Step 5: setQueryData에서 Key 팩토리 사용 확인

**검사:** `setQueryData` 호출 시 첫 번째 인자에 하드코딩된 문자열 배열이 아닌 key factory를 사용해야 합니다.

**도구:** Grep

```
# setQueryData에서 하드코딩된 키 사용 탐지
pattern: "setQueryData\(\s*\["
glob: "**/*.ts"
```

**PASS 기준:** 매칭 결과 0건
**FAIL 기준:** `setQueryData(['employees', id], ...)` 형태의 하드코딩

**수정 방법:** `setQueryData(['employees', id], ...)` → `setQueryData(employeeKeys.detail(id), ...)` (`lib/query/keys.ts`에서 import)

## Output Format

```markdown
## verify-query-patterns 검증 결과

| # | 검사 항목 | 결과 | 상세 |
|---|----------|------|------|
| 1 | Query Key 팩토리 사용 | PASS/FAIL | 하드코딩된 키 N건 |
| 2 | Query/Mutation 분리 | PASS/FAIL | 혼재 파일 N개 |
| 3 | API 클라이언트 직접 import | PASS/FAIL | 위반 파일 N개 |
| 4 | invalidateQueries 키 팩토리 | PASS/FAIL | 하드코딩 N건 |
| 5 | setQueryData 키 팩토리 | PASS/FAIL | 하드코딩 N건 |
```

## 예외사항

다음은 **위반이 아닙니다**:

1. **Query+Mutation 통합 파일** — 파일명에 `Query`도 `Mutations`도 포함하지 않는 파일(예: `useEmployeeFiles.ts`, `useAdminReports.ts`, `useAdminWorkstats.ts`)은 Query와 Mutation을 함께 포함할 수 있음
2. **`useAuth.ts`의 직접 API 호출** — 인증 훅은 `lib/api/auth.ts`를 사용하며, 이는 정상적인 API 함수 import임
3. **`lib/api/` 내부 파일에서의 client import** — API 함수 정의 파일(`lib/api/*.ts`)에서 `client.ts`를 import하는 것은 올바른 패턴
4. **`useQueryClient` import** — `@tanstack/react-query`에서 `useQueryClient`를 import하는 것은 `@/lib/api/client`와 다름
