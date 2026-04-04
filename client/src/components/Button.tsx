import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ children, href, onClick, className, type = 'button' }) => {
  const baseClasses = 'rounded-full border-2 border-primary bg-primary px-8 py-3 text-base font-semibold text-white hover:bg-white hover:text-primary transition-all duration-300';

  if (href) {
    return (
      <a href={href} className={cn(baseClasses, className)}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(baseClasses, className)}
    >
      {children}
    </button>
  );
};

export default Button;