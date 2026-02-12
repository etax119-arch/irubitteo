'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          padding: '1rem',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '1rem',
            }}>
              문제가 발생했습니다
            </h2>
            <p style={{
              color: '#4b5563',
              marginBottom: '1.5rem',
            }}>
              일시적인 오류가 발생했습니다. 다시 시도해주세요.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f97316',
                color: 'white',
                borderRadius: '0.75rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
