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
│   └── useAuth.ts            # 인증 훅 (로그인, 로그아웃, checkAuth 자동 호출)
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
| `hooks/useAuth.ts` | 컴포넌트용 인증 훅 (마운트 시 checkAuth 자동 호출) |
| `middleware.ts` | 쿠키 기반 역할별 라우트 접근 제어 |

---

## 3. 핵심 구현 상세

### 토큰 갱신 큐 시스템 (`lib/api/client.ts`)

동시 요청 시 토큰 갱신을 한 번만 수행하고, 대기 중인 요청들을 큐에서 처리:

```typescript
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 갱신 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post('/auth/refresh');
        processQueue();
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // CustomEvent로 로그아웃 트리거 (순환 참조 방지)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

### CustomEvent 로그아웃 메커니즘 (`lib/auth/store.ts`)

API 클라이언트에서 스토어를 직접 import하면 순환 참조가 발생합니다.
CustomEvent를 사용하여 이를 해결:

```typescript
// store.ts
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().clearUser();
  });
}
```

### useAuth 훅 (`hooks/useAuth.ts`)

컴포넌트 마운트 시 자동으로 인증 상태 확인 (로그인 페이지 제외):

```typescript
export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading } =
    useAuthStore();

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const user = await authApi.getMe();
      setUser(user);
    } catch {
      clearUser();
    } finally {
      setLoading(false);  // 로딩 상태 해제 보장
    }
  }, [setUser, clearUser, setLoading]);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    // 로그인 페이지에서는 인증 확인 스킵 (불필요한 401 에러 방지)
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/login')) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth, setLoading]);

  return { user, isAuthenticated, isLoading, login, logout, checkAuth };
}
```

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
| Zustand (메모리) | 사용자 정보 (UI 표시용) | 클라이언트 |
| localStorage | isAuthenticated만 저장 (user 정보 제외) | 클라이언트 |

> **보안 주의**: 사용자 정보(id, name, code 등)는 XSS 공격 방지를 위해 localStorage에 저장하지 않고 메모리에만 유지합니다.

### 서버에서 설정해야 할 Cookie

| Cookie | HttpOnly | Secure | SameSite | Path | Max-Age | 설명 |
|--------|----------|--------|----------|------|---------|------|
| accessToken | Yes | Yes | Strict | / | 900 (15분) | JWT Access Token |
| refreshToken | Yes | Yes | Strict | /v1/auth | 604800 (7일) | JWT Refresh Token |
| auth-status | No | Yes | Strict | / | 604800 (7일) | 인증 상태 플래그 |
| user-role | No | Yes | Strict | / | 604800 (7일) | 사용자 역할 |

---

## 6. 구현된 UX 기능

### 로그인 페이지 공통

- **엔터키 제출**: 입력 필드에서 Enter 키로 로그인 가능
- **자동 탭 이동**: 관리자 로그인에서 이메일 입력 후 비밀번호 필드로 자동 포커스
- **로딩 상태**: 로그인 중 버튼 비활성화 및 스피너 표시
- **에러 메시지**: 로그인 실패 시 명확한 에러 메시지 표시

### 대시보드 공통

- **로딩 스피너**: 인증 상태 확인 중 로딩 표시
- **사용자 정보 표시**: 로그인된 사용자 이름 표시
- **로그아웃**: 서버 API 호출 후 클라이언트 상태 정리

---

## 7. 검증 체크리스트

### 기능 검증

- [x] 관리자 로그인 (이메일 + 비밀번호)
- [x] 기업 로그인 (고유번호)
- [x] 직원 로그인 (고유번호)
- [x] 로그아웃
- [x] 토큰 자동 갱신 (401 → refresh → 재시도)
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

- [x] 토큰이 localStorage/sessionStorage에 저장되지 않음
- [x] 사용자 정보가 localStorage에 저장되지 않음 (메모리에만 유지)
- [x] 로그인 에러 메시지 통일 (사용자/코드 존재 여부 식별 방지)
- [ ] Cookie에 HttpOnly 플래그 설정됨 (서버 구현 필요)
- [ ] HTTPS에서만 Cookie 전송됨 (서버 구현 필요)

---

## 8. 미완료 항목

| 항목 | 상태 | 비고 |
|------|------|------|
| HttpOnly Cookie 설정 | 미완료 | 백엔드에서 설정 필요 |
| Secure 플래그 설정 | 미완료 | 백엔드에서 설정 필요 |
| 토큰 갱신 API | 미완료 | 백엔드에서 구현 필요 |

---

## 참고 문서

- [인증 개요](./README.md) - 인증 시스템 개요
- ~~[API 설계 - 인증](../api/auth.md)~~ (미작성) - 인증 API 명세
- ~~[서버 인증 구현](./backend.md)~~ (미작성) - NestJS 서버 인증 구현 가이드
- [요구사항](../requirements.md) - 인증 방식 정의
- [타입 정의](../../../types/auth.ts) - 인증 관련 TypeScript 타입
