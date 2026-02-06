# 출퇴근 API

> 공통 규칙은 [API README](./README.md) 참조

## POST /attendances/clock-in

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

---

## POST /attendances/clock-out

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

---

## GET /attendances

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

---

## GET /attendances/today

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

---

## GET /stats/monthly

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

## PUT /attendances/:id

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
