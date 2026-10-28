
import React from 'react';

export type LessonFormat = 'video' | 'reading' | 'quiz' | 'adaptive-quiz' | 'project' | 'live-session' | 'metaverse';
export type UserRole = 'learner' | 'instructor' | 'institution';

export interface DiscussionPost {
  id: string;
  author: string;
  avatarUrl: string;
  timestamp: string;
  text: string;
  replies: DiscussionPost[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface Resource {
  id: string;
  name: string;
  url: string;
  format: 'pdf' | 'zip' | 'link' | 'video';
}

export interface QuizOption {
    id: string;
    text: string;
}

export interface QuizQuestion {
    id: string;
    questionText: string;
    options: QuizOption[];
    correctOptionId: string;
    explanation?: string;
}

export interface Annotation {
  id: string;
  text: string;
  comment: string;
  startOffset: number;
  endOffset: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description?: string;
  isCompleted: boolean;
  format: LessonFormat;
  transcript?: string;
  discussion?: DiscussionPost[];
  isLocked?: boolean;
  deadline?: string; // ISO 8601 date string
  checklist?: ChecklistItem[];
  resources?: Resource[];
  sessionTime?: string; // ISO 8601 date string for live sessions
  liveSessionUrl?: string;
  videoUrl?: string;
  content?: string;
  projectBrief?: string;
  questions?: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  prerequisites?: string[]; // Array of module IDs
}

export interface Testimonial {
  id: string;
  name: string;
  avatarUrl: string;
  quote: string;
  rating?: number;
}

export interface CourseAnalytics {
    totalStudents: number;
    completionRate: number; // percentage
    totalRevenue: number;
    engagement: { month: string; students: number }[];
    dropoutRates: { lesson: string; dropoutPercentage: number }[];
}

export interface Coupon {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
}


export interface Course {
  id:string;
  title: string;
  instructor: string;
  instructorImage?: string;
  imageUrl: string;
  progress: number; // Percentage from 0 to 100
  category: string;
  description: string;
  modules: Module[];
  isDraft?: boolean;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  price?: number; // 0 for free
  priceType?: 'free' | 'one-time' | 'subscription';
  rating?: number; // e.g., 4.5
  reviews?: number; // e.g., 1250
  duration?: string; // e.g., "10 hours"
  university?: string;
  universityLogo?: string;
  learningOutcomes?: string[];
  videoTrailerUrl?: string; 
  testimonials?: Testimonial[];
  certificateType?: 'Certificate' | 'Micro-Credential' | 'Degree';
  analytics?: CourseAnalytics;
  language?: string;
  coupons?: Coupon[];
  status?: 'active' | 'upcoming' | 'archived';
  statusLabel?: 'Self-Paced' | 'Online' | 'Archived' | 'Coming Soon';
  offeredBy?: 'institution' | 'instructor';
  institutionName?: string;
  facultyName?: string;
  campusName?: string;
  qualificationType?: string;
  instructorCredentials?: string;
  instructorCountry?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  feedback?: 'good' | 'bad';
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: string;
}

export interface Certificate {
    id: string;
    courseId: string;
    courseTitle: string;
    issuedDate: string;
    transactionHash: string;
    linkedinShareUrl?: string;
}

export interface EducationEntry {
    id: string;
    institution: string;
    degree: string;
    period: string;
}

export interface UserProfile {
    name: string;
    displayName?: string;
    username?: string;
    avatarUrl?: string;
    coverImageUrl?: string;
    bio?: string;
    contact?: {
        email: string;
        phone?: string;
    };
    location?: {
        city: string;
        country: string;
    };
    skills?: string[];
    socialLinks?: {
        linkedin?: string;
        github?: string;
        behance?: string;
        portfolio?: string;
    };
    education?: EducationEntry[];
    title: string;
    coursesInProgress: number;
    coursesCompleted: number;
    achievements: Achievement[];
    certificates: Certificate[];
    learningGoals?: string[];
    mentorshipStatus?: 'seeking' | 'offering' | 'none';
    targetCareer?: string;
    academicInstitution?: string;
    officeHours?: string;
    hourlyRate?: number;
}

export interface UserSettings {
    account: {
        email: string;
        phone: string;
        twoFactorEnabled: boolean;
        connectedAccounts: Array<'google' | 'apple' | 'linkedin'>;
    };
    learning: {
        language: string;
        subtitles: boolean;
        videoSpeed: number;
        videoQuality: 'auto' | '1080p' | '720p' | '480p';
        autoPlay: boolean;
    };
    notifications: {
        reminders: boolean;
        certificates: boolean;
        offers: boolean;
        forum: 'all' | 'highlights' | 'none';
    };
    privacy: {
        profileVisibility: 'public' | 'students' | 'private';
        showCompletedCourses: boolean;
        showAchievements: boolean;
    };
    payment: {
        plan: string;
        paymentMethods: Array<{ type: 'credit_card' | 'paypal'; last4: string; expiry: string }>;
        billingHistory: Array<{ id: string; date: string; amount: number; invoiceUrl: string }>;
    };
    accessibility: {
        highContrast: boolean;
    };
    support: {
        lastDataExportRequest: string | null;
        lastAccountDeletionRequest: string | null;
    };
}

export interface InstructorSettings {
    publicProfile: {
        displayName: string;
        bio: string;
        socialLinks?: {
            twitter?: string;
            youtube?: string;
            website?: string;
        };
        achievements?: Achievement[];
        certifications?: Certificate[];
        accreditations?: string[];
        licenses?: string[];
        resumeUrl?: string;
    };
    payout: {
        method: 'paypal' | 'stripe';
        paypalEmail?: string;
        stripeConnected: boolean;
    };
    notifications: {
        studentJoins: boolean;
        courseReviews: boolean;
        newEnrollments: boolean;
    };
}


export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    matchPercentage: number;
    skills: string[];
}

export interface ManagedLearner {
    id: string;
    name: string;
    email: string;
    progress: number; // percentage
    lastActive: string;
    department?: string;
}

export interface InstitutionAnalytics {
    totalLearners: number;
    activeCourses: number;
    certificatesIssued: number;
    learnersPlacedInJobs: number;
    progressDistribution: { status: 'Not Started' | 'In Progress' | 'Completed'; count: number }[];
    demographicsByDepartment?: { department: string; count: number }[];
    demographicsByRegion?: { region: string; count: number }[];
    demographicsByAge?: { ageGroup: string; count: number }[];
    employerConnections?: { employer: string; learnersHired: number }[];
    totalRevenue?: number;
    revenueByCourse?: { courseId: string, revenue: number }[];
}

export interface FacultyMember {
    id: string;
    name: string;
    title: string;
    avatarUrl: string;
    bio: string;
}

export interface CampusLocation {
    id: string;
    name: string;
    address: string;
    imageUrl: string;
}

export interface InstitutionAdmin {
    id: string;
    name: string;
    email: string;
    role: 'Owner' | 'Admin' | 'Billing Manager';
    lastLogin: string;
}

export interface Discount {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
}

export interface ProgramBundle {
    id: string;
    title: string;
    courseIds: string[];
    price: number;
}

export interface MonetizationSettings {
    pricingTiers: Array<{ id: string; name: string; price: number; description: string }>;
    scholarshipsEnabled: boolean;
    discounts: Discount[];
    programBundles: ProgramBundle[];
}

export interface Program {
    id: string;
    title: string;
    type: 'Micro-Credential' | 'Professional Certificate' | 'Degree Pathway';
    description: string;
}

export interface GalleryItem {
    id: string;
    imageUrl: string;
    caption: string;
}

export interface ImpactStory {
    id: string;
    title: string;
    author: string;
    content: string;
    imageUrl: string;
}

export interface OfficeHour {
    id: string;
    day: string;
    time: string;
    facultyName: string;
}

export interface InstitutionProfile {
    tagline: string;
    about: string;
    bannerUrl: string;
    website: string;
    social: {
        linkedin?: string;
        twitter?: string;
    };
    contact: {
        email: string;
        phone: string;
    };
    supportLinks?: {
        faq?: string;
        helpDesk?: string;
        applicationPortal?: string;
    };
    faculty: FacultyMember[];
    locations: CampusLocation[];
    partnerships: Array<{ name: string; logoUrl: string }>;
    videoIntroductionUrl?: string;
    gallery: GalleryItem[];
    impactStories: ImpactStory[];
    testimonials: Testimonial[];
    mentorshipProgram: {
        description: string;
        officeHours: OfficeHour[];
    };
}

export interface RolePermissions {
    [role: string]: {
        editProfile: boolean;
        manageCourses: boolean;
        viewAnalytics: boolean;
        manageTeam: boolean;
    };
}

export interface InstructorVerificationRequest {
    id: string;
    name: string;
    email: string;
    submittedDate: string;
}

export interface FullInstitutionData {
    name: string;
    profile: InstitutionProfile;
    branding: {
        logoUrl: string;
        primaryColor: string;
    };
    settings: {
        customDomain: string;
        whiteLabel: boolean;
        multiLanguage: boolean;
        profileVisibility: 'public' | 'private';
    };
    analytics: InstitutionAnalytics;
    admins: InstitutionAdmin[];
    learners: ManagedLearner[];
    monetization: MonetizationSettings;
    courses: Course[];
    programs: Program[];
    communityPosts: CommunityPost[];
    rolePermissions: RolePermissions;
    instructorVerifications: InstructorVerificationRequest[];
}

export interface CommunityPost {
    id: string;
    author: string;
    avatarUrl: string;
    timestamp: string;
    content: string;
    likes: number;
    comments: number;
}

export interface Mentor {
    id: string;
    name: string;
    avatarUrl: string;
    title: string;
    expertise: string[];
}

export interface MentorshipMeeting {
    id: string;
    title: string;
    with: string;
    date: string;
}

export interface Club {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    imageUrl: string;
}

export interface SubscriptionTier {
  name: string;
  price: number;
  idealFor: string;
  features: string[];
  objective: string;
  cta: string;
  featured?: boolean;
}
