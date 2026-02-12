import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { UserRole } from '@/types/auth';

// 보호된 경로 정의
const PROTECTED_ROUTES: Record<string, UserRole[]> = {
  '/admin': ['admin'],
  '/company': ['company'],
  '/employee': ['employee'],
};

// 인증된 사용자가 접근할 수 없는 경로 (로그인 페이지 등)
const AUTH_ROUTES = ['/login/admin', '/login/company', '/login/employee'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 크로스 도메인 배포 환경에서는 백엔드 쿠키를 미들웨어에서 읽을 수 없으므로
  // 인증 보호는 클라이언트 사이드 layout에서 처리 (useAuth 훅)
  // 미들웨어는 쿠키가 있는 경우에만 역할 기반 라우팅 수행
  const authStatus = request.cookies.get('auth-status')?.value;
  const userRole = request.cookies.get('user-role')?.value as
    | UserRole
    | undefined;

  const isAuthenticated = authStatus === 'authenticated';

  // 보호된 경로: 쿠키가 있을 때만 역할 검증 (쿠키 없으면 layout에서 처리)
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute && isAuthenticated && userRole) {
    const allowedRoles = PROTECTED_ROUTES[matchedRoute];

    // 역할별 접근 제어
    if (!allowedRoles.includes(userRole)) {
      const redirectUrl = new URL(`/${userRole}`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 인증된 사용자가 로그인 페이지 접근 시 대시보드로 리다이렉트
  if (isAuthenticated && AUTH_ROUTES.some((route) => pathname === route)) {
    if (userRole) {
      const dashboardUrl = new URL(`/${userRole}`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 대해 middleware 실행:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public 폴더의 파일들
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
