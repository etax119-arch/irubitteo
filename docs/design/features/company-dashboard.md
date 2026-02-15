# 기업 대시보드 기능 명세

> 참조: `durubitteo_design/src/CompanyDashboard.jsx`

## 개요

기업 인사담당자가 사용하는 근로자 관리 시스템. 출퇴근 현황 확인, 근로자 등록/관리, 근무일정 등록, 공지사항 발송 기능 제공.

---

## 구현 상태

**구현 완료** (라우트 기반 탭 구조)

### 라우트 구조

```
/app/company/
├── layout.tsx              # 헤더 + 4개 탭 네비게이션 (Link 기반, aria-current 지원) + 인증 보호
├── page.tsx                # → /company/dashboard 리다이렉트
├── _components/            # 공용 컴포넌트
│   ├── StatCard.tsx            # 통계 카드
│   ├── EmployeeTable.tsx       # 근로자 목록 테이블
│   ├── AttendanceTable.tsx     # 출퇴근 기록 테이블
│   ├── CalendarGrid.tsx        # 캘린더 그리드
│   ├── NoticeHistory.tsx       # 공지 발송 기록
│   ├── AddWorkerModal.tsx      # 근로자 추가 모달
│   ├── ScheduleModal.tsx       # 일정 등록/수정 모달
│   └── WorkerSelector.tsx      # 공지 발송 대상 선택
├── _utils/                 # 유틸리티
│   └── filterEmployees.ts     # 직원 검색 필터 (이름, 전화번호, 장애유형)
├── dashboard/page.tsx      # 대시보드 탭
├── employees/
│   ├── page.tsx            # 근로자 관리 탭 (목록)
│   ├── _hooks/             # 근로자 관련 커스텀 훅
│   │   ├── useEmployeeDetail.ts    # 근로자 상세 정보 + 수정
│   │   ├── useAttendanceHistory.ts # 출퇴근 기록 조회 + 수정
│   │   ├── useResign.ts            # 퇴사 처리
│   │   ├── useEmployeeFiles.ts     # 문서 업로드/삭제
│   │   ├── useEmployeeNotes.ts     # 비고란 상태 관리
│   │   ├── useEmployeeWorkInfo.ts  # 근무 정보 상태 관리
│   │   └── useEmployeeDisability.ts # 장애 정보 상태 관리
│   └── [id]/
│       ├── page.tsx        # 근로자 상세 페이지
│       └── _components/    # 상세 페이지 전용 컴포넌트 (11개)
│           ├── ProfileCard.tsx            # 프로필 카드
│           ├── DisabilityInfoSection.tsx   # 장애 정보 (편집 가능)
│           ├── NotesSection.tsx           # 비고란 (편집 가능)
│           ├── ResignSection.tsx          # 퇴사 정보
│           ├── ResignModal.tsx            # 퇴사 등록 모달
│           ├── AttendanceHistoryTable.tsx  # 출퇴근 기록 테이블
│           ├── WorkInfoSection.tsx        # 근무 정보 (편집 가능)
│           ├── DocumentSection.tsx        # 문서 관리
│           ├── UploadModal.tsx            # 파일 업로드 모달
│           ├── WorkDoneModal.tsx          # 업무 내용 확인 모달
│           └── WorkTimeEditModal.tsx      # 근무시간 수정 모달
├── schedule/page.tsx       # 근무일정 탭
└── notices/page.tsx        # 공지사항 탭
```

### URL 구조

| URL | 설명 |
|-----|------|
| `/company` | `/company/dashboard`로 리다이렉트 |
| `/company/dashboard` | 대시보드 탭 |
| `/company/employees` | 근로자 관리 탭 (목록) |
| `/company/employees/:id` | 근로자 상세 페이지 |
| `/company/schedule` | 근무일정 탭 |
| `/company/notices` | 공지사항 탭 |

---

## 탭 구성

| 탭 ID | 탭 이름 | 아이콘 | 설명 |
|-------|--------|--------|------|
| dashboard | 대시보드 | TrendingUp | 통계 카드 및 출퇴근 기록 조회 |
| employees | 근로자 관리 | Users | 근로자 목록 조회 및 등록 |
| schedule | 근무일정관리 | Clock | 캘린더 기반 근무 내용 등록 |
| notices | 공지사항 | MessageSquare | 근로자에게 공지 발송 |

