# 시스템 아키텍처

## 1. 전체 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                         클라이언트                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   직원 웹    │  │   기업 웹    │  │  관리자 웹   │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Vercel (Frontend)                            │
│                      Next.js 16 + React 19                       │
│                      (Server Components)                         │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Railway (Backend)                            │
│                      NestJS + Prisma                             │
│                      (REST API + JWT)                            │
└─────────────────────────────┬───────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
┌──────────────────────┐              ┌──────────────────────┐
│  Supabase PostgreSQL │              │   Supabase Storage   │
│     (메인 DB)         │              │   (파일 저장소)        │
└──────────────────────┘              └──────────────────────┘
```

---

## 2. 멀티테넌트 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                    이루빛터 플랫폼                                 │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                    관리자 (단일)                           │  │
│   │               - 플랫폼 전체 관리                            │  │
│   │               - 기업 계정 생성/관리                          │  │
│   └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│              ┌───────────────┼───────────────┐                  │
│              ▼               ▼               ▼                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │    기업 A    │  │    기업 B    │  │    기업 C    │         │
│   ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│   │  직원 1      │  │  직원 4      │  │  직원 6      │         │
│   │  직원 2      │  │  직원 5      │  │  직원 7      │         │
│   │  직원 3      │  │              │  │  직원 8      │         │
│   └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 데이터 격리
- 모든 테이블에 `company_id` 외래키 적용
- Row Level Security (RLS)로 기업별 데이터 격리
- 직원은 자신의 데이터만, 기업은 소속 직원 데이터만 접근

---

## 3. 인증 흐름

### 직원/기업 인증 (고유번호)

```
사용자                  Frontend              Backend              DB
 │                         │                    │                  │
 │  1. 고유번호 입력         │                    │                  │
 │─────────────────────────>│                    │                  │
 │                         │  2. POST /auth/login                  │
 │                         │     (type: employee | company)        │
 │                         │───────────────────>│                  │
 │                         │                    │  3. 고유번호 조회  │
 │                         │                    │─────────────────>│
 │                         │                    │<─────────────────│
 │                         │                    │  4. JWT 생성      │
 │                         │<───────────────────│                  │
 │  5. JWT 저장 (쿠키)       │                    │                  │
 │<─────────────────────────│                    │                  │
```

### 관리자 인증 (이메일 + 비밀번호)

```
관리자                  Frontend              Backend              DB
 │                         │                    │                  │
 │  1. 이메일/비밀번호 입력   │                    │                  │
 │─────────────────────────>│                    │                  │
 │                         │  2. POST /auth/login (type: admin)    │
 │                         │───────────────────>│                  │
 │                         │                    │  3. 관리자 조회    │
 │                         │                    │─────────────────>│
 │                         │                    │<─────────────────│
 │                         │                    │  4. 비밀번호 검증  │
 │                         │                    │  5. JWT 생성      │
 │                         │<───────────────────│                  │
 │  6. JWT 저장 (쿠키)       │                    │                  │
 │<─────────────────────────│                    │                  │
```

---

## 4. 출퇴근 처리 흐름

```
직원                    Frontend              Backend              DB
 │                         │                    │                  │
 │  1. 출근 버튼 클릭        │                    │                  │
 │─────────────────────────>│                    │                  │
 │                         │  2. POST /attendances/clock-in        │
 │                         │     (JWT 포함)       │                  │
 │                         │───────────────────>│                  │
 │                         │                    │  3. 중복 체크      │
 │                         │                    │─────────────────>│
 │                         │                    │<─────────────────│
 │                         │                    │  4. 출근 기록 생성 │
 │                         │                    │─────────────────>│
 │                         │                    │<─────────────────│
 │                         │<───────────────────│                  │
 │  5. 출근 완료 UI 표시     │                    │                  │
 │<─────────────────────────│                    │                  │
