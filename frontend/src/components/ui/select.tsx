// src/components/ui/select.tsx
import React from 'react';

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface SelectValueProps { placeholder?: string; children?: React.ReactNode }
export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Простий стилізований Select контейнер.
 * Використовується як обгортка для Trigger та Content.
 */
export const Select: React.FC<SelectProps> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

/**
 * Trigger для відкриття Select меню.
 */
export const SelectTrigger: React.FC<SelectTriggerProps> = React.forwardRef(
  ({ children, className = '', ...props }, ref: React.Ref<HTMLDivElement>) => (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={`w-full text-left border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
);

/**
 * Значення, що відображається в Trigger.
 */
export const SelectValue: React.FC<SelectValueProps> = ({ placeholder, children }) => (
  <span>{children || placeholder}</span>
);

/**
 * Контент з опціями.
 */
export const SelectContent: React.FC<SelectContentProps> = ({ children, className = '', ...props }) => (
  <div className={`mt-1 border rounded bg-white shadow ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Окрема опція в Select меню.
 */
export const SelectItem: React.FC<SelectItemProps> = ({ children, className = '', ...props }) => (
  <div
    className={`cursor-pointer px-2 py-1 hover:bg-gray-100 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Select;