---

## 탭별 상세 기능

### 1. 대시보드 탭

**목적**: 오늘의 출퇴근 현황 한눈에 파악
**데이터 관리**: TanStack Query 적용 (`useCompanyDaily`, staleTime: 60s + 리프레시 버튼)
**API 연동**: ✅ 완료 (`GET /v1/attendances/company-daily`)

#### 통계 카드 (4열)
| 카드 | 아이콘 | 색상 | 데이터 |
|------|--------|------|--------|
| 전체 근로자 | Users | 파란색 | `stats.total`명 |
| 출근 | UserCheck | 주황색 (강조) | `stats.checkedIn`명 |
| 퇴근 | Clock | 회색 | `stats.checkedOut`명 |
| 출근율 | TrendingUp | 녹색 | `stats.attendanceRate`% |

#### 출퇴근 기록 테이블

**날짜 선택**:
- 이전/다음 날짜 버튼
- 현재 선택 날짜 표시 (예: "2026년 1월 28일 (화)")
- 날짜 변경 시 `GET /v1/attendances/company-daily?date=YYYY-MM-DD` 재요청

**테이블 컬럼**:
| 컬럼 | 설명 |
|------|------|
| 이름 | 근로자 이름 (아바타 포함) |
| 전화번호 | 연락처 |
| 출근 | 출근 시간 (미출근 시 "-") |
| 퇴근 | 퇴근 시간 (미퇴근 시 "-") |
| 상태 | 근무중 / 퇴근 / 결근 / 휴가 / 출근 전 / 휴무 |
| 업무 내용 | 퇴근 시 입력한 내용 |

**상태 배지 색상** (`getEmployeeStatusStyle`):
- 근무중: 초록색 (`bg-green-100 text-green-700`)
- 퇴근: 파란색 (`bg-blue-100 text-blue-700`)
- 결근: 빨간색 (`bg-red-100 text-red-700`)
- 휴가: 청록색 (`bg-teal-100 text-teal-700`)
- 출근 전: 노란색 (`bg-yellow-100 text-yellow-700`)
- 휴무: 회색 (`bg-gray-100 text-gray-600`)

**로딩/에러 상태**:
- 로딩 중: "로딩 중..." 표시
- 에러 시: 에러 메시지 + `<Button variant="ghost">` 재시도 버튼, `role="alert"` 적용

---

### 2. 근로자 관리 탭

**목적**: 소속 근로자 목록 조회 및 신규 등록
**데이터 관리**: TanStack Query 적용 (`useCompanyPaginatedEmployees`, `useCreateEmployee`, 서버 사이드 페이지네이션, 검색 디바운싱 300ms, `PaginationBar`, `onNextPage` 상한 검증)
**API 연동**: ✅ 완료 (`GET /v1/employees`)

#### 상단 영역
- "근로자 관리" 제목
- 검색창 (이름, 전화번호, 장애유형 — 서버 사이드 검색, 300ms 디바운싱)
- "+ 근로자 추가" 버튼

#### 근로자 목록 테이블
| 컬럼 | 설명 |
|------|------|
| 이름 | 아바타(이니셜) + 이름 |
| 전화번호 | 연락처 |
| 장애유형 | `disabilityType` 단독 표시 (예: "지체장애") |
| 상태 | 근무중 / 결근 / 퇴사 |
| 관리 | "상세보기" 버튼 → `/company/employees/:id` |

#### 근로자 추가 모달

**API 연동**: ✅ 완료 (`POST /v1/employees`)

**섹션 1: 기본 인적 정보**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| 이름 | 텍스트 | O | 근로자 이름 |
| 주민등록번호 | 텍스트 | O | 000000-0000000 형식 (평문 저장, 입력 시 보임) |
| 성별 | 버튼 선택 | O | 남 / 여 |
| 휴대폰 번호 | 전화번호 | O | 010-0000-0000 형식 (자동 하이픈 포맷팅, 하이픈 포함 저장) |

**섹션 2: 주소 정보**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| 시/도 | 드롭다운 | O | 17개 시/도 중 선택 |
| 시/군/구 | 드롭다운 | O | 선택된 시/도에 따라 동적 변경, 시/도 미선택 시 비활성화 |
| 상세주소 | 텍스트 | X | 자유 입력 (최대 200자) |

