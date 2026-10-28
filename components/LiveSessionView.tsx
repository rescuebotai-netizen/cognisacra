import React, { useState, useEffect } from 'react';
import { Course, Lesson } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import SignalIcon from './icons/SignalIcon';

interface LiveSessionViewProps {
    course: Course;
    lesson: Lesson;
    onBack: () => void;
}

const calculateTimeLeft = (sessionTime: string) => {
    const difference = +new Date(sessionTime) - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return { timeLeft, isLive: difference <= 0 };
};


const LiveSessionView: React.FC<LiveSessionViewProps> = ({ course, lesson, onBack }) => {
    const [timeData, setTimeData] = useState(calculateTimeLeft(lesson.sessionTime || ''));
    
    useEffect(() => {
        if (!lesson.sessionTime) return;

        const timer = setTimeout(() => {
            setTimeData(calculateTimeLeft(lesson.sessionTime!));
        }, 1000);

        return () => clearTimeout(timer);
    });
    
    const { timeLeft, isLive } = timeData;

    return (
        <div className="animate-fade-in h-full flex flex-col items-center justify-center bg-gray-900 text-white rounded-2xl p-8 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-crimson/20 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-800/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>

            <button onClick={onBack} className="absolute top-6 left-6 flex items-center text-red-300 hover:text-white font-semibold z-10">
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Course
            </button>

            <div className="text-center z-10">
                <SignalIcon className={`w-24 h-24 mx-auto ${isLive ? 'text-crimson animate-pulse' : 'text-red-400'}`} />
                <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-red-400">{isLive ? 'Session is Live!' : 'Upcoming Live Session'}</p>
                <h1 className="mt-2 text-4xl font-extrabold font-serif">{lesson.title}</h1>
                <p className="mt-2 text-lg text-gray-400">From course: {course.title}</p>
                
                {!isLive && lesson.sessionTime && (
                    <div className="mt-8 flex justify-center space-x-4">
                        <div className="text-center">
                            <p className="text-4xl font-bold">{String(timeLeft.days).padStart(2, '0')}</p>
                            <p className="text-sm uppercase text-gray-400">Days</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</p>
                            <p className="text-sm uppercase text-gray-400">Hours</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</p>
                            <p className="text-sm uppercase text-gray-400">Minutes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</p>
                            <p className="text-sm uppercase text-gray-400">Seconds</p>
                        </div>
                    </div>
                )}
                
                <p className="mt-8 max-w-lg mx-auto text-gray-300">
                    This is a scheduled live session with your instructor. Get your questions ready!
                </p>

                <button 
                    onClick={() => alert('Joining live session...')}
                    className="mt-10 px-12 py-4 font-bold text-lg text-white bg-crimson rounded-full shadow-lg shadow-crimson/50 hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110 disabled:bg-gray-500 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
                    disabled={!isLive}
                >
                    {isLive ? 'Join Live Session Now' : 'Join When Live'}
                </button>
            </div>
        </div>
    );
};

export default LiveSessionView;