# 이루빛터 프로젝트 문서

## 프로젝트 개요

**이루빛터**는 기업 출퇴근 관리 웹 플랫폼입니다.

### 플랫폼 구조
- **멀티테넌트 구조**: 플랫폼 → 기업 → 직원
- **3단계 사용자**:
  - 이루빛터 관리자 (단일 계정) - 플랫폼 전체 관리
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
├── getting-started.md                 # 개발 환경 셋업 가이드
│
├── design/                            # 설계 문서
│   ├── requirements.md                # 요구사항
│   ├── architecture.md                # 시스템 아키텍처
│   │
│   ├── auth/                          # 인증 시스템
│   │   ├── README.md                  # 인증 개요
│   │   └── frontend.md                # 프론트엔드 구현
│   │
│   ├── tanstack-query.md              # TanStack Query 가이드
│   │
│   └── features/                      # 기능 명세
│       ├── admin-dashboard.md         # 관리자 대시보드
│       ├── company-dashboard.md       # 기업 대시보드
│       ├── employee-app.md            # 직원 앱
│       └── attendance-status.md       # 출퇴근 Status 체계
│
└── review/                            # 리뷰 문서
    ├── attendance-system-review.md    # 출퇴근 시스템 리뷰
    └── tanstack-query-review.md       # TanStack Query 사용 현황 리뷰
```

---

## 문서 목록


### 가이드

| 문서 | 설명 |
|------|------|
| [개발 환경 셋업](getting-started.md) | 사전 요구사항, 환경변수, 서버/프론트 설정, 실행 방법 |
| [개발 환경 셋업](getting-started.md#6-검색엔진-제출-url-프로덕션) | 운영 도메인 sitemap/rss/robots 제출 URL |

### 설계 문서 (design/)

| 문서 | 설명 |
|------|------|
| [요구사항](design/requirements.md) | 기능 요구사항, 사용자 흐름 |
| [아키텍처](design/architecture.md) | 시스템 구조, 모듈 구조 |

#### 인증 시스템 (design/auth/)

| 문서 | 설명 |
|------|------|
| [인증 개요](design/auth/README.md) | 인증 방식, 토큰 정책, Cookie 설정 |
| [프론트엔드 구현](design/auth/frontend.md) | Next.js 클라이언트 인증 구현 |

#### 기능 명세 (design/features/)

| 문서 | 설명 |
|------|------|
| [관리자 대시보드](design/features/admin-dashboard.md) | 플랫폼 관리자 대시보드 기능 명세 |
| [기업 대시보드](design/features/company-dashboard.md) | 기업 관리자 대시보드 기능 명세 |
| [직원 앱](design/features/employee-app.md) | 직원 출퇴근 앱 기능 명세 |
| [출퇴근 Status 체계](design/features/attendance-status.md) | 출퇴근 상태 DB 저장 방식, 크론잡, UI 표시 |

#### 기술 가이드

| 문서 | 설명 |
|------|------|
| [TanStack Query](design/tanstack-query.md) | 캐시 정책, Query Key 규칙, 마이그레이션 가이드 |

#### 리뷰 (review/)

| 문서 | 설명 |
|------|------|
| [출퇴근 시스템 리뷰](review/attendance-system-review.md) | 출퇴근 시스템 전반 리뷰 |
| [TanStack Query 리뷰](review/tanstack-query-review.md) | TanStack Query 사용 현황 및 개선점 리뷰 |

---

## 관련 저장소

이루빛터 프로젝트는 여러 저장소로 구성됩니다:

| 저장소 | 설명 | 기술 스택 |
|--------|------|----------|
| `durubitteo_web` | 프론트엔드 (현재) | Next.js, React, TypeScript |
| `durubitteo_design` | 디자인 목업 (참조용) | Vite, Tailwind CSS |
| `durubitteo_server` | 백엔드 API | NestJS |

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
- [x] 백엔드 API 연동
  - [x] 근로자 관리 (목록 조회, 상세, 수정)
  - [x] 출퇴근 기록 조회/수정
  - [x] 대시보드 통계
  - [x] 근무일정 관리
  - [x] 공지사항 발송
  - [x] 근무시간 수정 + 휴가 처리
  - [x] 근로자 주소 입력/표시
  - [x] 회원사 CRUD + 파일 관리
  - [x] 기업 문의 조회/처리
  - [x] 결근/비고 알림
  - [x] 월간 근무 통계 (조회/재계산/수정)
- [x] 리포트 탭 (파일 저장소: 문서 템플릿 + 통계 리포트)

### 안정화 단계
- [x] 프로덕션 안정성 개선 (파일 다운로드, 인증, 데이터 갱신)
- [x] 보안 헤더 적용 (CSP, HSTS, X-Frame-Options 등)
- [x] 에러 바운더리, 타임아웃 설정
- [x] ESLint 경고/오류 전체 수정

### 배포 단계
- [ ] Supabase 프로덕션 설정
- [ ] Vercel 배포
- [ ] Railway 백엔드 배포
- [ ] 도메인 연결
