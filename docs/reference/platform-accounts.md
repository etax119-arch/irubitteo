# 플랫폼 계정 체크리스트

## 1. 개발 단계 필요 계정

### Supabase (Database + Auth + Storage)
- [ ] Supabase 계정 생성
- [ ] 프로젝트 생성
- [ ] 환경 변수 확보:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

**가이드**: https://supabase.com/dashboard

```
1. supabase.com 접속
2. GitHub 또는 이메일로 가입
3. New Project 클릭
4. 프로젝트명: durubitteo-dev
5. 데이터베이스 비밀번호 설정 (안전하게 보관)
6. 리전: Northeast Asia (Seoul) 선택
7. Settings > API에서 키 확인
```

---

### GitHub (코드 저장소)
- [ ] GitHub 계정 (있으면 스킵)
- [ ] Organization 생성 (선택)
- [ ] 저장소 생성:
  - `durubitteo_web` (Frontend)
  - `durubitteo_server` (Backend)

---

### Vercel (Frontend 호스팅)
- [ ] Vercel 계정 생성
- [ ] GitHub 연동
- [ ] 프로젝트 import

**가이드**: https://vercel.com/new

```
1. vercel.com 접속
2. Continue with GitHub 클릭
3. Import Git Repository 선택
4. durubitteo_web 저장소 선택
5. 환경 변수 설정:
   - NEXT_PUBLIC_API_URL
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
6. Deploy 클릭
```

---

### Railway (Backend 호스팅)
- [ ] Railway 계정 생성
- [ ] GitHub 연동
- [ ] 프로젝트 생성

**가이드**: https://railway.app/new

```
1. railway.app 접속
2. Login with GitHub 클릭
3. New Project > Deploy from GitHub repo
4. durubitteo_server 저장소 선택
5. 환경 변수 설정:
   - DATABASE_URL (Supabase 연결 문자열)
   - JWT_SECRET
   - SUPABASE_SERVICE_ROLE_KEY
   - ENCRYPTION_KEY (주민번호 암호화용)
6. Deploy 클릭
```

---

## 2. 배포 단계 필요 계정

### 도메인 (선택)
- [ ] 도메인 등록 서비스 계정
  - 추천: Namecheap, GoDaddy, 가비아
- [ ] 도메인 구매
  - 예: durubitteo.com, durubitteo.kr

### SSL 인증서
- [ ] Vercel: 자동 발급 (무료)
- [ ] Railway: 자동 발급 (무료)

### 모니터링 (선택)
- [ ] Sentry 계정 (에러 모니터링)
- [ ] LogRocket 계정 (세션 리플레이)

---

## 3. 환경별 설정

### 개발 환경 (Development)
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Backend (.env)
DATABASE_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres
JWT_SECRET=dev-secret-key-change-in-production
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
ENCRYPTION_KEY=dev-encryption-key-32bytes!!
```

### 스테이징 환경 (Staging)
```env
# Vercel Preview 환경 사용
NEXT_PUBLIC_API_URL=https://api-staging.durubitteo.com
# 나머지는 개발과 동일한 Supabase 프로젝트 사용
```

### 프로덕션 환경 (Production)
```env
# Frontend (Vercel Environment Variables)
NEXT_PUBLIC_API_URL=https://api.durubitteo.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Backend (Railway Environment Variables)
DATABASE_URL=postgresql://...prod...
JWT_SECRET=production-secret-key-very-long-and-random
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
ENCRYPTION_KEY=production-encryption-key-32!!
```

---

## 4. 계정 생성 순서 (권장)

1. **GitHub** - 코드 저장소 먼저 준비
2. **Supabase** - 데이터베이스 설정
3. **Vercel** - GitHub 연동 후 Frontend 배포
4. **Railway** - GitHub 연동 후 Backend 배포
5. **도메인** - 서비스 안정화 후 구매

---

## 5. 보안 주의사항

### 절대 공개하면 안 되는 키
- `SUPABASE_SERVICE_ROLE_KEY` - 서버에서만 사용
- `JWT_SECRET` - 토큰 서명용
- `ENCRYPTION_KEY` - 주민번호 암호화용
- `DATABASE_URL` - DB 접속 정보

### 공개 가능한 키
- `NEXT_PUBLIC_SUPABASE_URL` - 공개 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - RLS로 보호됨

### 키 관리 팁
```
1. 절대 Git에 커밋하지 않기
2. .env 파일은 .gitignore에 추가
3. 프로덕션 키는 호스팅 플랫폼의 환경 변수로 관리
4. 정기적으로 키 로테이션 (6개월~1년)
```

---

## 6. 비용 요약

| 서비스 | 무료 티어 | 유료 시작 |
|--------|----------|----------|
| Supabase | 500MB DB, 1GB Storage | $25/월 |
| Vercel | 100GB 대역폭 | $20/월 |
| Railway | $5 크레딧/월 | 사용량 기반 |
| GitHub | 무제한 공개 저장소 | $4/월 (Private) |
| 도메인 | - | ~$15/년 |

**초기 개발 시**: 거의 무료로 진행 가능
**프로덕션 시**: 약 $50~70/월 예상
