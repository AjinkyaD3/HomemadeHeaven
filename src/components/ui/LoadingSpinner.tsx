import React from 'react';
import { Spinner } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const spinnerSize = {
    small: 'sm',
    medium: 'md',
    large: 'lg'
  }[size];

  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size={spinnerSize}
    />
  );
};

export default LoadingSpinner;