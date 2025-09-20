import React from 'react';
import { Alert as AlertType } from '../types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AlertProps {
  alert: AlertType;
  onRemove: (id: string) => void;
}

const Alert: React.FC<AlertProps> = ({ alert, onRemove }) => {
  const getAlertClasses = (type: AlertType['type']) => {
    const baseClasses = 'alert shadow-lg';
    switch (type) {
      case 'success':
        return `${baseClasses} alert-success`;
      case 'danger':
        return `${baseClasses} alert-error`;
      case 'warning':
        return `${baseClasses} alert-warning`;
      case 'info':
        return `${baseClasses} alert-info`;
      default:
        return `${baseClasses} alert-info`;
    }
  };

  const getIcon = (type: AlertType['type']) => {
    switch (type) {
      case 'success':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
      case 'danger':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
      case 'warning':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        );
      case 'info':
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={getAlertClasses(alert.type)}>
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {getIcon(alert.type)}
        </svg>
        <div className="flex-1">
          <span className="font-medium">{alert.message}</span>
        </div>
        <button
          onClick={() => onRemove(alert.id)}
          className="btn btn-ghost btn-sm btn-circle"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Alert;

