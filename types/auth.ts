/** 사용자 역할 */
export type UserRole = 'admin' | 'company' | 'employee';

/** 로그인 입력 (직원/기업) */
export type CodeLoginInput = {
  code: string;
  type: 'employee' | 'company';
};

/** 로그인 입력 (관리자) */
export type AdminLoginInput = {
  email: string;
  password: string;
};

/** JWT 페이로드 */
export type JwtPayload = {
  sub: string; // 사용자 ID
  role: UserRole;
  companyId?: string; // 직원인 경우 소속 기업 ID
  iat: number;
  exp: number;
};

/** 인증된 사용자 정보 */
export type AuthUser = {
  id: string;
  role: UserRole;
  name: string;
  companyId?: string;
};

/** 로그인 응답 */
export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};