# 프론트엔드 인증 시스템 정리

> **상태**: 구현 완료 (2026-02)

## 1. 개요

### 인증 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                        로그인 흐름                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  사용자 ──▶ 로그인 페이지 ──▶ POST /auth/login                  │
│                                    │                            │
│                                    ▼                            │
│                         서버: JWT 발급 + HttpOnly Cookie 설정    │
│                                    │                            │
│                                    ▼                            │
│                         클라이언트: 사용자 정보 Zustand 저장      │
│                                    │                            │
│                                    ▼                            │
│                         역할별 대시보드로 리다이렉트              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        토큰 갱신 흐름                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  API 요청 ──▶ 401 Unauthorized                                  │
│                    │                                            │
│                    ▼                                            │
│              POST /auth/refresh (Cookie 자동 전송)              │
│                    │                                            │
│              ┌─────┴─────┐                                      │
│              │           │                                      │
│              ▼           ▼                                      │
│          성공: 재시도   실패: 로그아웃 + 로그인 페이지            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 역할별 로그인 방식

| 역할 | 식별자 | 비밀번호 | 예시 |
|------|--------|----------|------|
| 관리자 (admin) | 이메일 | 필요 | admin@durubitteo.com |
| 기업 (company) | 고유번호 | 불필요 | ABC123 |
| 직원 (employee) | 고유번호 | 불필요 | 99011234 (생년월일4자리+전화번호뒤4자리) |

---

## 2. 구현 파일 구조

```
durubitteo_web/
├── lib/
│   ├── api/
│   │   ├── client.ts         # axios 인스턴스, 토큰 갱신 인터셉터
│   │   └── auth.ts           # 인증 API 함수 (login, logout, refresh, getMe)
│   │
│   └── auth/
│       └── store.ts          # Zustand 스토어 + persist + CustomEvent
│
├── hooks/
│   ├── useAuth.ts            # 인증 훅 (로그인, 로그아웃, checkAuth — useAuthQuery 기반)
│   └── useAuthQuery.ts       # 인증 Query 훅 (TanStack Query, staleTime: 5분)
│
├── middleware.ts             # Next.js 라우트 보호 (쿠키 기반 역할별 접근 제어)
│
├── app/
│   └── login/
│       ├── admin/page.tsx    # 관리자 로그인 (이메일 + 비밀번호)
│       ├── company/page.tsx  # 기업 로그인 (고유번호)
│       └── employee/page.tsx # 직원 로그인 (고유번호)
│
└── types/
    └── auth.ts               # 인증 관련 타입
```

### 파일별 역할

| 파일 | 역할 |
|------|------|
| `lib/api/client.ts` | axios 인스턴스, 401 응답 시 토큰 갱신 큐 시스템 |
| `lib/api/auth.ts` | login, logout, refresh, getMe API 함수 |
| `lib/auth/store.ts` | Zustand + persist로 UI 표시용 사용자 상태 관리 |
| `hooks/useAuthQuery.ts` | TanStack Query 기반 인증 상태 조회 (`GET /auth/me`, staleTime: 5분) |
| `hooks/useAuth.ts` | 컴포넌트용 인증 훅 (useAuthQuery 결과를 Zustand에 동기화, 로그인/로그아웃) |
| `middleware.ts` | 쿠키 기반 역할별 라우트 접근 제어 |

---

## 3. 핵심 구현 상세

### 토큰 갱신 큐 시스템 + 서킷 브레이커 (`lib/api/client.ts`)

동시 요청 시 토큰 갱신을 한 번만 수행하고, 대기 중인 요청들을 큐에서 처리합니다.
큐 폭주 방지 및 연속 실패 시 서킷 브레이커로 보호합니다:

