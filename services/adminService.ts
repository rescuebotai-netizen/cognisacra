// Admin Service - API for platform administration

import { PlatformStats, PlatformUser, PlatformCourse, PlatformLibraryItem } from '../types';
import { authService } from './authService';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://cogni-sacra-backend-production.up.railway.app';
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// API response structures from backend
interface UsersApiResponse {
    users: Array<{
        id: string;
        name: string;
        email: string;
        role: string;
        isEmailVerified: boolean;
        status?: string;
        institutionId?: string;
        onboardingCompleted?: boolean;
        interests?: string[];
        createdAt: string;
    }>;
    total: number;
    page: string | number;
    totalPages: number;
}

interface CoursesApiResponse {
    courses: Array<{
        id: string;
        title: string;
        instructor?: string;
        instructorId?: string;
        status: string;
        enrollments?: number;
        rating?: number;
        createdAt: string;
        category?: string;
    }>;
    total: number;
    page: string | number;
    totalPages: number;
}

interface LibraryApiResponse {
    items: Array<{
        id: string;
        title: string;
        type: string;
        author?: string;
        uploadedBy?: string;
        status: string;
        downloads?: number;
        createdAt: string;
    }>;
    total: number;
    page: string | number;
    totalPages: number;
}

// Helper function for authenticated requests
async function authenticatedFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = authService.getToken();
    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (response.status === 401) {
        authService.logout();
        throw new Error('Session expired. Please login again.');
    }

    const apiResponse: ApiResponse<T> = await response.json();

    if (!response.ok || !apiResponse.success) {
        throw new Error(apiResponse.message || 'Request failed');
    }

    return apiResponse.data as T;
}

// Map API role to PlatformUser role
function mapUserRole(apiRole: string): PlatformUser['role'] {
    switch (apiRole) {
        case 'platform_admin':
            return 'platform_admin';
        case 'instructor':
            return 'instructor';
        case 'institution_admin':
            return 'institution_admin';
        case 'independent_learner':
        case 'user':
        default:
            return 'independent_learner';
    }
}

// Map API user to PlatformUser
function mapApiUserToPlatformUser(apiUser: UsersApiResponse['users'][0]): PlatformUser {
    return {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        role: mapUserRole(apiUser.role),
        status: (apiUser.status as PlatformUser['status']) || 'active',
        isEmailVerified: apiUser.isEmailVerified,
        createdAt: apiUser.createdAt,
    };
}

