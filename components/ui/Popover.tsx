'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.top;
    if (spaceBelow < rect.height + 8) {
      setPlacement('top');
    } else {
      setPlacement('bottom');
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      {trigger}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute left-0 z-50 mt-1 rounded-xl border border-gray-200 bg-white shadow-lg',
            placement === 'top' && 'bottom-full mb-1 mt-0',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
