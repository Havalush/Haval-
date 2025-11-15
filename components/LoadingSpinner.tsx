
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 mt-8">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-slate-600 font-medium">AI is tidying up its thoughts...<br/>Analyzing your space now.</p>
    </div>
  );
};
