import React, { useState, useEffect, useCallback } from 'react';
import { Course, Lesson } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import { generateAdaptiveQuestion, getReviewSuggestions, QuizQuestion } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import ReviewSuggestionsModal from './ReviewSuggestionsModal';
import BookOpenIcon from './icons/BookOpenIcon';

interface AdaptiveQuizViewProps {
    course: Course;
    quizLesson: Lesson;
    onBack: () => void;
}

const QUIZ_LENGTH = 5;
const COOLDOWN_MINUTES = 5;

const AdaptiveQuizView: React.FC<AdaptiveQuizViewProps> = ({ course, quizLesson, onBack }) => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [history, setHistory] = useState<{ question: string; userAnswer: string; isCorrect: boolean }[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState('');
    const [reviewSuggestions, setReviewSuggestions] = useState<string | null>(null);
    const [isGeneratingReview, setIsGeneratingReview] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const fetchNextQuestion = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newQuestion = await generateAdaptiveQuestion(quizLesson.title, history);
            setQuestions(prev => [...prev, newQuestion]);
        } catch (e) {
            setError("Could not load the next question. Please try again later.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [quizLesson.title, history]);

    useEffect(() => {
        fetchNextQuestion();
    }, []);

    const handleSubmitAnswer = () => {
        if (!selectedAnswer) return;

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.answer;
        
        setFeedback({ isCorrect, explanation: currentQuestion.explanation });
        
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        
        setHistory(prev => [
            { question: currentQuestion.question, userAnswer: selectedAnswer, isCorrect },
            ...prev
        ]);
    };

    const handleNextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex >= QUIZ_LENGTH) {
            setIsFinished(true);
            return;
        }

        setSelectedAnswer(null);
        setFeedback(null);
        setCurrentQuestionIndex(nextIndex);

        if (!questions[nextIndex]) {
            fetchNextQuestion();
        }
    };
    
    const restartQuiz = () => {
        setQuestions([]);
        setHistory([]);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setFeedback(null);
        setScore(0);
        setIsFinished(false);
        setError(null);
        setIsLoading(true);
        setCooldownUntil(null);
        setTimeLeft('');
    
        generateAdaptiveQuestion(quizLesson.title, [])
            .then(newQuestion => {
                setQuestions([newQuestion]);
            })
            .catch(e => {
                setError("Could not restart the quiz. Please try again later.");
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const passingScorePercentage = 70;
    const userScorePercentage = questions.length > 0 ? (score / QUIZ_LENGTH) * 100 : 0;
    const hasPassed = isFinished && userScorePercentage >= passingScorePercentage;
    
    useEffect(() => {
        if (isFinished && !hasPassed && !cooldownUntil) {
            setCooldownUntil(Date.now() + COOLDOWN_MINUTES * 60 * 1000);
        }
    }, [isFinished, hasPassed, cooldownUntil]);
    
    useEffect(() => {
        if (!cooldownUntil) return;
        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = cooldownUntil - now;
            if (remaining <= 0) {
                clearInterval(interval);
                setTimeLeft('');
                setCooldownUntil(null);
            } else {
                const minutes = Math.floor((remaining / 1000) / 60);
                const seconds = Math.floor((remaining / 1000) % 60);
                setTimeLeft(`(${minutes}:${seconds.toString().padStart(2, '0')})`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [cooldownUntil]);

    const handleReviewMistakes = async () => {
        setIsGeneratingReview(true);
        setIsReviewModalOpen(true);
        setReviewSuggestions(null);

        const incorrectQuestions = history.filter(h => !h.isCorrect).map(h => ({ question: h.question, userAnswer: h.userAnswer }));
        if (incorrectQuestions.length === 0) {
            setReviewSuggestions("You didn't get any questions wrong! If you still didn't pass, it might be because the quiz was incomplete.");
            setIsGeneratingReview(false);
            return;
        }

        const transcripts = course.modules.flatMap(m => m.lessons).filter(l => l.transcript).map(l => ({ lessonTitle: l.title, transcript: l.transcript! }));
        if (transcripts.length === 0) {
            setReviewSuggestions("No transcripts are available for this course to generate review material. Try retaking the quiz and paying close attention to the explanations after each question.");
            setIsGeneratingReview(false);
            return;
        }
        
        try {
            const suggestions = await getReviewSuggestions(incorrectQuestions, transcripts);
            setReviewSuggestions(suggestions);
        } catch (e) {
            setReviewSuggestions("Sorry, I couldn't generate review suggestions at this time. Please try again later.");
            console.error(e);
        } finally {
            setIsGeneratingReview(false);
        }
    };


    if (isFinished) {
        return (
            <>
            <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center animate-fade-in">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">{hasPassed ? 'Assessment Complete!' : 'Let\'s Review'}</h2>
                 <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">You've completed the {quizLesson.title}.</p>
                 <div className="my-8">
                     <p className="text-xl font-medium">Your Final Score:</p>
                     <p className={`text-6xl font-extrabold ${hasPassed ? 'text-green-500' : 'text-crimson dark:text-red-400'}`}>{score} / {QUIZ_LENGTH}</p>
                 </div>
                 {hasPassed ? (
                     <div className="flex justify-center space-x-4">
                        <button onClick={onBack} className="px-6 py-3 font-semibold text-white bg-crimson rounded-full hover:bg-red-800">
                            Back to Course
                        </button>
                    </div>
                 ) : (
                    <div className="mt-8">
                        <p className="mb-6 text-gray-600 dark:text-gray-400">You need a score of {passingScorePercentage}% or higher to pass. Review your mistakes or wait for the cooldown to try again.</p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button onClick={handleReviewMistakes} className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 flex items-center justify-center">
                                <BookOpenIcon className="w-5 h-5 mr-2" /> Review Mistakes
                            </button>
                            <button onClick={restartQuiz} disabled={!!cooldownUntil} className="px-6 py-3 font-semibold text-white bg-crimson rounded-full hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                Retake Quiz {timeLeft}
                            </button>
                        </div>
                    </div>
                 )}
            </div>
            <ReviewSuggestionsModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                suggestions={reviewSuggestions}
                isLoading={isGeneratingReview}
            />
            </>
        )
    }

    if (isLoading && questions.length === 0) {
        return (
            <div className="max-w-3xl mx-auto p-8 text-center">
                <SparklesIcon className="w-12 h-12 text-crimson mx-auto animate-spin" />
                <h2 className="mt-4 text-xl font-semibold font-serif">Generating your first question...</h2>
                <p>Our AI is preparing a personalized assessment for you.</p>
            </div>
        );
    }
    
    if (error && questions.length === 0) {
         return (
            <div className="max-w-3xl mx-auto p-8 bg-red-50 dark:bg-red-900/50 rounded-2xl text-center">
                <h2 className="text-xl font-bold text-red-700 dark:text-red-300 font-serif">An Error Occurred</h2>
                <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
                <button onClick={onBack} className="mt-6 px-6 py-2 font-semibold text-crimson border border-crimson rounded-full">
                    Back to Course
                </button>
            </div>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
        return (
            <div className="max-w-3xl mx-auto p-8 text-center">
                 <SparklesIcon className="w-12 h-12 text-crimson mx-auto animate-spin" />
                <h2 className="mt-4 text-xl font-semibold font-serif">Loading next question...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <button onClick={onBack} className="flex items-center text-crimson dark:text-red-400 hover:underline mb-6 font-semibold">
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Course
            </button>

            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">{quizLesson.title}</h1>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Question {currentQuestionIndex + 1} of {QUIZ_LENGTH}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 my-4">
                    <div className="bg-crimson h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / QUIZ_LENGTH) * 100}%` }}></div>
                </div>

                <h2 className="text-xl font-semibold my-6 text-gray-800 dark:text-gray-200">{currentQuestion.question}</h2>

                <div className="space-y-4">
                    {currentQuestion.options.map(option => {
                        const isCorrectAnswer = option === currentQuestion.answer;
                        const isSelectedAnswer = option === selectedAnswer;
                        let buttonClass = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-crimson/50 dark:hover:border-crimson';

                        if (feedback) {
                            if (isCorrectAnswer) {
                                buttonClass = 'bg-green-100 dark:bg-green-900/50 border-green-500 ring-2 ring-green-500 text-green-800 dark:text-green-200';
                            } else if (isSelectedAnswer && !feedback.isCorrect) {
                                buttonClass = 'bg-red-100 dark:bg-red-900/50 border-red-500 ring-2 ring-red-500 text-red-800 dark:text-red-200';
                            } else {
                                buttonClass = 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60 cursor-not-allowed';
                            }
                        } else if (isSelectedAnswer) {
                            buttonClass = 'bg-crimson/10 dark:bg-crimson/20 border-crimson ring-2 ring-crimson';
                        }
                        
                        return (
                            <button 
                                key={option} 
                                onClick={() => !feedback && setSelectedAnswer(option)}
                                disabled={!!feedback || isLoading}
                                className={`w-full text-left p-4 border rounded-lg transition-all ${buttonClass}`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>

                {feedback && (
                    <div className={`mt-6 p-4 rounded-lg animate-fade-in ${feedback.isCorrect ? 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200'}`}>
                        <h3 className="font-bold">{feedback.isCorrect ? "Correct!" : "Not quite..."}</h3>
                        <p className="text-sm mt-1">{feedback.explanation}</p>
                    </div>
                )}

                <div className="mt-8">
                    {feedback ? (
                        <button 
                            onClick={handleNextQuestion} 
                            disabled={isLoading}
                            className="w-full py-3 font-semibold text-white bg-crimson rounded-lg hover:bg-red-800 disabled:bg-red-400"
                        >
                            {isLoading ? 'Loading...' : (currentQuestionIndex + 1 < QUIZ_LENGTH ? 'Next Question' : 'Finish Assessment')}
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmitAnswer} 
                            disabled={!selectedAnswer || isLoading}
                            className="w-full py-3 font-semibold text-white bg-crimson rounded-lg hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Submit Answer
                        </button>
                    )}
                </div>
                 {error && !isLoading && questions.length > 0 && (
                     <p className="text-red-500 text-sm text-center mt-4">{error}</p>
                 )}
            </div>
        </div>
    );
};

export default AdaptiveQuizView;
