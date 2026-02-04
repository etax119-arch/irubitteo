# 기술 스택

## 1. 기술 구성

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 16.x | 프레임워크 (App Router) |
| React | 19.x | UI 라이브러리 |
| TypeScript | 5.x | 타입 안정성 |
| Tailwind CSS | v3 | 스타일링 |

### Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| NestJS | 10.x | API 서버 |
| TypeScript | 5.x | 타입 안정성 |
| Prisma | 5.x | ORM |
| JWT | - | 인증 토큰 |

### Database & Infrastructure
| 기술 | 용도 |
|------|------|
| PostgreSQL | 메인 데이터베이스 (Supabase) |
| Supabase | DB + Auth + Storage |
| Vercel | 프론트엔드 호스팅 |
| Railway | 백엔드 호스팅 |

---

## 2. 월 운영 비용

기업 100개 이상 규모 기준, 예산 100만원/월 이하

| 서비스 | 플랜 | 월 비용 | 비고 |
|--------|------|---------|------|
| Supabase | Pro | $25~ | 사용량 초과 시 추가 과금 |
| Vercel | Pro | $20 | 프론트엔드 호스팅 |
| Railway | Pro | ~$100 | 백엔드 호스팅 (여유 확보) |
| 도메인 | - | ~$1 | 연 $15 기준 |
| **총합** | | **~$150/월** | 약 20만원 |

※ 사용량 증가 시에도 예산(100만원) 내 충분한 여유 확보

---

## 3. Storage 정책

### Supabase Storage 사용
- 프로필 사진: `profiles/{company_id}/{employee_id}/`
- 직원 첨부파일: `employees/{company_id}/{employee_id}/`
- 기업 첨부파일: `companies/{company_id}/`
- 보고서: `reports/{company_id}/{year}/{month}/`

### 용량 제한
- 프로필 사진: 최대 2MB
- 첨부파일: 파일당 최대 10MB
- 기업당 총 용량: 1GB (초기)

### 파일 형식
- 이미지: jpg, png, webp
- 문서: pdf, doc, docx, xls, xlsx

---

## 4. 인프라 증설 기준

### Supabase
| 지표 | 기준 | 조치 |
|------|------|------|
| DB 크기 | 8GB 도달 시 | 모니터링 강화 |
| 동시 연결 | 60개 이상 | Connection Pooling 확인 |
| Storage | 50GB 도달 시 | 정리 또는 플랜 업그레이드 |

### Railway (Backend)
| 지표 | 기준 | 조치 |
|------|------|------|
| CPU | 80% 지속 시 | 인스턴스 스케일 업 |
| Memory | 512MB 도달 시 | 메모리 증설 |
| 응답 시간 | 500ms 초과 시 | 성능 최적화 |

### Vercel (Frontend)
| 지표 | 기준 | 조치 |
|------|------|------|
| 대역폭 | 100GB/월 초과 시 | Pro 플랜 전환 |
| 빌드 시간 | 45분/월 초과 시 | Pro 플랜 전환 |

---

## 5. 개발 환경

### 로컬 개발
```bash
# Frontend
npm run dev  # http://localhost:3000

# Backend (별도 저장소)
npm run start:dev  # http://localhost:4000
```

### 환경 변수
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend (.env)
DATABASE_URL=postgresql://...
JWT_SECRET=your-jwt-secret
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

---

## 6. 배포 파이프라인

### Frontend (Vercel)
1. GitHub main 브랜치 push
2. Vercel 자동 빌드 트리거
3. Preview 배포 (PR)
4. Production 배포 (merge)

### Backend (Railway)
1. GitHub main 브랜치 push
2. Railway 자동 빌드 트리거
3. 헬스체크 통과 후 배포

### Database (Supabase)
- Migration: Prisma migrate
- 스키마 변경 시 PR 리뷰 필수
