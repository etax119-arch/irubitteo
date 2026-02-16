import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '이루빛터 - 장애인 근로자와 기업이 함께 빛나는 일터',
    short_name: '이루빛터',
    description: '장애인 근로자와 기업을 위한, 일자리 매칭, 장애인 표준사업장, 장애인 고용부담금, 인증대행',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFDF7',
    theme_color: '#F97316',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
