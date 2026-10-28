import React from 'react';

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.75A2.25 2.25 0 004.5 6v1.5M9 3.75V3h3v.75M9 3.75v1.5M15 3.75H17.25A2.25 2.25 0 0119.5 6v1.5M15 3.75V3h-3v.75M15 3.75v1.5M6.75 18v-3a3.375 3.375 0 013.375-3.375h3.75a3.375 3.375 0 013.375 3.375v3M12 12.75V18" />
  </svg>
);

export default TrophyIcon;