export const adminService = {
    // ==================== PLATFORM STATS ====================
    async getStats(): Promise<PlatformStats> {
        try {
            // Try to get stats from dedicated endpoint
            return await authenticatedFetch<PlatformStats>('/admin/stats');
        } catch {
            // Fallback: calculate stats from users endpoint
            try {
                const usersResponse = await authenticatedFetch<UsersApiResponse>('/users?limit=1000');
                const users = usersResponse.users || [];

                const activeUsers = users.filter(u => u.status === 'active' || !u.status).length;
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const newUsersThisMonth = users.filter(u => new Date(u.createdAt) >= startOfMonth).length;

                return {
                    totalUsers: usersResponse.total || users.length,
                    activeUsers,
                    totalCourses: 0,
                    publishedCourses: 0,
                    totalLibraryItems: 0,
                    totalRevenue: 0,
                    newUsersThisMonth,
                    newCoursesThisMonth: 0,
                };
            } catch {
                console.error('Failed to fetch platform stats');
                return {
                    totalUsers: 0,
                    activeUsers: 0,
                    totalCourses: 0,
                    publishedCourses: 0,
                    totalLibraryItems: 0,
                    totalRevenue: 0,
                    newUsersThisMonth: 0,
                    newCoursesThisMonth: 0,
                };
            }
        }
    },

    // ==================== USER MANAGEMENT ====================
    async getUsers(params?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
    }): Promise<PaginatedResponse<PlatformUser>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.role && params.role !== 'all') queryParams.append('role', params.role);
        if (params?.status && params.status !== 'all') queryParams.append('status', params.status);

        const query = queryParams.toString();
        try {
            const response = await authenticatedFetch<UsersApiResponse>(
                `/users${query ? `?${query}` : ''}`
            );

            // Map API response to our format
            const users = (response.users || []).map(mapApiUserToPlatformUser);

            return {
                items: users,
                total: response.total || users.length,
                page: typeof response.page === 'string' ? parseInt(response.page, 10) : response.page,
                limit: params?.limit || 10,
                totalPages: response.totalPages || 1,
            };
        } catch (error) {
            console.error('Failed to fetch users:', error);
            return { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        }
    },

    async updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<PlatformUser> {
        const response = await authenticatedFetch<UsersApiResponse['users'][0]>(`/users/${userId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        return mapApiUserToPlatformUser(response);
    },

    async updateUserRole(userId: string, role: PlatformUser['role']): Promise<PlatformUser> {
        const response = await authenticatedFetch<UsersApiResponse['users'][0]>(`/users/${userId}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role }),
        });
        return mapApiUserToPlatformUser(response);
    },

    async deleteUser(userId: string): Promise<void> {
        await authenticatedFetch<void>(`/users/${userId}`, {
            method: 'DELETE',
        });
    },

    // ==================== COURSE MANAGEMENT ====================
    async getCourses(params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        category?: string;
    }): Promise<PaginatedResponse<PlatformCourse>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params?.category && params.category !== 'all') queryParams.append('category', params.category);

        const query = queryParams.toString();
        try {
            const response = await authenticatedFetch<CoursesApiResponse>(
                `/courses${query ? `?${query}` : ''}`
            );

            const courses: PlatformCourse[] = (response.courses || []).map(c => ({
                id: c.id,
                title: c.title,
                instructor: c.instructor || 'Unknown',
                instructorId: c.instructorId || '',
                status: (c.status as PlatformCourse['status']) || 'draft',
                enrollments: c.enrollments || 0,
                rating: c.rating || 0,
                createdAt: c.createdAt,
                category: c.category || 'Uncategorized',
            }));

            return {
                items: courses,
                total: response.total || courses.length,
                page: typeof response.page === 'string' ? parseInt(response.page, 10) : response.page,
                limit: params?.limit || 10,
                totalPages: response.totalPages || 1,
            };
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            return { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        }
    },

    async updateCourseStatus(courseId: string, status: PlatformCourse['status']): Promise<PlatformCourse> {
        const response = await authenticatedFetch<CoursesApiResponse['courses'][0]>(`/courses/${courseId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        return {
            id: response.id,
            title: response.title,
            instructor: response.instructor || 'Unknown',
            instructorId: response.instructorId || '',
            status: (response.status as PlatformCourse['status']) || 'draft',
            enrollments: response.enrollments || 0,
            rating: response.rating || 0,
            createdAt: response.createdAt,
            category: response.category || 'Uncategorized',
        };
    },

    async deleteCourse(courseId: string): Promise<void> {
        await authenticatedFetch<void>(`/courses/${courseId}`, {
            method: 'DELETE',
        });
    },

    // ==================== LIBRARY MANAGEMENT ====================
    async getLibraryItems(params?: {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
        status?: string;
    }): Promise<PaginatedResponse<PlatformLibraryItem>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.type && params.type !== 'all') queryParams.append('type', params.type);
        if (params?.status && params.status !== 'all') queryParams.append('status', params.status);

        const query = queryParams.toString();
        try {
            const response = await authenticatedFetch<LibraryApiResponse>(
                `/library${query ? `?${query}` : ''}`
            );

            const items: PlatformLibraryItem[] = (response.items || []).map(item => ({
                id: item.id,
                title: item.title,
                type: (item.type as PlatformLibraryItem['type']) || 'document',
                author: item.author || 'Unknown',
                uploadedBy: item.uploadedBy || 'System',
                status: (item.status as PlatformLibraryItem['status']) || 'pending',
                downloads: item.downloads || 0,
                createdAt: item.createdAt,
            }));

            return {
                items,
                total: response.total || items.length,
                page: typeof response.page === 'string' ? parseInt(response.page, 10) : response.page,
                limit: params?.limit || 10,
                totalPages: response.totalPages || 1,
            };
        } catch (error) {
            console.error('Failed to fetch library items:', error);
            return { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        }
    },

    async updateLibraryItemStatus(
        itemId: string,
        status: PlatformLibraryItem['status']
    ): Promise<PlatformLibraryItem> {
        const response = await authenticatedFetch<LibraryApiResponse['items'][0]>(`/library/${itemId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        return {
            id: response.id,
            title: response.title,
            type: (response.type as PlatformLibraryItem['type']) || 'document',
            author: response.author || 'Unknown',
            uploadedBy: response.uploadedBy || 'System',
            status: (response.status as PlatformLibraryItem['status']) || 'pending',
            downloads: response.downloads || 0,
            createdAt: response.createdAt,
        };
    },

    async deleteLibraryItem(itemId: string): Promise<void> {
        await authenticatedFetch<void>(`/library/${itemId}`, {
            method: 'DELETE',
        });
    },
};

export default adminService;
