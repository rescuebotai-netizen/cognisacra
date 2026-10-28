import React from 'react';

const ThumbsDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 4.5c.806 0 1.533.446 2.031 1.08a9.041 9.041 0 012.861 2.4c.723.384 1.35.956 1.653 1.715a4.498 4.498 0 00.322 1.672v1.652a.75.75 0 01-.75.75A2.25 2.25 0 0116.5 15c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H13.5c-1.026 0-1.945-.694-2.054-1.715A4.496 4.496 0 0011.25 6c0-.83.112-1.633.322-2.396C11.806 3.256 12.63 3 13.51 3H15.75M6.375 15.75V6m0 9.75h-2.25A.75.75 0 013 15V7.5a.75.75 0 01.75-.75h2.25" />
  </svg>
);

export default ThumbsDownIcon;
