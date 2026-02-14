---
name: verify-security
description: 보안 헤더, 인증, 토큰 관리 패턴을 검증합니다. 보안 설정, 인증 흐름, 미들웨어 변경 후 사용.
disable-model-invocation: true
---

# 보안 패턴 검증

## 목적

프로젝트의 보안 관련 설정과 패턴 준수를 검증합니다:

1. **보안 헤더 완전성** — 필수 HTTP 보안 헤더가 모두 설정되어 있는지 확인
2. **CSP 정책** — Content-Security-Policy에 필수 지시어가 포함되어 있는지 확인
3. **API 클라이언트 보안** — Axios 인스턴스의 보안 설정 (credentials, proxy, timeout) 확인
4. **토큰 저장 금지** — localStorage에 인증 토큰을 직접 저장하지 않는지 확인
5. **라우트 보호** — 미들웨어에서 보호 경로가 누락 없이 정의되어 있는지 확인
6. **비밀번호 유효성 검사** — 클라이언트 측 비밀번호 길이 검사 존재 확인
7. **환경 변수 격리** — 컴포넌트에서 process.env 직접 사용 방지

## 실행 시점

- 보안 헤더나 CSP 정책을 수정한 후
- 인증 흐름 또는 미들웨어를 변경한 후
- API 클라이언트 설정을 변경한 후
- 새로운 보호 라우트를 추가한 후
- PR 전 보안 설정 준수 확인 시

## Related Files

| File | Purpose |
|------|---------|
| `next.config.ts` | 보안 헤더 + CSP + API 프록시 설정 |
| `lib/api/client.ts` | Axios 인스턴스 (withCredentials, proxy, timeout) |
| `lib/auth/store.ts` | Zustand 인증 스토어 (localStorage 사용 범위) |
| `middleware.ts` | 라우트 보호 미들웨어 |
| `hooks/useAuth.ts` | 인증 훅 (login, logout, checkAuth) |
| `lib/api/auth.ts` | 인증 API 함수 |
| `types/auth.ts` | 인증 타입 정의 |
| `lib/file.ts` | 파일 업로드 보안 유틸 (magic byte, 압축) |
| `app/admin/settings/page.tsx` | 비밀번호 변경 + 계정 관리 |

## 워크플로우

### Step 1: 보안 헤더 존재 확인

**파일:** `next.config.ts`

**검사:** 6개 필수 보안 헤더가 모두 존재하는지 확인합니다.

**도구:** Grep (6회, path: `next.config.ts`)

```
pattern: "X-Frame-Options"
pattern: "X-Content-Type-Options"
pattern: "Strict-Transport-Security"
pattern: "Content-Security-Policy"
pattern: "Referrer-Policy"
pattern: "Permissions-Policy"
```

**PASS 기준:** 6개 헤더 모두 매칭 1건 이상
**FAIL 기준:** 누락된 헤더가 있음

**수정 방법:** `next.config.ts`의 `headers()` 함수에 누락된 보안 헤더를 추가합니다.

### Step 2: CSP 필수 지시어 확인

**파일:** `next.config.ts`

**검사:** Content-Security-Policy에 `default-src 'self'`가 포함되어 있는지 확인합니다.

**도구:** Grep

```
pattern: "default-src 'self'"
path: "next.config.ts"
```

**PASS 기준:** 매칭 1건 이상
**FAIL 기준:** `default-src 'self'` 누락

**수정 방법:** CSP 정책에 `default-src 'self'` 지시어를 추가합니다.

### Step 3: API 클라이언트 보안 설정

**파일:** `lib/api/client.ts`

**검사 3a:** `withCredentials: true` 설정이 존재하는지 확인합니다.

**도구:** Grep

```
pattern: "withCredentials:\\s*true"
path: "lib/api/client.ts"
```

**검사 3b:** `baseURL`이 `/api/proxy` (same-origin proxy)를 사용하는지 확인합니다.

**도구:** Grep

```
pattern: "baseURL.*['\"/]api/proxy"
path: "lib/api/client.ts"
```

**검사 3c:** `timeout` 설정이 존재하는지 확인합니다.

**도구:** Grep

```
pattern: "timeout:"
path: "lib/api/client.ts"
```

**PASS 기준:** 3개 검사 모두 매칭 1건 이상
**FAIL 기준:** 누락된 설정이 있음

**수정 방법:** Axios 인스턴스 생성 시 누락된 설정을 추가합니다.

### Step 4: 토큰 직접 저장 금지

