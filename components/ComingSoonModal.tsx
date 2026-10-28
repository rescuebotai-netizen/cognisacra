import React, { useEffect, useRef } from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName: string;
    featureDescription: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose, featureName, featureDescription }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = "coming-soon-modal-title";

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        setTimeout(() => modalRef.current?.focus(), 100);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
            onClick={onClose}
            role="presentation"
        >
            <div 
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md m-4 p-6 relative transform transition-all animate-fade-in"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900">
                        <SparklesIcon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h3 id={titleId} className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{featureName}</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-500 dark:text-gray-400">Coming Soon!</p>
                    <p className="mt-4 text-md text-gray-600 dark:text-gray-300">{featureDescription}</p>
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none"
                        onClick={onClose}
                    >
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonModal;