'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function Popover({ trigger, children, isOpen, onClose, className }: PopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
  const [align, setAlign] = useState<'left' | 'right'>('left');
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  const dropdownRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.top;
    setPlacement(spaceBelow < rect.height + 8 ? 'top' : 'bottom');
    const spaceRight = window.innerWidth - rect.left;
    setAlign(spaceRight < rect.width + 8 ? 'right' : 'left');
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {trigger}
      {isOpen && (
        <>
          {/* 모바일: 배경 딤 (탭하면 닫힘) */}
          <div
            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
            aria-hidden="true"
            onClick={onClose}
          />
          <div
            ref={dropdownRef}
            className={cn(
              'z-50 rounded-xl border border-gray-200 bg-white shadow-lg',
              // 모바일: 화면 중앙 고정 모달
              'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] overflow-auto',
              // sm 이상: 트리거에 앵커된 드롭다운
              'sm:absolute sm:top-auto sm:translate-x-0 sm:translate-y-0 sm:mt-1 sm:max-h-none sm:overflow-visible',
              align === 'right' ? 'sm:left-auto sm:right-0' : 'sm:right-auto sm:left-0',
              placement === 'top' && 'sm:bottom-full sm:mb-1 sm:mt-0',
              className
            )}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