**시/도 변경 시 동작**: 시/도 변경 → 시/군/구 초기화 + complete 상태 삭제

**섹션 3: 비상 연락처 정보**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| 비상 연락처 이름 | 텍스트 | O | 보호자/비상연락 대상자 |
| 근로자와의 관계 | 텍스트 | O | 부모, 보호자 등 |
| 비상 연락처 전화번호 | 전화번호 | O | 010-0000-0000 형식 (자동 하이픈 포맷팅, 하이픈 포함 저장) |

**섹션 4: 장애 정보**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| 장애 유형 | 드롭다운 | O | 15개 유형 중 선택 |
| 중증/경증 | 버튼 선택 | O | 중증 (빨강) / 경증 (파랑) |

**장애 유형 목록**:
- 지체장애, 뇌병변장애, 시각장애, 청각장애, 언어장애
- 지적장애, 정신장애, 자폐성장애, 신장장애, 심장장애
- 호흡기장애, 간장애, 안면장애, 장루·요루장애, 간질장애

**섹션 5: 근무 및 인정 정보**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| 입사일 | 날짜 | O | 근무 시작일 |
| 장애인 인정일 | 날짜 | O | 장애인 고용 인정 시작일 |
| 근무 요일 | 다중 선택 | O | 월~일 중 선택 |
| 출근 시간 | 시간 | O | 예: 09:00 |

**섹션 6: 근로자 고유 번호 설정**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| 근로자 고유 번호 | 텍스트 | O | 출퇴근 앱 로그인용 코드 |

**고유번호 자동 생성 규칙**:
- 주민등록번호 MMDD (인덱스 2~5) + 휴대폰 번호 뒤 4자리
- 예: 주민번호 `990315-1234567` + 전화번호 `010-1234-5678` → 고유번호 `03155678`
- SSN 6자리 이상 + 전화번호 4자리 이상 입력 시 자동 생성
- 사용자가 직접 수정 가능 (수동 편집 시 이후 자동 생성 중단)
- 중복 고유번호 제출 시 409 에러 → 별도 에러 토스트 표시

**전화번호 자동 포맷팅**:
- 숫자 입력 시 자동으로 `000-0000-0000` 형식의 하이픈 삽입
- 최대 11자리 (하이픈 제외)
- 휴대폰 번호, 비상연락처 전화번호 모두 적용
- DB에 하이픈 포함된 상태로 저장

---

### 2-1. 근로자 상세 페이지 (`/company/employees/:id`)

**목적**: 개별 근로자의 상세 정보 조회 및 편집
**API 연동**: ✅ 완료 (`GET /v1/employees/:id`, `PATCH /v1/employees/:id`, `GET /v1/attendances`, `PATCH /v1/attendances/:id`)

#### 레이아웃

3열 그리드 (모바일에서 1열):
- **왼쪽 (1/3)**: 기본 정보, 고유번호, 장애 정보, 비고란
- **오른쪽 (2/3)**: 출퇴근 기록, 근무 정보, 문서 관리

#### 왼쪽: 기본 정보

**프로필 카드 (편집 가능)**
- 이니셜 아바타 (이름 첫 글자)
- 이름, 상태 배지 (근무중/퇴근/결근/퇴사)
- 읽기 모드: 주민번호, 핸드폰번호, 주소, 비상연락처, 성별, 입사일
- 수정 버튼 클릭 시 인라인 편집 모드 (이름, 주민번호, 핸드폰번호, 성별, 입사일, 주소(시/도+시군구+상세), 비상연락처(이름+관계+전화))
- API: `PATCH /v1/employees/:id` (`name`, `ssn`, `phone`, `gender`, `hireDate`, `addressCity/District/Detail`, `emergencyContactName/Relation/Phone`)

**근로자 고유번호 카드**
- 주황색 강조 카드로 고유번호 표시

**장애 정보 (편집 가능)**
- 유형 (수정 가능 - DISABILITY_TYPES 드롭다운), 중증/경증 (수정 가능), 인정일 (수정 가능)
- 수정 버튼 클릭 시 인라인 편집 모드
- API: `PATCH /v1/employees/:id` (`disabilityType`, `disabilitySeverity`, `disabilityRecognitionDate`)