```

---

## 5. 결근 판단 배치 처리

```
┌─────────────────────────────────────────────────────────────────┐
│                     매 10분 크론잡 (결근 자동 처리)                 │
│                                                                  │
│   1. 오늘 요일 확인 (KST, 월=1 ~ 일=7)                           │
│   2. 해당 요일이 출근일로 등록된 활성 직원 조회                      │
│   3. 출근시간 + 30분 경과 여부 확인                                │
│   4. 미출근 직원에게 absent 레코드 upsert                         │
│   5. 이미 출근한 직원은 스킵 (upsert update: {})                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 출근일 설정
- 기업이 직원 등록 시 출근 요일 지정 (예: [1,2,3,4,5] = 월~금)
- 직원별로 다른 출근일 설정 가능
- 등록된 출근일에만 결근 판단 적용

---

## 6. 프론트엔드 구조

```
app/
├── layout.tsx                   # 루트 레이아웃
├── page.tsx                     # / (랜딩 페이지)
├── _components/                 # 루트 레벨 공용 컴포넌트
│
├── login/                       # 로그인 페이지
│   ├── employee/page.tsx        # 직원 로그인 (고유번호)
│   ├── company/page.tsx         # 기업 로그인 (고유번호)
│   └── admin/page.tsx           # 관리자 로그인 (이메일+비밀번호)
│
├── inquiry/page.tsx             # 신규 기업 문의 (CompanyInquiry.jsx)
├── playground/page.tsx          # UI 컴포넌트 테스트 페이지
│
├── employee/                    # 직원 전용 - 출퇴근 앱 (AttendanceApp.jsx)
│   ├── layout.tsx               # 직원 레이아웃
│   ├── _components/             # 직원 전용 컴포넌트
│   ├── page.tsx                 # 메인 화면 (출근/퇴근 선택)
│   ├── checkin/page.tsx         # 출근 처리
│   └── checkout/page.tsx        # 퇴근 처리
│
├── company/                     # 기업 전용 (CompanyDashboard.jsx)
│   ├── layout.tsx               # 기업 레이아웃
│   ├── _components/             # 기업 전용 컴포넌트
│   ├── dashboard/page.tsx       # 대시보드 (통계, 출퇴근 현황)
│   ├── employees/               # 직원 관리
│   │   ├── page.tsx             # 직원 목록
│   │   ├── _hooks/              # 직원 관련 훅
│   │   └── [id]/page.tsx        # 직원 상세 (EmployeeDetail.jsx)
│   ├── schedule/page.tsx        # 근무 일정 관리 (캘린더)
│   └── notices/page.tsx         # 공지사항
│
└── admin/                       # 관리자 전용 (AdminDashboard.jsx)
    ├── layout.tsx               # 관리자 레이아웃
    ├── _components/             # 관리자 전용 컴포넌트
    ├── dashboard/page.tsx       # 대시보드 (통계)
    ├── companies/               # 회사 관리
    │   ├── page.tsx             # 회사 목록
    │   └── [id]/page.tsx        # 회사 상세 (CompanyDetail.jsx)
    ├── employees/               # 직원 통계
    │   ├── page.tsx             # 직원 목록/통계
    │   └── [id]/page.tsx        # 직원 상세 (AdminWorkerDetail.jsx)
    ├── workstats/page.tsx       # 근무 통계
    ├── notifications/page.tsx   # 알림센터 (결근 알림 + 문의 관리)
    └── reports/                 # 리포트 (파일 저장소)
        ├── page.tsx
        ├── _hooks/              # useAdminFiles
        └── _components/         # FileSection, FileListItem, FileUploadModal
```

### 디자인 파일 매핑

| Next.js 라우트 | 디자인 파일 | 비고 |
|---------------|------------|------|
| `/` (page.tsx) | LandingPage.jsx | 랜딩 페이지 |
| `/inquiry` | CompanyInquiry.jsx | 기업 문의 폼 |
| `/employee/*` | AttendanceApp.jsx | 단계별 출퇴근 플로우 |
| `/company/dashboard` | CompanyDashboard.jsx | 탭: 대시보드 |
| `/company/employees` | CompanyDashboard.jsx | 탭: 직원 관리 |
| `/company/employees/[id]` | EmployeeDetail.jsx | 직원 상세 |
| `/company/schedule` | CompanyDashboard.jsx | 탭: attendance (근무 일정) |
| `/company/notices` | CompanyDashboard.jsx | 탭: 공지사항 |
| `/admin/dashboard` | AdminDashboard.jsx | 탭: 대시보드 |
| `/admin/companies` | AdminDashboard.jsx | 탭: 회사 관리 |
| `/admin/companies/[id]` | CompanyDetail.jsx | 회사 상세 |
| `/admin/employees` | AdminDashboard.jsx | 탭: workers (직원 통계) |
| `/admin/employees/[id]` | AdminWorkerDetail.jsx | 직원 상세 |
| `/admin/workstats` | AdminDashboard.jsx | 탭: 근무 통계 |
| `/admin/notifications` | AdminDashboard.jsx | 탭: 알림센터 |
| `/admin/reports` | AdminDashboard.jsx | 탭: 리포트 |
| `/admin/settings` | AdminDashboard.jsx (확장) | 관리자 계정 설정 (비밀번호 변경) |

