# 두르비터 개발 로드맵

## 현재 상태 요약

| 항목 | 상태 | 비고 |
|------|------|------|
| 문서 설계 | ✅ 완료 | 14개 테이블, 50+ API 엔드포인트 |
| 프론트 구조설계 | ✅ 완료 | 23개 페이지, 10개 공용 컴포넌트 |
| UI 구현 | ✅ 완료 | 70-75% 완성 (더미 데이터 기반) |
| DB 테이블 | ❌ 미진행 | Supabase 사용 예정 |
| 서버 설계/구현 | ❌ 미진행 | NestJS 사용 예정 |
| 프론트-백엔드 연동 | ❌ 미진행 | API 클라이언트 필요 |

---

## Phase 1: DB 테이블 생성 (Supabase)

### 목표
설계 문서(`docs/design/database-schema.md`) 기반으로 Supabase에 테이블 생성

### 작업 내용

#### 1-1. Supabase 프로젝트 확인
- [ ] 프로젝트 URL, API 키 확인
- [ ] 환경변수 파일 설정 (`.env.local`)

#### 1-2. 테이블 생성 (순서 중요 - 외래키 의존성)

**1단계: 독립 테이블**
```sql
-- 1. admins (관리자)
-- 2. inquiries (기업 문의)
-- 3. templates (문서 템플릿)
```

**2단계: companies 관련**
```sql
-- 4. companies (기업)
-- 5. company_files (기업 첨부파일) - FK: companies
```

**3단계: employees 관련**
```sql
-- 6. employees (직원) - FK: companies
-- 7. employee_files (직원 첨부파일) - FK: employees
```

**4단계: 기능 테이블**
```sql
-- 8. attendances (출퇴근) - FK: employees
-- 9. schedules (근무일정) - FK: companies
-- 10. notices (공지사항) - FK: companies
-- 11. notice_recipients (공지 수신자) - FK: notices, employees
-- 12. employee_monthly_stats (월간 통계) - FK: employees
```

**5단계: 로그 테이블**
```sql
-- 13. audit_logs (감사 로그)
```

#### 1-3. 인덱스 생성
- database-schema.md에 명시된 인덱스들 생성

#### 1-4. 초기 데이터
- [ ] 관리자 계정 1개 생성 (비밀번호 bcrypt 해시)
- [ ] 테스트용 기업 1개 생성
- [ ] 테스트용 직원 2-3명 생성

### 참고 파일
- `docs/design/database-schema.md` - 전체 SQL 스크립트 포함

---

## Phase 2: 서버 프로젝트 설정 (NestJS)

### 목표
`../durubitteo_server/` 에 NestJS 프로젝트 생성 및 구조 설계

### 작업 내용

#### 2-1. 프로젝트 초기화
```bash
cd ../durubitteo_server
nest new . --package-manager npm
```

#### 2-2. 필수 패키지 설치
```bash
# Prisma ORM
npm install prisma @prisma/client
npx prisma init

# 인증
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt

# 유효성 검사
npm install class-validator class-transformer

# Swagger
npm install @nestjs/swagger swagger-ui-express

# 기타
npm install @nestjs/config
```

#### 2-3. 모듈 구조
```
src/
├── app.module.ts
├── main.ts
│
├── auth/                 # 인증 모듈
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── dto/
│       └── login.dto.ts
│
├── companies/            # 기업 모듈
│   ├── companies.module.ts
│   ├── companies.controller.ts
│   ├── companies.service.ts
│   └── dto/
│
├── employees/            # 직원 모듈
│   ├── employees.module.ts
│   ├── employees.controller.ts
│   ├── employees.service.ts
│   └── dto/
│
├── attendance/           # 출퇴근 모듈
│   ├── attendance.module.ts
│   ├── attendance.controller.ts
│   ├── attendance.service.ts
│   └── dto/
│
├── schedules/            # 근무일정 모듈
├── notices/              # 공지사항 모듈
├── inquiries/            # 기업문의 모듈
├── admin/                # 관리자 전용 모듈
├── files/                # 파일 업로드 모듈
├── audit/                # 감사 로그 모듈
│
├── common/               # 공용
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── transform.interceptor.ts
│   └── pipes/
│       └── validation.pipe.ts
│
└── prisma/               # Prisma 서비스
    ├── prisma.module.ts
    └── prisma.service.ts
```