**비고란 (편집 가능)**
- 회사 메모 텍스트
- 수정 버튼 클릭 시 textarea로 전환
- API: `PATCH /v1/employees/:id` (`companyNote`)

**퇴사 등록/퇴사 정보**
- 활성 근로자: "퇴사 등록" 버튼 (퇴사일, 사유 입력 모달)
- 퇴사 모달에 "대기자에 포함" 체크박스 (재취업 희망 근로자 표시, `standby` 필드)
- 퇴사자: 퇴사일, 비고 표시

#### 오른쪽: 상세 정보

**최근 출퇴근 기록**
- 최근 7건 조회 (`GET /v1/attendances?employeeId=...&limit=7`)
- 테이블 컬럼: 날짜, 출근, 퇴근, 상태(정상/지각/결근/휴가), 업무내용, 수정
- 휴가 상태: 파란색 "휴가" 뱃지, 출근/퇴근 시간에 `text-gray-400 line-through` 취소선 표시
- 업무내용: "확인하기" 링크 → 모달로 전체 내용 표시
- 수정: 각 행에 수정 아이콘 → 근무시간 수정 모달
  - 출근시간, 퇴근시간, 업무내용 편집
  - 상태 드롭다운: 출근(`checkin`), 퇴근(`checkout`), 결근(`absent`), 휴가(`leave`) 선택 가능
  - clockIn/clockOut이 없는 레코드: 시간 필드를 빈 값으로 표시 (기본값 채우지 않음)
  - 미퇴근 직원: 퇴근시간 필드가 빈 상태("--:--")로 표시, 시간 입력 시에만 퇴근 처리
  - 상태 변경 시 프로필 카드의 상태 배지도 자동 갱신 (직원 정보 refetch)
  - 변경된 필드만 API로 전송 (partial update)
  - API: `PATCH /v1/attendances/:id` (`clockIn`, `clockOut`, `workContent`, `status`)

**근무 정보 (편집 가능)**
- 근무 요일: 월~일 토글 버튼 (선택된 요일 주황색 표시)
- 출근 시간: HH:MM 표시
- 수정 모드: 요일 토글 + time input
- API: `PATCH /v1/employees/:id` (`workDays`, `workStartTime`)

**문서 관리** (API 연동 완료)
- 문서 목록: 문서종류 배지, 파일명, 크기, 업로드일 표시
- 파일 클릭 시 새 탭에서 미리보기/다운로드 (URL 프로토콜 검증: http/https만 허용)
- 삭제 버튼 (확인 후 Supabase Storage + DB 삭제)
- 빈 상태 / 로딩 상태 UI
- 파일 업로드 모달: 문서 종류 선택 (근로계약서, 동의서, 건강검진, 자격증, 장애인등록증, 이력서, 기타) + 파일 선택 (PDF, JPG, PNG, 최대 10MB, `validateUploadFile` + `FILE_CONSTRAINTS.DOCUMENT` 검증)
- API: `GET/POST /v1/employees/:id/files`, `DELETE /v1/employees/:id/files/:fileId`
- Supabase Storage 버킷: `employee-files`

---

### 3. 근무일정관리 탭

**목적**: 캘린더에서 날짜별 근무 내용 등록 (직원 앱에서 출근 시 표시)
**데이터 관리**: TanStack Query 적용 (`useMonthlySchedules`, `useCreateSchedule`, `useUpdateSchedule`, `useDeleteSchedule`)

#### 캘린더 뷰
- 월별 네비게이션 (이전/다음 월)
- 7열 그리드 (일~토)
- 요일 헤더 (일요일 빨강, 토요일 파랑)

#### 날짜 셀
- 날짜 숫자
- 등록된 일정 있는 경우:
  - 업무 내용 미리보기 (텍스트 truncate)
  - 파란 계열 배경
- 일정 없는 평일: + 아이콘
- 오늘 날짜: 주황색 테두리

#### 일정 등록 모달
- 날짜 클릭 시 모달 표시
- 선택한 날짜 표시
- 근무 내용 텍스트 영역 (8줄)
- 취소 / 저장 버튼

