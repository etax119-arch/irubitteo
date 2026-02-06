# 기업 API

> 공통 규칙은 [API README](./README.md) 참조

## GET /companies

기업 목록 조회 (관리자 전용)

**Query Parameters**
- `page`: 페이지 번호 (기본: 1)
- `limit`: 페이지당 개수 (기본: 20)
- `search`: 검색어 (기업명)
- `isActive`: 활성 상태 필터

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "ABC",
      "name": "테스트 기업",
      "email": "test@company.com",
      "phone": "02-1234-5678",
      "isActive": true,
      "employeeCount": 15,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## POST /companies

기업 등록 (관리자 전용)

**Request**
```json
{
  "code": "ABC",
  "name": "테스트 기업",
  "email": "test@company.com",
  "phone": "02-1234-5678",
  "address": "서울시 강남구...",
  "businessNumber": "123-45-67890",
  "contractStartDate": "2024-01-01",
  "contractEndDate": "2024-12-31",
  "hrContactName": "김담당",
  "hrContactPhone": "010-1111-2222",
  "hrContactEmail": "hr@company.com"
}
```

**Response**
```json
{
  "id": "uuid",
  "code": "ABC",
  "name": "테스트 기업",
  "email": "test@company.com",
  "phone": "02-1234-5678",
  "address": "서울시 강남구...",
  "businessNumber": "123-45-67890",
  "contractStartDate": "2024-01-01",
  "contractEndDate": "2024-12-31",
  "hrContactName": "김담당",
  "hrContactPhone": "010-1111-2222",
  "hrContactEmail": "hr@company.com",
  "isActive": true,
  "employeeCount": 0,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**참고**: `code`는 기업의 고유번호로, 관리자가 기업 등록 시 직접 지정합니다. 기업은 이 고유번호만으로 로그인합니다 (비밀번호 없음).

---

## GET /companies/:id

기업 상세 조회 (해당 기업 또는 관리자)

**Response**
```json
{
  "id": "uuid",
  "code": "ABC",
  "name": "테스트 기업",
  "email": "test@company.com",
  "phone": "02-1234-5678",
  "address": "서울시 강남구...",
  "businessNumber": "123-45-67890",
  "contractStartDate": "2024-01-01",
  "contractEndDate": "2024-12-31",
  "hrContactName": "김담당",
  "hrContactPhone": "010-1111-2222",
  "hrContactEmail": "hr@company.com",
  "isActive": true,
  "employeeCount": 15,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

## PUT /companies/:id

기업 정보 수정 (해당 기업 또는 관리자)

**Request**
```json
{
  "name": "테스트 기업 (수정)",
  "email": "updated@company.com",
  "phone": "02-9876-5432",
  "address": "서울시 서초구...",
  "businessNumber": "123-45-67890",
  "resignDate": "2024-01-15",
  "resignReason": "계약 해지"
}
```

**Response**
```json
{
  "id": "uuid",
  "code": "ABC",
  "name": "테스트 기업 (수정)",
  "email": "updated@company.com",
  "phone": "02-9876-5432",
  "address": "서울시 서초구...",
  "businessNumber": "123-45-67890",
  "contractStartDate": "2024-01-01",
  "contractEndDate": "2024-12-31",
  "hrContactName": "김담당",
  "hrContactPhone": "010-1111-2222",
  "hrContactEmail": "hr@company.com",
  "resignDate": "2024-01-15",
  "resignReason": "계약 해지",
  "isActive": false,
  "employeeCount": 15,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**참고**: `code`는 수정 불가. `contractStartDate`, `contractEndDate`, `hrContactName`, `hrContactPhone`, `hrContactEmail`은 수정 가능합니다. `resignDate`와 `resignReason`은 탈퇴 처리 시 함께 전송하며, 탈퇴 시 `isActive`는 자동으로 `false`로 변경됩니다.

---

## DELETE /companies/:id

기업 삭제 (비활성화, 관리자 전용)

**Response**
```json
{
  "id": "uuid",
  "isActive": false,
  "message": "기업이 비활성화되었습니다."
}
```

---

## POST /companies/:id/files

기업 첨부파일 업로드 (관리자 전용)

**Request** (multipart/form-data)
```
file: 업로드할 파일
```

**Response**
```json
{
  "id": "uuid",
  "fileName": "계약서.pdf",
  "filePath": "companies/abc/계약서.pdf",
  "fileSize": 102400,
  "mimeType": "application/pdf",
  "createdAt": "2024-01-15T09:00:00Z"
}
```

---

## GET /companies/:id/files

기업 첨부파일 목록 조회 (관리자 또는 해당 기업)

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "fileName": "계약서.pdf",
      "filePath": "companies/abc/계약서.pdf",
      "fileSize": 102400,
      "mimeType": "application/pdf",
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ]
}
```

---

## DELETE /companies/:id/files/:fileId

기업 첨부파일 삭제 (관리자 전용)

**Response**
```json
{
  "message": "파일이 삭제되었습니다."
}
```