---

## 7. 백엔드 모듈 구조

```
src/
├── auth/                        # 인증 모듈
│   ├── strategies/             # JWT 전략
│   ├── guards/                 # 인증 가드 (JWT, Roles)
│   └── decorators/             # 커스텀 데코레이터 (CurrentUser, Roles, Public)
│
├── employees/                   # 직원 모듈
├── employee-files/              # 직원 문서 모듈
│
├── companies/                   # 기업 모듈
├── company-files/               # 기업 문서 모듈
│
├── attendance/                  # 출퇴근 모듈 (크론잡 포함)
├── schedules/                   # 근무일정 모듈
├── notices/                     # 공지사항 모듈
├── inquiries/                   # 기업 문의 모듈
│
├── admin/                       # 관리자 전용 모듈 (통계, 알림)
├── admin-files/                 # 관리자 파일 모듈 (문서 템플릿/리포트)
│
├── files/                       # 파일 스토리지 (Global)
│   └── storage/                # Supabase Storage 서비스
│
├── common/                      # 공통 모듈
│   ├── filters/                # Global Exception Filter
│   ├── interceptors/           # Response Interceptor
│   └── utils/                  # KST 시간대 유틸리티
│
└── prisma/                      # Prisma 설정
```

---

## 8. 보안 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                        보안 레이어                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    HTTPS (전송 암호화)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              보안 헤더 (next.config.ts)                    │  │
│  │         CSP, HSTS, X-Frame-Options 등                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              JWT 인증 (Access + Refresh)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              RBAC (역할 기반 접근 제어)                     │  │
│  │         관리자 > 기업 > 직원                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              RLS (Row Level Security)                     │  │
│  │         기업별 데이터 격리                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              암호화 (SHA-256, bcrypt)                     │  │
│  │         주민등록번호(SHA-256 해시), 관리자 비밀번호          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 보안 헤더 (`next.config.ts`)

| 헤더 | 값 | 목적 |
|------|-----|------|
| `X-Frame-Options` | `DENY` | 클릭재킹 방지 |
| `X-Content-Type-Options` | `nosniff` | MIME 스니핑 방지 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer 정보 제한 |
| `Permissions-Policy` | `camera=(self), microphone=(), geolocation=(self)` | 브라우저 기능 제한 |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | HTTPS 강제 |
| `Content-Security-Policy` | `connect-src 'self' https:` 등 | 리소스 로딩 제한 |

> **참고**: 개발 환경에서는 CSP `connect-src`에 `http://localhost:*`가 추가되어 로컬 API 서버 직접 호출을 허용합니다.

### API 프록시 (`next.config.ts`)

프로덕션에서 프론트엔드 → 백엔드 API 호출은 Next.js rewrites를 통해 프록시됩니다:

```
프론트엔드 → /api/proxy/:path* → 백엔드 API 서버
```

- **프로덕션**: `apiClient`의 baseURL이 `/api/proxy`로 설정 → same-origin 요청 (CSP `'self'` 충족)
- **개발**: baseURL이 `http://localhost:4000/v1`로 설정 → CSP에서 `http://localhost:*` 허용

---

## 9. 배포 환경

### Development
- Frontend: `localhost:3000`
- Backend: `localhost:4000`
- Database: Supabase 개발 프로젝트

### Staging (선택)
- Frontend: `staging.durubitteo.com`
- Backend: `api-staging.durubitteo.com`
- Database: Supabase Staging Branch

### Production
- Frontend: `durubitteo.com` (Vercel)
- Backend: `api.durubitteo.com` (Railway)
- Database: Supabase Production
