import React, { useState, useEffect, useCallback } from 'react';
import { PlatformCourse } from '../../types';
import { adminService } from '../../services/adminService';
import { Search, Filter, Eye, CheckCircle, XCircle, Archive, Star, ChevronLeft, ChevronRight, MoreVertical, RefreshCw, Loader2 } from 'lucide-react';

const getStatusBadgeColor = (status: PlatformCourse['status']) => {
    switch (status) {
        case 'published':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'draft':
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        case 'pending_review':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'archived':
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const formatStatus = (status: PlatformCourse['status']) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

interface AdminCoursesViewProps {
    onViewCourse?: (courseId: string) => void;
}

const AdminCoursesView: React.FC<AdminCoursesViewProps> = ({ onViewCourse }) => {
    const [courses, setCourses] = useState<PlatformCourse[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCourses, setTotalCourses] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pendingReviewCount, setPendingReviewCount] = useState(0);
    const itemsPerPage = 10;

    const fetchCourses = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await adminService.getCourses({
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery || undefined,
                status: statusFilter,
                category: categoryFilter,
            });
            setCourses(response.items);
            setTotalPages(response.totalPages);
            setTotalCourses(response.total);

            // Extract unique categories
            const uniqueCategories = [...new Set(response.items.map(c => c.category))];
            setCategories(prev => {
                const allCategories = [...new Set([...prev, ...uniqueCategories])];
                return allCategories;
            });

            // Count pending reviews
            const pending = response.items.filter(c => c.status === 'pending_review').length;
            setPendingReviewCount(pending);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load courses');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery, statusFilter, categoryFilter]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, categoryFilter]);

    const handleUpdateStatus = async (courseId: string, status: PlatformCourse['status']) => {
        setIsUpdating(courseId);
        setSelectedCourse(null);
        try {
            await adminService.updateCourseStatus(courseId, status);
            setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status } : c));
            // Update pending count
            if (status !== 'pending_review') {
                setPendingReviewCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update course status');
        } finally {
            setIsUpdating(null);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalCourses);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Review, approve, and manage platform courses</p>
                </div>
                <div className="flex items-center gap-4">
                    {pendingReviewCount > 0 && (
                        <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-xl font-medium">
                            {pendingReviewCount} courses pending review
                        </div>
                    )}
                    <button
                        onClick={fetchCourses}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-crimson text-white rounded-xl hover:bg-crimson/90 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Courses</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCourses}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
                    <p className="text-2xl font-bold text-green-600">{courses.filter(c => c.status === 'published').length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending Review</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingReviewCount}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Archived</p>
                    <p className="text-2xl font-bold text-gray-600">{courses.filter(c => c.status === 'archived').length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title or instructor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="pending_review">Pending Review</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Courses Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instructor</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enrollments</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoading ? (
                                // Loading skeleton
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                                                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded ml-auto" /></td>
                                    </tr>
                                ))
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No courses found
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{course.title}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{course.category}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {course.instructor}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(course.status)}`}>
                                                {formatStatus(course.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {course.enrollments.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{course.rating.toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(course.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {isUpdating === course.id ? (
                                                    <Loader2 size={18} className="animate-spin text-gray-400" />
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => onViewCourse?.(course.id)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                            title="View Course"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        {course.status === 'pending_review' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(course.id, 'published')}
                                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                                    title="Approve"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(course.id, 'draft')}
                                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                    title="Reject"
                                                                >
                                                                    <XCircle size={18} />
                                                                </button>
                                                            </>
                                                        )}
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
                                                                className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                            >
                                                                <MoreVertical size={18} />
                                                            </button>
                                                            {selectedCourse === course.id && (
                                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-10">
                                                                    {course.status !== 'published' && (
                                                                        <button
                                                                            onClick={() => handleUpdateStatus(course.id, 'published')}
                                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-green-600"
                                                                        >
                                                                            <CheckCircle size={14} />
                                                                            Publish
                                                                        </button>
                                                                    )}
                                                                    {course.status !== 'archived' && (
                                                                        <button
                                                                            onClick={() => handleUpdateStatus(course.id, 'archived')}
                                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                                                                        >
                                                                            <Archive size={14} />
                                                                            Archive
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {totalCourses > 0
                            ? `Showing ${startIndex} to ${endIndex} of ${totalCourses} courses`
                            : 'No courses found'
                        }
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || isLoading}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                            {currentPage} / {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0 || isLoading}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCoursesView;
