import React, { useState, useEffect, useCallback } from 'react';
import { PlatformUser } from '../../types';
import { adminService } from '../../services/adminService';
import { Search, Filter, MoreVertical, UserCheck, UserX, Mail, Shield, ChevronLeft, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';

const getRoleBadgeColor = (role: PlatformUser['role']) => {
    switch (role) {
        case 'platform_admin':
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        case 'instructor':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
        case 'institution_admin':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'independent_learner':
        default:
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
};

const getStatusBadgeColor = (status: PlatformUser['status']) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'suspended':
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
};

const formatRole = (role: PlatformUser['role']) => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const AdminUsersView: React.FC = () => {
    const [users, setUsers] = useState<PlatformUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 10;

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await adminService.getUsers({
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery || undefined,
                role: roleFilter,
                status: statusFilter,
            });
            setUsers(response.items);
            setTotalPages(response.totalPages);
            setTotalUsers(response.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery, roleFilter, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, roleFilter, statusFilter]);

    const handleUpdateStatus = async (userId: string, status: 'active' | 'suspended') => {
        setIsUpdating(userId);
        try {
            await adminService.updateUserStatus(userId, status);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update user status');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleUpdateRole = async (userId: string, role: PlatformUser['role']) => {
        setIsUpdating(userId);
        setSelectedUser(null);
        try {
            await adminService.updateUserRole(userId, role);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update user role');
        } finally {
            setIsUpdating(null);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalUsers);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Manage platform users, roles, and permissions</p>
                </div>
                <button
                    onClick={fetchUsers}
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

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson"
                        >
                            <option value="all">All Roles</option>
                            <option value="independent_learner">Learner</option>
                            <option value="instructor">Instructor</option>
                            <option value="institution_admin">Institution Admin</option>
                            <option value="platform_admin">Platform Admin</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Verified</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoading ? (
                                // Loading skeleton
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                                                    <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded ml-auto" /></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson to-rose-500 flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                                                {formatRole(user.role)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(user.status)}`}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isEmailVerified ? (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <UserCheck size={16} />
                                                    <span className="text-sm">Verified</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-yellow-600">
                                                    <Mail size={16} />
                                                    <span className="text-sm">Pending</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {isUpdating === user.id ? (
                                                    <Loader2 size={18} className="animate-spin text-gray-400" />
                                                ) : (
                                                    <>
                                                        {user.status === 'active' ? (
                                                            <button
                                                                onClick={() => handleUpdateStatus(user.id, 'suspended')}
                                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                title="Suspend User"
                                                            >
                                                                <UserX size={18} />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUpdateStatus(user.id, 'active')}
                                                                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                                title="Activate User"
                                                            >
                                                                <UserCheck size={18} />
                                                            </button>
                                                        )}
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                                                                className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                            >
                                                                <MoreVertical size={18} />
                                                            </button>
                                                            {selectedUser === user.id && (
                                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-10">
                                                                    <button
                                                                        onClick={() => handleUpdateRole(user.id, 'instructor')}
                                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                                                    >
                                                                        <Shield size={14} />
                                                                        Make Instructor
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleUpdateRole(user.id, 'platform_admin')}
                                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                                                                    >
                                                                        <Shield size={14} />
                                                                        Make Admin
                                                                    </button>
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
                        {totalUsers > 0
                            ? `Showing ${startIndex} to ${endIndex} of ${totalUsers} users`
                            : 'No users found'
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

export default AdminUsersView;
