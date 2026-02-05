'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

type IconButtonVariant = 'default' | 'ghost' | 'outline';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: React.ReactNode;
  label?: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default: 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400',
  ghost: 'text-gray-600 hover:bg-gray-100 disabled:text-gray-400',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400',
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizeStyles: Record<IconButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      icon,
      label,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <span className={iconSizeStyles[size]}>{icon}</span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton, type IconButtonProps, type IconButtonVariant, type IconButtonSize };
