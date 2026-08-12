import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-48 w-full">
      <Loader2 className="w-10 h-10 text-[var(--color-accent)] animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
