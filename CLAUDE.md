# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Documentation

프로젝트 상세 문서는 `docs/` 폴더를 참조하세요:

### 설계 문서
- [프로젝트 개요](docs/README.md) - 전체 문서 인덱스
- [요구사항](docs/design/requirements.md) - 기능 요구사항, 사용자 흐름
- [아키텍처](docs/design/architecture.md) - 시스템 구조 및 흐름

### 인증 시스템
- [인증 개요](docs/design/auth/README.md) - 인증 방식, 토큰 정책
- [프론트엔드 구현](docs/design/auth/frontend.md) - Next.js 인증 구현

### 기능 명세
- [관리자 대시보드](docs/design/features/admin-dashboard.md) - 관리자 기능
- [기업 대시보드](docs/design/features/company-dashboard.md) - 기업 기능
- [직원 앱](docs/design/features/employee-app.md) - 출퇴근 앱

## Related Projects

이루빛터 프로젝트는 여러 저장소로 구성됩니다:

```
/Users/hyson/durubitteo/
├── durubitteo_web/        # 현재 프로젝트 (Next.js 프론트엔드)
├── durubitteo_design/     # 디자인 프로젝트 (Vite + Tailwind)
└── durubitteo_server/     # 서버 프로젝트 (NestJS)
```

### durubitteo_design (참조용)
- **용도**: HTML/JSX 디자인 목업 - 구현 시 참고
- **경로**: `../durubitteo_design/src/`
- **주요 파일**:
  - `AdminDashboard.jsx` - 관리자 대시보드
  - `AdminWorkerDetail.jsx` - 관리자 직원 상세
  - `AttendanceApp.jsx` - 출퇴근 앱
  - `CompanyDashboard.jsx` - 기업 대시보드
  - `CompanyDetail.jsx` - 기업 상세
  - `CompanyInquiry.jsx` - 기업 문의
  - `EmployeeDetail.jsx` - 직원 상세
  - `LandingPage.jsx` - 랜딩 페이지

### durubitteo_server
- **용도**: 백엔드 API 서버
- **경로**: `../durubitteo_server/`
- **기술 스택**: NestJS

## Build & Development Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm start        # Run production server
npm run lint     # ESLint check
```

## Docker 개발 환경

프론트 루트(`irubitteo`)의 `docker-compose.yml` 하나로 프론트엔드+서버를 함께 실행합니다.

```bash
docker compose up --build
```

코드 변경 자동 반영을 위해 bind mount + watch 모드(`next dev`, `nest start --watch`)를 사용합니다.

## Tech Stack

- **Next.js 16.1.6** with App Router (not Pages Router)
- **React 19.2.3** with Server Components by default
- **TypeScript 5** with strict mode
- **Tailwind CSS v3** with autoprefixer
- **ESLint v9** with flat config format

## Architecture

### App Router Structure
All pages and layouts live in `app/`. Server Components are the default - add `'use client'` directive only for components that need interactivity.

### Route-based Tab Navigation Pattern
탭 UI가 있는 대시보드는 URL 기반 라우팅을 사용합니다:
- `layout.tsx`: 공통 헤더 + Link 기반 탭 네비게이션
- `page.tsx`: 기본 탭으로 리다이렉트 (예: `/company` → `/company/dashboard`)
- 각 탭은 독립적인 `page.tsx`로 구현

```
/company/
├── layout.tsx      # 헤더 + 탭 (Link 컴포넌트)
├── page.tsx        # redirect('/company/dashboard')
├── dashboard/page.tsx
├── employees/
│   ├── page.tsx
│   └── [id]/page.tsx
├── schedule/page.tsx
└── notices/page.tsx

