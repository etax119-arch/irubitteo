# 데이터베이스 스키마

## 1. 전체 구조

```
┌─────────────┐     ┌─────────────────┐
│   admins    │     │    companies    │
└─────────────┘     └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
    ┌─────────────────┐ ┌──────────┐ ┌─────────────────┐
    │  company_files  │ │employees │ │     reports     │
    └─────────────────┘ └────┬─────┘ └────────┬────────┘
                             │                │
                    ┌────────┼────────┐       │
                    │        │        │       │
                    ▼        ▼        ▼       ▼
           ┌──────────────┐ ┌─────┐ ┌─────────────────┐
           │employee_files│ │tasks│ │  report_files   │
           └──────────────┘ └─────┘ └─────────────────┘
                                │
                                ▼
                        ┌─────────────┐
                        │ attendances │
                        └─────────────┘
```

---

## 2. 테이블 상세

### admins (두르비터 관리자)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 관리자 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| password_hash | VARCHAR(255) | NOT NULL | 비밀번호 해시 |
| name | VARCHAR(100) | NOT NULL | 이름 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### companies (기업)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 기업 ID |
| code | VARCHAR(10) | UNIQUE, NOT NULL | 기업 고유번호 (로그인용) |
| name | VARCHAR(255) | NOT NULL | 기업명 |
| email | VARCHAR(255) | | 연락용 이메일 |
| phone | VARCHAR(20) | | 연락처 |
| address | TEXT | | 주소 |
| business_number | VARCHAR(20) | | 사업자등록번호 |
| is_active | BOOLEAN | DEFAULT TRUE | 활성 상태 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL,  -- 기업 고유번호 (로그인용)
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  business_number VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### company_files (기업 첨부파일)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 파일 ID |
| company_id | UUID | FK → companies | 기업 ID |
| file_name | VARCHAR(255) | NOT NULL | 파일명 |
| file_path | TEXT | NOT NULL | 저장 경로 |
| file_size | INTEGER | | 파일 크기 (bytes) |
| mime_type | VARCHAR(100) | | MIME 타입 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

```sql
CREATE TABLE company_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_company_files_company ON company_files(company_id);
```

---

### employees (직원)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 직원 ID |
| company_id | UUID | FK → companies | 소속 기업 |
| unique_code | VARCHAR(20) | UNIQUE, NOT NULL | 고유번호 (로그인용) |
| name | VARCHAR(100) | NOT NULL | 이름 |
| phone | VARCHAR(20) | NOT NULL | 연락처 |
| ssn_encrypted | TEXT | NOT NULL | 주민번호 (암호화) |
| hire_date | DATE | NOT NULL | 입사일 |
| resign_date | DATE | | 퇴사일 |
| work_days | INTEGER[] | DEFAULT '{1,2,3,4,5}' | 출근 요일 (1=월, 7=일) |
| work_start_time | TIME | DEFAULT '09:00' | 근무 시작 |
| work_end_time | TIME | DEFAULT '18:00' | 근무 종료 |
| profile_image | TEXT | | 프로필 이미지 경로 |
| is_active | BOOLEAN | DEFAULT TRUE | 활성 상태 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  unique_code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  ssn_encrypted TEXT NOT NULL,
  hire_date DATE NOT NULL,
  resign_date DATE,
  work_days INTEGER[] DEFAULT '{1,2,3,4,5}',  -- 출근 요일 (1=월, 7=일)
  work_start_time TIME DEFAULT '09:00',
  work_end_time TIME DEFAULT '18:00',
  profile_image TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_employees_unique_code ON employees(unique_code);
