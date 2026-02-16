# 인증 시스템

이루빛터 플랫폼의 인증 시스템 문서입니다.

## 개요

### 역할별 로그인 방식

| 역할 | 식별자 | 비밀번호 | 예시 |
|------|--------|----------|------|
| 관리자 (admin) | 이메일 | 필요 | admin@durubitteo.com |
| 기업 (company) | 고유번호 | 불필요 | ABC123 |
| 직원 (employee) | 생년월일4자리+전화번호뒤4자리 | 불필요 | 99011234 |

### 토큰 정책

- **Access Token**: 유효기간 15분 (900s), HttpOnly Cookie
- **Refresh Token**: 유효기간 7일, HttpOnly Cookie
- **저장 위치**: HttpOnly Cookie (서버에서 Set-Cookie 헤더로 설정)
- **갱신 방식**: Cookie 자동 전송, 서버에서 검증 후 새 Cookie 발급

### Cookie 설정

| Cookie | HttpOnly | Secure | SameSite | Path | Max-Age |
|--------|----------|--------|----------|------|---------|
| accessToken | Yes | Yes(prod) | None(prod) / Lax(dev) | / | 900 (15분) |
| refreshToken | Yes | Yes(prod) | None(prod) / Lax(dev) | / | 604800 (7일) |
| auth-status | No | Yes(prod) | None(prod) / Lax(dev) | / | 604800 (7일) |
| user-role | No | Yes(prod) | None(prod) / Lax(dev) | / | 604800 (7일) |

**참고**: `auth-status`와 `user-role`은 클라이언트(middleware.ts)에서 라우트 보호를 위해 읽을 수 있도록 HttpOnly가 아닙니다.

> **Note**: 위 토큰 수명/경로 값은 `frontend.md` 기준입니다. 서버 구현 시 실제 값을 확인하세요.

---

## 상세 문서

| 문서 | 설명 |
|------|------|
| [프론트엔드 구현](frontend.md) | Next.js 클라이언트 인증 구현 가이드 |
| ~~[백엔드 구현](backend.md)~~ (미작성) | NestJS 서버 인증 구현 가이드 |

---

## 관련 문서

- [요구사항](../requirements.md) - 인증 방식 정의 (3. 인증 방식 섹션)
- ~~[API 설계 - 인증](../api/auth.md)~~ (미작성) - 인증 API 명세
