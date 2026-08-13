# 출퇴근 Status 체계

## 개요

출퇴근 상태(status)를 DB에 직접 저장하여 관리하는 방식. 이전에는 `present` 하나로 저장 후 조회 시마다 `clockIn/clockOut` 유무 + 현재시간 + workDays로 실시간 계산했으나, 이제 출근/퇴근/결근 등 상태를 DB에 직접 기록한다.

---

## Status 체계

### DB 저장값 (AttendanceStatus)

| 값 | 의미 | 설정 시점 |
|---|---|---|
| `pending` | 출근 전 | 매일 00:00 KST 크론이 근무일 직원에게 자동 생성 |
| `checkin` | 출근 | 직원이 출근 시 자동 설정 |
| `checkout` | 퇴근 | 직원이 퇴근 시 자동 설정 |
| `absent` | 결근 | 크론잡 자동(`pending` → `absent`) / 기업·관리자 수동 |
| `leave` | 휴무 | 00:00 크론이 비근무일·회사 휴일 직원에게 자동 생성 / 기업·관리자 수동 |
| `annual_leave` | 연차 | 기업·관리자 수동 (잔여 연차 검증) |
| `public_holiday` | 공휴 | 00:00 크론이 **국가 공휴일**의 근무일 직원에게 자동 생성 / 10분 크론이 `pending`·`absent`를 정정 / 기업·관리자 수동 |

### 조회 시 계산값 (레코드 없는 경우만 — 크론 유실 대비 폴백)

오늘 레코드는 00:00 크론이 미리 만들기 때문에 평상시에는 계산값이 쓰이지 않는다.
배포/재시작으로 크론을 놓쳤거나 과거 날짜를 조회할 때만 아래 값이 합성된다.

| 값 | 의미 | 조건 |
|---|---|---|
| `pending` | 출근 전 | 출근일인데 레코드 없음 |
| `public_holiday` | 공휴 | 출근일 + **국가 공휴일**인데 레코드 없음 |
| `dayoff` | 휴무 | 비출근일이고 레코드 없음, 또는 **회사 휴일** |

폴백 값은 `resolveDerivedStatus()`(`src/common/utils/work-time.ts`) 한 곳에서만 만든다.
`resolveAutoStatus()`를 그대로 쓰고 `leave`만 `dayoff`로 바꾸므로 **크론이 썼을 값과 항상 일치**한다.
(규칙을 조회 경로마다 따로 구현했을 때 공휴일·회사 휴일이 겹치는 날의 우선순위가 어긋나 있었다.)

---

## 서버 동작

### 출근 (clockIn)

- `POST /v1/attendances/clock-in`
- attendance 레코드 생성/업데이트, `status: 'checkin'` 설정
- 이미 `pending`/`absent` 레코드가 있으면 upsert로 `checkin`으로 덮어씀 (늦은 출근 허용)

### 퇴근 (clockOut)

- `POST /v1/attendances/clock-out`
- attendance 레코드 업데이트, `status: 'checkout'` 설정

### 오늘 레코드 사전 생성 (크론잡)

- **파일**: `src/attendance/attendance-cron.service.ts` — `createTodayRecords()` / `ensureTodayRecords()`
- **실행 주기**: 매일 00:00 KST (`0 0 * * *`, `timeZone: 'Asia/Seoul'`)

**동작 순서**:
1. 오늘 휴일인 회사 ID 벌크 조회 (`getHolidayCompanyIds()`)
2. **오늘의 국가 공휴일 명칭 조회** (`getPublicHolidayName()` — `holidays` 테이블, 회사 무관 전역)
3. 재직 중인 활성 직원 전체 조회 (`hireDate ≤ 오늘`, `resignDate` null 또는 오늘 이후)
4. `resolveAutoStatus()`로 상태 결정 — 비근무일 → `leave`, 근무일+국가 공휴일 → `public_holiday`,
   근무일+회사 휴일 → `leave`, 그 외 근무일 → `pending`
5. `createMany({ skipDuplicates: true })` 한 번으로 생성 — 기존 레코드는 절대 덮어쓰지 않음
6. `applyPublicHolidayToTodayRecords()` 호출 (아래 참조)

레코드가 미리 있으므로 출근 전에도 연차/휴무 지정·메모 입력이 가능하고, 근태 목록에 오늘 행이 노출된다.

### 결근 자동 처리 (크론잡)