```typescript
// 설정 상수
const REFRESH_CONFIG = {
  MAX_QUEUE_SIZE: 50,              // 큐 크기 제한 (10탭 × 4쿼리 + 여유분)
  QUEUE_TIMEOUT_MS: 10_000,        // 큐 대기 타임아웃 (10s)
  REFRESH_TIMEOUT_MS: 5_000,       // 갱신 요청 타임아웃 (5s)
  STAGGER_BASE_MS: 50,             // 시차 재시도 간격
  CIRCUIT_BREAKER_THRESHOLD: 3,    // 연속 실패 허용 횟수
  CIRCUIT_BREAKER_RESET_MS: 30_000, // 서킷 차단 시간 (30s)
  PROACTIVE_REFRESH_BEFORE_MS: 2 * 60 * 1000,   // 만료 2분 전 갱신
  ACCESS_TOKEN_TTL_MS: 15 * 60 * 1000,           // 15분 (서버 설정과 동일)
} as const;

// 상태 변수
let isRefreshing = false;
let failedQueue: Array<{ resolve; reject; timer }> = [];
let consecutiveFailures = 0;
let circuitOpenUntil = 0;

// 서킷 브레이커: 연속 3회 실패 시 30초간 갱신 시도 차단
function isCircuitOpen(): boolean {
  if (consecutiveFailures < REFRESH_CONFIG.CIRCUIT_BREAKER_THRESHOLD) return false;
  return Date.now() < circuitOpenUntil;
}

// 큐 처리: 성공 시 50ms 간격으로 시차 재시도
function processQueue(error: unknown) {
  failedQueue.forEach((entry, index) => {
    clearTimeout(entry.timer);
    if (error) entry.reject(error);
    else setTimeout(() => entry.resolve(), index * REFRESH_CONFIG.STAGGER_BASE_MS);
  });
  failedQueue = [];
}
```

**핵심 보호 메커니즘**:
- **큐 크기 제한 (50개)**: 초과 요청은 즉시 거부
- **큐 타임아웃 (10s)**: 대기 시간 초과 시 자동 거부
- **갱신 타임아웃 (5s)**: `/auth/refresh` 요청에 타임아웃 적용
- **시차 재시도 (50ms)**: 갱신 성공 시 큐 요청을 50ms 간격으로 풀어서 서버 부하 방지
- **서킷 브레이커 (3회→30s)**: 연속 3회 갱신 실패 시 30초간 갱신 시도 자체를 차단

### 프로액티브 토큰 갱신 (`lib/api/client.ts`)

accessToken 만료(15분) 2분 전에 미리 갱신하여 401 자체를 예방합니다:

```typescript
// 타이머 스케줄: 로그인/갱신 성공 → 13분 후 자동 갱신
export function scheduleProactiveRefresh() { ... }
export function cancelProactiveRefresh() { ... }
async function performProactiveRefresh() { ... }
```

**트리거 지점** (응답 인터셉터):
- **로그인 성공** (`/auth/login`): 항상 타이머 재시작
- **갱신 성공** (`/auth/refresh`): 항상 타이머 재시작 (새 토큰 기준)
- **세션 복원** (`/auth/me`): 타이머가 없을 때만 1회 시작 (새로고침 시)

**정리 지점**:
- `clearAuthState()`: 갱신 실패 → 로그아웃 시 타이머 취소
- `useAuth().logout()`: 사용자 명시적 로그아웃 시 타이머 취소

**동시성 안전**:
- `isRefreshing` 플래그를 reactive 경로와 공유
- 프로액티브 갱신 중 401 발생 → 큐에 추가 → 성공 시 `processQueue(null)`로 처리
- 프로액티브 실패 → `drainQueue(err)` → 다음 401에서 reactive 경로 재시도
- 프로액티브 실패 시 `clearAuthState()` 미호출 (치명적이지 않음)

### 429 Rate Limit 재시도 (`lib/api/client.ts`)

서버가 429 (Too Many Requests)를 반환하면 Axios 인터셉터에서 자동 재시도합니다:

```typescript
const MAX_RATE_LIMIT_RETRIES = 3;
const RETRYABLE_METHODS = new Set(['get', 'head']);
```

**재시도 정책**:
- **대상 메서드**: GET/HEAD만 (POST/PUT/PATCH/DELETE는 중복 변경 리스크로 재시도하지 않음)
- **최대 재시도**: 3회
- **지연 전략**: `Retry-After` 헤더 우선 → 없으면 exponential backoff (1s → 2s → 4s, 최대 8s)
- **Retry-After 파싱**: 초 단위 숫자 + HTTP-date 형식 모두 지원
- **TanStack Query 연동**: Query에서는 4xx를 재시도하지 않으므로 Axios 최대 3회 × Query 1회 = 최대 4회로 제한

```typescript
// lib/api/error.ts에 429 메시지 추가
429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
```

### 토큰 갱신 실패 시 로그아웃 (`lib/api/client.ts`)

토큰 갱신 실패 시 Zustand 상태 초기화 + TanStack Query 전체 캐시 클리어:

```typescript
function clearAuthState() {
  cancelProactiveRefresh();
  useAuthStore.getState().clearUser();
  if (typeof window !== 'undefined') {
    getQueryClient().clear();
  }
}
```

> **참고**: `clear()`는 동기 함수로 모든 쿼리 캐시를 즉시 제거합니다. auth 쿼리만 삭제하면 이전 사용자의 데이터가 캐시에 남아 보안 위험이 있으므로 전체 클리어합니다.

