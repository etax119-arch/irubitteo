import ClosingCtaSection from '@/app/_components/ClosingCtaSection';

const VARIANTS = [
  { variant: 'cards', label: 'A · 2개 카드 병렬' },
  { variant: 'banner', label: 'B · 중앙 배너 + 버튼 2개' },
  { variant: 'split', label: 'C · 좌우 분할 풀패널' },
] as const;

export default function CtaPlaygroundPage() {
  return (
    <main>
      {VARIANTS.map(({ variant, label }) => (
        <div key={variant} className="relative">
          <div className="sticky top-0 z-40 bg-gray-900 text-white text-sm font-semibold px-4 py-2">
            {label}
          </div>
          <ClosingCtaSection variant={variant} />
        </div>
      ))}
    </main>
  );
}