- **파일**: `src/attendance/attendance-cron.service.ts` — `markAbsentEmployees()`
- **실행 주기**: 매 10분 (`*/10 * * * *`)
- 서버가 실행 중이면 자동 동작 (`@nestjs/schedule` 사용)

**동작 순서**:
1. `ensureTodayRecords()` 선행 호출 — 00:00 크론을 놓쳤어도 10분 안에 자가 복구
2. `applyPublicHolidayToTodayRecords()` 호출 — 결근 판정 **전에** 공휴일 정정을 끝낸다
3. KST 기준 현재 시각과 오늘 날짜 계산
4. **오늘 휴일인 회사 ID + 국가 공휴일 조회**
5. 활성 직원 중 `resolveAutoStatus()`가 `pending`을 반환하는 직원만 대상
   → **국가 공휴일이면 `public_holiday`가 반환되므로 자동으로 결근 대상에서 빠진다**
6. 각 직원의 `workStartTime + 30분`(요일별 `workTimes` 우선)이 현재시간보다 이전인지 확인
7. 대상 직원의 레코드 중 **`status='pending'` + `clockIn=null`인 것만** `updateMany`로 `absent` 전환
   → 관리자가 수정한 `leave`/`annual_leave`/`checkin`은 건드리지 않음

**예시**: 출근시간 09:00인 직원이 09:30까지 미출근 → 09:30~09:40 사이 크론 실행 시 `pending` → `absent`
**휴일 예시**: 기업이 해당 날짜를 휴일로 설정 → 크론잡이 해당 기업 직원을 모두 건너뜀
**공휴일 예시**: 설날 → 근무 요일 직원은 `public_holiday`로 남고 결근 처리되지 않음

### 국가 공휴일 자동 정정 (`applyPublicHolidayToTodayRecords`)

- **파일**: `src/attendance/attendance-cron.service.ts`
- 00:00 이후에 공휴일이 추가되거나(임시공휴일 수동 INSERT), 이 기능이 배포된 당일에는
  레코드가 이미 `pending`/`absent`로 만들어져 있다. `ensureTodayRecords()`는 전원 레코드가
  있으면 INSERT를 건너뛰므로 스스로 고쳐지지 않아, 이 단계가 그 구간을 메운다.
- **오늘 날짜만** 정정한다 — 지난 날짜는 소급하지 않는다(과거 기록 보존).
- `UNTOUCHED_AUTO_RECORD` + `status: { in: CORRECTABLE_AUTO_STATUSES }`(= `pending`/`absent`) +
  근무 요일 직원의 `employeeId: { in: [...] }` 조건으로 `public_holiday` 전환
- `clockIn=null` 조건이 포함되므로 **이미 출근한 직원은 자동 제외**된다
- 근무 요일 필터를 관계 조건(`employee: { workDays: { has } }`)으로 걸지 않는다 —
  `work_days`에 인덱스가 없어 `employees` 전체 스캔이 붙는다. 크론이 이미 메모리에 들고 있는
  직원 목록으로 id를 만들어 `attendances`의 `(date, employeeId)` 인덱스만 타게 한다

### 사후 휴일 등록 시 자동 레코드 정정

- **파일**: `src/schedules/schedules.service.ts`
- 휴일 등록(create) 또는 수정(update)에서 `isHoliday: true` 설정 시, 해당 날짜의
  **자동 생성 레코드를 휴무(`leave`)로 전환** (`markAutoRecordsAsLeave`)
- 대상 상태는 `CORRECTABLE_AUTO_STATUSES`(`src/common/utils/attendance-record.ts`)로,
  `public_holiday`는 **의도적으로 제외**한다 — 국가 공휴일에 회사가 휴일을 겹쳐 등록해도
  더 구체적인 `공휴` 라벨을 유지하는 것이 정확하다. 정정 경로가 공유하는 상수라
  상태를 새로 추가할 때 한 곳만 보면 된다
- `$transaction`으로 스케줄 저장 + 정정을 원자적 처리 → 화면에 즉시 반영되고, 레코드가 잠깐 사라지는 구간이 없다
- **자동 생성 식별 조건** (`UNTOUCHED_AUTO_RECORD`, 4개 모두 만족): `clockIn=null`, `clockOut=null`, `note=null`, `workContent=null`
  + 상태가 `pending` 또는 `absent`
- 관리자 수동 결근(메모 추가 등)은 보존됨
- `employee: { companyId }` 관계 필터로 비활성 직원 포함 전체 정정