#### 2-4. Prisma 스키마 작성
- `prisma/schema.prisma` 파일 작성
- database-schema.md 기반으로 모델 정의

#### 2-5. 환경변수 설정
```env
# .env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"
SSN_ENCRYPTION_KEY="your-aes-key"
```

#### 2-6. 공용 설정
- CORS 설정
- Global Validation Pipe
- Swagger 문서화
- 응답 포맷 통일 (interceptor)

### 참고 파일
- `docs/design/api-design.md` - API 명세
- `docs/design/architecture.md` - 시스템 구조

---

## Phase 3: 핵심 API 구현

### 목표
우선순위 높은 API 엔드포인트부터 구현

### 구현 순서

#### 3-1. 인증 모듈 (최우선)
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/auth/login` | POST | 로그인 (type: employee/company/admin) |
| `/auth/refresh` | POST | 토큰 갱신 |
| `/auth/logout` | POST | 로그아웃 |
| `/auth/me` | GET | 현재 사용자 정보 |

**로그인 로직**:
- employee/company: 고유번호만으로 인증
- admin: 이메일 + 비밀번호 (bcrypt 검증)

#### 3-2. 기업 API
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/companies` | GET | 기업 목록 |
| `/companies` | POST | 기업 등록 |
| `/companies/:id` | GET | 기업 상세 |
| `/companies/:id` | PUT | 기업 수정 |
| `/companies/:id` | DELETE | 기업 삭제 (비활성화) |
| `/companies/:id/files` | POST | 파일 업로드 |
| `/companies/:id/files` | GET | 파일 목록 |

#### 3-3. 직원 API
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/employees` | GET | 직원 목록 |
| `/employees` | POST | 직원 등록 |
| `/employees/:id` | GET | 직원 상세 |
| `/employees/:id` | PUT | 직원 수정 |
| `/employees/:id` | DELETE | 직원 삭제 (비활성화) |

#### 3-4. 출퇴근 API
| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/attendances/clock-in` | POST | 출근 기록 |
| `/attendances/clock-out` | POST | 퇴근 기록 |
| `/attendances` | GET | 출퇴근 조회 |
| `/attendances/today` | GET | 오늘 현황 |
| `/attendances/:id` | PUT | 출퇴근 수정 |

#### 3-5. 부가 기능 (후순위)
- 공지사항 API (5개)
- 근무일정 API (5개)
- 문의 API (4개)
- 관리자 통계 API (10개)
- 템플릿 API (2개)

### 참고 파일
- `docs/design/api-design.md` - 상세 요청/응답 스펙

---

## Phase 4: 프론트엔드 API 연동

### 목표
더미 데이터를 실제 API 호출로 교체

### 작업 내용

#### 4-1. API 클라이언트 설정
```
lib/
├── api/
│   ├── client.ts         # axios 인스턴스, 인터셉터
│   ├── auth.ts           # 인증 API 함수
│   ├── companies.ts      # 기업 API 함수
│   ├── employees.ts      # 직원 API 함수
│   ├── attendance.ts     # 출퇴근 API 함수
│   ├── schedules.ts      # 근무일정 API 함수
│   ├── notices.ts        # 공지사항 API 함수
│   └── admin.ts          # 관리자 API 함수
```

**client.ts 구현 사항**:
- baseURL 설정
- 요청 인터셉터: Authorization 헤더 추가
- 응답 인터셉터: 401 에러 시 토큰 갱신

#### 4-2. 서버 상태 관리 (TanStack Query)
```bash
npm install @tanstack/react-query
```

