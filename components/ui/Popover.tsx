'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

/** 트리거와 드롭다운 사이 간격(px) */
const GAP = 4;
/** 뷰포트 가장자리에서 최소 이 만큼은 띄운다 */
const EDGE = 8;
/**
 * 모달(최대 z-[100]) 위, 토스트(z-[9999]) 아래.
 * body로 포털하므로 모달과 형제가 되어 z-index로만 순서가 정해진다.
 */
const Z = 'z-[200]';

type Position = { top: number; left: number };

/**
 * 트리거에 앵커된 드롭다운.
 *
 * 드롭다운은 `document.body`로 포털한다 — 모달 본문(`overflow-y-auto`)처럼
 * 스크롤 컨테이너 안에서 쓰이면 `absolute` 자식이 컨테이너에 잘려 달력 아래쪽이
 * 보이지 않기 때문이다. 포털 + `fixed`면 조상의 overflow와 무관해진다.
 *
 * 모바일(sm 미만)은 화면 중앙 고정 오버레이로 띄운다.
 */
export function Popover({ trigger, children, isOpen, onClose, className }: PopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /** 트리거 위치 기준으로 드롭다운 좌표를 잡고, 넘치면 위/왼쪽으로 접는다 */
  const reposition = useCallback(() => {
    const trigger = containerRef.current;
    const dropdown = dropdownRef.current;
    if (!trigger || !dropdown) return;

    const anchor = trigger.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = dropdown;

    const fitsBelow = anchor.bottom + GAP + height <= window.innerHeight - EDGE;
    const top = fitsBelow
      ? anchor.bottom + GAP
      : Math.max(EDGE, anchor.top - GAP - height);

    const left = Math.max(
      EDGE,
      Math.min(anchor.left, window.innerWidth - width - EDGE),
    );

    setPosition((prev) =>
      prev?.top === top && prev?.left === left ? prev : { top, left },
    );
  }, []);

  // 열릴 때 한 번 재고, 그 뒤 스크롤/리사이즈에 따라간다.
  // 스크롤은 capture로 들어야 모달 본문 같은 내부 스크롤 컨테이너도 잡힌다.
  // 닫힐 때 좌표를 비우지 않는다 — 드롭다운이 언마운트되고, 다시 열릴 때는
  // useLayoutEffect가 페인트 전에 reposition()을 돌려 새 좌표로 덮는다.
  useLayoutEffect(() => {
    if (!isOpen) return;

    reposition();
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [isOpen, reposition]);

  useEffect(() => {
    if (!isOpen) return;

    // 포털된 드롭다운은 containerRef 밖이라 함께 확인해야 한다.
    // 빠뜨리면 달력을 클릭하는 순간 "바깥 클릭"으로 닫힌다.
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        onCloseRef.current();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const dropdown = (
    <>
      {/* 모바일: 배경 딤 (탭하면 닫힘) */}
      <div
        className={cn('fixed inset-0 bg-black/40 sm:hidden', Z)}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={dropdownRef}
        // 좌표를 CSS 변수로 넘긴다 — inline top/left로 주면 명시도가 높아
        // 모바일의 중앙 정렬(left-1/2 top-1/2)까지 덮어버린다.
        style={
          position
            ? ({
                '--popover-top': `${position.top}px`,
                '--popover-left': `${position.left}px`,
              } as React.CSSProperties)
            : undefined
        }
        className={cn(
          'rounded-xl border border-gray-200 bg-white shadow-lg',
          Z,
          // 모바일: 화면 중앙 고정
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] overflow-auto',
          // sm 이상: 트리거에 앵커
          'sm:translate-x-0 sm:translate-y-0 sm:max-h-none sm:overflow-visible',
          'sm:top-[var(--popover-top)] sm:left-[var(--popover-left)]',
          // 좌표를 재기 전에는 위치가 튀므로 숨긴다 (모바일은 중앙이라 무관)
          !position && 'sm:invisible',
          className,
        )}
      >
        {children}
      </div>
    </>
  );

  return (
    <div ref={containerRef} className="relative">
      {trigger}
      {isOpen && typeof document !== 'undefined'
        ? createPortal(dropdown, document.body)
        : null}
    </div>
  );
}
