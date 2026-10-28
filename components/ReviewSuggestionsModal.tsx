import React, { useEffect, useRef } from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface ReviewSuggestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestions: string | null;
    isLoading: boolean;
}

const ReviewSuggestionsModal: React.FC<ReviewSuggestionsModalProps> = ({ isOpen, onClose, suggestions, isLoading }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = "review-suggestions-modal-title";

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
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl m-4 relative transform transition-all animate-fade-in flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
            >
                <div className="p-6 border-b dark:border-gray-700">
                    <h3 id={titleId} className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <SparklesIcon className="w-6 h-6 mr-3 text-crimson" />
                        AI-Powered Review
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Here are some key areas to review based on your incorrect answers.</p>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-48">
                            <SparklesIcon className="w-10 h-10 animate-spin text-crimson" />
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing your answers and generating suggestions...</p>
                        </div>
                    )}
                    {suggestions && (
                        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed prose dark:prose-invert">
                           {suggestions}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t dark:border-gray-700 mt-auto bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-crimson text-base font-medium text-white hover:bg-red-800"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewSuggestionsModal;