### 휴일 해제 시 자동 휴무 되돌리기

- 휴일 수정(`isHoliday: true → false`) 또는 휴일 일정 삭제 시, **오늘 날짜에 한해**
  자동 생성된 `leave` 레코드를 원래 상태로 되돌린다 (`restoreAutoLeaveRecords`)
- 되돌릴 상태는 `resolveRestoredStatus()`가 정한다 — 오늘이 국가 공휴일이면 `pending`이 아니라
  `public_holiday`로 되돌아간다 (회사 휴일을 해제해도 공휴일은 그대로다)
- 이 조회는 **트랜잭션에 들어가기 전에** 끝낸다 — 트랜잭션 안에서 읽으면 커넥션을 하나 더
  잡은 채 락을 더 오래 쥐게 되고, Transaction Pooler 환경에서 동시성이 떨어진다
- 지난 날짜를 되돌리면 이미 지나간 날이 갑자기 결근으로 바뀌며 결근 알림이 소급 발생하므로 제외
- 원래 비근무 요일인 직원의 휴무는 남겨야 하므로 `workDays`에 해당 요일이 있는 직원만 대상

### 수동 상태 변경 (updateAttendance)

- `PATCH /v1/attendances/:id`
- 기업 또는 관리자가 `status`를 `pending`, `checkin`, `checkout`, `leave`, `absent`, `annual_leave`, `public_holiday`로 직접 변경 가능
- `pending`/`leave`/`annual_leave`/`public_holiday`로 변경 시 `clockIn`/`clockOut`은 `null`로, `isLate`, `isEarlyLeave`는 false로 리셋
- `checkin`으로 변경 시 `clockOut`은 `null`로 정리되고 `isEarlyLeave`는 false로 리셋
- `status` 미전송 시 `clockIn`/`clockOut` 최종값 기준으로 `status` 자동 동기화
  - 최종 `clockOut` 존재 시 `checkout`
  - 최종 `clockOut` 없음 + `clockIn` 존재 시 `checkin`
- 최종 `status`가 `checkout`인데 최종 `clockOut`이 없으면 `400` 에러 반환

### 대시보드 조회 (getCompanyDaily / getDailyAttendance)

- attendance 레코드가 있으면 → `att.status` 그대로 반환 (오늘은 00:00 크론 덕분에 항상 이쪽)
- 레코드 없으면 → `resolveDerivedStatus(workDays, dayOfWeek, flags)` 한 곳에서 결정
  - 비출근일 → `dayoff`
  - 출근일 + 국가 공휴일 → `public_holiday`
  - 출근일 + 회사 휴일 → `dayoff`
  - 그 외 출근일 → `pending`
- 응답 필드 두 개는 의미가 다르다
  - `isHoliday: boolean` — **회사가 등록한 휴일만**. 근로자 앱이 이 값으로 출근 버튼을 숨긴다
  - `publicHoliday: string | null` — 국가 공휴일 명칭. 안내 표시용이며 출근을 막지 않는다

### 결근 알림 (getAbsenceAlerts)

- `GET /admin/absence-alerts`
- DB에서 `status: 'absent'` 레코드를 직접 조회 (이전: 날짜별 순회하며 계산)

---

## 프론트엔드 타입

### AttendanceStatus (DB 저장값)

```typescript
// types/attendance.ts
type AttendanceStatus =
  | 'pending' | 'checkin' | 'checkout' | 'absent' | 'leave' | 'annual_leave' | 'public_holiday';
```

### DailyAttendanceRecord.status (대시보드 표시)

```typescript
// types/attendance.ts (EmployeeDailyStatus = Exclude<Employee['status'], 'resigned'>)
status: 'checkin' | 'checkout' | 'absent' | 'leave' | 'annual_leave' | 'public_holiday' | 'pending' | 'dayoff';
```

### AdminDailyEmployee.status (관리자 대시보드)

```typescript
// types/adminDashboard.ts — 별도 선언이 아니라 EmployeeDailyStatus를 재사용한다
status: EmployeeDailyStatus;
```

### Employee.status (직원 목록)

```typescript
// types/employee.ts
status:
  | 'checkin' | 'checkout' | 'absent' | 'leave' | 'annual_leave'
  | 'public_holiday' | 'resigned' | 'pending' | 'dayoff';
```

---

## UI 표시

상태 표시는 `lib/status.ts`에서 통합 관리. 모든 페이지(기업/관리자)에서 동일한 색상/라벨 사용.

