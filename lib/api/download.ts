import apiClient from './client';

/**
 * apiClient를 통해 파일을 다운로드하고 브라우저 다운로드 트리거
 * 인증이 필요한 백엔드 API 엔드포인트용
 */
export async function downloadFile(apiPath: string, fileName?: string): Promise<void> {
  const response = await apiClient.get(apiPath, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || '';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * apiClient를 통해 파일을 가져와 새 탭에서 열기
 * 인증이 필요한 백엔드 API 엔드포인트용
 */
export async function openFile(apiPath: string): Promise<void> {
  const response = await apiClient.get(apiPath, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  window.open(url, '_blank');
}

/**
 * 외부 URL(Supabase public URL 등)을 새 탭에서 열기
 */
export function openExternalFile(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * 외부 URL(Supabase public URL 등)을 다운로드
 * fetch로 blob을 가져온 후 다운로드 트리거
 */
export async function downloadExternalFile(url: string, fileName?: string): Promise<void> {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = fileName || '';
  a.click();
  URL.revokeObjectURL(blobUrl);
}
