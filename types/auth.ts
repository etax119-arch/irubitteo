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

/** 인증된 사용자 정보 (기본) */
export type AuthUserBase = {
  id: string;
  role: UserRole;
  name: string;
};

/** 직원 인증 정보 */
export type AuthUserEmployee = AuthUserBase & {
  role: 'employee';
  code: string;
  companyId: string;
  companyName: string;
};

/** 기업 인증 정보 */
export type AuthUserCompany = AuthUserBase & {
  role: 'company';
  code: string;
};

/** 관리자 인증 정보 */
export type AuthUserAdmin = AuthUserBase & {
  role: 'admin';
  email: string;
};

/** 인증된 사용자 정보 (역할별 유니온) */
export type AuthUser = AuthUserEmployee | AuthUserCompany | AuthUserAdmin;

/** 로그인 응답 */
export type LoginResponse = {
  user: AuthUser;
  // accessToken, refreshToken은 HttpOnly Cookie로 서버에서 설정됨
};