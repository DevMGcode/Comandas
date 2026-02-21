import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, onClick }) => {
  const Component = onClick ? motion.div : 'div';
  
  return (
    <Component
      className={clsx(
        'glass rounded-xl p-6 shadow-xl',
        hover && 'glass-hover cursor-pointer',
        className
      )}
      onClick={onClick}
      {...(onClick && {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
      })}
    >
      {children}
    </Component>
  );
};