### Employee 실시간 상태 (getEmployeeStatusLabel / getEmployeeStatusStyle)

기업 대시보드(AttendanceTable), 관리자 대시보드(CompanyAttendanceAccordion), 직원 목록, 관리자 직원 상세 등에서 공통 사용.

| status | 라벨 | 스타일 |
|---|---|---|
| `checkin` | 근무중 | `bg-green-100 text-green-700` |
| `checkout` | 퇴근 | `bg-blue-100 text-blue-700` |
| `absent` | 결근 | `bg-red-100 text-red-700` |
| `leave` | 휴무 | `bg-teal-100 text-teal-700` |
| `annual_leave` | 연차 | `bg-purple-100 text-purple-700` |
| `public_holiday` | 공휴 | `bg-pink-100 text-pink-700` |
| `pending` | 출근 전 | `bg-yellow-100 text-yellow-700` |
| `dayoff` | 휴무 | `bg-gray-100 text-gray-600` |
| (비활성) | 퇴사 | `bg-gray-200 text-gray-600` |

### 최근 출퇴근 기록 표시 (getAttendanceRecordStatusLabel / getAttendanceRecordStatusColor)

관리자 직원 상세, 기업 직원 상세의 최근 출퇴근 기록 테이블에서 사용.

| DB status | 라벨 | 스타일 |
|---|---|---|
| `pending` | 출근 전 | `bg-yellow-100 text-yellow-700` |
| `checkin` | 출근 | `bg-green-100 text-green-700` |
| `checkout` | 퇴근 | `bg-blue-100 text-blue-700` |
| `absent` | 결근 | `bg-red-100 text-red-700` |
| `leave` | 휴무 | `bg-teal-100 text-teal-700` |
| `annual_leave` | 연차 | `bg-purple-100 text-purple-700` |
| `public_holiday` | 공휴 | `bg-pink-100 text-pink-700` |

> `공휴`에 빨강을 쓰지 않는 이유: `결근`이 이미 `bg-red-100 text-red-700`이라 배지에서 구분되지 않는다.
> 달력(`CalendarGrid`)은 '빨간날' 의미를 살려 빨강을 쓰지만, 상태 배지는 분홍으로 분리한다.

### 공통 판정 유틸

| 함수 | 용도 |
|---|---|
| `hasNoClockTimes(status)` | 출퇴근 시각이 존재할 수 없는 상태(`pending`/`absent`/`leave`/`annual_leave`/`public_holiday`) → 표·엑셀·PDF에서 시간 대신 `-` 표시 |
| `resolveAnnualLeaveCancelStatus(dateOnly, workDays)` | 연차 취소 시 되돌릴 상태 (비근무일 → `leave`, 오늘 → `pending`, 지난 날 → `absent`) |

> **알려진 한계**: `resolveAnnualLeaveCancelStatus`는 프론트에서 계산하므로 휴일 정보를 모른다.
> 휴일이었던 지난 날의 연차를 취소하면 `absent`가 된다. 회사 휴일에 대해 원래 있던 동작이고
> 국가 공휴일도 동일하다. 관리자가 근무시간 수정 모달에서 `공휴`를 직접 선택해 정정할 수 있다.

---

## 파일 목록

### 서버 (durubitteo_server)

