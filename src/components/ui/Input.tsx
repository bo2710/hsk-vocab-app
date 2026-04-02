import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        // FIX DARK MODE: Thêm bg-white dark:bg-gray-700
        className={`w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white transition-shadow ${className}`}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';