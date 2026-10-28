import React, { useEffect, useState } from 'react';
import { PlatformStats } from '../../types';
import { adminService } from '../../services/adminService';
import { Users, GraduationCap, Library, DollarSign, TrendingUp, UserPlus, BookPlus, Activity, RefreshCw } from 'lucide-react';
import { View } from '../../App';

interface AdminDashboardViewProps {
    onNavigate?: (view: View) => void;
}

const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    color: string;
    isLoading?: boolean;
}> = ({ title, value, icon, trend, trendUp, color, isLoading }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                {isLoading ? (
                    <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
                ) : (
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
                )}
                {trend && !isLoading && (
                    <p className={`text-sm mt-2 flex items-center gap-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp size={14} className={trendUp ? '' : 'rotate-180'} />
                        {trend}
                    </p>
                )}
            </div>
            <div className={`p-4 rounded-2xl ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
    const [stats, setStats] = useState<PlatformStats>({
        totalUsers: 0,
        activeUsers: 0,
        totalCourses: 0,
        publishedCourses: 0,
        totalLibraryItems: 0,
        totalRevenue: 0,
        newUsersThisMonth: 0,
        newCoursesThisMonth: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await adminService.getStats();
            setStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load stats');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const activeRate = stats.totalUsers > 0
        ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)
        : '0';

    const publishedRate = stats.totalCourses > 0
        ? ((stats.publishedCourses / stats.totalCourses) * 100).toFixed(1)
        : '0';

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Admin Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Overview of CogniSacra platform metrics and management</p>
                </div>
                <button
                    onClick={fetchStats}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-crimson text-white rounded-xl hover:bg-crimson/90 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    icon={<Users size={24} className="text-blue-600" />}
                    trend={`+${stats.newUsersThisMonth} this month`}
                    trendUp={true}
                    color="bg-blue-100 dark:bg-blue-900/30"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Active Users"
                    value={stats.activeUsers.toLocaleString()}
                    icon={<Activity size={24} className="text-green-600" />}
                    trend={`${activeRate}% active rate`}
                    trendUp={true}
                    color="bg-green-100 dark:bg-green-900/30"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Total Courses"
                    value={stats.totalCourses.toLocaleString()}
                    icon={<GraduationCap size={24} className="text-purple-600" />}
                    trend={`+${stats.newCoursesThisMonth} this month`}
                    trendUp={true}
                    color="bg-purple-100 dark:bg-purple-900/30"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Library Items"
                    value={stats.totalLibraryItems.toLocaleString()}
                    icon={<Library size={24} className="text-orange-600" />}
                    color="bg-orange-100 dark:bg-orange-900/30"
                    isLoading={isLoading}
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard
                    title="Published Courses"
                    value={stats.publishedCourses.toLocaleString()}
                    icon={<BookPlus size={24} className="text-indigo-600" />}
                    trend={`${publishedRate}% of total`}
                    trendUp={true}
                    color="bg-indigo-100 dark:bg-indigo-900/30"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign size={24} className="text-emerald-600" />}
                    trendUp={true}
                    color="bg-emerald-100 dark:bg-emerald-900/30"
                    isLoading={isLoading}
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => onNavigate?.('admin-users')}
                        className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                        <UserPlus size={20} />
                        <span className="font-medium">Manage Users</span>
                    </button>
                    <button
                        onClick={() => onNavigate?.('admin-courses')}
                        className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    >
                        <BookPlus size={20} />
                        <span className="font-medium">Review Pending Courses</span>
                    </button>
                    <button
                        onClick={() => onNavigate?.('admin-library')}
                        className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                    >
                        <Library size={20} />
                        <span className="font-medium">Manage Library</span>
                    </button>
                </div>
            </div>

            {/* Recent Activity - placeholder for now */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-600 rounded" />
                                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-600 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                                <UserPlus size={16} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">New user registered</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Platform activity</p>
                            </div>
                            <span className="text-xs text-gray-400">Recently</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <GraduationCap size={16} className="text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Course activity</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{stats.totalCourses} total courses</p>
                            </div>
                            <span className="text-xs text-gray-400">Updated</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <Activity size={16} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Platform health check completed</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">All systems operational</p>
                            </div>
                            <span className="text-xs text-gray-400">Now</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardView;
