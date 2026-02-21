import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'primary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className }) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    primary: 'badge-primary',
  };

  return (
    <span className={clsx('badge', variants[variant], className)}>
      {children}
    </span>
  );
};
