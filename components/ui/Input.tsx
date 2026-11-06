'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  /** 입력칸 오른쪽에 배치할 요소 (예: 비밀번호 보기 버튼) */
  rightElement?: React.ReactNode;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3.5 text-base',
  lg: 'px-5 py-4 text-lg',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      label,
      error,
      leftIcon,
      rightElement,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-duru-orange-400 focus:border-transparent placeholder:text-gray-400',
              error
                ? 'border-red-400 bg-red-50/50'
                : 'border-gray-200 bg-white hover:border-gray-300',
              sizeStyles[size],
              leftIcon && 'pl-10',
              rightElement && 'pr-12',
              className
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              {rightElement}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, type InputProps, type InputSize };
