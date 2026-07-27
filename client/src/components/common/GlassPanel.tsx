import React from 'react';
import { clsx } from 'clsx';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: 'cyan' | 'violet' | 'magenta' | 'none';
  hoverEffect?: boolean;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  glow: _glow = 'cyan',
  hoverEffect = true,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'glass-panel rounded-xl p-6 transition-colors duration-200',
        hoverEffect && 'glass-panel-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
