import React from 'react';
import { Spinner } from '@chakra-ui/react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="rose.500"
        size="xl"
      />
    </div>
  );
};

export default LoadingSpinner;