#### 일정 요약 카드
| 카드 | 아이콘 | 데이터 |
|------|--------|--------|
| 이번 달 등록 일정 | FileText | {개수}개 |

---

### 4. 공지사항 탭

**목적**: 근로자에게 긴급 공지 발송 및 발송 기록 관리
**데이터 관리**: TanStack Query 적용 (`useNotices`, `useActiveEmployees`, `useSendNotice`, `useDeleteNotice`)
**API 연동**: ✅ 완료 (`POST /v1/notices`, `GET /v1/notices`, `DELETE /v1/notices/:id`)

#### 새 공지사항 발송 섹션

**발송 대상 근로자** (`WorkerSelector` 컴포넌트):
- "전체 선택" / "전체 해제" 버튼 (현재 검색 필터 기준, 결과 0건 시 비활성화)
- 검색창 (이름, 전화번호로 필터링, `useMemo` 캐싱)
- 근로자 체크박스 목록
  - 아바타, 이름, 장애유형, 전화번호
- 선택된 근로자 수 표시
- **성능 최적화**: 선택 상태를 `Set<string>`으로 관리하여 O(1) 조회, `useCallback`으로 콜백 메모이제이션

**공지사항 내용**:
- 텍스트 영역 (6줄)
- 플레이스홀더 예시:
  ```
  근로자들에게 전달할 공지사항을 작성해주세요.

  예)
  내일 오전 안전교육이 진행됩니다.
  필히 참석 부탁드립니다.
  ```

**버튼**:
- "초기화" - 선택 및 내용 초기화
- "발송하기" - 대상 선택 + 내용 입력 시 활성화

#### 발송 기록 섹션

**목록 표시**:
- 발송 날짜/시간 (예: "2026-01-28 14:30")
- 발송자
- 발송 대상 근로자 목록 (3명 초과 시 "+N명 더보기")
- 공지 내용

---

## 데이터 흐름

### 입력 데이터
| 항목 | 출처 | 설명 |
|------|------|------|
| 근로자 정보 | 모달 입력 | 신규 근로자 등록 |
| 근무 일정 | 캘린더 모달 | 날짜별 작업 내용 |
| 공지사항 | 텍스트 입력 | 발송할 공지 내용 |

### 출력 데이터
| 항목 | 대상 | 설명 |
|------|------|------|
| 오늘의 작업 내용 | 직원 앱 출근 화면 | 해당 날짜 근무 내용 |
| 긴급 공지 | 직원 앱 메인 화면 | 발송된 공지 표시 |
| 출퇴근 기록 | 대시보드 | 근로자별 출퇴근 현황 |

---

## API 연동 현황

| 기능 | API | 상태 |
|------|-----|------|
| 근로자 목록 조회 | `GET /v1/employees` | ✅ 완료 |
| 근로자 상세 조회 | `GET /v1/employees/:id` | ✅ 완료 |
| 근로자 정보 수정 | `PATCH /v1/employees/:id` | ✅ 완료 |
| 출퇴근 기록 조회 | `GET /v1/attendances` | ✅ 완료 |
| 출퇴근 기록 수정 | `PATCH /v1/attendances/:id` | ✅ 완료 |
| 대시보드 일별 현황 | `GET /v1/attendances/company-daily` | ✅ 완료 |
| 근로자 등록 | `POST /v1/employees` | ✅ 완료 |
| 근무일정 관리 | `GET /v1/schedules/monthly`, `POST /v1/schedules`, `PATCH /v1/schedules/:id`, `DELETE /v1/schedules/:id` | ✅ 완료 |
| 공지사항 발송/삭제 | `POST /v1/notices`, `GET /v1/notices`, `DELETE /v1/notices/:id` | ✅ 완료 |
| 출퇴근 사진 삭제 | `DELETE /v1/attendances/:id/photos` | ✅ 완료 |
| 퇴사 처리 | `PATCH /v1/employees/:id` | ✅ 완료 |
| 문서 목록 조회 | `GET /v1/employees/:id/files` | ✅ 완료 |
| 문서 업로드 | `POST /v1/employees/:id/files` | ✅ 완료 |
| 문서 삭제 | `DELETE /v1/employees/:id/files/:fileId` | ✅ 완료 |

## 주요 타입

