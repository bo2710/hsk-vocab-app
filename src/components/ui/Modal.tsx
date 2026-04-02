import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col transform transition-transform"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 id="modal-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none px-2 outline-none focus:ring-2 focus:ring-primary-500 rounded"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <div className="p-4 md:p-6 overflow-y-auto flex-1 text-gray-800 dark:text-gray-200">
          {children}
        </div>
        
        {actions && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-950/50">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};