/admin/
├── layout.tsx      # 헤더 + 6개 탭 (Link 컴포넌트)
├── page.tsx        # redirect('/admin/dashboard')
├── _components/    # AdminStatCard, CompanyCard, WorkerTable 등
├── dashboard/page.tsx
├── companies/
│   ├── page.tsx
│   └── [id]/page.tsx
├── employees/
│   ├── page.tsx
│   └── [id]/page.tsx
├── workstats/page.tsx
├── notifications/page.tsx
├── reports/page.tsx
└── settings/page.tsx
```

장점: URL 북마크/공유 가능, 브라우저 히스토리 지원

### Path Alias
`@/*` maps to the project root (configured in tsconfig.json).

### Styling
- Tailwind utility classes in JSX
- CSS variables for theming in `app/globals.css`: `--background`, `--foreground`
- Dark mode via `prefers-color-scheme` media query and `dark:` Tailwind prefix
- Geist fonts configured as CSS variables: `--font-geist-sans`, `--font-geist-mono`

### Logo & Icon Files

#### 메타 아이콘 (Next.js App Router 자동 인식)
| 파일 | 용도 |
|------|------|
| `app/icon.png` | 파비콘 — 브라우저 탭, 검색 결과(네이버/구글) URL 왼쪽 아이콘 |
| `app/apple-icon.png` | iOS 홈 화면 추가 시 아이콘 |
| `app/opengraph-image.png` | OG 이미지 — 검색 결과 미리보기, 카카오톡/SNS 링크 공유 시 썸네일 |

#### 로고 이미지 (페이지 내 사용)
| 파일 | 배경 | 사용 위치 |
|------|------|----------|
| `public/images/landing_logo_tran_1.png` | 투명 (컬러) | 헤더, ServiceSection ABOUT, 로그인 페이지, inquiry 헤더 |
| `public/images/landing_logo_tran_2.png` | 투명 (밝은톤) | — |
| `public/images/landing_logo_tran_3.png` | 투명 (흰색) | Footer (어두운 배경) |

#### 로고 원본 (`public/images/logos/`)
AI 원본 파일 및 PNG 변환본 보관 (직접 사용하지 않음)

### Configuration Files
- `next.config.ts` - Next.js config (API 프록시 rewrites, 보안 헤더)
- `eslint.config.mjs` - ESLint v9 flat config extending next/core-web-vitals and next/typescript
- `postcss.config.mjs` - PostCSS config (Tailwind, autoprefixer)
- `tsconfig.json` - TypeScript with ES2017 target, strict mode, bundler module resolution

### Folder Structure Convention

```
durubitteo_web/
├── app/
│   ├── _components/          # 루트 레벨 공용 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HeroSlider.tsx
│   │   ├── ServiceSection.tsx
│   │   ├── TargetAudienceSection.tsx
│   │   ├── PartnersSection.tsx
│   │   └── CommuteSection.tsx
│   │
│   ├── login/                # 로그인 페이지들
│   │   ├── admin/page.tsx    # /login/admin
│   │   ├── company/page.tsx  # /login/company
│   │   └── employee/page.tsx # /login/employee
│   │
│   ├── inquiry/              # 기업 문의 페이지
│   │   └── page.tsx          # /inquiry
│   │
│   ├── playground/           # 개발용 테스트 페이지
│   │   └── page.tsx          # /playground
│   │
│   ├── employee/             # 직원 영역
│   │   ├── layout.tsx        # 인증 보호 (useAuth)
│   │   ├── page.tsx          # 직원 메인
│   │   ├── checkin/page.tsx  # 출근 페이지
│   │   ├── checkout/page.tsx # 퇴근 페이지
│   │   ├── _components/
│   │   │   ├── HeaderCard.tsx         # 사용자 인사 + 날짜 + 로그아웃
│   │   │   ├── AttendanceButtons.tsx  # 출퇴근 버튼 (상태별 조건부 렌더링)
│   │   │   ├── NoticeSection.tsx      # 긴급 공지 섹션
│   │   │   ├── WorkRecordsSection.tsx # 활동 기록 아코디언
│   │   │   ├── DateNavigator.tsx      # 연도/월 네비게이션
│   │   │   ├── WorkRecordCard.tsx     # 활동 기록 카드
│   │   │   ├── PhotoLightbox.tsx      # 사진 확대 모달
│   │   │   ├── HeicImage.tsx          # HEIC 이미지 지원
│   │   │   └── SuccessModal.tsx       # 출퇴근 완료 모달
│   │   └── _hooks/
│   │       ├── useMyAttendanceQuery.ts    # 출퇴근 Query 훅 (TanStack Query)
│   │       ├── useMyAttendanceMutations.ts # 출퇴근 Mutation 훅 (TanStack Query)
│   │       ├── useMyScheduleToday.ts      # 오늘 스케줄 Query 훅 (휴일 판정)
│   │       ├── useMyProfile.ts            # 본인 프로필 Query 훅 (workDays 비근무일 판정)
│   │       ├── useWorkRecords.ts          # 활동 기록 상태 관리 (React Query + 페이지네이션)
│   │       └── useEmployeeNotice.ts       # 직원 공지사항 상태 관리
│   │
│   ├── company/              # 기업 영역 (라우트 기반 탭)
│   │   ├── layout.tsx        # 공통 헤더 + 탭 네비게이션 + 인증 보호
│   │   ├── page.tsx          # → /company/dashboard 리다이렉트
│   │   ├── _components/
│   │   │   ├── StatCard.tsx
│   │   │   ├── EmployeeTable.tsx
│   │   │   ├── AttendanceTable.tsx
│   │   │   ├── CalendarGrid.tsx
│   │   │   ├── NoticeHistory.tsx
│   │   │   ├── AddWorkerModal.tsx
│   │   │   ├── ScheduleModal.tsx
│   │   │   └── WorkerSelector.tsx
│   │   ├── _hooks/            # company 전용 훅
│   │   │   ├── useDashboardQuery.ts     # 대시보드 Query 훅
│   │   │   ├── useNoticeQuery.ts        # 공지사항 Query 훅
│   │   │   ├── useNoticeMutations.ts    # 공지사항 Mutation 훅
│   │   │   ├── useScheduleQuery.ts      # 근무일정 Query 훅
│   │   │   └── useScheduleMutations.ts  # 근무일정 Mutation 훅
│   │   ├── _utils/           # 유틸리티
│   │   │   └── filterEmployees.ts # 직원 검색 필터
│   │   ├── dashboard/        # 대시보드 탭
│   │   ├── employees/        # 근로자 관리 탭
│   │   │   ├── page.tsx
│   │   │   ├── _hooks/       # useAttendanceHistory, useEmployeeEditForm, useEmployeeFiles
│   │   │   └── [id]/         # 근로자 상세 + _components/ (11개)
│   │   ├── schedule/         # 근무일정 탭
│   │   └── notices/          # 공지사항 탭
│   │
│   └── admin/                # 관리자 영역 (라우트 기반 탭)
│       ├── layout.tsx        # 공통 헤더 + 6개 탭 네비게이션
│       ├── page.tsx          # → /admin/dashboard 리다이렉트
│       ├── _hooks/            # admin 전용 훅
│       │   ├── useCompanyQuery.ts              # 회원사 Query 훅
│       │   ├── useCompanyMutations.ts          # 회원사 Mutation 훅
│       │   ├── useCompanyFiles.ts              # 회원사 파일 Query/Mutation 훅
│       │   ├── useAdminDashboardQuery.ts       # 관리자 대시보드 Query 훅
│       │   ├── useAdminNotificationQuery.ts    # 알림센터 Query 훅
│       │   ├── useAdminNotificationMutations.ts # 알림센터 Mutation 훅
│       │   ├── useAdminReports.ts              # 리포트 파일 Query/Mutation 훅
│       │   ├── useAdminWorkstats.ts            # 근무통계 Query/Mutation 훅
│       │   └── useAdminAccountQuery.ts         # 관리자 계정 Query 훅
│       ├── _components/
│       │   ├── AdminStatCard.tsx
│       │   ├── CompanyCard.tsx
│       │   ├── WorkerTable.tsx
│       │   ├── WorkStatsTable.tsx
│       │   ├── CompanyAttendanceAccordion.tsx
│       │   ├── AbsenceAlertList.tsx
│       │   ├── InquiryList.tsx
│       │   ├── InquiryDetailModal.tsx
│       │   ├── NoteUpdateAlertList.tsx
│       │   ├── AddCompanyModal.tsx
│       │   └── PrintPreviewModal.tsx
│       ├── dashboard/        # 대시보드 탭
│       ├── companies/        # 회원사 관리 탭
│       │   ├── page.tsx
│       │   └── [id]/         # 회원사 상세
│       │       ├── page.tsx
│       │       ├── _hooks/   # useCompanyDetailUI
│       │       └── _components/  # CompanyProfileCard, PMInfoCard, ResignSection, EmployeeListSection, FileSection, ResignModal
│       ├── employees/        # 근로자 관리 탭
│       │   ├── page.tsx
│       │   └── [id]/         # 근로자 상세
│       │       ├── page.tsx
│       │       ├── _hooks/   # useAdminAttendanceHistory, useAdminEditForm, useAdminEmployeeFiles
│       │       └── _components/  # ProfileCard, AdminNoteSection, CompanyNoteSection, ResignInfoSection, AttendanceHistoryTable, WorkInfoSection, DocumentSection, FileUploadModal, WorkTimeEditModal, WorkDoneModal
│       ├── workstats/        # 근무 통계 탭
│       ├── notifications/    # 알림센터 탭
│       ├── reports/          # 리포트 탭 (파일 저장소)
│       │   ├── page.tsx
│       │   └── _components/
│       │       ├── FileSection.tsx     # 섹션 (목록 + 업로드 버튼)
│       │       ├── FileListItem.tsx    # 파일 행 (다운로드/삭제)
│       │       └── FileUploadModal.tsx # 업로드 모달
│       └── settings/        # 설정 탭
│           └── page.tsx
│
├── components/               # 공용 컴포넌트 (app 외부)
│   ├── ProfileImageUpload.tsx # 프로필 이미지 업로드/삭제 (HEIC 변환, 압축)
│   ├── PhotoLightbox.tsx      # 사진 확대 라이트박스 모달
│   └── ui/                   # 전역 UI 프리미티브 (Button, Input, Modal 등)
│
├── hooks/                    # 공용 훅 (여러 라우트에서 공유)
│   ├── useAuth.ts            # 인증 훅 (login, logout, checkAuth — useAuthQuery 기반)
│   ├── useAuthQuery.ts       # 인증 Query 훅 (TanStack Query, staleTime: 5분)
│   ├── useAttendanceQuery.ts # 출퇴근 Query 훅 (TanStack Query)
│   ├── useAttendanceMutations.ts # 출퇴근 Mutation 훅 (TanStack Query)
│   ├── useEmployeeQuery.ts   # 근로자 Query 훅 (TanStack Query)
│   ├── useEmployeeMutations.ts # 근로자 Mutation 훅 (생성, 수정, 프로필 이미지 업로드/삭제)
│   └── useEmployeeFiles.ts   # 근로자 파일 Query/Mutation 훅 (TanStack Query)
│
├── types/                    # 공용 타입 정의
│   ├── api.ts                # API 공통 타입 (ApiResponse, Pagination 등)
│   ├── auth.ts               # 인증 관련 타입
│   ├── adminDashboard.ts     # 관리자 대시보드 타입 (디자인 목업 기준)
│   ├── adminFile.ts          # 관리자 파일 타입 (AdminFile, AdminFileCategory)
│   ├── company.ts            # 기업 타입
│   ├── companyDashboard.ts   # 기업 대시보드 타입
│   ├── employee.ts           # 직원 타입 + DISABILITY_TYPES 상수
│   ├── attendance.ts         # 출퇴근 타입
│   ├── schedule.ts           # 근무일정 타입
│   ├── notice.ts             # 공지사항 타입
│   └── inquiry.ts            # 기업 문의 타입
│
└── lib/                      # 유틸리티 함수
    ├── cn.ts                 # Tailwind 클래스 병합
    ├── file.ts               # HEIC 파일 유틸리티 + formatFileSize + validateUploadFile + FILE_CONSTRAINTS
    ├── kst.ts                # KST 시간 변환 (formatUtcTimestampAsKST, formatKSTDate, offsetDateString 등)
    ├── workDays.ts           # 요일 매핑 (DAY_LABELS, LABEL_TO_NUM, NUM_TO_LABEL)
    ├── status.ts             # 출퇴근 상태 표시 통합 (getEmployeeStatusLabel/Style, getDisplayStatusColor)
    ├── address.ts            # 한국 시/도 → 시/군/구 매핑 (CITY_OPTIONS, getDistrictOptions)
    ├── auth/
    │   └── store.ts          # Zustand 인증 스토어 (useAuthStore)
    ├── query/                # TanStack Query 설정
    │   ├── client.ts         # QueryClient (staleTime: Infinity, gcTime: 30분)
    │   ├── QueryProvider.tsx  # 'use client' Provider 래퍼
    │   └── keys.ts           # Query Key 팩토리
    └── api/                  # API 클라이언트
        ├── client.ts         # Axios 인스턴스
        ├── error.ts          # 에러 메시지 추출 유틸
        ├── auth.ts           # 인증 API
        ├── admin.ts          # 관리자 API (통계, 출퇴근, 월간 통계, 알림, 파일)
        ├── attendance.ts     # 출퇴근 API
        ├── employees.ts      # 직원 API (CRUD + 프로필 이미지 업로드/삭제)
        ├── employeeFiles.ts  # 직원 파일 API
        ├── employeeNotices.ts # 직원 공지 API
        ├── notices.ts        # 공지사항 API
        ├── schedules.ts      # 근무일정 API
        ├── companies.ts      # 기업 API
        ├── companyFiles.ts   # 기업 파일 API
        └── inquiries.ts      # 기업 문의 API
```

#### Component & Hook Placement
| 조건 | 위치 |
|------|------|
| 한 라우트 폴더에서만 사용 | `app/employee/_components/`, `app/admin/_hooks/` 등 |
| 여러 라우트에서 재사용 | `@/components/`, `@/hooks/` |
| 범용 UI 프리미티브 | `@/components/ui/` |

#### Naming Rules
- **Components**: `PascalCase.tsx` (e.g., `Button.tsx`, `HeroSlider.tsx`)
- **Hooks**: `useCamelCase.ts` (e.g., `useAuth.ts`, `useGeolocation.ts`)
- **Types**: `camelCase.ts` (e.g., `attendance.ts`, `employee.ts`)
- **Folders inside `app/`**: prefix with `_` (e.g., `_components/`, `_hooks/`)
- **Folders outside `app/`**: no `_` prefix (e.g., `components/`, `hooks/`)
- **No barrel exports** (`index.ts`) - import files directly

#### Import Paths
| 상황 | 경로 방식 |
|------|----------|
| `app/` 외부 파일 import | 절대 경로 `@/` (e.g., `@/components/ui/Button`) |
| 같은 라우트 폴더 내 | 상대 경로 `./` (e.g., `./_components/NoticeSection`) |
| 다른 라우트 폴더 참조 | **금지** - 공용 폴더로 승격 필요 |

#### Type Placement
- **Component Props**: 같은 파일에 정의
- **Domain types**: `@/types/` 폴더에 정의

### UI Components (공용 컴포넌트)

`@/components/ui/`에 공용 UI 컴포넌트가 구현되어 있습니다. **페이지 UI 구현 시 반드시 이 컴포넌트들을 우선 사용하세요.**

| 컴포넌트 | 용도 | 주요 Props |
|---------|------|-----------|
| `Button` | 버튼 | `variant`, `size`, `fullWidth`, `leftIcon`, `rightIcon` |
| `Badge` | 상태 표시 | `variant`, `size` |
| `Card` | 카드 컨테이너 | `padding`, `hover` + `CardHeader`, `CardContent`, `CardFooter` |
| `Avatar` | 프로필 이미지/이니셜 | `src`, `name`, `size` |
| `Input` | 텍스트 입력 | `label`, `error`, `leftIcon`, `size` |
| `Textarea` | 여러 줄 입력 | `label`, `error` |
| `Checkbox` | 체크박스 | `label`, `size` |
| `IconButton` | 아이콘 버튼 | `icon`, `variant`, `size`, `label` |
| `Modal` | 모달 다이얼로그 | `isOpen`, `onClose`, `title`, `size` |
| `Tabs` | 탭 UI | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| `Skeleton` | 로딩 플레이스홀더 | `className` |
| `Toast` | 토스트 알림 | `useToast()` 훅 사용 |
| `PaginationBar` | 서버 사이드 페이지네이션 | `currentPage`, `pagination`, `onPrevPage`, `onNextPage` |

**사용 예시:**
```tsx
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

<Button variant="primary" size="lg" leftIcon={<Icon />}>
  버튼 텍스트
</Button>
```

**Toast 사용법:**
```tsx
import { useToast } from '@/components/ui/Toast';

function MyComponent() {
  const toast = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast.success('저장되었습니다.');
    } catch {
      toast.error('저장에 실패했습니다.');
    }
  };
}
```
- Zustand 기반, `alert()` 대신 사용
- variant: `success` (초록), `error` (빨강)
- 우상단 표시, 3초 후 자동 닫힘
- `<ToastContainer />`는 `app/layout.tsx`에 이미 추가됨

**유틸리티:**
- `cn()` - Tailwind 클래스 병합 (`@/lib/cn`)

## Skills

프로젝트 아키텍처 검증을 위한 스킬 목록입니다:

| 스킬 | 설명 |
|------|------|
| `verify-imports` | Import 경로 규칙 검증 |
| `verify-query-patterns` | TanStack Query 패턴 검증 |
| `verify-file-structure` | 파일 배치/명명 규칙 검증 |
| `verify-security` | 보안 패턴 검증 (헤더, 인증, 토큰, 라우트 보호) |
| `verify-ui-patterns` | UI 컴포넌트 사용 패턴 검증 (input, textarea, checkbox, button, dialog) |
| `verify-implementation` | 모든 verify 스킬 통합 실행 |
| `manage-skills` | 검증 스킬 유지보수 |
| `codex-review` | Codex CLI를 통한 구현 계획 외부 리뷰 |
