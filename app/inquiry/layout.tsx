import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기업 문의',
  description: '이루빛터와 함께할 기업을 찾습니다. 장애인 근로자 채용 및 근태 관리에 대해 문의하세요.',
  alternates: {
    canonical: 'https://www.irubitteo.com/inquiry',
  },
};

export default function InquiryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
