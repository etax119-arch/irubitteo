import { AxiosError } from 'axios';

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: '잘못된 요청입니다.',
  401: '인증이 만료되었습니다. 다시 로그인해주세요.',
  403: '접근 권한이 없습니다.',
  404: '요청한 데이터를 찾을 수 없습니다.',
  409: '요청이 충돌합니다. 다시 시도해주세요.',
  429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  500: '서버 오류가 발생했습니다.',
};

/**
 * API 에러에서 사용자 메시지를 추출하는 공통 유틸리티
 */
export function extractErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const responseMessage = err.response?.data?.message;
    if (typeof responseMessage === 'string') {
      return responseMessage;
    }
    if (!err.response) {
      return '네트워크 연결을 확인해주세요.';
    }
    const statusMessage = HTTP_STATUS_MESSAGES[err.response.status];
    if (statusMessage) {
      return statusMessage;
    }
  }
  return '알 수 없는 오류가 발생했습니다.';
}
