# 데이터베이스 스키마

## 1. 전체 구조

```
┌─────────────┐     ┌─────────────────┐     ┌───────────────┐     ┌─────────────┐
│   admins    │     │    companies    │     │ notifications │     │ audit_logs  │
└─────────────┘     └────────┬────────┘     └───────────────┘     └─────────────┘
                             │
              ┌──────────────┼──────────────┬───────────────┐     ┌───────────┐
              │              │              │               │     │ templates │
              ▼              ▼              ▼               ▼     └───────────┘
    ┌─────────────────┐ ┌──────────┐ ┌───────────┐ ┌─────────────────┐
    │  company_files  │ │employees │ │ schedules │ │     reports     │
    └─────────────────┘ └────┬─────┘ └───────────┘ └────────┬────────┘
                             │                              │
         ┌───────────────────┼────────────────┬─────────────┤
         │                   │                │             │
         ▼                   ▼                ▼             ▼
┌──────────────┐ ┌───────────────────────┐ ┌─────────────┐ ┌─────────────────┐
│employee_files│ │notices─notice_recip...│ │ attendances │ │  report_files   │
└──────────────┘ └───────────────────────┘ └─────────────┘ └─────────────────┘
                                                  │
                                                  ▼
                                   ┌────────────────────────┐
                                   │ employee_monthly_stats │
                                   └────────────────────────┘
                                   (employees FK - 관리자 월간 통계 수정용)

┌───────────┐
│ inquiries │  (독립 테이블 - 비인증 문의)
└───────────┘
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
| contract_start_date | DATE | | 계약 시작일 |
| contract_end_date | DATE | | 계약 만료일 |
| hr_contact_name | VARCHAR(100) | | 인사담당자명 |
| hr_contact_phone | VARCHAR(20) | | 인사담당자 연락처 |
| hr_contact_email | VARCHAR(255) | | 인사담당자 이메일 |
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
  contract_start_date DATE,
  contract_end_date DATE,
  hr_contact_name VARCHAR(100),
  hr_contact_phone VARCHAR(20),
  hr_contact_email VARCHAR(255),
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
| gender | VARCHAR(10) | NOT NULL | 성별 (male/female) |
| ssn_encrypted | TEXT | NOT NULL | 주민번호 (암호화) |
| hire_date | DATE | NOT NULL | 입사일 |
| resign_date | DATE | | 퇴사일 |
| contract_end_date | DATE | | 계약 만료일 |
| work_days | INTEGER[] | DEFAULT '{1,2,3,4,5}' | 출근 요일 (1=월, 7=일) |
| work_start_time | TIME | DEFAULT '09:00' | 근무 시작 |
| work_end_time | TIME | DEFAULT '18:00' | 근무 종료 |
| profile_image | TEXT | | 프로필 이미지 경로 |
| disability_type | VARCHAR(50) | | 장애 유형 |
| disability_severity | VARCHAR(10) | | 중증/경증 (severe/mild) |
| disability_recognition_date | DATE | | 장애인 인정일 |
| emergency_contact_name | VARCHAR(100) | | 비상연락처 이름 |
| emergency_contact_relation | VARCHAR(50) | | 비상연락처 관계 |
| emergency_contact_phone | VARCHAR(20) | | 비상연락처 전화번호 |
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
  gender VARCHAR(10) NOT NULL,
  ssn_encrypted TEXT NOT NULL,
  hire_date DATE NOT NULL,
  resign_date DATE,
  contract_end_date DATE,
  work_days INTEGER[] DEFAULT '{1,2,3,4,5}',  -- 출근 요일 (1=월, 7=일)
  work_start_time TIME DEFAULT '09:00',
  work_end_time TIME DEFAULT '18:00',
  profile_image TEXT,
  disability_type VARCHAR(50),
  disability_severity VARCHAR(10),
  disability_recognition_date DATE,
  emergency_contact_name VARCHAR(100),
  emergency_contact_relation VARCHAR(50),
  emergency_contact_phone VARCHAR(20),
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
| work_content | TEXT | | 퇴근 시 업무 요약 (하루 1건) |
| photo_urls | JSONB | DEFAULT '[]' | 퇴근 시 첨부 사진 URL 배열 |
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
  work_content TEXT,
  photo_urls JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

CREATE INDEX idx_attendances_employee_date ON attendances(employee_id, date);
CREATE INDEX idx_attendances_date ON attendances(date);
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
| status | VARCHAR(20) | DEFAULT 'generating' | 상태 |
| data | JSONB | | 보고서 데이터 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

**type 값**: `daily` (일일), `weekly` (주간), `monthly` (월간)

**status 값**: `generating` (생성 중), `completed` (완료)

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'generating',
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

### notices (공지사항)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 공지 ID |
| company_id | UUID | FK → companies | 발송 기업 |
| content | TEXT | NOT NULL | 공지 내용 |
| sender_name | VARCHAR(100) | | 발송자명 |
| created_at | TIMESTAMP | DEFAULT NOW() | 발송일시 |

```sql
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notices_company ON notices(company_id);
CREATE INDEX idx_notices_created ON notices(created_at DESC);
```

---

### notice_recipients (공지 수신자)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | ID |
| notice_id | UUID | FK → notices | 공지 ID |
| employee_id | UUID | FK → employees | 수신 직원 ID |
| read_at | TIMESTAMP | | 읽은 시간 |

```sql
CREATE TABLE notice_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  read_at TIMESTAMP,
  UNIQUE(notice_id, employee_id)
);

