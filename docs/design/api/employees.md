# 직원 API

> 공통 규칙은 [API README](./README.md) 참조

## GET /employees

직원 목록 조회 (기업 전용 - 소속 직원만)

**Query Parameters**
- `page`, `limit`: 페이지네이션
- `search`: 이름/고유번호 검색
- `isActive`: 활성 상태 필터

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "uniqueCode": "ABC-001",
      "name": "홍길동",
      "phone": "010-1234-5678",
      "hireDate": "2024-01-01",
      "workDays": [1, 2, 3, 4, 5],
      "workStartTime": "09:00",
      "workEndTime": "18:00",
      "profileImage": "https://...",
      "emergencyContactName": "홍부모",
      "emergencyContactRelation": "부모",
      "emergencyContactPhone": "010-9876-5432",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

## POST /employees

직원 등록 (기업 전용)

**Request**
```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "gender": "male",
  "ssn": "900101-1234567",
  "hireDate": "2024-01-01",
  "contractEndDate": "2025-12-31",
  "workDays": [1, 2, 3, 4, 5],
  "workStartTime": "09:00",
  "workEndTime": "18:00",
  "disabilityType": "지체장애",
  "disabilitySeverity": "mild",
  "disabilityRecognitionDate": "2020-01-01",
  "emergencyContactName": "홍부모",
  "emergencyContactRelation": "부모",
  "emergencyContactPhone": "010-9876-5432"
}
```

**Response**
```json
{
  "id": "uuid",
  "companyId": "uuid",
  "uniqueCode": "ABC-001",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "gender": "male",
  "hireDate": "2024-01-01",
  "contractEndDate": "2025-12-31",
  "workDays": [1, 2, 3, 4, 5],
  "workStartTime": "09:00",
  "workEndTime": "18:00",
  "profileImage": null,
  "disabilityType": "지체장애",
  "disabilitySeverity": "mild",
  "disabilityRecognitionDate": "2020-01-01",
  "emergencyContactName": "홍부모",
  "emergencyContactRelation": "부모",
  "emergencyContactPhone": "010-9876-5432",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**참고**: `uniqueCode`는 기업코드와 순번으로 자동 생성됩니다 (예: ABC-001, ABC-002).

---

## GET /employees/:id

직원 상세 조회 (직원 본인, 소속 기업, 관리자)

**Response**
```json
{
  "id": "uuid",
  "uniqueCode": "ABC-001",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "gender": "male",
  "hireDate": "2024-01-01",
  "resignDate": null,
  "contractEndDate": "2025-12-31",
  "workDays": [1, 2, 3, 4, 5],
  "workStartTime": "09:00",
  "workEndTime": "18:00",
  "profileImage": "https://...",
  "disabilityType": "지체장애",
  "disabilitySeverity": "mild",
  "disabilityRecognitionDate": "2020-01-01",
  "emergencyContactName": "홍부모",
  "emergencyContactRelation": "부모",
  "emergencyContactPhone": "010-9876-5432",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

## PUT /employees/:id

직원 정보 수정 (기업 또는 관리자)

**Request**
```json
{
  "name": "홍길동",
  "phone": "010-9876-5432",
  "workDays": [1, 2, 3, 4, 5],
  "workStartTime": "09:00",
  "workEndTime": "18:00",
  "resignDate": "2024-01-15",
  "resignReason": "계약 만료"
}
```

**참고**: `resignDate`와 `resignReason`은 퇴사 처리 시 함께 전송합니다. 퇴사 취소 시 `resignDate: null`로 전송합니다.

**Response**
```json
{
  "id": "uuid",
  "uniqueCode": "ABC-001",
  "name": "홍길동",
  "phone": "010-9876-5432",
  "gender": "male",
  "hireDate": "2024-01-01",
  "resignDate": "2024-01-15",
  "resignReason": "계약 만료",
  "contractEndDate": "2025-12-31",
  "workDays": [1, 2, 3, 4, 5],
  "workStartTime": "09:00",
  "workEndTime": "18:00",
  "profileImage": "https://...",
  "disabilityType": "지체장애",
  "disabilitySeverity": "mild",
  "disabilityRecognitionDate": "2020-01-01",
  "emergencyContactName": "홍부모",
  "emergencyContactRelation": "부모",
  "emergencyContactPhone": "010-9876-5432",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**참고**: `uniqueCode`, `ssn`, `hireDate`는 수정 불가. `contractEndDate`, `disabilityType`, `disabilitySeverity`, `disabilityRecognitionDate`, `emergencyContactName`, `emergencyContactRelation`, `emergencyContactPhone`은 수정 가능합니다.

---

## DELETE /employees/:id

직원 삭제 (비활성화, 기업 또는 관리자)

**Response**
```json
{
  "id": "uuid",
  "isActive": false,
  "message": "직원이 비활성화되었습니다."
}
```

---

## POST /employees/:id/files

직원 첨부파일 업로드 (기업 또는 관리자)

**Request** (multipart/form-data)
```
file: 업로드할 파일
```

**Response**
```json
{
  "id": "uuid",
  "fileName": "이력서.pdf",
  "filePath": "employees/abc-001/이력서.pdf",
  "fileSize": 51200,
  "mimeType": "application/pdf",
  "createdAt": "2024-01-15T09:00:00Z"
}
```

---

## GET /employees/:id/files

직원 첨부파일 목록 (직원 본인, 소속 기업, 관리자)

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "fileName": "이력서.pdf",
      "filePath": "employees/abc-001/이력서.pdf",
      "fileSize": 51200,
      "mimeType": "application/pdf",
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ]
}
```

---

## DELETE /employees/:id/files/:fileId

직원 첨부파일 삭제 (기업 또는 관리자)

**Response**
```json
{
  "message": "파일이 삭제되었습니다."
}
```
