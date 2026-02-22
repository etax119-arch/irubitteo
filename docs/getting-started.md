# 개발 환경 셋업 가이드

## 사전 요구사항

- **Node.js** 18 이상
- **npm** 9 이상
- **PostgreSQL** 15 이상 (또는 Supabase)
- **Git**

## 프로젝트 구조

```
/Users/hyson/durubitteo/
├── durubitteo_web/        # 프론트엔드 (Next.js)
├── durubitteo_server/     # 백엔드 (NestJS)
└── durubitteo_design/     # 디자인 목업 (참조용)
```

## 1. 백엔드 서버 설정

### 1-1. 의존성 설치

```bash
cd durubitteo_server
npm install
```

### 1-2. 환경변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
```

필수 환경변수:

| 변수 | 설명 | 예시 |
|------|------|------|
| `DATABASE_URL` | PostgreSQL 연결 문자열 | `postgresql://user:pw@localhost:5432/durubitteo` |
| `DIRECT_URL` | Prisma 직접 연결 URL (마이그레이션용) | 위와 동일 |
| `JWT_SECRET` | JWT 서명 키 | 임의의 긴 문자열 |
| `JWT_EXPIRES_IN_SECONDS` | Access Token 만료 시간 | `900` (15분) |
| `JWT_REFRESH_EXPIRES_IN_SECONDS` | Refresh Token 만료 시간 | `604800` (7일) |
| ~~`SSN_ENCRYPTION_KEY`~~ | ~~주민번호 암호화 키~~ | 더 이상 사용하지 않음 (주민번호 평문 저장) |
| `SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 키 | Supabase 대시보드에서 확인 |
| `PORT` | 서버 포트 | `4000` |
| `CORS_ORIGIN` | 허용 Origin | `http://localhost:3000` |

### 1-3. 데이터베이스 설정

```bash
# Prisma 마이그레이션 실행
npx prisma migrate dev

# (선택) 시드 데이터
npx prisma db seed
```

### 1-4. 서버 실행

```bash
npm run start:dev
```

서버가 `http://localhost:4000`에서 실행됩니다.
API prefix: `/v1` (예: `http://localhost:4000/v1/auth/login`)

---

## 2. 프론트엔드 설정

### 2-1. 의존성 설치

```bash
cd durubitteo_web
npm install
```

### 2-2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/v1
```

### 2-3. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000`에서 접근 가능합니다.

---

## 3. 주요 명령어

### 프론트엔드 (`durubitteo_web`)

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 서버
npm run lint     # ESLint 검사
```

### 백엔드 (`durubitteo_server`)

```bash
npm run start:dev    # 개발 서버 (watch mode)
npm run build        # 프로덕션 빌드
npm start            # 프로덕션 서버
npm test             # 테스트 실행
npx prisma studio    # DB GUI 도구
```

---

## 4. 기술 스택

### 프론트엔드
- **Next.js 16** (App Router)
- **React 19** (Server Components 기본)
- **TypeScript 5** (strict)
- **Tailwind CSS v3**
- **Zustand** (클라이언트 상태)
- **TanStack Query** (서버 상태 캐싱)

### 백엔드
- **NestJS 11**
- **Prisma 6** (PostgreSQL ORM)
- **JWT** (HttpOnly 쿠키 인증)
- **Supabase** (파일 스토리지)
- **class-validator** (DTO 검증)

---

## 5. 개발 포트 요약

| 서비스 | 포트 | URL |
|--------|------|-----|
| 프론트엔드 | 3000 | http://localhost:3000 |
| 백엔드 API | 4000 | http://localhost:4000/v1 |
| Prisma Studio | 5555 | http://localhost:5555 |

---

## 6. 검색엔진 제출 URL (프로덕션)

운영 도메인(`https://www.irubitteo.com`) 기준으로 다음 URL을 제출합니다.

| 항목 | URL | 비고 |
|------|-----|------|
| 사이트맵 | `https://www.irubitteo.com/sitemap.xml` | Next.js `app/sitemap.ts`에서 생성 |
| RSS 피드 | `https://www.irubitteo.com/rss.xml` | Next.js `app/rss.xml/route.ts`에서 생성 |
| robots | `https://www.irubitteo.com/robots.txt` | Next.js `app/robots.ts`에서 생성 |

네이버 서치어드바이저 기준:
- **사이트/도메인 등록 + 소유권 확인** 후 제출
- `사이트맵 URL`과 `RSS URL`을 각각 등록
