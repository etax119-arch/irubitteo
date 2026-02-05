/** API 응답 공통 구조 */
export type ApiResponse<T> = {
  success: true;
  data: T;
};

/** API 에러 응답 */
export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
};

/** API 결과 (성공 또는 에러) */
export type ApiResult<T> = ApiResponse<T> | ApiError;

/** 페이지네이션 요청 파라미터 */
export type PaginationParams = {
  page?: number;
  limit?: number;
};

/** 페이지네이션 메타 정보 */
export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/** 페이지네이션 응답 */
export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};