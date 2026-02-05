# API 설계

## 개요

- **Base URL**: `https://api.durubitteo.com/v1`
- **인증**: Bearer Token (JWT)
- **Content-Type**: `application/json`

### 토큰 정책
- **Access Token**: 유효기간 1시간
- **Refresh Token**: 유효기간 7일
- **저장 위치**: HttpOnly Cookie (보안 강화)
- **갱신 방식**: Refresh Token으로 새 Access Token 발급

### 필드명 변환 규칙

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

### 공통 응답 형식

**목록 조회 응답**
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
    "role": "employee | company | admin",
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

**Response**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
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

**Response**
```json
{
  "message": "로그아웃되었습니다."
}
```

### GET /auth/me
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

### GET /companies/:id
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

### PUT /companies/:id
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

### DELETE /companies/:id
기업 삭제 (비활성화, 관리자 전용)

**Response**
```json
{
  "id": "uuid",
  "isActive": false,
  "message": "기업이 비활성화되었습니다."
}
```

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

### DELETE /companies/:id/files/:fileId
기업 첨부파일 삭제 (관리자 전용)

**Response**
```json
{
  "message": "파일이 삭제되었습니다."
}
```

---

## 3. 직원 API

### GET /employees
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

### POST /employees
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

### GET /employees/:id
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

### PUT /employees/:id
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

### DELETE /employees/:id
직원 삭제 (비활성화, 기업 또는 관리자)

**Response**
```json
{
  "id": "uuid",
  "isActive": false,
  "message": "직원이 비활성화되었습니다."
}
```

### POST /employees/:id/files
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

### GET /employees/:id/files
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

### DELETE /employees/:id/files/:fileId
직원 첨부파일 삭제 (기업 또는 관리자)

**Response**
```json
{
  "message": "파일이 삭제되었습니다."
}
```

---

## 4. 출퇴근 API

### POST /attendances/clock-in
출근 기록 (직원 전용)

**Request**
(Body 없음 - JWT에서 직원 정보 추출)

**Response**
```json
{
  "id": "uuid",
  "date": "2024-01-15",
  "clockIn": "2024-01-15T09:05:00Z",
  "isLate": true,
  "status": "present",
  "createdAt": "2024-01-15T09:05:00Z",
  "updatedAt": "2024-01-15T09:05:00Z"
}
```

### POST /attendances/clock-out
퇴근 기록 (직원 전용)

**Request**
```json
{
  "workContent": "제품 포장 작업 완료",
  "photos": ["base64..."]
}
```

**참고**: `photos`는 base64 인코딩된 이미지 배열 또는 multipart/form-data로 전송 가능. 요청 시 `photos`로 전송하며, 응답에서는 저장된 URL을 `photoUrls`로 반환합니다.

**Response**
```json
{
  "id": "uuid",
  "date": "2024-01-15",
  "clockIn": "2024-01-15T09:05:00Z",
  "clockOut": "2024-01-15T18:00:00Z",
  "isLate": true,
  "isEarlyLeave": false,
  "status": "present",
  "workContent": "제품 포장 작업 완료",
  "photoUrls": ["https://storage.../photo1.jpg"],
  "createdAt": "2024-01-15T09:05:00Z",
  "updatedAt": "2024-01-15T18:00:00Z"
}
```

### GET /attendances
출퇴근 기록 조회 (권한별 범위 제한 - 직원: 본인만, 기업: 소속 직원, 관리자: 전체)

**Query Parameters**
- `employeeId`: 직원 ID (기업이 조회 시)
- `startDate`: 시작일 (YYYY-MM-DD)
- `endDate`: 종료일 (YYYY-MM-DD)
- `status`: 상태 필터 (present, absent)
- `page`, `limit`: 페이지네이션

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
      "note": "비고 내용",
      "workContent": "제품 포장 작업 완료",
      "photoUrls": ["https://storage.../photo1.jpg"],
      "employee": {
        "id": "uuid",
        "name": "홍길동",
        "phone": "010-1234-5678",
        "uniqueCode": "ABC-001"
      },
      "createdAt": "2024-01-15T09:05:00Z",
      "updatedAt": "2024-01-15T18:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### GET /attendances/today
