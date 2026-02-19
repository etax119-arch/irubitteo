# 출퇴근 Status 체계

## 개요

출퇴근 상태(status)를 DB에 직접 저장하여 관리하는 방식. 이전에는 `present` 하나로 저장 후 조회 시마다 `clockIn/clockOut` 유무 + 현재시간 + workDays로 실시간 계산했으나, 이제 출근/퇴근/결근 등 상태를 DB에 직접 기록한다.

---

## Status 체계

### DB 저장값 (AttendanceStatus)

| 값 | 의미 | 설정 시점 |
|---|---|---|
| `checkin` | 출근 | 직원이 출근 시 자동 설정 |
| `checkout` | 퇴근 | 직원이 퇴근 시 자동 설정 |
| `absent` | 결근 | 크론잡 자동 / 기업·관리자 수동 |
| `leave` | 휴가 | 기업·관리자 수동 |

### 조회 시 계산값 (레코드 없는 경우만)

| 값 | 의미 | 조건 |
|---|---|---|
| `pending` | 출근 전 | 출근일인데 레코드 없음 |
| `dayoff` | 휴무 | 비출근일이고 레코드 없음, 또는 **회사 휴일** |

---

## 서버 동작

### 출근 (clockIn)

- `POST /v1/attendances/clock-in`
- attendance 레코드 생성/업데이트, `status: 'checkin'` 설정
- 이미 absent 레코드가 있으면 upsert로 `checkin`으로 덮어씀 (늦은 출근 허용)

### 퇴근 (clockOut)

- `POST /v1/attendances/clock-out`
- attendance 레코드 업데이트, `status: 'checkout'` 설정

### 결근 자동 처리 (크론잡)

- **파일**: `src/attendance/attendance-cron.service.ts`
- **실행 주기**: 매 10분 (`*/10 * * * *`)
- 서버가 실행 중이면 자동 동작 (`@nestjs/schedule` 사용)

**동작 순서**:
1. KST 기준 현재 시각과 오늘 날짜 계산
2. **오늘 휴일인 회사 ID 벌크 조회** (`getHolidayCompanyIds()`)
3. 활성 직원 중 오늘이 출근일(`workDays`)인 직원 조회
4. **휴일 회사 소속 직원은 스킵** (`holidayCompanyIds.has(emp.companyId)`)
5. 각 직원의 `workStartTime + 30분`이 현재시간보다 이전인지 확인
6. 오늘 attendance 레코드가 없으면 → `status: 'absent'` 레코드 생성
7. 이미 레코드가 있으면 (출근했거나 이미 absent) → 아무것도 안 함

**예시**: 출근시간 09:00인 직원이 09:30까지 미출근 → 09:30~09:40 사이 크론 실행 시 absent 레코드 생성
**휴일 예시**: 기업이 해당 날짜를 휴일로 설정 → 크론잡이 해당 기업 직원을 모두 건너뜀

### 사후 휴일 등록 시 자동 결근 정리

- **파일**: `src/schedules/schedules.service.ts`
- 휴일 등록(create) 또는 수정(update)에서 `isHoliday: true` 설정 시, 해당 날짜의 **자동 결근 레코드만 삭제**
- `$transaction`으로 스케줄 저장 + 결근 정리를 원자적 처리
- **자동 결근 식별 조건** (5개 모두 만족): `status='absent'`, `clockIn=null`, `clockOut=null`, `note=null`, `workContent=null`
- 관리자 수동 결근(메모 추가 등)은 보존됨
- `employee: { companyId }` 관계 필터로 비활성 직원 포함 전체 정리

### 수동 상태 변경 (updateAttendance)

- `PATCH /v1/attendances/:id`
- 기업 또는 관리자가 `status`를 `checkin`, `checkout`, `leave`, `absent`로 직접 변경 가능
- `leave`로 변경 시 `isLate`, `isEarlyLeave`는 false로 리셋
- `checkin`으로 변경 시 `clockOut`은 `null`로 정리되고 `isEarlyLeave`는 false로 리셋
- `status` 미전송 시 `clockIn`/`clockOut` 최종값 기준으로 `status` 자동 동기화
  - 최종 `clockOut` 존재 시 `checkout`
  - 최종 `clockOut` 없음 + `clockIn` 존재 시 `checkin`
- 최종 `status`가 `checkout`인데 최종 `clockOut`이 없으면 `400` 에러 반환

### 대시보드 조회 (getCompanyDaily / getDailyAttendance)

- attendance 레코드가 있으면 → `att.status` 그대로 반환
- 레코드 없으면:
  - **회사 휴일이면** → `dayoff` (휴일 우선)
  - 출근일이면 → `pending`
  - 비출근일이면 → `dayoff`
- `getCompanyDaily()` 응답에 `isHoliday: boolean` 포함 (프론트엔드 휴일 표시용)

### 결근 알림 (getAbsenceAlerts)

- `GET /admin/absence-alerts`
- DB에서 `status: 'absent'` 레코드를 직접 조회 (이전: 날짜별 순회하며 계산)

