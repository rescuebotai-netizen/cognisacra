import React, { useState } from 'react';
import { Course, Lesson } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import UploadIcon from './icons/UploadIcon';
import FolderOpenIcon from './icons/FolderOpenIcon';
import XMarkIcon from './icons/XMarkIcon';

interface ProjectSubmissionViewProps {
    course: Course;
    lesson: Lesson;
    onBack: () => void;
}

const ProjectSubmissionView: React.FC<ProjectSubmissionViewProps> = ({ course, lesson, onBack }) => {
    const [submittedFile, setSubmittedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSubmittedFile(event.target.files[0]);
        }
    };

    const removeFile = () => {
        setSubmittedFile(null);
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
             <button onClick={onBack} className="flex items-center text-crimson dark:text-red-400 hover:underline mb-6 font-semibold">
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Back to Course
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-start mb-6">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mr-4">
                        <FolderOpenIcon className="w-8 h-8 text-purple-500" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-purple-500 dark:text-purple-400">Project-Based Lesson</p>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-serif">{lesson.title}</h1>
                        <p className="text-md text-gray-500 dark:text-gray-400">From course: {course.title}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-serif">Project Requirements</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                           For this project, you will build a functional To-Do List application using React and Redux Toolkit. Your application should allow users to add new tasks, mark tasks as complete, and delete tasks. Pay close attention to component structure and state management principles discussed in the course.
                        </p>
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 font-serif">Submit Your Work</h2>
                        {submittedFile ? (
                             <div className="flex items-center justify-between p-4 bg-crimson/10 dark:bg-crimson/20 border border-crimson/20 dark:border-crimson/30 rounded-md">
                                 <div className="flex items-center">
                                    <FolderOpenIcon className="w-6 h-6 text-crimson mr-3" />
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{submittedFile.name}</p>
                                 </div>
                                 <button onClick={removeFile} className="p-1 rounded-full hover:bg-red-100 text-red-500">
                                     <XMarkIcon className="w-5 h-5" />
                                 </button>
                            </div>
                        ) : (
                            <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-crimson hover:text-red-700 focus-within:outline-none">
                                            <span>Upload your project files</span>
                                            <input id="file-upload" name="file-upload" type="file" onChange={handleFileChange} className="sr-only" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">ZIP, RAR, or link to a GitHub repository</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => alert('Project submitted for review!')}
                        disabled={!submittedFile}
                        className="w-full py-3 font-semibold text-white bg-crimson rounded-lg hover:bg-red-800 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Submit Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectSubmissionView;