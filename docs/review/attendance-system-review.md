# 출퇴근 시스템 코드 리뷰

**리뷰 일시**: 2026-02-11
**범위**: 출퇴근 상태 표시, 색상 일관성, 에러 처리, 타임존 처리

---

## 점검 항목별 결과

### 1. 상태값 표시 일관성 점검

**결과**: 문제 발견 및 수정 완료

| 항목 | 수정 전 | 수정 후 |
|------|---------|---------|
| checkin 색상 | green/blue/orange (페이지별 상이) | green (통일) |
| checkout 색상 | blue/green/gray (페이지별 상이) | blue (통일) |
| pending 색상 | yellow/gray (페이지별 상이) | yellow (통일) |
| ~~holiday 색상~~ | ~~purple/blue~~ | holiday 제거됨 (서버 미지원) |

### 2. 중복 함수 정의 점검

**결과**: 3곳 중복 발견 및 통합 완료

| 함수 | 기존 위치 | 통합 후 |
|------|----------|---------|
| `getStatusColor` | `company/_utils/attendanceStatus.ts`, `admin/employees/[id]/page.tsx`, `admin/_components/CompanyAttendanceAccordion.tsx` | `lib/status.ts` |
| `getEmployeeStatusLabel/Style` | `company/_utils/employeeStatus.ts` (원본), 각 컴포넌트 로컬 변형 | `lib/status.ts` |
| `getAttendanceDisplayStatus` | `admin/employees/[id]/page.tsx` 로컬 | `lib/status.ts` |

### 3. 에러 처리 점검

**결과**: 누락 1건 발견 및 수정 완료

- `admin/dashboard/page.tsx`: 날짜 변경 시 `getAdminDailyAttendance()` 호출에 에러 처리 없음
  - `.then()` 패턴 → `async/await` + `try-catch` + `toast.error()` 로 변경

### 4. 관리자 직원 상세 상태 표시 점검

**결과**: Critical 버그 발견 및 수정 완료

수정 전 `statusLabel` 매핑:
```
checkin → '근무중'
checkout → '퇴근'
absent → '결근'
leave → '대기' (BUG)
~~holiday → '대기' (BUG)~~ (holiday 제거됨)
pending → '대기' (BUG)
dayoff → '대기' (BUG)
```

수정 후: `getEmployeeStatusLabel()` 공유 함수 사용으로 7가지 상태 모두 정확 표시

### 5. 상태 수정 모달 점검

**결과**: ~~holiday 옵션 누락 발견 및 추가 완료~~ → 이후 holiday 자체를 제거 (서버 미지원)

- `admin/employees/[id]/page.tsx` 근무시간 수정 모달
- 최종: checkin, checkout, absent, leave (4개) — holiday 제거됨

### 6. 타임존 처리 점검

**결과**: 2건 발견 및 수정 완료

| 위치 | 문제 | 수정 |
|------|------|------|
| `CompanyAttendanceAccordion` 날짜 초기화 | 수동 KST 계산 (`+9h`) | `formatDateAsKST(new Date())` |
| `workstats/page.tsx` `getCurrentMonth()` | `new Date().getMonth()` (UTC 기준) | `formatDateAsKST(new Date()).substring(0, 7)` |

---

## 수정 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `lib/status.ts` | **신규** - 공유 상태 유틸리티 (4개 함수) |
| `app/company/_utils/employeeStatus.ts` | `lib/status`에서 re-export |
| `app/company/_utils/attendanceStatus.ts` | `lib/status`에서 re-export |
| `app/admin/_components/CompanyAttendanceAccordion.tsx` | 로컬 함수 제거, 공유 함수 사용, KST 수정 |
| `app/company/_components/AttendanceTable.tsx` | `getStatusBadge` 제거, 공유 함수 사용 |
| `app/admin/employees/[id]/page.tsx` | statusLabel/Class 수정, 로컬 함수 제거 |
| `app/admin/dashboard/page.tsx` | 날짜 변경 에러 처리 추가 |
| `app/admin/workstats/page.tsx` | `getCurrentMonth` KST 적용 |

---

## 통합된 상태 색상 표준 (lib/status.ts)

### Employee 실시간 상태 (System A)

| Status | Label | Style |
|--------|-------|-------|
| checkin | 근무중 | `bg-green-100 text-green-700` |
| checkout | 퇴근 | `bg-blue-100 text-blue-700` |
| absent | 결근 | `bg-red-100 text-red-700` |
| leave | 휴가 | `bg-blue-100 text-blue-700` |
| pending | 출근 전 | `bg-yellow-100 text-yellow-700` |
| dayoff | 휴무 | `bg-gray-100 text-gray-600` |
| (비활성) | 퇴사 | `bg-gray-200 text-gray-600` |

### 출퇴근 기록 표시 상태 (System B)

| DisplayStatus | Style |
|---------------|-------|
| 정상 | `bg-green-100 text-green-700` |
| 지각 | `bg-yellow-100 text-yellow-700` |
| 휴가 | `bg-blue-100 text-blue-700` |
| 결근 | `bg-red-100 text-red-700` |

---

## 검증

- `npm run build`: 타입 에러 없이 빌드 성공 확인