**검사:** `localStorage`에 `token`, `accessToken`, `refreshToken` 문자열을 직접 저장하는 코드가 없어야 합니다.

**도구:** Grep

```
pattern: "localStorage\.\w+Item\(.*[Tt]oken"
glob: "**/*.{ts,tsx}"
```

`node_modules/`, `.next/` 디렉토리는 제외합니다.

**PASS 기준:** 매칭 0건
**FAIL 기준:** 토큰을 localStorage에 저장하는 코드가 존재

**수정 방법:** 토큰은 httpOnly 쿠키로 관리해야 합니다. localStorage에서 토큰을 저장/읽는 코드를 제거합니다.

### Step 5: 미들웨어 라우트 보호

**파일:** `middleware.ts`

**검사 5a:** `PROTECTED_ROUTES` 정의에 `admin`, `company`, `employee` 3개 경로가 포함되어 있는지 확인합니다.

**도구:** Grep

```
pattern: "PROTECTED_ROUTES"
path: "middleware.ts"
output_mode: "content"
```

결과에서 `admin`, `company`, `employee` 3개 경로가 모두 포함되어 있는지 확인합니다.

**검사 5b:** `AUTH_ROUTES` 정의에 로그인 경로가 포함되어 있는지 확인합니다.

**도구:** Grep

```
pattern: "AUTH_ROUTES"
path: "middleware.ts"
output_mode: "content"
```

결과에서 `/login` 경로가 포함되어 있는지 확인합니다.

**PASS 기준:** 3개 보호 경로 + 로그인 경로 모두 존재
**FAIL 기준:** 누락된 경로가 있음

**수정 방법:** `middleware.ts`에서 누락된 경로를 `PROTECTED_ROUTES` 또는 `AUTH_ROUTES` 배열에 추가합니다.

### Step 6: 비밀번호 유효성 검사 패턴

**검사:** 비밀번호 입력이 있는 페이지에서 클라이언트 측 최소 길이 검사가 존재하는지 확인합니다.

**도구:** Grep

```
pattern: "\.length\s*[<>=]"
glob: "app/**/settings/page.tsx"
```

**PASS 기준:** 매칭 1건 이상
**FAIL 기준:** 클라이언트 비밀번호 길이 검사 없음

**수정 방법:** 비밀번호 변경 로직에 `password.length >= N` 형태의 최소 길이 검사를 추가합니다.

### Step 7: 환경 변수 직접 사용 제한

**검사:** `app/` 내 컴포넌트에서 `process.env`를 직접 사용하지 않는지 확인합니다. 환경 변수는 설정 파일(`next.config.ts`, `lib/` 등)에서만 사용해야 합니다.

**도구:** Grep

```
pattern: "process\.env"
glob: "app/**/*.{ts,tsx}"
```

**PASS 기준:** 매칭 0건
**FAIL 기준:** 컴포넌트에서 `process.env`를 직접 사용

**수정 방법:** `process.env` 접근을 설정 파일로 이동하고, 컴포넌트에서는 설정 값을 import하여 사용합니다.

## Output Format

```markdown
## verify-security 검증 결과

| # | 검사 항목 | 결과 | 상세 |
|---|----------|------|------|
| 1 | 보안 헤더 존재 | PASS/FAIL | 6/6 헤더 존재 또는 누락 목록 |
| 2 | CSP default-src | PASS/FAIL | default-src 'self' 존재 여부 |
| 3 | API 클라이언트 보안 | PASS/FAIL | 3/3 설정 또는 누락 목록 |
| 4 | 토큰 저장 금지 | PASS/FAIL | 발견된 파일:라인 |
| 5 | 미들웨어 라우트 보호 | PASS/FAIL | 3/3 경로 또는 누락 목록 |
| 6 | 비밀번호 길이 검사 | PASS/FAIL | 검사 존재 여부 |
| 7 | 환경 변수 격리 | PASS/FAIL | 발견된 파일:라인 |
```

## 예외사항

다음은 **위반이 아닙니다**:

1. **`lib/auth/store.ts`의 localStorage 사용** — 사용자 프로필 정보(이름, 역할)만 영속화하며, 토큰은 저장하지 않음. 이는 정상적인 패턴
2. **`next.config.ts`의 `unsafe-inline`/`unsafe-eval`** — Next.js 프레임워크 요구사항으로 현재 필수. 추후 nonce 기반 CSP로 개선 가능
3. **개발 환경 CSP의 `http://localhost:*`** — `isDev` 분기 내부에서만 사용되므로 프로덕션에는 영향 없음
