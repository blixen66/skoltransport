import React from 'react';

interface LoadingSpinnerProps {
  isVisible: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  isVisible, 
  text = 'Optimering pågår...' 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <div className="text-base-content font-medium">{text}</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

