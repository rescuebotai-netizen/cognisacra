import React from 'react';
import { Course } from '../types';
import PencilIcon from './icons/PencilIcon';
import BookOpenIcon from './icons/BookOpenIcon';

interface InstitutionCourseCardProps { 
    course: Course; 
    onEdit: () => void; 
    onView: () => void;
}

const getCourseStatusLabel = (course: Course): string => {
    if (course.isDraft) return 'Draft';
    if (course.statusLabel) return course.statusLabel;
    if (course.status === 'upcoming') return 'Coming Soon';
    if (course.status === 'archived') return 'Archived';
    return 'Self-Paced';
};

const getBadgeClasses = (status: string) => {
    switch (status) {
        case 'Draft':
            return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800';
        case 'Self-Paced':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
        case 'Online':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
        case 'Archived':
            return 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        case 'Coming Soon':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-250';
    }
};

const InstitutionCourseCard: React.FC<InstitutionCourseCardProps> = ({ course, onEdit, onView }) => {
    const statusText = getCourseStatusLabel(course);
    const badgeStyle = getBadgeClasses(statusText);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl">
            <img className="h-40 w-full object-cover" src={course.imageUrl} alt={course.title} />
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-xs font-semibold text-crimson dark:text-crimson/90 uppercase">{course.category}</p>
                <h3 className="text-lg font-bold mt-1 text-gray-900 dark:text-white font-serif">{course.title}</h3>
                
                <div className="mt-2.5 flex items-center">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeStyle}`}>
                        {statusText}
                    </span>
                </div>

                <div className="mt-4 flex-grow"></div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={onEdit} className="flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-crimson rounded-full hover:bg-red-800">
                        <PencilIcon className="w-4 h-4 mr-2"/>
                        Edit
                    </button>
                     <button onClick={onView} className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                        <BookOpenIcon className="w-4 h-4 mr-2"/>
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstitutionCourseCard;
