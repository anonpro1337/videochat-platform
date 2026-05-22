'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25': variant === 'primary',
            'glass hover:bg-white/10 text-text-primary': variant === 'secondary',
            'hover:bg-white/5 text-text-muted hover:text-text-primary': variant === 'ghost',
            'bg-destructive hover:bg-destructive-dark text-white': variant === 'destructive',
          },
          {
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-5 py-2.5 text-sm': size === 'md',
            'px-8 py-3.5 text-base': size === 'lg',
          },
          className,
        )}
        {...props}
      >
        {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : children}
      </button>
    );
  },
);

Button.displayName = 'Button';
