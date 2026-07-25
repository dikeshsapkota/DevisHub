import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'violet' | 'magenta' | 'lime' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    violet: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    magenta: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
    lime: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    outline: 'bg-white/5 text-slate-300 border-white/10',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-mono px-2.5 py-1',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-md border font-medium transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
