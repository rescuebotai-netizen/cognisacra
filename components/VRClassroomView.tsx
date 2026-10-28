

import React from 'react';
import { Course, Lesson } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import CubeTransparentIcon from './icons/CubeTransparentIcon';

interface VRClassroomViewProps {
    course: Course;
    lesson: Lesson;
    onBack: () => void;
}

const VRClassroomView: React.FC<VRClassroomViewProps> = ({ course, lesson, onBack }) => {
    return (
        <div className="animate-fade-in h-full flex flex-col items-center justify-center bg-gray-900 text-white rounded-2xl p-8 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-crimson/20 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-800/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>

            <button onClick={onBack} className="absolute top-6 left-6 flex items-center text-red-300 hover:text-white font-semibold z-10">
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Course
            </button>

            <div className="text-center z-10">
                <CubeTransparentIcon className="w-24 h-24 text-crimson mx-auto animate-bounce" />
                <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-crimson">Entering Metaverse Classroom</p>
                <h1 className="mt-2 text-4xl font-extrabold font-serif">{lesson.title}</h1>
                <p className="mt-2 text-lg text-gray-400">From course: {course.title}</p>
                
                <p className="mt-8 max-w-lg mx-auto text-gray-300">
                    Prepare for an immersive learning experience. Your virtual reality simulation is ready to launch.
                </p>

                <button 
                    onClick={() => alert('VR Simulation launch is a future feature. Stay tuned!')}
                    className="mt-10 px-12 py-4 font-bold text-lg text-white bg-crimson rounded-full shadow-lg shadow-crimson/50 hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-110"
                >
                    Launch Simulation
                </button>
            </div>
        </div>
    );
};

export default VRClassroomView;