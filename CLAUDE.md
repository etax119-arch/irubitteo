# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Documentation

프로젝트 상세 문서는 `docs/` 폴더를 참조하세요:

### 설계 문서
- [프로젝트 개요](docs/README.md) - 전체 문서 인덱스
- [요구사항](docs/design/requirements.md) - 기능 요구사항, 사용자 흐름
- [DB 스키마](docs/design/database-schema.md) - 테이블 구조 및 관계
- [API 설계](docs/design/api-design.md) - 엔드포인트 명세
- [아키텍처](docs/design/architecture.md) - 시스템 구조 및 흐름



### 의사결정/참조
- [기술 스택](docs/reference/tech-stack.md) - 기술 선정 및 비용
- [계정 체크리스트](docs/reference/platform-accounts.md) - 필요 플랫폼 계정

## Related Projects

두르비터 프로젝트는 여러 저장소로 구성됩니다:

```
/Users/hyson/durubitteo/
├── durubitteo_web/        # 현재 프로젝트 (Next.js 프론트엔드)
├── durubitteo_design/     # 디자인 프로젝트 (Vite + Tailwind)
└── durubitteo_server/     # 서버 프로젝트 (NestJS 예정)
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

### durubitteo_server (예정)
- **용도**: 백엔드 API 서버
- **경로**: `../durubitteo_server/`
- **기술 스택**: NestJS (예정)

## Build & Development Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm start        # Run production server
npm run lint     # ESLint check
```

## Tech Stack

- **Next.js 16.1.6** with App Router (not Pages Router)
- **React 19.2.3** with Server Components by default
- **TypeScript 5** with strict mode
- **Tailwind CSS v3** with autoprefixer
- **ESLint v9** with flat config format

## Architecture

### App Router Structure
All pages and layouts live in `app/`. Server Components are the default - add `'use client'` directive only for components that need interactivity.

### Path Alias
`@/*` maps to the project root (configured in tsconfig.json).

### Styling
- Tailwind utility classes in JSX
- CSS variables for theming in `app/globals.css`: `--background`, `--foreground`
- Dark mode via `prefers-color-scheme` media query and `dark:` Tailwind prefix
- Geist fonts configured as CSS variables: `--font-geist-sans`, `--font-geist-mono`

### Configuration Files
- `next.config.ts` - Next.js config (currently default)
- `eslint.config.mjs` - ESLint v9 flat config extending next/core-web-vitals and next/typescript
- `postcss.config.mjs` - PostCSS config (Tailwind, autoprefixer)
- `tsconfig.json` - TypeScript with ES2017 target, strict mode, bundler module resolution

### Folder Structure Convention

```
durubitteo_web/
├── app/
│   ├── (public)/
│   │   ├── _components/      # (public) 전용 컴포넌트
│   │   └── _hooks/           # (public) 전용 훅
│   ├── (employee)/
│   │   ├── _components/
│   │   └── _hooks/
│   ├── (company)/
│   │   ├── _components/
│   │   └── _hooks/
│   └── (admin)/
│       ├── _components/
│       └── _hooks/
│
├── components/               # 공용 컴포넌트 (app 외부)
│   ├── ui/                   # 전역 UI 프리미티브 (Button, Input, Modal 등)
│   └── layout/               # 레이아웃 컴포넌트 (Header, Sidebar 등)
│
├── hooks/                    # 공용 훅
│   └── queries/              # 서버 상태 훅 (TanStack Query 등)
│
├── types/                    # 공용 타입 정의
│
└── lib/                      # 유틸리티 함수
```

#### Component & Hook Placement
| 조건 | 위치 |
|------|------|
| 한 라우트 그룹에서만 사용 | `app/(group)/_components/`, `app/(group)/_hooks/` |
| 여러 라우트에서 재사용 | `@/components/`, `@/hooks/` |
| 범용 UI 프리미티브 | `@/components/ui/` |
| 서버 상태 훅 | `@/hooks/queries/` |

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
| 같은 라우트 그룹 내 | 상대 경로 `./` (e.g., `./_components/HeroSlider`) |
| 다른 라우트 그룹 참조 | **금지** - 공용 폴더로 승격 필요 |

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

**사용 예시:**
```tsx
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

<Button variant="primary" size="lg" leftIcon={<Icon />}>
  버튼 텍스트
</Button>
```

**유틸리티:**
- `cn()` - Tailwind 클래스 병합 (`@/lib/cn`)
