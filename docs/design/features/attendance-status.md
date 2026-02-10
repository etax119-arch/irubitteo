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
| `holiday` | 휴일 | 기업·관리자 수동 |

### 조회 시 계산값 (레코드 없는 경우만)

| 값 | 의미 | 조건 |
|---|---|---|
| `pending` | 출근 전 | 출근일인데 레코드 없음 |
| `dayoff` | 휴무 | 비출근일이고 레코드 없음 |

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
2. 활성 직원 중 오늘이 출근일(`workDays`)인 직원 조회
3. 각 직원의 `workStartTime + 30분`이 현재시간보다 이전인지 확인
4. 오늘 attendance 레코드가 없으면 → `status: 'absent'` 레코드 생성
5. 이미 레코드가 있으면 (출근했거나 이미 absent) → 아무것도 안 함

**예시**: 출근시간 09:00인 직원이 09:30까지 미출근 → 09:30~09:40 사이 크론 실행 시 absent 레코드 생성

### 수동 상태 변경 (updateAttendance)

- `PATCH /v1/attendances/:id`
- 기업 또는 관리자가 `status`를 `leave`, `holiday`, `absent` 등으로 직접 변경 가능
- `leave` 또는 `holiday`로 변경 시 `isLate`, `isEarlyLeave`는 false로 리셋

### 대시보드 조회 (getCompanyDaily / getDailyAttendance)

- attendance 레코드가 있으면 → `att.status` 그대로 반환
- 레코드 없으면 → 출근일이면 `pending`, 비출근일이면 `dayoff`

### 결근 알림 (getAbsenceAlerts)

- `GET /admin/absence-alerts`
- DB에서 `status: 'absent'` 레코드를 직접 조회 (이전: 날짜별 순회하며 계산)

---

## 프론트엔드 타입

### AttendanceStatus (DB 저장값)

```typescript
// types/attendance.ts
type AttendanceStatus = 'checkin' | 'checkout' | 'absent' | 'leave' | 'holiday';
```

### DailyAttendanceRecord.status (대시보드 표시)

```typescript
// types/attendance.ts
status: 'checkin' | 'checkout' | 'absent' | 'leave' | 'holiday' | 'pending' | 'dayoff';
```

### AdminDailyEmployee.status (관리자 대시보드)

```typescript
// types/adminDashboard.ts
status: 'checkin' | 'checkout' | 'absent' | 'leave' | 'holiday' | 'pending' | 'dayoff';
```

### Employee.status (직원 목록)

```typescript
// types/employee.ts
status: 'checkin' | 'checkout' | 'absent' | 'leave' | 'holiday' | 'resigned' | 'pending' | 'dayoff';
```

### DisplayStatus (출퇴근 기록 표시)

```typescript
// types/attendance.ts
type DisplayStatus = '정상' | '지각' | '결근' | '휴가' | '휴일';
```

---

## UI 표시

### 기업 대시보드 (AttendanceTable)

| status | 라벨 | Badge variant |
|---|---|---|
| `checkin` | 출근 완료 | `orange` |
| `checkout` | 퇴근 완료 | `default` (회색) |
| `absent` | 결근 | `danger` |
| `leave` | 휴가 | `info` |
| `holiday` | 휴일 | `default` |
| `pending` | 출근 전 | `warning` |
| `dayoff` | 휴무 | `default` |

### 관리자 대시보드 (CompanyAttendanceAccordion)

| status | 라벨 | 스타일 |
|---|---|---|
| `checkout` | 퇴근 | `bg-green-100 text-green-700` |
| `checkin` | 출근 중 | `bg-blue-100 text-blue-700` |
| `absent` | 결근 | `bg-red-100 text-red-700` |
| `leave` | 휴가 | `bg-blue-100 text-blue-700` |
| `holiday` | 휴일 | `bg-purple-100 text-purple-700` |
| `dayoff` | 휴무 | `bg-gray-100 text-gray-600` |
| `pending` | 출근 전 | `bg-gray-100 text-gray-700` |

### 직원 목록 (employeeStatus)

| status | 라벨 | 스타일 |
|---|---|---|
| `checkin` | 근무중 | `bg-green-100 text-green-700` |
| `checkout` | 퇴근 | `bg-blue-100 text-blue-700` |
| `absent` | 결근 | `bg-red-100 text-red-700` |
| `leave` | 휴가 | `bg-blue-100 text-blue-700` |
| `holiday` | 휴일 | `bg-purple-100 text-purple-700` |
| `pending` | 출근 전 | `bg-yellow-100 text-yellow-700` |
| `dayoff` | 휴무 | `bg-gray-100 text-gray-600` |

### 출퇴근 기록 (useAttendanceHistory)

| DB status | DisplayStatus |
|---|---|
| `leave` | 휴가 |
| `holiday` | 휴일 |
| `absent` | 결근 |
| `checkin` / `checkout` + isLate | 지각 |
| `checkin` / `checkout` + !isLate | 정상 |

---

## 파일 목록

### 서버 (durubitteo_server)

| 파일 | 역할 |
|---|---|
| `prisma/schema.prisma` | status default: `"checkin"` |
| `src/attendance/dto/attendance-query.dto.ts` | AttendanceStatus enum (CHECKIN, CHECKOUT, ABSENT, LEAVE, HOLIDAY) |
| `src/attendance/attendance.service.ts` | clockIn → checkin, clockOut → checkout, getCompanyDaily DB status 직접 사용 |
| `src/attendance/attendance-cron.service.ts` | 결근 자동 처리 크론잡 (매 10분) |
| `src/attendance/attendance.module.ts` | AttendanceCronService 등록 |
| `src/admin/admin.service.ts` | getDailyAttendance/getAbsenceAlerts DB status 직접 사용 |
| `src/app.module.ts` | ScheduleModule.forRoot() 등록 |

### 프론트엔드 (durubitteo_web)

| 파일 | 역할 |
|---|---|
| `types/attendance.ts` | AttendanceStatus, DisplayStatus, DailyAttendanceRecord 타입 |
| `types/adminDashboard.ts` | AdminDailyEmployee.status 타입 |
| `types/employee.ts` | Employee.status 타입 |
| `app/company/_components/AttendanceTable.tsx` | 기업 대시보드 출퇴근 테이블 배지 |
| `app/admin/_components/CompanyAttendanceAccordion.tsx` | 관리자 회사별 출퇴근 아코디언 |
| `app/company/_utils/employeeStatus.ts` | 직원 상태 라벨/스타일 |
| `app/company/_utils/attendanceStatus.ts` | DisplayStatus 색상 |
| `app/company/employees/_hooks/useAttendanceHistory.ts` | 출퇴근 기록 → DisplayStatus 변환 |

---

## DB 마이그레이션

기존 `present` 데이터 변환 (1회성):

```sql
UPDATE attendances SET status = 'checkout' WHERE status = 'present' AND clock_out IS NOT NULL;
UPDATE attendances SET status = 'checkin' WHERE status = 'present' AND clock_out IS NULL;
```
