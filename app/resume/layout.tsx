import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이력서 등록',
  description: '이루빛터에 이력서를 등록하고 맞춤형 일자리를 찾아보세요.',
  alternates: { canonical: '/resume' },
  openGraph: {
    title: '이력서 등록 | 이루빛터',
    description: '이루빛터에 이력서를 등록하고 맞춤형 일자리를 찾아보세요.',
  },
};

export default function ResumeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