| 파일 | 역할 |
|---|---|
| `prisma/schema.prisma` | status default: `"checkin"`, Schedule.isHoliday 필드, **Holiday 모델(국가 공휴일, 전역)** |
| `prisma/migrations/*_add_holidays/` | holidays 테이블 DDL + 2026~2030 공휴일 시드 (SQL, `ON CONFLICT DO NOTHING`) |
| `src/attendance/dto/attendance-query.dto.ts` | AttendanceStatus enum (PENDING, CHECKIN, CHECKOUT, ABSENT, LEAVE, ANNUAL_LEAVE, **PUBLIC_HOLIDAY**) |
| `src/attendance/attendance.service.ts` | clockIn → checkin, clockOut → checkout, updateAttendance status 동기화/검증, getCompanyDaily 휴일→dayoff·공휴일 반영 |
| `src/attendance/attendance-cron.service.ts` | 오늘 레코드 사전 생성(매일 00:00 KST) + 결근 자동 처리 크론잡 (매 10분, 휴일 회사 스킵) + **공휴일 정정(applyPublicHolidayToTodayRecords)** |
| `src/attendance/attendance.module.ts` | AttendanceCronService 등록 |
| `src/admin/admin.service.ts` | getDailyAttendance/getAbsenceAlerts 휴일→dayoff·공휴일 반영 |
| `src/employees/employees.service.ts` | toResponse() 휴일→dayoff·공휴일 반영, 직원 생성 시 오늘 레코드 생성, workDays 변경 시 재동기화, 입사일 소급 백필(공휴일은 근무 기록 없이 `public_holiday`) |
| `src/schedules/schedules.service.ts` | 휴일 등록/해제 시 자동 생성 레코드 정리 ($transaction), getMonthly에 공휴일 포함, getToday에 publicHoliday 포함 |
| `src/common/utils/holiday.ts` | 휴일 조회 공통 유틸 (getHolidayCompanyIds, isCompanyHoliday, getCompanyHolidayDates, **getPublicHolidayName, getPublicHolidayDates**) |
| `src/common/utils/work-time.ts` | **resolveAutoStatus — 자동 상태 판정의 단일 지점**, resolveDerivedStatus(조회 폴백), AUTO_STATUSES, HolidayFlags, AttendanceDisplayStatus, isPastAbsentThreshold |
| `src/common/utils/attendance-record.ts` | UNTOUCHED_AUTO_RECORD, CORRECTABLE_AUTO_STATUSES (정정 경로가 공유하는 조건) |
| `src/app.module.ts` | ScheduleModule.forRoot() 등록 |

### 프론트엔드 (durubitteo_web)

| 파일 | 역할 |
|---|---|
| `types/attendance.ts` | AttendanceStatus, DailyAttendanceRecord 타입 |
| `types/adminDashboard.ts` | AdminDailyEmployee.status 타입 |
| `types/employee.ts` | Employee.status 타입 |
| `types/schedule.ts` | Schedule, **PublicHoliday**, MonthlySchedule(+holidays), **TodayScheduleResponse** |
| `lib/status.ts` | **통합 상태 유틸리티** (getEmployeeStatusLabel/Style, getAttendanceRecordStatusLabel/Color, hasNoClockTimes, resolveAnnualLeaveCancelStatus) |
| `app/employee/page.tsx` | 직원 홈 — `getAttendanceMode()` 순수 함수로 출퇴근 버튼 상태 결정 (holiday/dayoff/checkin/checkout/completed). **`public_holiday`는 `checkin` 모드 — 공휴일에도 출근 가능** |
| `app/employee/_components/AttendanceButtons.tsx` | `AttendanceMode` 기반 조건부 렌더링 (버튼/휴일/비근무일/완료 메시지) |
| `app/employee/_components/PublicHolidayNotice.tsx` | 공휴일 안내 배너 — 홈·출근 화면이 공유하며 출근 버튼을 가리지 않는다 |
| `app/employee/_hooks/useMyProfile.ts` | `GET /v1/employees/me` — workDays 기반 비근무일 판정 |
| `app/employee/_hooks/useMyScheduleToday.ts` | `GET /v1/schedules/today` — 회사 휴일 판정 + 공휴일 명칭 |
| `app/company/_components/CalendarGrid.tsx` | 근무일정 달력 — 공휴일 빨간 배경/명칭, 일요일 빨강·토요일 파랑 |
| `app/admin/settings/_components/HolidaySection.tsx` | 관리자 설정 — 공휴일 연도별 목록/추가/수정/삭제 |
| `app/admin/_hooks/useHolidayQuery.ts` · `useHolidayMutations.ts` | 공휴일 Query/Mutation 훅 (변경 시 근무일정 달력 캐시도 무효화) |
| `lib/api/holidays.ts` · `types/holiday.ts` | 공휴일 API/타입 (`/v1/holidays`, 관리자 전용) |
| `app/company/_components/AttendanceTable.tsx` | 기업 대시보드 출퇴근 테이블 |
| `app/admin/_components/CompanyAttendanceAccordion.tsx` | 관리자 회사별 출퇴근 아코디언 |
| `app/company/employees/_hooks/useAttendanceHistory.ts` | 최근 출퇴근 기록 가공 (raw status 유지) |

---

## DB 마이그레이션

기존 `present` 데이터 변환 (1회성):

```sql
UPDATE attendances SET status = 'checkout' WHERE status = 'present' AND clock_out IS NOT NULL;
UPDATE attendances SET status = 'checkin' WHERE status = 'present' AND clock_out IS NULL;
```