> 출퇴근 관련 타입은 `@/types/attendance.ts`, 직원 타입은 `@/types/employee.ts`, 폼 타입은 `@/types/companyDashboard.ts`에 정의

### DailyAttendanceRecord (대시보드용) — `@/types/attendance.ts`

```typescript
interface DailyAttendanceRecord {
  employeeId: string;            // UUID
  name: string;
  phone: string;
  clockIn: string | null;        // UTC ISO timestamp (표시 시 +9h KST 변환)
  clockOut: string | null;       // UTC ISO timestamp (표시 시 +9h KST 변환)
  status: EmployeeDailyStatus;   // Exclude<Employee['status'], 'resigned'>
  workContent: string | null;    // 퇴근 시 입력한 업무 내용
}
```

### CompanyDailyStats — `@/types/attendance.ts`

```typescript
interface CompanyDailyStats {
  total: number;           // 활성 근로자 수
  checkedIn: number;       // 출근 상태 인원
  checkedOut: number;      // 퇴근 완료 인원
  attendanceRate: number;  // 출근율 (%)
}
```

### CompanyDailyResponse — `@/types/attendance.ts`

```typescript
interface CompanyDailyResponse {
  date: string;                     // "YYYY-MM-DD"
  stats: CompanyDailyStats;
  records: DailyAttendanceRecord[];
}
```

### Employee — `@/types/employee.ts`

```typescript
type WorkDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type DisabilityType =
  | '지체장애' | '뇌병변장애' | '시각장애' | '청각장애' | '언어장애'
  | '지적장애' | '정신장애' | '자폐성장애' | '신장장애' | '심장장애'
  | '호흡기장애' | '간장애' | '안면장애' | '장루·요루장애' | '간질장애';

type Employee = {
  id: string;                          // UUID
  name: string;
  phone: string;
  disability: string | null;           // "지체장애 중증" (타입+중증/경증 결합)
  hireDate: string;                    // "YYYY-MM-DD"
  gender: string | null;               // "남" / "여"
  addressCity: string | null;              // 주소 시/도
  addressDistrict: string | null;          // 주소 시/군/구
  addressDetail: string | null;            // 상세주소
  emergencyContactName: string | null;
  emergencyContactRelation: string | null;
  emergencyContactPhone: string | null;
  status: 'checkin' | 'checkout' | 'absent' | 'leave' | 'resigned' | 'pending' | 'dayoff';
  clockIn: string | null;             // UTC ISO timestamp (표시 시 +9h KST 변환)
  clockOut: string | null;            // UTC ISO timestamp (표시 시 +9h KST 변환)
  uniqueCode: string;
  companyNote: string | null;
  adminNote: string | null;
  isActive: boolean;
  standby: boolean;
  resignDate: string | null;
  resignReason: string | null;
  workDays: WorkDay[];                 // [1,2,3,4,5] (1=월 ~ 7=일)
  workStartTime: string | null;        // "HH:mm"
  disabilityType: DisabilityType | null;
  disabilitySeverity: '중증' | '경증' | null;
  disabilityRecognitionDate: string | null; // "YYYY-MM-DD"
};
```

> `@/types/employee.ts`에는 위 외에도 `EmployeeCreateInput`, `EmployeeUpdateInput`, `EmployeeSummary`, `EmployeeQueryParams`, `EmployeeWithCompany`, `EmployeeFile`, `DocumentType` 등의 타입이 정의되어 있음.
> `@/types/companyDashboard.ts`에는 근로자 추가 모달용 `AddWorkerForm` 인터페이스가 정의되어 있음.

---

## 접근성(Accessibility)

| 항목 | 구현 |
|------|------|
| 탭 네비게이션 | 활성 탭에 `aria-current="page"` 적용 |
| 에러 상태 | `role="alert"`로 스크린 리더 자동 공지 |
| 에러 재시도 버튼 | `<Button variant="ghost">` 공용 컴포넌트 사용 |
| 문서 열기 | URL 프로토콜 검증 (XSS 방지) + `noopener,noreferrer` |

---

## 연관 기능

- 직원 대시보드 > 출근 화면: 오늘의 작업 내용 표시
- 직원 대시보드 > 메인 화면: 긴급 공지 표시
- 관리자 대시보드 > 출퇴근 현황: 전체 회사 데이터 조회
