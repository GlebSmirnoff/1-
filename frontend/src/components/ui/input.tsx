// src/components/ui/input.tsx
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Базовий інпут з Tailwind стилями
 */
export const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

export default Input;
