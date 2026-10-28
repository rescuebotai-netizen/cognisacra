import React from 'react';
// FIX: Corrected import name from 'institutionData' to 'fullInstitutionData' as exported from constants.ts.
import { fullInstitutionData as institutionData } from '../constants';
import UsersIcon from './icons/UsersIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import CertificateIcon from './icons/CertificateIcon';
import StatCard from './shared/StatCard';
import BarChart from './shared/BarChart';
import DoughnutChart from './shared/DoughnutChart';

const InstitutionAnalyticsView: React.FC = () => {
    const data = institutionData;

    const topCoursesData = [
        { label: 'React Mastery', value: 1200 },
        { label: 'AI/UX Design', value: 950 },
        { label: 'Data Science', value: 800 },
        { label: 'Cloud Intro', value: 650 },
        { label: 'JS Scratch', value: 500 },
    ];
    
    // FIX: Corrected property access for learner demographics from `demographics` to `demographicsByDepartment` to match the `InstitutionAnalytics` type definition.
    const demographicsData = data.analytics.demographicsByDepartment?.map(d => ({ label: d.department, value: d.count })) || [];
    const demographicColors = ['#3B82F6', '#10B981', '#F97316', '#8B5CF6'];

    const courseCompletionReport = [
        { id: 'react-mastery', title: 'Advanced React', enrolled: 1200, completed: 850 },
        { id: 'ai-ux-design', title: 'AI-Powered UX/UI', enrolled: 950, completed: 720 },
        { id: 'data-science-python', title: 'Data Science with Python', enrolled: 800, completed: 750 },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Institution Analytics</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">Detailed insights into your organization's learning activity.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <StatCard 
                    icon={<UsersIcon className="w-6 h-6 text-blue-800 dark:text-blue-200" />}
                    label="Total Learners"
                    value={data.analytics.totalLearners}
                    color="bg-blue-100 dark:bg-blue-900/50"
                />
                <StatCard 
                    icon={<BookOpenIcon className="w-6 h-6 text-green-800 dark:text-green-200" />}
                    label="Active Courses"
                    value={data.analytics.activeCourses}
                    color="bg-green-100 dark:bg-green-900/50"
                />
                 <StatCard 
                    icon={<CertificateIcon className="w-6 h-6 text-amber-800 dark:text-amber-200" />}
                    label="Certificates Issued"
                    value={data.analytics.certificatesIssued}
                    color="bg-amber-100 dark:bg-amber-900/50"
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <BarChart 
                        title="Top Courses by Enrollment"
                        data={topCoursesData}
                        color="bg-purple-500"
                    />
                </div>
                 <div className="lg:col-span-2">
                    <DoughnutChart
                        title="Learner Demographics"
                        data={demographicsData}
                        colors={demographicColors}
                    />
                </div>
            </div>


            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <h3 className="p-6 text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Course Completion Report</h3>
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Learners Enrolled</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Learners Completed</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Completion Rate</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {courseCompletionReport.map((course) => {
                                const completionRate = (course.completed / course.enrolled * 100).toFixed(1);
                                return (
                                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{course.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{course.enrolled.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{course.completed.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-3">
                                                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${completionRate}%` }}></div>
                                            </div>
                                            <span>{completionRate}%</span>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InstitutionAnalyticsView;