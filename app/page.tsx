import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Header from './_components/Header';
import HeroSection from './_components/HeroSection';
import ServiceSection from './_components/ServiceSection';
import ManagementSystemSection from './_components/ManagementSystemSection';
import ConsultingProcessSection from './_components/ConsultingProcessSection';
import RecommendedJobsSection from './_components/RecommendedJobsSection';
import AnnouncementSection from './_components/AnnouncementSection';
import ClosingCtaSection from './_components/ClosingCtaSection';
import Footer from './_components/Footer';
import StructuredData from './_components/StructuredData';
import { serverFetch } from '@/lib/api/server-fetch';
import type { GalleryItem } from '@/types/gallery';
import type { AnnouncementItem } from '@/types/announcement';
import type { PaginatedResponse } from '@/types/api';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.irubitteo.com',
  },
};

const organizationData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '이루빛터',
  alternateName: 'Irubitteo',
  url: 'https://www.irubitteo.com',
  logo: 'https://www.irubitteo.com/images/logo.png',
  description: '가능성이 일상의 빛이 되는 곳, 이루빛터에서는 장애인 근로자를 위한 맞춤형 직무를 설계하고 매칭하여 빛나는 내일을 함께 합니다.',
};

const websiteData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '이루빛터',
  alternateName: 'Irubitteo',
  url: 'https://www.irubitteo.com',
};

const siteNavigationData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    { '@type': 'SiteNavigationElement', position: 1, name: '빛터 갤러리', url: 'https://www.irubitteo.com/gallery' },
    { '@type': 'SiteNavigationElement', position: 2, name: '빛터 소식지', url: 'https://www.irubitteo.com/newsletter' },
    { '@type': 'SiteNavigationElement', position: 3, name: '빛터 공고', url: 'https://www.irubitteo.com/announcements' },
    { '@type': 'SiteNavigationElement', position: 4, name: '신규기업 문의', url: 'https://www.irubitteo.com/inquiry' },
    { '@type': 'SiteNavigationElement', position: 5, name: '이력서 등록', url: 'https://www.irubitteo.com/resume' },
  ],
};

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
});

export default async function LandingPage() {
  // 로드 실패 시 해당 섹션(캐러셀/공고)은 렌더링되지 않음
  const [galleryResult, announcementResult] = await Promise.allSettled([
    serverFetch<PaginatedResponse<GalleryItem>>('/galleries?page=1&limit=10'),
    serverFetch<PaginatedResponse<AnnouncementItem>>('/announcements?page=1&limit=6'),
  ]);
  const galleryItems: GalleryItem[] =
    galleryResult.status === 'fulfilled' ? galleryResult.value.data : [];
  const announcementItems: AnnouncementItem[] =
    announcementResult.status === 'fulfilled' ? announcementResult.value.data : [];

  return (
    <div className={`min-h-screen bg-duru-ivory text-duru-text-main selection:bg-landing-orange selection:text-white ${notoSansKR.className}`} style={{ fontWeight: 500 }}>
      <StructuredData data={organizationData} />
      <StructuredData data={websiteData} />
      <StructuredData data={siteNavigationData} />
      <Header />
      <HeroSection />
      <ServiceSection galleryItems={galleryItems} />
      <ManagementSystemSection />
      <RecommendedJobsSection />
      <ConsultingProcessSection />
      <AnnouncementSection items={announcementItems} />
      <ClosingCtaSection variant="split" />
      <Footer />
    </div>
  );
}
