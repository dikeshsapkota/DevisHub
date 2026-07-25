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
  glow = 'cyan',
  hoverEffect = true,
  className,
  ...props
}) => {
  const glowStyles = {
    cyan: 'border-cyan-500/20 shadow-[0_0_20px_rgba(0,240,255,0.05)]',
    violet: 'border-purple-500/20 shadow-[0_0_20px_rgba(139,92,246,0.05)]',
    magenta: 'border-pink-500/20 shadow-[0_0_20px_rgba(255,0,122,0.05)]',
    none: 'border-white/10',
  };

  return (
    <div
      className={clsx(
        'glass-panel rounded-xl p-6 relative overflow-hidden transition-all duration-300',
        glowStyles[glow],
        hoverEffect && 'hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {/* Corner Cyber accent line */}
      <div className="absolute top-0 right-0 w-8 h-[2px] bg-gradient-to-l from-cyan-400 to-transparent opacity-60" />
      {children}
    </div>
  );
};
