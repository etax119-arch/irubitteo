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
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

/** 페이지네이션 메타 정보 */
export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

/** 페이지네이션 응답 */
export type PaginatedResponse<T> = {
  items: T[];
  meta: PaginationMeta;
};