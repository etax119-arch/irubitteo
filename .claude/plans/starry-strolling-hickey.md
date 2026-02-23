# 이루빛터 프로젝트 정밀 분석 리뷰

## Context

3개 에이전트(라우팅/데이터레이어/UI-설정)로 프로젝트 전체를 분석하고, 주요 발견사항에 대해 원본 코드를 직접 읽어 교차 검증을 수행했습니다.

**분석 범위**: App Router 구조, 인증 흐름, API 클라이언트, TanStack Query 패턴, 타입 정의, UI 컴포넌트, 보안 설정

---

## 교차 검증 결과 (오탐 정정)

에이전트 분석에서 3건의 오탐을 확인하여 정정합니다:

| 에이전트 지적 | 실제 상황 | 근거 |
|-------------|----------|------|
| `attendanceKeys.myHistoryAll()` 함수 없음 | **존재함** (keys.ts:35) | prefix 매칭으로 하위 쿼리 전체 무효화 — 정상 |
| `companyFiles.ts`의 `_skipAuthRetry` 작동 안함 | **정상 작동** | client.ts:13-15에서 `AxiosRequestConfig` 타입 확장 |
| `useAuth()` 매번 checkAuth() API 호출 | **캐시 활용** | `useAuthQuery`가 TanStack Query `staleTime: 5분` 적용 |

---

## 실제 이슈 및 수정 결과

### 1. [보안] CSP `'unsafe-eval'` — 수정 완료

- **파일**: `next.config.ts:34`
- **수정**: 프로덕션에서 `'unsafe-eval'` 제거, 개발모드에서만 허용
- **상태**: 완료

### 2. [보안] Supabase 이미지 도메인 — 수정 완료

- **파일**: `next.config.ts:4,10`
- **수정**: `NEXT_PUBLIC_SUPABASE_HOSTNAME` 환경변수 기반으로 변경 (미설정 시 기존 와일드카드 유지)
- **상태**: 완료

### 3. [접근성] Modal 포커스 트랩 — 수정 완료

- **파일**: `components/ui/Modal.tsx`
- **수정**: Tab 키 순환 + 열릴 때 첫 포커스 요소에 자동 focus + 닫힐 때 이전 포커스 복원
- **상태**: 완료

### 4. [접근성] Header nav aria-label — 수정 완료

- **파일**: `app/_components/Header.tsx`
- **수정**: `<nav>` 태그에 `aria-label="메인 네비게이션"` 추가 (태그 자체는 이미 존재)
- **상태**: 완료

### 5. [일관성] API 응답 타입 통일 — 수정 완료

- **파일**: `lib/api/employees.ts`, `hooks/useEmployeeQuery.ts`, `app/employee/_hooks/useMyProfile.ts`
- **수정**: 모든 employee API 함수가 데이터를 직접 반환하도록 통일 (admin.ts 패턴)
  - `{ success, data }` 래퍼 제거 → 데이터 직접 반환
  - Query 훅에서 `select: (data) => data.data` 제거
  - `deleteEmployee()` → `void` 반환 (admin.ts의 delete 패턴과 통일)
- **상태**: 완료 (tsc + lint 검증 통과)

### 6. [UX] 큰 페이지 컴포넌트 — 미수정 (선택)

- **대상**: company/employees/page.tsx (293줄) 외 4개 파일
- **판단**: 기능 정상, 리팩토링 필요시 별도 진행
- **상태**: 보류

---

## 강점 (유지 권장)

| 영역 | 상세 |
|------|------|
| 토큰 갱신 | 프로액티브 갱신 + 서킷 브레이커 + 큐잉 — 프로덕션 수준 |
| Query Key Factory | 체계적 prefix 매칭 패턴 (keys.ts) |
| 라우트 구조 | App Router 표준 패턴 준수, 크로스 라우트 import 없음 |
| 파일 명명 | PascalCase 컴포넌트, useCamelCase 훅 — 100% 일관 |
| 서버 컴포넌트 활용 | gallery/newsletter 공개 페이지 SSR + 클라이언트 분리 |
| 인증 보안 | HttpOnly 쿠키 + Same-Origin 프록시 + X-Robots-Tag |
| 보안 헤더 | HSTS, X-Frame-Options, Permissions-Policy 등 적절 |
| 컬러 시스템 | duru-orange 7단계 그라데이션 일관 적용 |

---

## 검증

- `npx tsc --noEmit` — 통과
- `npm run lint` — 기존 경고 4건만 (이번 변경과 무관)