### useAuthQuery 훅 (`hooks/useAuthQuery.ts`)

TanStack Query 기반 인증 상태 조회:

```typescript
export function useAuthQuery(enabled: boolean = true) {
  return useQuery<AuthUser>({
    queryKey: authKeys.me(),
    queryFn: () => authApi.getMe(),
    enabled,
    staleTime: 5 * 60 * 1000,  // 5분
    gcTime: 30 * 60 * 1000,    // 30분
    retry: false,
  });
}
```

### useAuth 훅 (`hooks/useAuth.ts`)

`useAuthQuery` 결과를 Zustand에 동기화하고, 로그인/로그아웃 기능 제공:

```typescript
export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading } =
    useAuthStore();

  // 로그인 페이지에서는 /auth/me 호출 차단
  const isLoginPage = pathname.startsWith('/login');
  const authQuery = useAuthQuery(!isLoginPage);

  // TanStack Query 결과를 Zustand에 동기화
  useEffect(() => {
    if (isLoginPage) { setLoading(false); return; }
    if (authQuery.isSuccess && authQuery.data) setUser(authQuery.data);
    else if (authQuery.isError) {
      if (authQuery.error instanceof AxiosError && authQuery.error.response?.status === 401)
        clearUser();
      else setLoading(false); // 네트워크 에러 시 기존 상태 유지
    }
  }, [isLoginPage, authQuery.isSuccess, authQuery.isError, ...]);

  return { user, isAuthenticated, isLoading, login, logout, checkAuth };
}
```

**이전 대비 변경점**:
- 수동 `checkAuth()` → `useAuthQuery`가 마운트 시 자동 호출
- 로그인 성공 시 `queryClient.setQueryData(authKeys.me(), response.user)`로 캐시에 직접 설정
- 로그아웃 시 `await queryClient.cancelQueries()` + `queryClient.clear()`로 in-flight 요청 취소 후 전체 캐시 클리어

---

## 4. 라우트 보호 (`middleware.ts`)

### 접근 제어 규칙

| 상황 | 동작 |
|------|------|
| 미인증 사용자 → 보호된 경로 | `/login/[role]?redirect=...`로 리다이렉트 |
| 역할 불일치 | 해당 역할의 대시보드로 리다이렉트 |
| 인증된 사용자 → 로그인 페이지 | 역할별 대시보드로 리다이렉트 |

### 역할별 접근 가능 경로

| 경로 | 접근 가능 역할 |
|------|---------------|
| `/admin/*` | admin |
| `/company/*` | company |
| `/employee/*` | employee |
| `/login/*` | 모두 (미인증) |
| `/inquiry` | 모두 |
| `/` | 모두 |

---

## 5. 토큰 저장 전략

| 저장 위치 | 내용 | 관리 주체 |
|-----------|------|-----------|
| HttpOnly Cookie | accessToken, refreshToken | 서버 |
| 일반 Cookie | auth-status, user-role | 서버 (middleware.ts 읽기용) |
| Zustand (메모리 + persist) | 사용자 프로필 정보 (UI 표시용) | 클라이언트 |
| localStorage | isAuthenticated + user (프로필 정보) | 클라이언트 |

> **참고**: localStorage에 저장되는 user 정보는 프로필 데이터(이름, 역할, ID)이며 자격증명이 아닙니다. 토큰은 HttpOnly 쿠키로 JS에서 접근 불가합니다. 영속화를 통해 새로고침 시 인증 로딩 단계를 제거합니다.

### 서버에서 설정해야 할 Cookie

| Cookie | HttpOnly | Secure | SameSite | Path | Max-Age | 설명 |
|--------|----------|--------|----------|------|---------|------|
| accessToken | Yes | Yes(prod) | None(prod) / Lax(dev) | / | 900 (15분) | JWT Access Token |
| refreshToken | Yes | Yes(prod) | None(prod) / Lax(dev) | / | 604800 (7일) | JWT Refresh Token |
| auth-status | No | Yes(prod) | None(prod) / Lax(dev) | / | 604800 (7일) | 인증 상태 플래그 |
| user-role | No | Yes(prod) | None(prod) / Lax(dev) | / | 604800 (7일) | 사용자 역할 |

---

## 6. 구현된 UX 기능

### 로그인 페이지 공통

- **엔터키 제출**: 입력 필드에서 Enter 키로 로그인 가능
- **자동 탭 이동**: 관리자 로그인에서 이메일 입력 후 비밀번호 필드로 자동 포커스
- **로딩 상태**: 로그인 중 버튼 비활성화 및 스피너 표시
- **에러 메시지**: 로그인 실패 시 명확한 에러 메시지 표시

