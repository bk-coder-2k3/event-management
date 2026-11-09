import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'default';
  size?: 'sm' | 'md';
}

export function Badge({ className = '', variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const variantStyles = {
    default: 'bg-ivory-200 text-burgundy-900 border border-ivory-300',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200 font-medium',
    danger: 'bg-red-50 text-red-800 border border-red-200 font-medium',
    info: 'bg-blue-50 text-blue-800 border border-blue-200 font-medium',
    gold: 'bg-gold-50 text-gold-900 border border-gold-300 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
