import apiClient from './client';
import type {
  AuthUser,
  LoginResponse,
  AdminLoginInput,
  CodeLoginInput,
} from '@/types/auth';

export type LoginParams =
  | { type: 'admin'; email: string; password: string }
  | { type: 'company'; code: string }
  | { type: 'employee'; code: string };

export const authApi = {
  /**
   * 로그인
   * - 관리자: 이메일 + 비밀번호
   * - 기업/직원: 고유 코드
   */
  async login(params: LoginParams): Promise<LoginResponse> {
    let endpoint: string;
    let body: AdminLoginInput | CodeLoginInput;

    if (params.type === 'admin') {
      endpoint = '/auth/login/admin';
      body = { email: params.email, password: params.password };
    } else {
      endpoint = '/auth/login/code';
      body = { code: params.code, type: params.type };
    }

    const response = await apiClient.post<LoginResponse>(endpoint, body);
    return response.data;
  },

  /**
   * 로그아웃
   * - 서버에서 HttpOnly Cookie 삭제
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  /**
   * 토큰 갱신
   * - refresh token을 사용하여 access token 갱신
   */
  async refresh(): Promise<void> {
    await apiClient.post('/auth/refresh');
  },

  /**
   * 현재 사용자 정보 조회
   * - access token으로 사용자 정보 확인
   */
  async getMe(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>('/auth/me');
    return response.data;
  },
};

export default authApi;
