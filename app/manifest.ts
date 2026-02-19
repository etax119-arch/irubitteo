import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '이루빛터 - 장애인 근로자와 기업이 함께 빛나는 일터',
    short_name: '이루빛터',
    description: '이루빛터는 장애인 근로자 채용 연계부터 출퇴근 관리까지 지원하는 통합 고용 관리 플랫폼입니다.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFDF7',
    theme_color: '#F97316',
    icons: [
      { src: '/icon.png', sizes: '48x48', type: 'image/png' },
    ],
  };
}
