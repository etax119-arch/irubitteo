# 두르비터 프로젝트 문서

## 프로젝트 개요

**두르비터**는 기업 출퇴근 관리 웹 플랫폼입니다.

### 플랫폼 구조
- **멀티테넌트 구조**: 플랫폼 → 기업 → 직원
- **3단계 사용자**:
  - 두르비터 관리자 (단일 계정) - 플랫폼 전체 관리
  - 기업 - 소속 직원 관리
  - 직원 - 출퇴근 및 업무 관리

### 핵심 기능
- 직원 출퇴근 기록 및 관리
- 업무 내용 등록 및 조회
- 일일/주간/월간 보고서 생성
- 기업별 직원 관리
- 결근 자동 판단

---

## 문서 구조

```
docs/
├── README.md                          # 전체 문서 인덱스 (현재 파일)
├── development-roadmap.md             # 개발 로드맵 (단계별 계획)
│
├── design/                            # 설계 문서
│   ├── requirements.md                # 요구사항
│   ├── database-schema.md             # DB 스키마
│   ├── architecture.md                # 시스템 아키텍처
│   │
│   ├── auth/                          # 인증 시스템
│   │   ├── README.md                  # 인증 개요
│   │   ├── frontend.md                # 프론트엔드 구현
│   │   └── backend.md                 # 백엔드 구현
│   │
│   ├── api/                           # API 설계
│   │   ├── README.md                  # 공통 규칙
│   │   ├── auth.md                    # 인증 API
│   │   ├── companies.md               # 기업 API
│   │   ├── employees.md               # 직원 API
│   │   ├── attendance.md              # 출퇴근 API
│   │   ├── admin.md                   # 관리자 API
│   │   └── misc.md                    # 공지/일정/문의/템플릿
│   │
│   └── features/                      # 기능 명세
│       ├── admin-dashboard.md         # 관리자 대시보드
│       ├── company-dashboard.md       # 기업 대시보드
│       └── employee-app.md            # 직원 앱
│
└── reference/                         # 참조 문서
    ├── tech-stack.md                  # 기술 스택
    └── platform-accounts.md           # 플랫폼 계정
```

---

## 문서 목록


### 설계 문서 (design/)

| 문서 | 설명 |
|------|------|
| [요구사항](design/requirements.md) | 기능 요구사항, 사용자 흐름 |
| [DB 스키마](design/database-schema.md) | 테이블 구조, 관계, 암호화 정책 |
| [아키텍처](design/architecture.md) | 시스템 구조, 모듈 구조 |

#### 인증 시스템 (design/auth/)

| 문서 | 설명 |
|------|------|
| [인증 개요](design/auth/README.md) | 인증 방식, 토큰 정책, Cookie 설정 |
| [프론트엔드 구현](design/auth/frontend.md) | Next.js 클라이언트 인증 구현 |
| [백엔드 구현](design/auth/backend.md) | NestJS 서버 인증 구현 |

#### API 설계 (design/api/)

| 문서 | 설명 |
|------|------|
| [API 공통](design/api/README.md) | 공통 규칙, 응답 형식, 에러 코드 |
| [인증 API](design/api/auth.md) | 로그인, 로그아웃, 토큰 갱신 |
| [기업 API](design/api/companies.md) | 기업 CRUD, 첨부파일 |
| [직원 API](design/api/employees.md) | 직원 CRUD, 첨부파일 |
| [출퇴근 API](design/api/attendance.md) | 출퇴근 기록, 조회, 수정 |
| [관리자 API](design/api/admin.md) | 플랫폼 통계, 감사 로그 |
| [기타 API](design/api/misc.md) | 공지사항, 근무일정, 문의, 템플릿 |

#### 기능 명세 (design/features/)

| 문서 | 설명 |
|------|------|
| [관리자 대시보드](design/features/admin-dashboard.md) | 플랫폼 관리자 대시보드 기능 명세 |
| [기업 대시보드](design/features/company-dashboard.md) | 기업 관리자 대시보드 기능 명세 |
| [직원 앱](design/features/employee-app.md) | 직원 출퇴근 앱 기능 명세 |

### 참조 문서 (reference/)

| 문서 | 설명 |
|------|------|
| [기술 스택](reference/tech-stack.md) | 기술 선정, 비용, 인프라 계획 |
| [계정 체크리스트](reference/platform-accounts.md) | 필요 플랫폼 계정 목록 |

---

## 관련 저장소

두르비터 프로젝트는 여러 저장소로 구성됩니다:

| 저장소 | 설명 | 기술 스택 |
|--------|------|----------|
| `durubitteo_web` | 프론트엔드 (현재) | Next.js, React, TypeScript |
| `durubitteo_design` | 디자인 목업 (참조용) | Vite, Tailwind CSS |
| `durubitteo_server` | 백엔드 API (예정) | NestJS |

### 프로젝트 관계

```
durubitteo_design (디자인)
       ↓ 참조
durubitteo_web (프론트엔드) ←→ durubitteo_server (백엔드)
                                      ↓
                                  Supabase (DB)
```

- **durubitteo_design**: UI/UX 디자인 구현의 참조 소스. JSX 컴포넌트로 각 화면의 레이아웃과 스타일 정의
- **durubitteo_web**: 실제 프론트엔드 구현. 디자인 프로젝트를 참고하여 Next.js로 개발
- **durubitteo_server**: API 서버. 프론트엔드와 REST API로 통신

---

## 진행 상황

### 기획 단계
- [x] 요구사항 정리
- [x] 기술 스택 선정
- [x] DB 스키마 설계
- [x] API 설계
- [x] 아키텍처 설계

### 개발 단계
- [x] 프로젝트 초기 설정
- [x] 프론트엔드 인증 시스템 구현
- [x] 기업 대시보드 UI (라우트 기반 탭 구조)
- [x] 직원 대시보드 UI (출퇴근 앱)
- [x] 관리자 대시보드 UI (6개 탭 전체 구현)
- [ ] 백엔드 API 연동
- [ ] 보고서 기능

### 배포 단계
- [ ] Supabase 프로덕션 설정
- [ ] Vercel 배포
- [ ] Railway 백엔드 배포
- [ ] 도메인 연결
