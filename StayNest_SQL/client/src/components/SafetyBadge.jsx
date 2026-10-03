import React from 'react';
import { ShieldCheck } from 'lucide-react';

const SafetyBadge = ({ score }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF7F0] text-[#198754] text-xs font-bold border border-[#D4F0E2]">
      <ShieldCheck className="w-3.5 h-3.5 text-[#198754]" />
      <span>Safety {score}</span>
    </div>
  );
};

export default SafetyBadge;
