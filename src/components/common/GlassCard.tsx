import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={`glass-card rounded-2xl p-4 transition-all duration-300 ${
        hoverEffect ? 'hover:border-accent/40 hover:bg-background-hover/80 hover:shadow-lg hover:shadow-accent/5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
