import React from 'react';

const CubeTransparentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M14 10V8.5M14 10l2-1M10 10l-2-1M10 10v2.5M10 10V8.5M12 15l-2-1m2 1l2-1m-2 1v2.5M12 15V12.5M12 21a9 9 0 110-18 9 9 0 010 18z" />
  </svg>
);

export default CubeTransparentIcon;