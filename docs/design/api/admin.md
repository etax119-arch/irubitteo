# 관리자 API

> 공통 규칙은 [API README](./README.md) 참조

모든 관리자 API는 관리자 전용입니다.

## GET /admin/stats

전체 플랫폼 통계

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

---

## GET /admin/employees

전체 직원 목록

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

---

## GET /admin/notifications

관리자 알림 목록

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

---

## GET /admin/stats/monthly

회사별 월간 통계

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

---

## PUT /admin/stats/employees/:id

월간 통계 인라인 수정

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

---

## GET /admin/stats/employees/:id

특정 직원의 월간 통계 이력 조회

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

---

## GET /admin/audit-logs

감사 로그 조회

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

---

## GET /admin/attendances

회사별 출퇴근 현황

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