```

---

### employee_files (직원 첨부파일)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 파일 ID |
| employee_id | UUID | FK → employees | 직원 ID |
| file_name | VARCHAR(255) | NOT NULL | 파일명 |
| file_path | TEXT | NOT NULL | 저장 경로 |
| file_size | INTEGER | | 파일 크기 (bytes) |
| mime_type | VARCHAR(100) | | MIME 타입 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

```sql
CREATE TABLE employee_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_employee_files_employee ON employee_files(employee_id);
```

---

### attendances (출퇴근)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 출퇴근 ID |
| employee_id | UUID | FK → employees | 직원 ID |
| date | DATE | NOT NULL | 날짜 |
| clock_in | TIMESTAMP | | 출근 시간 |
| clock_out | TIMESTAMP | | 퇴근 시간 |
| status | VARCHAR(20) | DEFAULT 'present' | 상태 |
| is_late | BOOLEAN | DEFAULT FALSE | 지각 여부 |
| is_early_leave | BOOLEAN | DEFAULT FALSE | 조퇴 여부 |
| note | TEXT | | 비고 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

**status 값**: `present` (출근), `absent` (결근)

**참고**: 결근은 work_days에 포함된 요일에만 판단됩니다. work_days에 없는 요일은 출퇴근 기록 자체가 생성되지 않습니다.

```sql
CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clock_in TIMESTAMP,
  clock_out TIMESTAMP,
  status VARCHAR(20) DEFAULT 'present',
  is_late BOOLEAN DEFAULT FALSE,
  is_early_leave BOOLEAN DEFAULT FALSE,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

CREATE INDEX idx_attendances_employee_date ON attendances(employee_id, date);
CREATE INDEX idx_attendances_date ON attendances(date);
```

---

### tasks (업무)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 업무 ID |
| employee_id | UUID | FK → employees | 직원 ID |
| attendance_id | UUID | FK → attendances | 출퇴근 ID |
| title | VARCHAR(255) | NOT NULL | 제목 |
| content | TEXT | | 내용 |
| start_time | TIMESTAMP | | 시작 시간 |
| end_time | TIMESTAMP | | 종료 시간 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  attendance_id UUID REFERENCES attendances(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_employee ON tasks(employee_id);
CREATE INDEX idx_tasks_attendance ON tasks(attendance_id);
```

---

### reports (보고서)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 보고서 ID |
| company_id | UUID | FK → companies | 기업 ID |
| type | VARCHAR(20) | NOT NULL | 종류 |
| period_start | DATE | NOT NULL | 기간 시작 |
| period_end | DATE | NOT NULL | 기간 종료 |
| data | JSONB | | 보고서 데이터 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

**type 값**: `daily` (일일), `weekly` (주간), `monthly` (월간)

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_company ON reports(company_id);
CREATE INDEX idx_reports_period ON reports(period_start, period_end);
```

---

### report_files (보고서 파일)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 파일 ID |
| report_id | UUID | FK → reports | 보고서 ID |
| file_type | VARCHAR(10) | NOT NULL | 파일 형식 |
| file_path | TEXT | NOT NULL | 저장 경로 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

**file_type 값**: `pdf`, `xlsx`

```sql
CREATE TABLE report_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  file_type VARCHAR(10) NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_report_files_report ON report_files(report_id);
```

---

## 3. 결근 판단 로직

### 배치 처리 (매일 자정)

```sql
-- 전날 출근 기록이 없는 활성 직원을 결근 처리 (work_days 기반)
INSERT INTO attendances (employee_id, date, status)
SELECT
  e.id,
  CURRENT_DATE - INTERVAL '1 day',
  'absent'
FROM employees e
WHERE e.is_active = TRUE
  AND e.hire_date <= CURRENT_DATE - INTERVAL '1 day'
  AND (e.resign_date IS NULL OR e.resign_date >= CURRENT_DATE - INTERVAL '1 day')
  AND NOT EXISTS (
    SELECT 1 FROM attendances a
    WHERE a.employee_id = e.id
      AND a.date = CURRENT_DATE - INTERVAL '1 day'
  )
  -- work_days 배열에 해당 요일 포함 여부 확인
  -- PostgreSQL: EXTRACT(ISODOW) = 1(월) ~ 7(일)
  AND EXTRACT(ISODOW FROM CURRENT_DATE - INTERVAL '1 day')::INTEGER = ANY(e.work_days);
```

**참고**: `EXTRACT(ISODOW ...)` 는 ISO 요일 (1=월요일, 7=일요일)을 반환하며, `work_days` 배열 형식과 일치합니다.

---

## 4. 주민번호 암호화

### 암호화 방식
- **알고리즘**: AES-256-GCM
- **키 관리**: 환경 변수로 관리 (절대 코드에 하드코딩 금지)

### 암호화 흐름
```
입력: 주민번호 (평문)
  ↓
AES-256-GCM 암호화
  ↓
Base64 인코딩
  ↓
저장: ssn_encrypted 컬럼
```

### 복호화 권한
- 두르비터 관리자: 전체 복호화 가능
- 기업: 소속 직원만 복호화 가능
- 직원: 본인만 복호화 가능
