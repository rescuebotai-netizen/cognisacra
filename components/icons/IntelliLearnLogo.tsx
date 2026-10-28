import React from 'react';

export interface CogniSacraLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    showText?: boolean;
    textClassName?: string;
}

const CogniSacraLogo: React.FC<CogniSacraLogoProps> = ({ 
    className = 'w-6 h-6', 
    alt = 'CogniSacra', 
    showText = false,
    textClassName = 'font-mono font-bold text-white',
    ...props 
}) => {
    return (
        <span className="inline-flex items-center gap-2.5 shrink-0">
            <span className="p-1 bg-white rounded-lg shadow-sm border border-zinc-200 inline-flex items-center justify-center shrink-0">
                <img 
                    src="/cogni-sacra.jpeg" 
                    alt={alt} 
                    className={`object-contain rounded block shrink-0 ${className}`} 
                    {...props} 
                />
            </span>
            {showText && (
                <span className={textClassName}>
                    CogniSacra
                </span>
            )}
        </span>
    );
};

export default CogniSacraLogo;
