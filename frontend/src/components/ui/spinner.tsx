// src/components/ui/spinner.tsx
import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Простий Spinner з Tailwind класами
 */
export const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  const sizeClass =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <div
      className={`${sizeClass} animate-spin rounded-full border-4 border-t-transparent border-gray-200`}
    />
  );
};

export default Spinner;
