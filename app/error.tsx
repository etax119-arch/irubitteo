'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Unhandled error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          문제가 발생했습니다
        </h2>
        <p className="text-gray-600 mb-6">
          일시적인 오류가 발생했습니다. 다시 시도해주세요.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-duru-orange-500 text-white rounded-xl font-semibold hover:bg-duru-orange-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