### 대시보드 공통

- **스켈레톤 UI**: 첫 방문(localStorage 없는 경우)에만 레이아웃 스켈레톤 표시, 일반 새로고침은 persist에서 즉시 복원하여 인증 로딩 없음
- **사용자 정보 표시**: 로그인된 사용자 이름 표시
- **로그아웃**: 서버 API 호출 후 클라이언트 상태 정리

### 관리자 계정 설정

- **진입 방식**: 관리자 레이아웃 헤더 우측 `계정 설정` 버튼 → `/admin/settings`
- **비밀번호 변경 폼**: 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인
- **관리자 계정 추가 폼**: 이메일, 이름, 초기 비밀번호, 초기 비밀번호 확인
- **관리자 계정 리스트 섹션**: 이름, 이메일, 생성일시 표시 (읽기 전용)
- **리스트 상태 처리**:
  - 조회 로딩 시 "불러오는 중..." 표시
  - 조회 실패 시 에러 메시지 + 재시도 버튼 표시
  - 데이터가 없으면 빈 상태 메시지 표시
- **클라이언트 검증**:
  - 모든 필드 필수
  - 새 비밀번호 최소 8자
  - 새 비밀번호와 확인 일치
  - 새 비밀번호는 현재 비밀번호와 달라야 함
- **관리자 계정 추가 검증**:
  - 모든 필드 필수
  - 이메일 형식 검증
  - 초기 비밀번호 최소 8자
  - 초기 비밀번호와 확인 일치
- **API 호출**: `PATCH /auth/password`
- **API 호출**: `POST /admin/accounts`
- **API 호출**: `GET /admin/accounts`
- **성공 동작**: 서버가 인증 쿠키 정리 → 클라이언트 인증 상태 정리 후 `/login/admin`으로 이동 (재로그인 강제)
- **계정 생성 성공 동작**: 성공 토스트 표시 + 관리자 계정 추가 폼 초기화 + 관리자 계정 리스트 갱신

---

## 7. 검증 체크리스트

### 기능 검증

- [x] 관리자 로그인 (이메일 + 비밀번호)
- [x] 관리자 비밀번호 변경 (계정 설정 페이지)
- [x] 관리자 계정 추가 (계정 설정 페이지)
- [x] 관리자 계정 목록 조회 (계정 설정 페이지)
- [x] 기업 로그인 (고유번호)
- [x] 직원 로그인 (고유번호)
- [x] 로그아웃
- [x] 토큰 자동 갱신 (401 → refresh → 재시도)
- [x] 프로액티브 토큰 갱신 (만료 2분 전 자동 갱신)
- [x] 갱신 실패 시 로그아웃

### 라우트 보호 검증

- [x] 미인증 사용자 → 로그인 페이지 리다이렉트
- [x] admin만 /admin/* 접근 가능
- [x] company만 /company/* 접근 가능
- [x] employee만 /employee/* 접근 가능
- [x] 잘못된 역할로 접근 시 리다이렉트

### 에러 처리 검증

- [x] 잘못된 자격 증명 에러 메시지 표시
- [x] 네트워크 오류 처리
- [x] 로딩 상태 표시

### 보안 검증

- [x] 토큰이 localStorage/sessionStorage에 저장되지 않음 (HttpOnly Cookie)
- [x] localStorage에는 프로필 정보만 저장 (자격증명 미포함, 새로고침 UX 개선용)
- [x] 로그인 에러 메시지 통일 (사용자/코드 존재 여부 식별 방지)
- [x] Cookie에 HttpOnly 플래그 설정됨
- [x] HTTPS에서만 Cookie 전송됨

---

## 8. 완료된 항목

| 항목 | 상태 | 비고 |
|------|------|------|
| HttpOnly Cookie 설정 | 완료 | 백엔드에서 설정 |
| Secure 플래그 설정 | 완료 | 백엔드에서 설정 |
| 토큰 갱신 API | 완료 | 백엔드에서 구현 |

---

## 참고 문서

- [인증 개요](./README.md) - 인증 시스템 개요
- ~~[API 설계 - 인증](../api/auth.md)~~ (미작성) - 인증 API 명세
- ~~[서버 인증 구현](./backend.md)~~ (미작성) - NestJS 서버 인증 구현 가이드
- [요구사항](../requirements.md) - 인증 방식 정의
- [타입 정의](../../../types/auth.ts) - 인증 관련 TypeScript 타입
