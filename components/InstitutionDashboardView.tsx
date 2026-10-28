import React from 'react';
import { FullInstitutionData, Course } from '../types';
import UsersIcon from './icons/UsersIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import CertificateIcon from './icons/CertificateIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import StatCard from './shared/StatCard';
import BarChart from './shared/BarChart';
import DoughnutChart from './shared/DoughnutChart';
import InstitutionCourseCard from './InstitutionCourseCard';
import CheckIcon from './icons/CheckIcon';
import { Radio } from 'lucide-react';

interface InstitutionDashboardViewProps {
    institutionData: FullInstitutionData;
    onCreateCourse: () => void;
    onEditCourse: (course: Course) => void;
    onViewCourse: (course: Course) => void;
    subscriptionPlan: string | null;
    onNavigate?: (view: string) => void;
}

const InstitutionDashboardView: React.FC<InstitutionDashboardViewProps> = ({ 
    institutionData, 
    onCreateCourse, 
    onEditCourse, 
    onViewCourse, 
    subscriptionPlan,
    onNavigate
}) => {
    const { name, analytics, courses } = institutionData;

    // Prepare data for charts
    const departmentData = analytics.demographicsByDepartment?.map(d => ({ label: d.department, value: d.count })) || [];
    const regionData = analytics.demographicsByRegion?.map(d => ({ label: d.region, value: d.count })) || [];
    const ageData = analytics.demographicsByAge?.map(d => ({ label: d.ageGroup, value: d.count })) || [];
    const progressData = analytics.progressDistribution.map(p => ({ label: p.status, value: p.count }));

    const revenueByCourseData = analytics.revenueByCourse?.map(r => {
        const course = courses.find(c => c.id === r.courseId);
        return {
            label: course?.title || 'Unknown Course',
            value: r.revenue,
        }
    }) || [];

    // Colors for charts
    const ageColors = ['#3B82F6', '#10B981', '#F97316', '#8B5CF6'];
    const progressColors = ['#10B981', '#F59E0B', '#EF4444']; // Completed, In Progress, Not Started

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white font-serif">Institution Command & Analytics</h1>
                    <p className="mt-1 text-sm text-zinc-400 font-mono">Node: {name}</p>
                     {subscriptionPlan && (
                        <div className="mt-3 inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-semibold">
                            <CheckIcon className="w-4 h-4" />
                            <span>Plan: {subscriptionPlan}</span>
                        </div>
                    )}
                </div>

                {onNavigate && (
                    <button
                        onClick={() => onNavigate('institution-accreditation')}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 shrink-0"
                    >
                        <span>Onboard Students & Lecturers</span>
                        <span className="text-base leading-none">→</span>
                    </button>
                )}
            </div>

            {/* Accreditation Callout Banner (Borderless) */}
            {onNavigate && (
                <div className="p-5 rounded-2xl bg-[#0E131C] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                    <div className="space-y-1">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                            Accreditation Engine
                        </div>
                        <h3 className="text-base font-bold text-white font-serif">
                            Issue Student & Faculty Accreditation Codes
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-xl">
                            Generate single-code passes for immediate self-onboarding into your accredited platform.
                        </p>
                    </div>
                    <button
                        onClick={() => onNavigate('institution-accreditation')}
                        className="px-4 py-2.5 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-emerald-400 hover:text-emerald-300 text-xs font-mono font-semibold transition flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
                    >
                        <span>Manage Codes</span>
                        <span>→</span>
                    </button>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <StatCard
                    icon={<UsersIcon className="w-6 h-6 text-blue-400" />}
                    label="Total Learners"
                    value={analytics.totalLearners.toLocaleString()}
                    color="bg-blue-950/40"
                />
                <StatCard
                    icon={<BookOpenIcon className="w-6 h-6 text-emerald-400" />}
                    label="Active Courses"
                    value={analytics.activeCourses.toLocaleString()}
                    color="bg-emerald-950/40"
                />
                <StatCard
                    icon={<CertificateIcon className="w-6 h-6 text-amber-400" />}
                    label="Certificates"
                    value={analytics.certificatesIssued.toLocaleString()}
                    color="bg-amber-950/40"
                />
                <StatCard
                    icon={<BriefcaseIcon className="w-6 h-6 text-indigo-400" />}
                    label="Placements"
                    value={analytics.learnersPlacedInJobs.toLocaleString()}
                    color="bg-indigo-950/40"
                />
                {analytics.totalRevenue && (
                    <StatCard
                        icon={<CurrencyDollarIcon className="w-6 h-6 text-pink-400" />}
                        label="Total Revenue"
                        value={`$${analytics.totalRevenue.toLocaleString()}`}
                        color="bg-pink-950/40"
                    />
                )}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BarChart
                    title="Revenue by Course"
                    data={revenueByCourseData}
                    color="bg-blue-500"
                />
                <DoughnutChart
                    title="Progress Distribution"
                    data={progressData}
                    colors={progressColors}
                />
            </div>

            {/* Course Management Section */}
            <div>
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-serif">Course Management</h2>
                        <p className="mt-0.5 text-xs text-zinc-400">Manage curriculum and published modules.</p>
                    </div>
                    <button onClick={onCreateCourse} className="px-5 py-2.5 font-mono text-xs font-bold text-black bg-emerald-500 rounded-xl hover:bg-emerald-400 shadow-lg transition-transform hover:scale-105 self-start md:self-center">
                        + Create Course
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map(course => (
                        <InstitutionCourseCard
                            key={course.id}
                            course={course}
                            onEdit={() => onEditCourse(course)}
                            onView={() => onViewCourse(course)}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default InstitutionDashboardView;