오늘 출퇴근 현황 (기업 전용)

**Query Parameters**
(없음 - 오늘 날짜 자동 적용)

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
  "employees": [
    {
      "id": "uuid",
      "name": "홍길동",
      "phone": "010-1234-5678",
      "uniqueCode": "ABC-001",
      "status": "present",
      "clockIn": "2024-01-15T09:05:00Z",
      "clockOut": null,
      "isLate": true,
      "workContent": null
    }
  ]
}
```

**참고**: summary의 `notYet`은 아직 출근하지 않은 직원 수이며, 실제 출퇴근 기록의 status 값은 아닙니다 (출근 전이므로 기록 자체가 없음).

### GET /stats/monthly
기업용 월간 통계 (기업 전용 - 소속 직원만)

**Query Parameters**
- `year`: 연도 (필수)
- `month`: 월 (필수)

**Response**
```json
{
  "year": 2024,
  "month": 1,
  "employees": [
    {
      "id": "uuid",
      "name": "홍길동",
      "workDays": 20,
      "totalWorkHours": 160.5
    }
  ],
  "averageWorkDays": 19.5,
  "averageWorkHours": 156.2
}
```

---

## 5. 관리자 API

### GET /admin/stats
전체 플랫폼 통계 (관리자 전용)

**Query Parameters**
(없음)

**Response**
```json
{
  "totalCompanies": 50,
  "activeCompanies": 45,
  "totalEmployees": 1200,
  "activeEmployees": 1150,
  "todayAttendances": 980,
  "todayAbsences": 50,
  "newCompaniesThisMonth": 3,
  "newEmployeesThisMonth": 25,
  "urgentNotificationCount": 5
}
```

### GET /admin/employees
전체 직원 목록 (관리자 전용)

**Query Parameters**
- `page`, `limit`: 페이지네이션
- `search`: 이름/회사명 검색
- `companyId`: 회사 ID 필터 (선택)
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
      "disabilityType": "지체장애",
      "disabilitySeverity": "mild",
      "contractEndDate": "2025-12-31",
      "isActive": true,
      "company": {
        "id": "uuid",
        "name": "테스트 기업",
        "code": "ABC"
      },
      "todayStatus": "present",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### GET /admin/notifications
관리자 알림 목록 (관리자 전용)

결근(attendances.status='absent')과 미처리 문의(inquiries.status='pending')를 조회합니다.

**Query Parameters**
- `page`, `limit`: 페이지네이션
- `type`: 알림 유형 필터 (absence, inquiry)

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "absence",
      "title": "결근 알림",
      "message": "홍길동님이 결근했습니다.",
      "relatedId": "uuid",
      "createdAt": "2024-01-15T09:00:00Z"
    },
    {
      "id": "uuid",
      "type": "inquiry",
      "title": "신규 문의",
      "message": "새로운 기업에서 문의가 접수되었습니다.",
      "relatedId": "uuid",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

**참고**: 별도의 notifications 테이블 없이, attendances(absent)와 inquiries(pending)에서 실시간 조회합니다.

### GET /admin/stats/monthly
회사별 월간 통계 (관리자 전용)

**Query Parameters**
- `year`: 연도 (필수)
- `month`: 월 (필수)
- `companyId`: 회사 ID 필터 (선택)

**Response**
```json
{
  "year": 2024,
  "month": 1,
  "companies": [
    {
      "id": "uuid",
      "name": "테스트 기업",
      "employees": [
        {
          "id": "uuid",
          "name": "홍길동",
          "phone": "010-1234-5678",
          "workDays": 20,
          "totalWorkHours": 160.5
        }
      ],
      "averageWorkDays": 19.5,
      "averageWorkHours": 156.2
    }
  ]
}
```

### PUT /admin/stats/employees/:id
월간 통계 인라인 수정 (관리자 전용)

**Request**
```json
{
  "year": 2024,
  "month": 1,
  "workDays": 21,
  "totalWorkHours": 168.0
}
```

**Response**
```json
{
  "id": "uuid",
  "employeeId": "uuid",
  "year": 2024,
  "month": 1,
  "workDays": 21,
  "totalWorkHours": 168.0,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### GET /admin/stats/employees/:id
특정 직원의 월간 통계 이력 조회 (관리자 전용)

**Query Parameters**
- `year`: 연도 (선택, 미지정 시 전체)

**Response**
```json
{
  "employeeId": "uuid",
  "employeeName": "홍길동",
  "stats": [
    {
      "id": "uuid",
      "year": 2024,
      "month": 1,
      "workDays": 20,
      "totalWorkHours": 160.5,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### GET /admin/audit-logs
감사 로그 조회 (관리자 전용)

**Query Parameters**
- `action`: login, logout, create, update, delete
- `userType`: admin, company, employee
- `startDate`, `endDate`: 기간
- `page`, `limit`: 페이지네이션

**Response**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "userType": "admin",
      "action": "update",
      "targetType": "employee",
      "targetId": "uuid",
      "details": {
        "field": "clockIn",
        "oldValue": "09:05:00",
        "newValue": "09:00:00"
      },
      "ipAddress": "192.168.1.1",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### GET /admin/attendances
회사별 출퇴근 현황 (관리자 전용)

**Query Parameters**
- `date`: 조회 날짜 (YYYY-MM-DD)
- `companyId`: 회사 ID (선택)

**Response**
```json
{
  "date": "2024-01-15",
  "companies": [
    {
      "id": "uuid",
      "name": "테스트 기업",
      "summary": {
        "total": 10,
        "present": 8,
        "absent": 1,
        "notYet": 1
      },
      "employees": [
        {
          "id": "uuid",
          "name": "홍길동",
          "phone": "010-1234-5678",
          "status": "present",
          "clockIn": "2024-01-15T09:05:00Z",
          "clockOut": "2024-01-15T18:00:00Z",
          "isLate": true,
          "workContent": "제품 포장 작업 완료"
        }
      ]
    }
  ]
}
```

**참고**: summary의 `notYet`은 아직 출근하지 않은 직원 수입니다.

---

## 6. 공지사항 API

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

## 7. 근무일정 API

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

## 8. 문의 API

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

## 9. 출퇴근 수정 API

### PUT /attendances/:id
출퇴근 기록 수정 (관리자 또는 기업)

**수정 가능 필드**
- `clockIn`: 출근 시간
- `clockOut`: 퇴근 시간
- `workContent`: 업무 내용
- `note`: 비고 (수정 사유 기록용)
- `status`: 상태 (present/absent) - 관리자/기업이 결근→출근 변경 가능

**참고**: status를 'present'로 변경 시 clockIn이 필수. clockIn 없이 status만 변경 불가.

**수정 불가 필드**
- `date`: 날짜 (변경 불가)
- `isLate`: 자동 계산 (clockIn 기준)
- `isEarlyLeave`: 자동 계산 (clockOut 기준)

**Request**
```json
{
  "clockIn": "2024-01-15T09:00:00Z",
  "clockOut": "2024-01-15T18:00:00Z",
  "workContent": "업무 내용 수정",
  "note": "관리자 수정"
}
```

**Response**
```json
{
  "id": "uuid",
  "date": "2024-01-15",
  "clockIn": "2024-01-15T09:00:00Z",
  "clockOut": "2024-01-15T18:00:00Z",
  "status": "present",
  "isLate": false,
  "isEarlyLeave": false,
  "workContent": "업무 내용 수정",
  "photoUrls": ["https://storage.../photo1.jpg"],
  "note": "관리자 수정",
  "createdAt": "2024-01-15T09:05:00Z",
  "updatedAt": "2024-01-15T16:00:00Z"
}
```

---

## 10. 템플릿 API

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
