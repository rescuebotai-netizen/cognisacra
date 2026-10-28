import React from 'react';
const CpuChipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M8.25 21v-1.5M4.5 15.75H3m18 0h-1.5M15.75 3v1.5M19.5 8.25H21M15.75 21v-1.5m3.75-12.75H21M3.375 19.125c-.621 0-1.125-.504-1.125-1.125V6.002c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v12.001c0 .621-.504 1.125-1.125 1.125H3.375z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25h6v7.5H9v-7.5z" />
  </svg>
);
export default CpuChipIcon;
