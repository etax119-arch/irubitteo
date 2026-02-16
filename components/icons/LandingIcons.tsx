interface IconProps {
  className?: string;
}

// 스마트폰 체크
export function SmartCheckIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 6h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9.5 12l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 실시간 차트
export function RealtimeChartIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 15V12M12 15V9M16 15V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="19" cy="6" r="2.5" fill="currentColor"/>
    </svg>
  );
}

// 자동 계산기
export function AutoCalculatorIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="8" y="6" width="8" height="3" rx="1" fill="currentColor"/>
      <circle cx="8.5" cy="13" r="0.8" fill="currentColor"/>
      <circle cx="12" cy="13" r="0.8" fill="currentColor"/>
      <circle cx="15.5" cy="13" r="0.8" fill="currentColor"/>
      <circle cx="8.5" cy="16.5" r="0.8" fill="currentColor"/>
      <circle cx="12" cy="16.5" r="0.8" fill="currentColor"/>
      <circle cx="15.5" cy="16.5" r="0.8" fill="currentColor"/>
    </svg>
  );
}

// 문서 파일
export function DocumentStackIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M14 3v5h5M9 13h6M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 따뜻한 손
export function WarmHandIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M11 8V6.5a1.5 1.5 0 0 1 3 0V8M11 8V6.5a1.5 1.5 0 0 0-3 0V11M11 8v3M14 8.5V5a1.5 1.5 0 0 1 3 0v8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 13.5V16a5 5 0 0 1-5 5H9.5a3.5 3.5 0 0 1-3.5-3.5V11a1.5 1.5 0 0 1 3 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// 성장 화살표
export function GrowthArrowIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 7h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 사람들
export function PeopleIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="17" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M21 21v-1.5a3 3 0 0 0-3-3h-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// 방패 (안정성)
export function ShieldCheckIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L4 7v6c0 5.25 3.5 9 8 11 4.5-2 8-5.75 8-11V7l-8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 별 (품질)
export function StarIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
    </svg>
  );
}

// 나침반 (길찾기)
export function CompassIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M15.5 8.5l-2.3 5.7-5.7 2.3 2.3-5.7 5.7-2.3z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  );
}

// 하트 펄스
export function HeartPulseIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.64l.77.78L12 20.5l7.65-7.5.77-.78a5.4 5.4 0 0 0 0-7.64z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 13h2l1.5-3 1.5 3h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 빌딩 하트
export function BuildingHeartIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="17" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 8h2M14 8h2M8 12h2M14 12h2M10 21v-4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 5.5c0-.6.4-1 1-1s1 .4 1 1-.9 1.5-1 2c-.1-.5-1-1.4-1-2z" fill="currentColor"/>
    </svg>
  );
}

// 클립보드 체크
export function ClipboardCheckIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 2h6v3H9V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 라이트 전구
export function LightBulbIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5V15a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1.5A6 6 0 0 1 12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 7v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// 메달
export function MedalIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="13" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M15.5 7.5L18 2l-6 4-6-4 2.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}