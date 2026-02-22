'use client';

import { useState } from 'react';

export default function PurchaseInquiryButton() {
  const [copied, setCopied] = useState(false);
  const phone = '070-8064-4554';

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      window.prompt('전화번호를 복사하세요:', phone);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-white bg-landing-orange px-6 py-3 rounded font-semibold hover:bg-landing-orange/90 transition-colors shadow-sm text-lg"
    >
      {copied ? '번호가 복사되었습니다!' : '작품 구매 문의'}
    </button>
  );
}
