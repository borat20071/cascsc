import React from 'react';

export function Preloader() {
  return (
    <div className="inline-flex items-center justify-center" aria-label="Loading...">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}