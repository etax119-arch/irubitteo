# 인증 API

> 공통 규칙은 [API README](./README.md) 참조

## 토큰 정책

- **Access Token**: 유효기간 15분, HttpOnly Cookie
- **Refresh Token**: 유효기간 7일, HttpOnly Cookie
- **저장 위치**: HttpOnly Cookie (서버에서 Set-Cookie 헤더로 설정)
- **갱신 방식**: Cookie 자동 전송, 서버에서 검증 후 새 Cookie 발급

### Cookie 설정

| Cookie | HttpOnly | Secure | SameSite | Path | Max-Age |
|--------|----------|--------|----------|------|---------|
| accessToken | Yes | Yes | Strict/Lax | / | 900 (15분) |
| refreshToken | Yes | Yes | Strict/Lax | /v1/auth | 604800 (7일) |
| auth-status | No | Yes | Strict/Lax | / | 604800 (7일) |
| user-role | No | Yes | Strict/Lax | / | 604800 (7일) |

**참고**: `auth-status`와 `user-role`은 클라이언트(middleware.ts)에서 라우트 보호를 위해 읽을 수 있도록 HttpOnly가 아닙니다.

---

## POST /v1/auth/login

로그인

**Request (관리자)**
```json
{
  "role": "admin",
  "email": "admin@durubitteo.com",
  "password": "string"
}
```

**Request (기업/직원)**
```json
{
  "role": "company | employee",
  "code": "ABC123"  // 기업: 고유번호, 직원: 생년월일4자리+전화번호뒤4자리
}
```

**Response**
- **Set-Cookie**: `accessToken` (HttpOnly), `refreshToken` (HttpOnly), `auth-status`, `user-role`

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "role": "employee | company | admin",
    "name": "홍길동"
  }
}
```

**참고**: `accessToken`, `refreshToken`은 응답 body가 아닌 Set-Cookie 헤더로 전달됩니다.

---

## POST /v1/auth/refresh

토큰 갱신

**Request**
- Body 없음 (refreshToken은 Cookie로 자동 전송)

**Response (성공)**
- **Set-Cookie**: 새 `accessToken`, `refreshToken` Cookie 설정

```json
{
  "success": true
}
```

**Response (실패)**
```json
{
  "success": false,
  "message": "No refresh token provided | Invalid refresh token"
}
```

---

## POST /v1/auth/logout

로그아웃

**Request**
- Body 없음

**Response**
- **Set-Cookie**: 모든 인증 관련 Cookie 삭제

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## GET /v1/auth/me

현재 인증된 사용자 정보 조회

**Response (직원)**
```json
{
  "id": "uuid",
  "role": "employee",
  "name": "홍길동",
  "code": "ABC-001",
  "companyId": "uuid",
  "companyName": "테스트 기업"
}
```

**Response (기업)**
```json
{
  "id": "uuid",
  "role": "company",
  "name": "테스트 기업",
  "code": "ABC"
}
```

**Response (관리자)**
```json
{
  "id": "uuid",
  "role": "admin",
  "name": "관리자명",
  "email": "admin@durubitteo.com"
}
```

---

## 관련 문서

- [인증 시스템](../auth/README.md) - 인증 흐름 및 구현 가이드
