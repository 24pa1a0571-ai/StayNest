import React from 'react';

const Rating = ({ value, count }) => {
  return (
    <div className="flex items-center gap-1 text-sm font-semibold text-[#1F2933]">
      <span className="text-amber-500">★</span>
      <span>{Number(value).toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-[#6B7280] font-normal">({count})</span>
      )}
    </div>
  );
};

export default Rating;
