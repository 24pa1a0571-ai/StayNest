import React from 'react';

const VerifiedBadge = ({ size = 'sm' }) => {
  if (size === 'lg') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF7F0] text-[#198754] text-xs font-semibold uppercase tracking-wider border border-[#D4F0E2]">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Verified Stay
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF7F0] text-[#198754] text-xs font-semibold border border-[#D4F0E2]">
      ✓ Verified
    </span>
  );
};

export default VerifiedBadge;
