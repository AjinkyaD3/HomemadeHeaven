import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  fullScreen = false,
  overlay = false 
}) => {
  const spinnerSizes = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const spinnerClasses = `
    inline-block animate-spin rounded-full 
    border-4 border-solid border-rose-500 
    border-r-transparent align-[-0.125em] 
    motion-reduce:animate-[spin_1.5s_linear_infinite]
    ${spinnerSizes[size]}
  `;

  const wrapperClasses = `
    flex items-center justify-center
    ${fullScreen ? 'fixed inset-0' : 'w-full h-full min-h-[200px]'}
    ${overlay ? 'bg-white/80 backdrop-blur-sm z-50' : ''}
  `;

  return (
    <div className={wrapperClasses}>
      <div className="relative">
        <div className={spinnerClasses} role="status" />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;