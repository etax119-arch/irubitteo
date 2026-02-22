'use client';

import { useState } from 'react';

export default function PurchaseInquiryButton() {
  const [copied, setCopied] = useState(false);
  const phone = '0262137773';

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      window.prompt('아래 번호를 복사하세요:', phone);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-white bg-landing-orange px-6 py-3 rounded font-semibold hover:bg-landing-orange/90 transition-colors shadow-sm text-lg"
    >
      {copied ? phone : '작품 구매 문의'}
    </button>
  );
}
