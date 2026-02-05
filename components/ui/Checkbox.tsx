'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

type CheckboxSize = 'sm' | 'md' | 'lg';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  size?: CheckboxSize;
}

const sizeStyles: Record<CheckboxSize, { checkbox: string; label: string }> = {
  sm: { checkbox: 'w-4 h-4', label: 'text-sm' },
  md: { checkbox: 'w-5 h-5', label: 'text-base' },
  lg: { checkbox: 'w-7 h-7', label: 'text-lg' },
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      size = 'md',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-center gap-3 cursor-pointer select-none',
          className
        )}
      >
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={cn(
            'rounded border-gray-300 text-duru-orange-600 focus:ring-duru-orange-500 accent-duru-orange-500 cursor-pointer shrink-0',
            sizeStyles[size].checkbox
          )}
          {...props}
        />
        {label && (
          <span className={cn('text-gray-700', sizeStyles[size].label)}>
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox, type CheckboxProps, type CheckboxSize };
