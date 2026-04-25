import React from 'react';

export default function Spinner({ size = 'md', label = 'Loading...' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-600`}
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
