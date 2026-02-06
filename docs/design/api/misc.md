# 기타 API

> 공통 규칙은 [API README](./README.md) 참조

공지사항, 근무일정, 문의, 템플릿 관련 API입니다.

---

## 공지사항 API

### POST /notices

공지사항 발송 (기업 전용)

**Request**
```json
{
  "content": "내일 오전 안전교육이 진행됩니다.",
  "senderName": "관리자",
  "recipientIds": ["uuid1", "uuid2"]
}
```

**Response**
```json
{
  "id": "uuid",
  "content": "내일 오전 안전교육이 진행됩니다.",
  "senderName": "관리자",
  "recipientCount": 2,
  "createdAt": "2024-01-15T14:30:00Z"
}
```

### GET /notices

공지사항 목록 조회 (기업: 본인 발송분)

**Query Parameters**
- `page`, `limit`: 페이지네이션

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "content": "내일 오전 안전교육이 진행됩니다.",
      "senderName": "관리자",
      "recipients": [
        { "id": "uuid", "name": "홍길동", "readAt": null }
      ],
      "createdAt": "2024-01-15T14:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

### GET /notices/:id

공지사항 상세 조회 (기업: 본인 발송분, 직원: 본인 수신)

**Response**
```json
{
  "id": "uuid",
  "content": "공지 내용입니다.",
  "senderName": "관리자",
  "recipients": [
    { "id": "uuid", "name": "홍길동", "readAt": "2024-01-15T10:00:00Z" }
  ],
  "createdAt": "2024-01-15T09:00:00Z"
}
```

### PUT /notices/:id/read

공지사항 읽음 처리 (직원 전용)

**Request**
(Body 없음 - JWT에서 직원 정보 추출)

**Response**
```json
{
  "id": "uuid",
  "readAt": "2024-01-15T10:00:00Z"
}
```

### GET /notices/employee

직원 공지 목록 (직원 전용)

**Query Parameters**
(없음 - 페이지네이션 미지원, 최근 7일치만 반환)

**Response**
```json
{
  "today": [
    {
      "id": "uuid",
      "content": "금일 긴급 공지입니다.",
      "senderName": "관리자",
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ],
  "past": [...]
}
```

**참고**: 공지사항 삭제 API는 제공하지 않습니다. 발송된 공지는 영구 보관됩니다.

---

## 근무일정 API

### POST /schedules

근무일정 등록 (기업 전용)

**Request**
```json
{
  "date": "2024-01-15",
  "content": "오늘은 제품 포장 작업과 부품 조립 작업을 진행할 예정입니다."
}
```

**Response**
```json
{
  "id": "uuid",
  "date": "2024-01-15",
  "content": "오늘은 제품 포장 작업과 부품 조립 작업을 진행할 예정입니다.",
  "createdAt": "2024-01-10T00:00:00Z",
  "updatedAt": "2024-01-10T00:00:00Z"
}
```

### GET /schedules

근무일정 목록 조회 (기업 또는 직원 - 소속 기업 일정)

**참고**: 기업/직원이 호출 시 JWT의 company_id 기반으로 자동 필터링됩니다.

**Query Parameters**
- `year`: 연도
- `month`: 월

**Response**
```json
{
  "year": 2024,
  "month": 1,
  "schedules": [
    {
      "id": "uuid",
      "date": "2024-01-15",
      "content": "제품 포장 작업",
      "createdAt": "2024-01-10T00:00:00Z",
      "updatedAt": "2024-01-10T00:00:00Z"
    }
  ]
}
```

### GET /schedules/today

오늘의 근무일정 (직원 전용)

**Query Parameters**
(없음 - JWT 기반 자동 필터링)

**Response**
```json
{
  "id": "uuid",
  "date": "2024-01-15",
  "content": "오늘은 제품 포장 작업과 부품 조립 작업을 진행할 예정입니다.",
  "createdAt": "2024-01-10T00:00:00Z",
  "updatedAt": "2024-01-10T00:00:00Z"
}
```

### PUT /schedules/:id

근무일정 수정 (기업 전용)

**Request**
```json
{
  "content": "수정된 작업 내용입니다."
}
```

**Response**
```json
{
  "id": "uuid",
  "date": "2024-01-15",
  "content": "수정된 작업 내용입니다.",
  "createdAt": "2024-01-10T00:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### DELETE /schedules/:id

근무일정 삭제 (기업 전용)

**Response**
```json
{
  "message": "근무일정이 삭제되었습니다."
}
```

---

## 문의 API

### POST /inquiries

기업 문의 등록 (비인증, 랜딩페이지용)

**Request**
```json
{
  "companyName": "새로운 기업",
  "representativeName": "김대표",
  "phone": "010-1234-5678",
  "email": "contact@newcompany.com",
  "content": "서비스 도입을 문의드립니다."
}
```

**Response**
```json
{
  "id": "uuid",
  "companyName": "새로운 기업",
  "representativeName": "김대표",
  "status": "pending",
  "createdAt": "2024-01-15T10:00:00Z",
  "completedAt": null
}
```

### GET /inquiries

문의 목록 조회 (관리자 전용)

**Query Parameters**
- `status`: pending, completed
- `page`, `limit`: 페이지네이션

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "companyName": "새로운 기업",
      "representativeName": "김대표",
      "phone": "010-1234-5678",
      "email": "contact@newcompany.com",
      "content": "서비스 도입을 문의드립니다.",
      "status": "pending",
      "createdAt": "2024-01-15T10:00:00Z",
      "completedAt": null
    }
  ],
  "pagination": { ... }
}
```

### GET /inquiries/:id

문의 상세 조회 (관리자 전용)

**Response**
```json
{
  "id": "uuid",
  "companyName": "새로운 기업",
  "representativeName": "김대표",
  "phone": "010-1234-5678",
  "email": "contact@newcompany.com",
  "content": "서비스 도입을 문의드립니다.",
  "status": "pending",
  "createdAt": "2024-01-15T10:00:00Z",
  "completedAt": null
}
```

### PUT /inquiries/:id/complete

문의 처리 완료 (관리자 전용)

**Request**
(Body 없음 - 처리 완료만 수행)

**Response**
```json
{
  "id": "uuid",
  "companyName": "새로운 기업",
  "representativeName": "김대표",
  "phone": "010-1234-5678",
  "email": "contact@newcompany.com",
  "content": "서비스 도입을 문의드립니다.",
  "status": "completed",
  "createdAt": "2024-01-15T10:00:00Z",
  "completedAt": "2024-01-15T15:00:00Z"
}
```

---

## 템플릿 API

### GET /templates

문서 템플릿 목록 조회 (인증된 사용자)

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "근로계약서",
      "description": "표준 근로계약서 양식",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "출근확인서",
      "description": "출근 확인 증명서 양식",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /templates/:id/download

템플릿 파일 다운로드 (인증된 사용자)

**Response**
- Content-Type: application/octet-stream
- Content-Disposition: attachment; filename="템플릿명.docx"

**참고**: 템플릿은 시스템에서 사전 등록되며, API를 통한 생성/수정/삭제는 지원하지 않습니다.
