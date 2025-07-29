// src/components/ui/button.tsx
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Базова кнопка з Tailwind стилями
 */
export const Button: React.FC<ButtonProps> = ({ className = '', children, ...props }) => (
  <button
    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
