import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 transition-shadow resize-y ${className}`}
        {...props}
      />
    </div>
  );
});

Textarea.displayName = 'Textarea';