```
hooks/
└── queries/
    ├── useAuth.ts
    ├── useCompanies.ts
    ├── useEmployees.ts
    ├── useAttendance.ts
    └── ...
```

#### 4-3. 인증 연동
- [ ] 로그인 페이지 API 연결 (`app/login/*/page.tsx`)
- [ ] 토큰 저장 (HttpOnly Cookie 또는 메모리)
- [ ] 인증 상태 관리 (Context 또는 Zustand)
- [ ] 보호 라우트 미들웨어 (`middleware.ts`)

#### 4-4. 페이지별 API 연동

**직원 영역** (`app/employee/`):
- [ ] 대시보드: 공지사항 조회, 업무 기록 조회
- [ ] 출근: clock-in API 연결
- [ ] 퇴근: clock-out API 연결 (사진 업로드 포함)

**기업 영역** (`app/company/`):
- [ ] 대시보드: 통계 API, 출퇴근 현황 API
- [ ] 근로자 관리: CRUD API 연결
- [ ] 근무일정: 일정 CRUD API
- [ ] 공지사항: 공지 발송/조회 API

**관리자 영역** (`app/admin/`):
- [ ] 대시보드: 전체 통계, 알림 API
- [ ] 회원사 관리: 기업 CRUD API
- [ ] 근로자 관리: 전체 직원 조회 API
- [ ] 근무 통계: 월간 통계 API
- [ ] 알림센터: 결근 알림, 문의 알림 API

#### 4-5. 에러/로딩 처리
- [ ] 로딩 스켈레톤 컴포넌트 추가
- [ ] 에러 바운더리 구현
- [ ] 토스트 알림 (성공/실패)
- [ ] 폼 유효성 검사 (react-hook-form)

### 참고 파일
- `types/` - API 타입 정의 (대부분 완성됨)
- `docs/design/api-design.md` - 요청/응답 스펙

---

## 권장 진행 순서

```
Week 1-2: Phase 1 (DB)
├── Supabase 테이블 생성
├── 인덱스 및 제약조건
└── 초기 데이터 입력

Week 3-4: Phase 2 (서버 설정)
├── NestJS 프로젝트 초기화
├── Prisma 연결
└── 공용 설정 (CORS, Swagger 등)

Week 5-6: Phase 3-1 (인증)
├── 인증 모듈 구현
├── JWT 발급/검증
└── 가드 및 데코레이터

Week 7: Phase 4-1,2 (프론트 인증)
├── API 클라이언트 설정
├── 로그인 연동
└── End-to-End 테스트

Week 8-10: Phase 3-2,3 + 4-3
├── CRUD API 구현
├── 출퇴근 API 구현
└── 프론트 페이지 연동

Week 11-12: Phase 3-4 + 4-4,5
├── 부가 기능 API
├── 에러 처리
└── 최종 테스트
```

---

## 검증 체크리스트

### Phase 1 완료 시
- [ ] Supabase 대시보드에서 14개 테이블 확인
- [ ] 테이블 간 외래키 관계 확인
- [ ] 테스트 데이터 입력 및 조회

### Phase 2 완료 시
- [ ] `npm run start:dev` 서버 실행 확인
- [ ] Swagger UI 접속 확인 (`http://localhost:4000/api`)
- [ ] Prisma로 DB 연결 확인

### Phase 3 완료 시
- [ ] Swagger 또는 Postman으로 API 테스트
- [ ] 로그인 → 토큰 발급 → 인증 필요 API 호출 성공

### Phase 4 완료 시
- [ ] 로그인 후 대시보드 데이터 로드 확인
- [ ] 출퇴근 기록 생성/조회 확인
- [ ] CRUD 작업 정상 동작 확인

---

## 관련 문서

- [요구사항](design/requirements.md)
- [DB 스키마](design/database-schema.md)
- [API 설계](design/api-design.md)
- [아키텍처](design/architecture.md)
- [기술 스택](reference/tech-stack.md)
