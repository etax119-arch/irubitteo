# 프론트엔드 인증 시스템 구현 가이드

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

## 2. 구현 구조

### 폴더 구조

```
durubitteo_web/
├── lib/
│   ├── api/
│   │   ├── client.ts         # axios 인스턴스, 인터셉터
│   │   └── auth.ts           # 인증 API 함수
│   │
│   └── auth/
│       └── store.ts          # Zustand 스토어 (UI 표시용)
│
├── hooks/
│   └── useAuth.ts            # 인증 훅 (로그인, 로그아웃, 상태)
│
├── middleware.ts             # Next.js 라우트 보호
│
├── app/
│   └── login/
│       ├── admin/page.tsx    # 관리자 로그인 (이메일 + 비밀번호)
│       ├── company/page.tsx  # 기업 로그인 (고유번호)
│       └── employee/page.tsx # 직원 로그인 (고유번호)
│
└── types/
    └── auth.ts               # 인증 관련 타입 (기존)
```

### 파일별 역할

| 파일 | 역할 |
|------|------|
| `lib/api/client.ts` | axios 인스턴스 생성, 요청/응답 인터셉터, 토큰 갱신 로직 |
| `lib/api/auth.ts` | 로그인, 로그아웃, 토큰 갱신, 사용자 정보 조회 API 함수 |
| `lib/auth/store.ts` | Zustand로 UI 표시용 사용자 상태 관리 |
| `hooks/useAuth.ts` | 컴포넌트에서 사용할 인증 훅 (스토어 + API 연결) |
| `middleware.ts` | 보호된 라우트 접근 제어 |

---

## 3. API 클라이언트

### axios 인스턴스 설정

```typescript
// lib/api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.durubitteo.com/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // Cookie 자동 전송
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 응답 인터셉터 (토큰 갱신)

```typescript
// lib/api/client.ts (계속)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 재시도하지 않은 요청인 경우
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
        // 스토어 초기화 및 로그인 페이지로 리다이렉트
        window.location.href = '/';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 4. 인증 상태 관리

### Zustand 선택 이유

| 기준 | Context API | Zustand |
|------|-------------|---------|
| 보일러플레이트 | 많음 (Provider, Reducer) | 적음 |
| 리렌더링 최적화 | 수동 (useMemo, useCallback) | 자동 (selector) |
| 서버 컴포넌트 호환 | Provider 필요 | Provider 불필요 |
| 번들 크기 | 0 (내장) | ~2KB (가벼움) |
| 개발자 도구 | 없음 | devtools 미들웨어 |

**결론**: Zustand 사용 - 간결한 코드, 자동 최적화, 서버 컴포넌트 친화적

### AuthStore 구조

