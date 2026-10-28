import React, { useState, useEffect, useRef } from 'react';
import StarIcon from './icons/StarIcon';
import AnnotationIcon from './icons/AnnotationIcon';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, courseTitle }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = "feedback-modal-title";
    
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

    const handleSubmit = () => {
        // In a real app, you would submit this data to a backend
        console.log({ rating, comment });
        alert('Thank you for your feedback!');
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
            onClick={onClose}
            role="presentation"
        >
            <div 
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg m-4 p-6 relative transform transition-all animate-fade-in"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900">
                        <AnnotationIcon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h3 id={titleId} className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Leave Feedback</h3>
                    <p className="mt-2 text-md text-gray-600 dark:text-gray-400">How would you rate your experience with "{courseTitle}"?</p>
                </div>

                 <div className="mt-6 flex justify-center space-x-2" role="group" aria-labelledby="rating-label">
                    <span id="rating-label" className="sr-only">Rate this course</span>
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            aria-label={`${star} star${star > 1 ? 's' : ''}`}
                            aria-pressed={rating === star}
                            className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500"
                        >
                            <StarIcon 
                                className={`w-10 h-10 cursor-pointer transition-colors ${
                                    (hoverRating || rating) >= star 
                                    ? 'text-amber-400' 
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                            />
                        </button>
                    ))}
                </div>


                <div className="mt-6">
                     <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Additional Comments (Optional)
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like or think could be improved?"
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={4}
                    />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                     <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={rating === 0}
                    >
                        Submit Feedback
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;