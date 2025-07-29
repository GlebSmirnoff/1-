// src/components/ui/card.tsx
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Card container with default Tailwind styling
 */
export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <div className={`bg-white rounded-2xl shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

/**
 * CardContent wrapper for padding and layout inside Card
 */
export const CardContent: React.FC<CardContentProps> = ({ className = '', children, ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