```typescript
// lib/auth/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

---

## 5. 토큰 관리 (서버 세션 기반)

### 토큰 저장 전략

| 저장 위치 | 내용 | 관리 주체 |
|-----------|------|-----------|
| HttpOnly Cookie | accessToken, refreshToken | 서버 |
| 일반 Cookie | auth-status, user-role | 서버 (middleware.ts에서 읽기용) |
| Zustand (메모리) | 사용자 정보 (UI 표시용) | 클라이언트 |

### 서버 요구사항

로그인 성공 시 서버에서 설정해야 할 Cookie:

| Cookie | HttpOnly | Secure | SameSite | Path | Max-Age | 설명 |
|--------|----------|--------|----------|------|---------|------|
| accessToken | Yes | Yes | Strict | / | 3600 | JWT Access Token |
| refreshToken | Yes | Yes | Strict | /auth | 604800 | JWT Refresh Token |
| auth-status | No | Yes | Strict | / | 3600 | 인증 상태 플래그 ("authenticated") |
| user-role | No | Yes | Strict | / | 3600 | 사용자 역할 ("admin" / "company" / "employee") |

**서버 응답 예시** (Set-Cookie 헤더):
```
Set-Cookie: accessToken=eyJ...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600
Set-Cookie: refreshToken=eyJ...; HttpOnly; Secure; SameSite=Strict; Path=/auth; Max-Age=604800
Set-Cookie: auth-status=authenticated; Secure; SameSite=Strict; Path=/; Max-Age=3600
Set-Cookie: user-role=admin; Secure; SameSite=Strict; Path=/; Max-Age=3600
```

### 보안 고려사항

1. **HttpOnly Cookie**: XSS 공격으로부터 토큰 보호 (accessToken, refreshToken)
2. **withCredentials: true**: Cookie 자동 전송
3. **CSRF 보호**: SameSite=Strict로 크로스 사이트 요청 차단
4. **클라이언트 저장소에 토큰 저장 금지**: localStorage, sessionStorage 사용 X
5. **Zustand persist 사용 시 주의**: user 정보만 저장, 민감 정보(토큰) 제외

### 토큰 갱신 시나리오

```
1. API 요청 → 401 응답
2. POST /auth/refresh 호출 (Cookie 자동 전송)
3. 서버: refreshToken 검증 → 새 accessToken 발급 → Cookie 갱신
4. 클라이언트: 원래 요청 재시도
5. 갱신 실패 시: 로그아웃 처리 → 로그인 페이지로 이동
```

---

## 6. 라우트 보호

### middleware.ts 구현

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 보호된 경로 정의
const protectedRoutes = {
  '/admin': ['admin'],
  '/company': ['company'],
  '/employee': ['employee'],
};

// 공개 경로
const publicRoutes = ['/', '/login', '/inquiry'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 경로는 통과
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // 정적 파일, API 경로 등은 통과
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Cookie에서 인증 상태 확인 (서버에서 설정한 별도 플래그 쿠키 활용)
  const authCookie = request.cookies.get('auth-status');

  if (!authCookie) {
    // 미인증: 로그인 페이지로 리다이렉트
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 역할 기반 접근 제어
  const userRole = request.cookies.get('user-role')?.value;

  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        // 권한 없음: 메인 페이지로 리다이렉트
        return NextResponse.redirect(new URL('/', request.url));
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 역할별 접근 제어

| 경로 | 접근 가능 역할 |
|------|---------------|
| `/admin/*` | admin |
| `/company/*` | company |
| `/employee/*` | employee |
| `/login/*` | 모두 (미인증) |
| `/inquiry` | 모두 |
| `/` | 모두 |

---

## 7. 로그인 페이지 연동

### 인증 API 함수

```typescript
// lib/api/auth.ts
import { apiClient } from './client';
import type { AuthUser, LoginResponse } from '@/types/auth';

type LoginType = 'admin' | 'company' | 'employee';

interface LoginParams {
  type: LoginType;
  identifier: string;  // admin: 이메일, company/employee: 고유번호
  password?: string;   // admin만 필요
}

export const authApi = {
  login: async (params: LoginParams): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', params);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refresh: async (): Promise<void> => {
    await apiClient.post('/auth/refresh');
  },

  getMe: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get<AuthUser>('/auth/me');
    return data;
  },
};
```

### useAuth 훅

```typescript
// hooks/useAuth.ts
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';
import { authApi } from '@/lib/api/auth';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading } = useAuthStore();

  const login = useCallback(async (
    type: 'admin' | 'company' | 'employee',
    identifier: string,
    password?: string
  ) => {
    setLoading(true);
    try {
      const response = await authApi.login({ type, identifier, password });
      setUser(response.user);

      // 역할별 리다이렉트
      const redirectMap = {
        admin: '/admin',
        company: '/company',
        employee: '/employee',
      };
      router.push(redirectMap[response.user.role]);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [router, setUser, setLoading]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearUser();
      router.push('/');
    }
  }, [router, clearUser]);

  const checkAuth = useCallback(async () => {
    try {
      const user = await authApi.getMe();
      setUser(user);
    } catch {
      clearUser();
    }
  }, [setUser, clearUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };
}
```

### 로그인 페이지 수정 예시 (관리자)

```typescript
// app/login/admin/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
// ... 기존 import

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setLoginError('');

    try {
      await login('admin', email, password);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... 나머지 코드
}
```

### 에러 처리

| 상황 | 에러 메시지 |
|------|-------------|
| 잘못된 이메일/비밀번호 (admin) | "이메일 또는 비밀번호가 올바르지 않습니다." |
| 존재하지 않는 고유번호 | "등록되지 않은 고유번호입니다." |
| 비활성화된 계정 | "비활성화된 계정입니다. 관리자에게 문의하세요." |
| 네트워크 오류 | "네트워크 오류가 발생했습니다. 다시 시도해주세요." |

---

## 8. 검증 체크리스트

### 기능 검증

- [ ] 관리자 로그인 (이메일 + 비밀번호)
- [ ] 기업 로그인 (고유번호)
- [ ] 직원 로그인 (고유번호)
- [ ] 로그아웃
- [ ] 토큰 자동 갱신 (401 → refresh → 재시도)
- [ ] 갱신 실패 시 로그아웃

### 라우트 보호 검증

- [ ] 미인증 사용자 → 로그인 페이지 리다이렉트
- [ ] admin만 /admin/* 접근 가능
- [ ] company만 /company/* 접근 가능
- [ ] employee만 /employee/* 접근 가능
- [ ] 잘못된 역할로 접근 시 리다이렉트

### 에러 처리 검증

- [ ] 잘못된 자격 증명 에러 메시지 표시
- [ ] 네트워크 오류 처리
- [ ] 로딩 상태 표시

### 보안 검증

- [ ] 토큰이 localStorage/sessionStorage에 저장되지 않음
- [ ] Cookie에 HttpOnly 플래그 설정됨 (서버 확인)
- [ ] HTTPS에서만 Cookie 전송됨 (Secure 플래그)

---

## 참고 문서

- [API 설계](./api-design.md) - 인증 API 명세
- [서버 인증 구현](./auth-server-implementation.md) - NestJS 서버 인증 구현 가이드
- [요구사항](./requirements.md) - 인증 방식 정의
- [타입 정의](../../types/auth.ts) - 인증 관련 TypeScript 타입
