import React, { useState, useEffect, useCallback } from 'react';
import { PlatformLibraryItem } from '../../types';
import { adminService } from '../../services/adminService';
import { Search, Filter, Eye, CheckCircle, XCircle, Trash2, Download, Book, FileText, Video, File, ChevronLeft, ChevronRight, MoreVertical, RefreshCw, Loader2 } from 'lucide-react';

const getStatusBadgeColor = (status: PlatformLibraryItem['status']) => {
    switch (status) {
        case 'published':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'rejected':
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getTypeIcon = (type: PlatformLibraryItem['type']) => {
    switch (type) {
        case 'book':
            return <Book size={18} className="text-blue-600" />;
        case 'article':
            return <FileText size={18} className="text-green-600" />;
        case 'video':
            return <Video size={18} className="text-purple-600" />;
        case 'document':
        default:
            return <File size={18} className="text-gray-600" />;
    }
};

interface AdminLibraryViewProps {
    onViewItem?: (itemId: string) => void;
}

const AdminLibraryView: React.FC<AdminLibraryViewProps> = ({ onViewItem }) => {
    const [items, setItems] = useState<PlatformLibraryItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pendingCount, setPendingCount] = useState(0);
    const itemsPerPage = 10;

    // Type counts
    const [typeCounts, setTypeCounts] = useState({
        book: 0,
        article: 0,
        video: 0,
        document: 0,
    });

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await adminService.getLibraryItems({
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery || undefined,
                type: typeFilter,
                status: statusFilter,
            });
            setItems(response.items);
            setTotalPages(response.totalPages);
            setTotalItems(response.total);

            // Count types and pending
            const counts = { book: 0, article: 0, video: 0, document: 0 };
            let pending = 0;
            response.items.forEach(item => {
                counts[item.type]++;
                if (item.status === 'pending') pending++;
            });
            setTypeCounts(counts);
            setPendingCount(pending);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load library items');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery, statusFilter, typeFilter]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, typeFilter]);

    const handleUpdateStatus = async (itemId: string, status: PlatformLibraryItem['status']) => {
        setIsUpdating(itemId);
        setSelectedItem(null);
        try {
            await adminService.updateLibraryItemStatus(itemId, status);
            setItems(prev => prev.map(i => i.id === itemId ? { ...i, status } : i));
            if (status !== 'pending') {
                setPendingCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update item status');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        setIsUpdating(itemId);
        setSelectedItem(null);
        try {
            await adminService.deleteLibraryItem(itemId);
            setItems(prev => prev.filter(i => i.id !== itemId));
            setTotalItems(prev => prev - 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete item');
        } finally {
            setIsUpdating(null);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Library Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Manage books, articles, videos, and documents</p>
                </div>
                <div className="flex items-center gap-4">
                    {pendingCount > 0 && (
                        <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-xl font-medium">
                            {pendingCount} items pending review
                        </div>
                    )}
                    <button
                        onClick={fetchItems}
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
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Book size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Books</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{typeCounts.book}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <FileText size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Articles</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{typeCounts.article}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Video size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Videos</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{typeCounts.video}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <File size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Documents</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{typeCounts.document}</p>
                        </div>
                    </div>
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
                            placeholder="Search by title or author..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson"
                        >
                            <option value="all">All Types</option>
                            <option value="book">Books</option>
                            <option value="article">Articles</option>
                            <option value="video">Videos</option>
                            <option value="document">Documents</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-crimson/20 focus:border-crimson"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Library Items Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Downloads</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uploaded</th>
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
                                                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                                                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded ml-auto" /></td>
                                    </tr>
                                ))
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No library items found
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                    {getTypeIcon(item.type)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">by {item.uploadedBy}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{item.type}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {item.author}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(item.status)}`}>
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                                                <Download size={14} />
                                                {item.downloads.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {isUpdating === item.id ? (
                                                    <Loader2 size={18} className="animate-spin text-gray-400" />
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => onViewItem?.(item.id)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                            title="View Item"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        {item.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(item.id, 'published')}
                                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                                    title="Approve"
                                                                >
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(item.id, 'rejected')}
                                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                    title="Reject"
                                                                >
                                                                    <XCircle size={18} />
                                                                </button>
                                                            </>
                                                        )}
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                                                                className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                            >
                                                                <MoreVertical size={18} />
                                                            </button>
                                                            {selectedItem === item.id && (
                                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-10">
                                                                    {item.status !== 'published' && (
                                                                        <button
                                                                            onClick={() => handleUpdateStatus(item.id, 'published')}
                                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-green-600"
                                                                        >
                                                                            <CheckCircle size={14} />
                                                                            Publish
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleDeleteItem(item.id)}
                                                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                        Delete
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
                        {totalItems > 0
                            ? `Showing ${startIndex} to ${endIndex} of ${totalItems} items`
                            : 'No items found'
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

export default AdminLibraryView;