CREATE INDEX idx_notice_recipients_employee ON notice_recipients(employee_id);
```

---

### schedules (근무일정)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 일정 ID |
| company_id | UUID | FK → companies | 기업 ID |
| date | DATE | NOT NULL | 날짜 |
| content | TEXT | NOT NULL | 작업 내용 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

```sql
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, date)
);

CREATE INDEX idx_schedules_company_date ON schedules(company_id, date);
```

---

### inquiries (기업 문의)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 문의 ID |
| company_name | VARCHAR(255) | NOT NULL | 기업명 |
| representative_name | VARCHAR(100) | NOT NULL | 대표자명 |
| phone | VARCHAR(20) | NOT NULL | 연락처 |
| email | VARCHAR(255) | | 이메일 |
| content | TEXT | NOT NULL | 문의 내용 |
| status | VARCHAR(20) | DEFAULT 'pending' | 상태 |
| created_at | TIMESTAMP | DEFAULT NOW() | 접수일 |
| completed_at | TIMESTAMP | | 처리 완료일 |

**status 값**: `pending` (대기), `completed` (완료)

```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  representative_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);
```

---

### notifications (알림)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 알림 ID |
| type | VARCHAR(50) | NOT NULL | 알림 유형 |
| title | VARCHAR(255) | NOT NULL | 알림 제목 |
| message | TEXT | | 알림 내용 |
| related_id | UUID | | 관련 엔티티 ID (employee_id, company_id 등) |
| is_read | BOOLEAN | DEFAULT FALSE | 읽음 여부 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

**type 값**: `absence` (결근), `contract_expiry` (계약 만료 임박), `long_absence` (장기 결근)

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

---

### templates (문서 템플릿)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 템플릿 ID |
| name | VARCHAR(255) | NOT NULL | 템플릿명 |
| description | TEXT | | 설명 |
| file_path | TEXT | NOT NULL | 파일 경로 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### audit_logs (감사 로그)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 로그 ID |
| user_id | UUID | | 사용자 ID |
| user_type | VARCHAR(20) | NOT NULL | 사용자 유형 (admin/company/employee) |
| action | VARCHAR(50) | NOT NULL | 액션 유형 |
| target_type | VARCHAR(50) | | 대상 엔티티 종류 |
| target_id | UUID | | 대상 엔티티 ID |
| details | JSONB | | 상세 정보 |
| ip_address | VARCHAR(45) | | IP 주소 |
| user_agent | TEXT | | User Agent |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

**action 값**: `login`, `logout`, `create`, `update`, `delete`

**user_type 값**: `admin`, `company`, `employee`

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_type VARCHAR(20) NOT NULL,
  action VARCHAR(50) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

---

### employee_monthly_stats (직원 월간 통계)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 통계 ID |
| employee_id | UUID | FK → employees | 직원 ID |
| year | INTEGER | NOT NULL | 연도 |
| month | INTEGER | NOT NULL | 월 (1-12) |
| work_days | INTEGER | DEFAULT 0 | 출근일수 |
| total_work_hours | DECIMAL(5,1) | DEFAULT 0 | 총 근무시간 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

**참고**: 관리자가 월간 통계를 인라인 수정할 때 사용. 수정하지 않은 경우 attendances 테이블에서 실시간 계산.

```sql
CREATE TABLE employee_monthly_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  work_days INTEGER NOT NULL DEFAULT 0,
  total_work_hours DECIMAL(5,1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(employee_id, year, month)
);

CREATE INDEX idx_employee_monthly_stats_employee ON employee_monthly_stats(employee_id);
CREATE INDEX idx_employee_monthly_stats_period ON employee_monthly_stats(year, month);
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
