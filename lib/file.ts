/**
 * HEIC/HEIF 파일인지 확인 (확장자/MIME 타입 기반)
 * @param file 확인할 파일
 * @returns boolean
 */
export function isHeicFile(file: File): boolean {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif')
  );
}

/**
 * 파일의 실제 내용(매직 바이트)을 읽어 HEIC/HEIF인지 확인
 * 확장자가 변경되어도 실제 HEIC 파일인지 감지 가능
 * @param file 확인할 파일
 * @returns Promise<boolean>
 */
export async function isHeicFileByContent(file: File): Promise<boolean> {
  // 파일의 처음 12바이트 읽기
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // ftyp 시그니처 확인 (offset 4-7에 'ftyp' 문자열)
  if (bytes[4] !== 0x66 || bytes[5] !== 0x74 || bytes[6] !== 0x79 || bytes[7] !== 0x70) {
    return false;
  }

  // 브랜드 확인 (offset 8-11)
  const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
  const heicBrands = ['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'];

  return heicBrands.includes(brand);
}

/**
 * HEIC 파일을 JPEG Blob으로 변환 (클라이언트 전용)
 * @param file HEIC 파일
 * @returns Promise<Blob> JPEG Blob
 */
export async function convertHeicToJpeg(file: File): Promise<Blob> {
  // 동적 import로 클라이언트에서만 로드 (heic-to는 최신 libheif 사용)
  const { heicTo } = await import('heic-to');
  const jpegBlob = await heicTo({
    blob: file,
    type: 'image/jpeg',
    quality: 0.8,
  });
  return jpegBlob;
}

/**
 * File을 base64 문자열로 변환
 * @param file 변환할 파일
 * @returns Promise<string> data:image/...;base64,... 형식의 문자열
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * 여러 File을 base64 문자열 배열로 변환
 * @param files 변환할 파일 배열
 * @returns Promise<string[]> base64 문자열 배열
 */
export async function filesToBase64(files: File[]): Promise<string[]> {
  return Promise.all(files.map(fileToBase64));
}

/**
 * 파일 크기(bytes)를 사람이 읽기 쉬운 형식으로 변환
 */
export function formatFileSize(bytes: number | null): string {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
