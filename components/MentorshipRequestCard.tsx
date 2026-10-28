import React from 'react';
import { UserProfile } from '../types';
import UserPlusIcon from './icons/UserPlusIcon';

interface MentorshipRequestCardProps {
    learner: UserProfile;
}

const MentorshipRequestCard: React.FC<MentorshipRequestCardProps> = ({ learner }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col p-4 text-center items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <img 
                src={learner.avatarUrl} 
                alt={learner.name} 
                className="w-20 h-20 rounded-full object-cover ring-4 ring-crimson/20 dark:ring-crimson/40"
            />
            <h4 className="mt-3 text-lg font-bold text-gray-900 dark:text-white font-serif">{learner.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{learner.title}</p>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 flex-grow">
                Seeking guidance for a career as a <span className="font-semibold">{learner.targetCareer}</span>.
            </p>
            <button 
                onClick={() => alert(`Connecting with ${learner.name}...`)}
                className="mt-4 w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-crimson rounded-full hover:bg-red-800"
            >
                <UserPlusIcon className="w-4 h-4 mr-2"/>
                Connect
            </button>
        </div>
    );
};

export default MentorshipRequestCard;