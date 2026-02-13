# Repository Guidelines

## Project Documentation
상세 설계/요구사항은 `docs/`를 우선 참조하세요.

- `docs/README.md`: 전체 문서 인덱스
- `docs/design/requirements.md`: 기능 요구사항, 사용자 흐름
- `docs/design/architecture.md`: 시스템 구조 및 모듈 흐름
- `docs/design/auth/README.md`: 인증 개요, 토큰 정책
- `docs/design/auth/frontend.md`: 프론트엔드 인증 구현
- `docs/design/features/admin-dashboard.md`: 관리자 기능 명세
- `docs/design/features/company-dashboard.md`: 기업 기능 명세
- `docs/design/features/employee-app.md`: 직원 앱 기능 명세
- `docs/design/tanstack-query.md`: Query key/caching 규칙

## Project Structure & Module Organization
이 저장소는 `durubitteo_web` 프론트엔드(Next.js App Router)입니다.

- `app/`: 라우트/레이아웃/페이지
- `app/**/_components`, `app/**/_hooks`, `app/**/_utils`: 특정 라우트 전용 코드
- `components/`: 전역 재사용 컴포넌트
- `components/ui/`: 공용 UI 프리미티브(버튼, 모달, 입력 등)
- `hooks/`, `lib/`, `types/`: 공용 훅/유틸/API/타입
- `docs/`: 요구사항, 아키텍처, 기능 명세

배치 원칙: 한 라우트에서만 쓰면 `app` 내부에, 여러 라우트에서 재사용되면 `components/` 또는 `hooks/`로 승격합니다.

## Build, Test, and Development Commands
- `npm run dev`: 개발 서버 실행 (`http://localhost:3000`)
- `npm run build`: 프로덕션 빌드
- `npm run start`: 빌드 결과 실행
- `npm run lint`: ESLint 검사(필수)
- `docker compose up --build`: web + server 통합 로컬 실행

## Coding Style & Naming Conventions
- TypeScript `strict` 모드 유지, 들여쓰기 2 spaces
- 컴포넌트: `PascalCase.tsx` (`AttendanceTable.tsx`)
- 훅: `useCamelCase.ts` (`useAdminDashboardQuery.ts`)
- 타입 파일: 도메인 기반 `camelCase.ts` (`attendance.ts`)
- `app/` 내부 특수 폴더는 `_` prefix 사용 (`_components`, `_hooks`)
- `app/` 외부 폴더는 `_` prefix 금지
- Barrel export(`index.ts`) 사용 금지, 파일 직접 import
- import 규칙: 공용 코드는 `@/` 절대경로 사용, 같은 라우트 내부만 상대경로 사용
- 다른 라우트 폴더를 직접 import하지 말고 공용 폴더로 승격

UI는 `components/ui/*`를 우선 사용하고, 알림은 `alert()` 대신 `useToast()`를 사용합니다.

## Testing Guidelines
현재 `package.json`에 프론트엔드 `test` 스크립트가 없습니다.

- PR 전 최소 `npm run lint` + `npm run build` 통과
- 수동 검증 시 변경 라우트를 직접 탐색(예: `/admin`, `/company/employees/[id]`)
- 테스트 도입 시 기능 근처에 `*.test.ts(x)`를 두고 실행 명령을 문서에 추가

## Commit & Pull Request Guidelines
최근 커밋은 짧은 한국어 작업 단위 제목 패턴을 사용합니다(예: `배포 오류 수정 #2`).

- 커밋은 단일 목적, 작은 단위로 분리
- 제목은 명령형/행동 중심으로 작성
- PR에는 변경 목적, 영향 경로, 검증 방법을 포함
- UI 변경 PR은 스크린샷 또는 짧은 영상 첨부
