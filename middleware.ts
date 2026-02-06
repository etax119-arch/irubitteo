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

  // Cookie에서 인증 상태 확인 (서버에서 설정해야 함)
  const authStatus = request.cookies.get('auth-status')?.value;
  const userRole = request.cookies.get('user-role')?.value as
    | UserRole
    | undefined;

  const isAuthenticated = authStatus === 'authenticated';

  // 보호된 경로 확인
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const allowedRoles = PROTECTED_ROUTES[matchedRoute];

    // 미인증 시 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      const loginUrl = new URL(`/login/${allowedRoles[0]}`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 역할별 접근 제어
    if (userRole && !allowedRoles.includes(userRole)) {
      // 허용되지 않은 역할이면 해당 역할의 대시보드로 리다이렉트
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
