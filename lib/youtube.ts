// extractYoutubeId는 서버의 `src/common/utils/youtube.ts`와 동일한 로직입니다.
// (저장소가 분리되어 있어 공유 패키지 없이 각자 보관 — 서버가 400을 내는 기준이므로
//  한쪽 파서를 고치면 다른 쪽도 함께 고칠 것)
const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
  'www.youtu.be',
]);

/**
 * 유튜브 URL에서 영상 ID를 추출한다.
 * 지원 형식: watch?v=ID, youtu.be/ID, /embed/ID, /shorts/ID, /live/ID, /v/ID
 */
export function extractYoutubeId(input?: string | null): string | null {
  if (!input) return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  // ID만 입력한 경우도 허용
  if (YOUTUBE_ID_PATTERN.test(trimmed)) return trimmed;

  let url: URL;
  try {
    url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  if (!YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;

  const fromQuery = url.searchParams.get('v');
  if (fromQuery && YOUTUBE_ID_PATTERN.test(fromQuery)) return fromQuery;

  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  // youtu.be/<id>
  if (url.hostname.toLowerCase().endsWith('youtu.be')) {
    return YOUTUBE_ID_PATTERN.test(segments[0]) ? segments[0] : null;
  }

  // /embed/<id>, /shorts/<id>, /live/<id>, /v/<id>
  const [prefix, candidate] = segments;
  if (
    candidate &&
    ['embed', 'shorts', 'live', 'v'].includes(prefix) &&
    YOUTUBE_ID_PATTERN.test(candidate)
  ) {
    return candidate;
  }

  return null;
}

/**
 * 유튜브 썸네일 URL.
 * - 'hq': 모든 영상에 존재 (480x360) — 서버 렌더링에 안전
 * - 'max': 고화질이지만 없는 영상도 있음 — onError 폴백이 가능한 곳에서만 사용
 */
export function getYoutubeThumbnail(
  videoId: string,
  quality: 'hq' | 'max' = 'hq',
): string {
  const file = quality === 'max' ? 'maxresdefault' : 'hqdefault';
  return `https://i.ytimg.com/vi/${videoId}/${file}.jpg`;
}

/** 클릭 후 바로 재생되는 임베드 URL (쿠키 최소화 도메인 사용) */
export function getYoutubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
}
