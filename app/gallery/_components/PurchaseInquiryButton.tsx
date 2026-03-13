'use client';

import { useState } from 'react';
import { Phone, Copy, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function PurchaseInquiryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const phoneDisplay = '02-6213-7773';
  const phoneRaw = '0262137773';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneRaw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('아래 번호를 복사하세요:', phoneRaw);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-white bg-landing-orange px-6 py-3 rounded font-semibold hover:bg-landing-orange/90 transition-colors shadow-sm text-lg"
      >
        작품 구매 문의
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="작품 구매 문의"
        size="lg"
      >
        <p className="text-gray-600 leading-relaxed mb-6">
          빛터갤러리의 작품으로 그립톡, 컵, 탁상 달력등 다양한 굿즈를 만들수
          있습니다. 굿즈 관련 문의는 유선으로 연락주시기 바랍니다.
        </p>

        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-landing-orange/10 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-landing-orange" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {phoneDisplay}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-landing-orange hover:bg-landing-orange/10 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                복사
              </>
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}