---

## 프론트엔드 타입

### AttendanceStatus (DB 저장값)

```typescript
// types/attendance.ts
type AttendanceStatus = 'checkin' | 'checkout' | 'absent' | 'leave';
```

### DailyAttendanceRecord.status (대시보드 표시)

```typescript
// types/attendance.ts
status: 'checkin' | 'checkout' | 'absent' | 'leave' | 'pending' | 'dayoff';
```

### AdminDailyEmployee.status (관리자 대시보드)

```typescript
// types/adminDashboard.ts
status: 'checkin' | 'checkout' | 'absent' | 'leave' | 'pending' | 'dayoff';
```

### Employee.status (직원 목록)

```typescript
// types/employee.ts
status: 'checkin' | 'checkout' | 'absent' | 'leave' | 'resigned' | 'pending' | 'dayoff';
```

### DisplayStatus (레거시 표시 타입)

```typescript
// types/attendance.ts
type DisplayStatus = '정상' | '지각' | '결근' | '휴가';
```

> `DisplayStatus`는 타입 호환성을 위해 남아 있으며, 최근 출퇴근 기록 테이블의 기본 표시는 AttendanceStatus 기반(raw status)으로 변경되었습니다.

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
| `leave` | 휴가 | `bg-teal-100 text-teal-700` |
| `pending` | 출근 전 | `bg-yellow-100 text-yellow-700` |
| `dayoff` | 휴무 | `bg-gray-100 text-gray-600` |
| (비활성) | 퇴사 | `bg-gray-200 text-gray-600` |

### 최근 출퇴근 기록 표시 (getAttendanceRecordStatusLabel / getAttendanceRecordStatusColor)

관리자 직원 상세, 기업 직원 상세의 최근 출퇴근 기록 테이블에서 사용.

| DB status | 라벨 | 스타일 |
|---|---|---|
| `checkin` | 출근 | `bg-green-100 text-green-700` |
| `checkout` | 퇴근 | `bg-blue-100 text-blue-700` |
| `absent` | 결근 | `bg-red-100 text-red-700` |
| `leave` | 휴가 | `bg-teal-100 text-teal-700` |

### DisplayStatus 변환 유틸 (getAttendanceDisplayStatus / getDisplayStatusColor)

`DisplayStatus(정상/지각/결근/휴가)`가 필요한 화면에서 사용 가능하며, 최근 출퇴근 기록 테이블의 기본 표시에는 사용하지 않습니다.

---

## 파일 목록

### 서버 (durubitteo_server)

| 파일 | 역할 |
|---|---|
| `prisma/schema.prisma` | status default: `"checkin"`, Schedule.isHoliday 필드 |
| `src/attendance/dto/attendance-query.dto.ts` | AttendanceStatus enum (CHECKIN, CHECKOUT, ABSENT, LEAVE) |
| `src/attendance/attendance.service.ts` | clockIn → checkin, clockOut → checkout, updateAttendance status 동기화/검증, getCompanyDaily 휴일→dayoff 반영 |
| `src/attendance/attendance-cron.service.ts` | 결근 자동 처리 크론잡 (매 10분, 휴일 회사 스킵) |
| `src/attendance/attendance.module.ts` | AttendanceCronService 등록 |
| `src/admin/admin.service.ts` | getDailyAttendance/getAbsenceAlerts 휴일→dayoff 반영 |
| `src/employees/employees.service.ts` | toResponse() 휴일→dayoff 반영 |
| `src/schedules/schedules.service.ts` | 휴일 등록 시 자동 결근 레코드 정리 ($transaction) |
| `src/common/utils/holiday.ts` | 휴일 조회 공통 유틸 (getHolidayCompanyIds, isCompanyHoliday) |
| `src/app.module.ts` | ScheduleModule.forRoot() 등록 |

### 프론트엔드 (durubitteo_web)

| 파일 | 역할 |
|---|---|
| `types/attendance.ts` | AttendanceStatus, DisplayStatus(레거시), DailyAttendanceRecord 타입 |
| `types/adminDashboard.ts` | AdminDailyEmployee.status 타입 |
| `types/employee.ts` | Employee.status 타입 |
| `lib/status.ts` | **통합 상태 유틸리티** (getEmployeeStatusLabel/Style, getAttendanceRecordStatusLabel/Color, getAttendanceDisplayStatus, getDisplayStatusColor) |
| `app/employee/page.tsx` | 직원 홈 — `getAttendanceMode()` 순수 함수로 출퇴근 버튼 상태 결정 (holiday/dayoff/checkin/checkout/completed) |
| `app/employee/_components/AttendanceButtons.tsx` | `AttendanceMode` 기반 조건부 렌더링 (버튼/휴일/비근무일/완료 메시지) |
| `app/employee/_hooks/useMyProfile.ts` | `GET /v1/employees/me` — workDays 기반 비근무일 판정 |
| `app/employee/_hooks/useMyScheduleToday.ts` | `GET /v1/schedules/today` — 회사 휴일 판정 |
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
