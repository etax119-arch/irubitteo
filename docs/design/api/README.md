# API 설계

## 개요

- **Base URL**: `https://api.durubitteo.com/v1`
- **인증**: Bearer Token (JWT)
- **Content-Type**: `application/json`

---

## API 문서 목록

| 문서 | 설명 |
|------|------|
| [인증 API](auth.md) | 로그인, 로그아웃, 토큰 갱신, 사용자 정보 조회 |
| [기업 API](companies.md) | 기업 CRUD, 첨부파일 관리 |
| [직원 API](employees.md) | 직원 CRUD, 첨부파일 관리 |
| [출퇴근 API](attendance.md) | 출퇴근 기록, 조회, 수정 |
| [관리자 API](admin.md) | 플랫폼 통계, 전체 직원/출퇴근 관리, 감사 로그 |
| [기타 API](misc.md) | 공지사항, 근무일정, 문의, 템플릿 |

---

## 필드명 변환 규칙

DB는 snake_case, API는 camelCase를 사용합니다. 주요 필드 예시:

| DB (snake_case) | API (camelCase) |
|-----------------|-----------------|
| unique_code | uniqueCode |
| work_days | workDays |
| work_start_time | workStartTime |
| work_end_time | workEndTime |
| work_content | workContent |
| clock_in | clockIn |
| clock_out | clockOut |
| is_late | isLate |
| is_early_leave | isEarlyLeave |
| is_active | isActive |
| created_at | createdAt |
| updated_at | updatedAt |

---

## 공통 응답 형식

### 목록 조회 응답

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 에러 응답 형식

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "유효하지 않은 요청입니다.",
  "details": {
    "field": "email",
    "reason": "이미 사용 중인 이메일입니다."
  }
}
```

### 주요 에러 코드

| 코드 | 설명 |
|------|------|
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 409 | 충돌 (중복 등) |
| 500 | 서버 오류 |

---

## 관련 문서

- [인증 시스템](../auth/README.md) - 인증 흐름 및 구현 가이드
- [DB 스키마](../database-schema.md) - 테이블 구조
