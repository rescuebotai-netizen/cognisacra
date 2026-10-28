import React from 'react';
import { Course } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import UsersIcon from './icons/UsersIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import StatCard from './shared/StatCard';
import BarChart from './shared/BarChart';

interface InstructorAnalyticsViewProps {
    course: Course;
    onBack: () => void;
}

const InstructorAnalyticsView: React.FC<InstructorAnalyticsViewProps> = ({ course, onBack }) => {
    if (!course.analytics) {
        return (
            <div>
                 <button onClick={onBack} className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6 font-semibold">
                    <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>
                <p>No analytics data available for this course.</p>
            </div>
        )
    }

    const { totalStudents, completionRate, totalRevenue, engagement, dropoutRates } = course.analytics;

    return (
        <div className="max-w-7xl mx-auto animate-fade-in space-y-8">
            <div>
                 <button onClick={onBack} className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4 font-semibold">
                    <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Course Analytics</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">{course.title}</p>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    icon={<UsersIcon className="w-6 h-6 text-blue-800 dark:text-blue-200" />}
                    label="Total Students"
                    value={totalStudents.toLocaleString()}
                    color="bg-blue-100 dark:bg-blue-900/50"
                />
                <StatCard 
                    icon={<ChartBarIcon className="w-6 h-6 text-green-800 dark:text-green-200" />}
                    label="Completion Rate"
                    value={`${completionRate}%`}
                    color="bg-green-100 dark:bg-green-900/50"
                />
                 <StatCard 
                    icon={<CurrencyDollarIcon className="w-6 h-6 text-amber-800 dark:text-amber-200" />}
                    label="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    color="bg-amber-100 dark:bg-amber-900/50"
                />
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BarChart 
                    title="Student Engagement (Last 5 Months)"
                    data={engagement.map(e => ({ label: e.month, value: e.students }))}
                    color="bg-blue-500"
                />
                 <BarChart 
                    title="Lesson Dropout Rates"
                    data={dropoutRates.map(d => ({ label: d.lesson, value: d.dropoutPercentage }))}
                    color="bg-red-500"
                />
            </div>

        </div>
    );
};

export default InstructorAnalyticsView;