# API 설계

## 개요

- **Base URL**: `https://api.durubitteo.com/v1`
- **인증**: Bearer Token (JWT)
- **Content-Type**: `application/json`

---

## 1. 인증 API

### POST /auth/login
로그인

**Request**
```json
{
  "type": "employee | company | admin",
  "identifier": "ABC-001",  // 직원/기업: 고유번호, 관리자: 이메일
  "password": "string"      // 관리자만 필요
}
```

**Response**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "type": "employee | company | admin",
    "name": "홍길동"
  }
}
```

### POST /auth/refresh
토큰 갱신

**Request**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /auth/logout
로그아웃

**Request**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 2. 기업 API

### GET /companies
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
      "createdAt": "2024-01-01T00:00:00Z"
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

### POST /companies
기업 등록 (관리자 전용)

**Request**
```json
{
  "code": "ABC",
  "name": "테스트 기업",
  "email": "test@company.com",
  "phone": "02-1234-5678",
  "address": "서울시 강남구...",
  "businessNumber": "123-45-67890"
}
```

**참고**: `code`는 기업의 고유번호로 로그인에 사용됩니다.

### GET /companies/:id
기업 상세 조회

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
  "isActive": true,
  "employeeCount": 15,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### PUT /companies/:id
기업 정보 수정

**Request**
```json
{
  "name": "테스트 기업 (수정)",
  "email": "updated@company.com",
  "phone": "02-9876-5432",
  "address": "서울시 서초구...",
  "businessNumber": "123-45-67890"
}
```

**참고**: `code`는 고유번호로 수정 불가합니다.

### DELETE /companies/:id
기업 삭제 (비활성화)

### POST /companies/:id/files
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

### GET /companies/:id/files
기업 첨부파일 목록 조회

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

### DELETE /companies/:id/files/:fileId
기업 첨부파일 삭제

---

## 3. 직원 API

### GET /employees
직원 목록 조회 (기업: 소속 직원만)

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
      "isActive": true
    }
  ],
  "pagination": { ... }
}
```

### POST /employees
직원 등록 (기업 전용)

**Request**
```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "ssn": "900101-1234567",
  "hireDate": "2024-01-01",
  "workDays": [1, 2, 3, 4, 5],
  "workStartTime": "09:00",
  "workEndTime": "18:00"
}
```

**Response**
```json
{
  "id": "uuid",
  "uniqueCode": "ABC-001",  // 자동 생성
  "name": "홍길동",
  ...
}
```

### GET /employees/:id
직원 상세 조회

**Response**
```json
{
  "id": "uuid",
  "uniqueCode": "ABC-001",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "hireDate": "2024-01-01",
  "resignDate": null,
  "workDays": [1, 2, 3, 4, 5],
  "workStartTime": "09:00",
  "workEndTime": "18:00",
  "profileImage": "https://...",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### PUT /employees/:id
직원 정보 수정

**Request**
```json
{
  "name": "홍길동",
  "phone": "010-9876-5432",
  "workDays": [1, 2, 3, 4, 5],
  "workStartTime": "09:00",
  "workEndTime": "18:00",
  "resignDate": null
}
```

**참고**: `uniqueCode`, `ssn`, `hireDate`는 수정 불가합니다.

### DELETE /employees/:id
직원 삭제 (비활성화)

### POST /employees/:id/files
직원 첨부파일 업로드

### GET /employees/:id/files
직원 첨부파일 목록

### DELETE /employees/:id/files/:fileId
직원 첨부파일 삭제

---

## 4. 출퇴근 API

### POST /attendances/clock-in
출근 기록

**Response**
```json
{
  "id": "uuid",
  "date": "2024-01-15",
  "clockIn": "2024-01-15T09:05:00Z",
  "isLate": true,
  "status": "present"
}
```

### POST /attendances/clock-out
퇴근 기록

**Response**
```json
{
  "id": "uuid",
  "date": "2024-01-15",
  "clockIn": "2024-01-15T09:05:00Z",
  "clockOut": "2024-01-15T18:00:00Z",
  "isLate": true,
  "isEarlyLeave": false,
  "status": "present"
}
```

### GET /attendances
출퇴근 기록 조회

**Query Parameters**
- `employeeId`: 직원 ID (기업이 조회 시)
- `startDate`: 시작일 (YYYY-MM-DD)
- `endDate`: 종료일 (YYYY-MM-DD)
- `status`: 상태 필터 (present, absent)

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "date": "2024-01-15",
      "clockIn": "2024-01-15T09:05:00Z",
      "clockOut": "2024-01-15T18:00:00Z",
      "status": "present",
      "isLate": true,
      "isEarlyLeave": false,
      "employee": {
        "id": "uuid",
        "name": "홍길동",
        "uniqueCode": "ABC-001"
      }
    }
  ],
  "pagination": { ... }
}
```

### GET /attendances/today
오늘 출퇴근 현황 (기업용 대시보드)

**Response**
```json
{
  "date": "2024-01-15",
  "summary": {
    "total": 20,
    "present": 15,
    "absent": 3,
    "notYet": 2,
    "late": 3
  },
  "employees": [ ... ]
}
```

---

## 5. 업무 API

### POST /tasks
업무 등록

**Request**
```json
{
  "attendanceId": "uuid",
  "title": "회의 참석",
  "content": "주간 팀 미팅 참석",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z"
}
```

**참고**: `attendanceId`는 선택 사항이며, 제공 시 해당 출퇴근 기록과 연결됩니다.

### GET /tasks
업무 목록 조회

**Query Parameters**
- `employeeId`: 직원 ID
- `date`: 날짜 (YYYY-MM-DD)
- `startDate`, `endDate`: 기간
- `attendanceId`: 출퇴근 ID (선택)

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "attendanceId": "uuid",
      "title": "회의 참석",
      "content": "주간 팀 미팅 참석",
      "startTime": "2024-01-15T10:00:00Z",
      "endTime": "2024-01-15T11:00:00Z",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### GET /tasks/:id
업무 상세 조회

### PUT /tasks/:id
업무 수정

### DELETE /tasks/:id
업무 삭제

---

## 6. 보고서 API

### GET /reports
보고서 목록 조회

**Query Parameters**
- `type`: daily, weekly, monthly
- `startDate`, `endDate`: 기간

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "weekly",
      "periodStart": "2024-01-08",
      "periodEnd": "2024-01-14",
      "createdAt": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### GET /reports/:id
보고서 상세 조회

**Response**
```json
{
  "id": "uuid",
  "type": "weekly",
  "periodStart": "2024-01-08",
  "periodEnd": "2024-01-14",
  "data": {
    "totalEmployees": 20,
    "presentDays": 85,
    "absentDays": 5,
    "lateDays": 3,
    "summary": "..."
  },
  "files": [
    {
      "id": "uuid",
      "fileType": "pdf",
      "filePath": "reports/2024/01/weekly-0108-0114.pdf"
    }
  ],
  "createdAt": "2024-01-15T00:00:00Z"
}
```

### POST /reports/generate
보고서 생성 요청

**Request**
```json
{
  "type": "weekly",
  "periodStart": "2024-01-08",
  "periodEnd": "2024-01-14"
}
```

**Response**
```json
{
  "id": "uuid",
  "type": "weekly",
  "periodStart": "2024-01-08",
  "periodEnd": "2024-01-14",
  "status": "generating",
  "createdAt": "2024-01-15T00:00:00Z"
}
```

**참고**: 보고서 생성은 비동기로 처리되며, 완료 후 `GET /reports/:id`로 결과를 조회합니다.

### GET /reports/:id/download
보고서 파일 다운로드

**Query Parameters**
- `format`: pdf, xlsx

---

## 7. 관리자 API

### GET /admin/stats
전체 플랫폼 통계

**Response**
```json
{
  "totalCompanies": 50,
  "activeCompanies": 45,
  "totalEmployees": 1200,
  "activeEmployees": 1150,
  "todayAttendances": 980,
  "todayAbsences": 50
}
```

### GET /admin/audit-logs
감사 로그 조회

**Query Parameters**
- `action`: login, logout, create, update, delete
- `userType`: admin, company, employee
- `startDate`, `endDate`: 기간

---

## 에러 응답 형식

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
