
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Course, Lesson, Job, UserProfile, UserSettings, FullInstitutionData, InstructorSettings, UserRole } from './types';
import { courses as initialCourses, userProfile as initialUserProfile, recommendedJobs, instructorCourses as initialInstructorCourses, fullInstitutionData as initialInstitutionData, userSettings as initialUserSettings, initialInstructorSettings, seekingMentorshipLearners, mentorshipMeetings, instructorSubscriptionTiers, institutionSubscriptionTiers } from './constants';
import Sidebar from './components/Sidebar';
import { PlatformTourGuide } from './components/PlatformTourGuide';
import { Menu } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CourseDetailView from './components/CourseDetailView';
import AITutorView from './components/AITutorView';
import ProfileView from './components/ProfileView';
import ProfileEditingView from './components/ProfileEditingView';
import JobBoardView from './components/JobBoardView';
import AdaptiveQuizView from './components/AdaptiveQuizView';
import InstructorDashboardView from './components/InstructorDashboardView';
import CourseBuilderView from './components/CourseBuilderView';
import SplashScreen from './components/onboarding/SplashScreen';
import LoginView from './components/onboarding/LoginView';
import RoleSelectionView from './components/onboarding/RoleSelectionView';
import PersonalizationView from './components/onboarding/PersonalizationView';
import WelcomeAssistantView from './components/onboarding/WelcomeAssistantView';
import CourseLandingPage from './components/CourseLandingPage';
import LearningView from './components/LearningView';
import LessonCompletionModal from './components/LessonCompletionModal';
import InstructorAnalyticsView from './components/InstructorAnalyticsView';
import InstitutionDashboardView from './components/InstitutionDashboardView';
import CommunityHubView from './components/CommunityHubView';
import VRClassroomView from './components/VRClassroomView';
import ApplicationModal from './components/ApplicationModal';
import InstitutionLearnersView from './components/InstitutionLearnersView';
import InstitutionSettingsView from './components/InstitutionSettingsView';
import InstitutionProfileView from './components/InstitutionProfileView';
import InstitutionProfileEditingView from './components/InstitutionProfileEditingView';
import ProjectSubmissionView from './components/ProjectSubmissionView';
import CalendarView from './components/CalendarView';
import ProfileSettingsView from './components/ProfileSettingsView';
import InstructorSettingsView from './components/InstructorSettingsView';
import LiveSessionView from './components/LiveSessionView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import DataPolicyView from './components/DataPolicyView';
import TermsOfServiceView from './components/TermsOfServiceView';
import SubscriptionView from './components/SubscriptionView';
import AIToolsView from './components/AIToolsView';
import VirtualClassroomView from './components/VirtualClassroomView';
import { InstitutionPortalView } from './components/InstitutionPortalView';
import LandingPage from './components/landing/LandingPage';
import { supabase } from './services/supabaseClient';
import VirtualLibraryView from './components/VirtualLibraryView';
import CogniSacraInstitutionalLibraryView from './components/CogniSacraInstitutionalLibraryView';
import { AIArchitectView } from './components/AIArchitectView';
import { InstitutionAccreditationView } from './components/InstitutionAccreditationView';
import { AccreditationRecord } from './services/accreditationService';
import { InstructorIntegrationsView } from './components/InstructorIntegrationsView';
import { InstitutionIntegrationsView } from './components/InstitutionIntegrationsView';
import { ScrollDirectionProvider } from './components/motion/MotionScroll';

type View = 'dashboard' | 'course' | 'tutor' | 'profile' | 'jobs' | 'adaptive-quiz' | 'instructor-dashboard' | 'course-builder' | 'course-landing' | 'learning' | 'instructor-analytics' | 'institution-dashboard' | 'community' | 'vr-classroom' | 'institution-learners' | 'institution-settings' | 'project-submission' | 'calendar' | 'profile-editing' | 'profile-settings' | 'institution-profile' | 'institution-profile-editing' | 'instructor-settings' | 'instructor-integrations' | 'institution-integrations' | 'live-session' | 'about' | 'contact' | 'data-policy' | 'terms-of-service' | 'ai-tools' | 'virtual-class' | 'institution-portal' | 'library' | 'ai-architect' | 'institution-accreditation';
type OnboardingStep = 'splash' | 'auth' | 'role-selection' | 'personalization' | 'welcome' | 'loaded';
type Theme = 'light' | 'dark';
type TextSize = 'base' | 'lg' | 'xl';
type AppState = 'landing' | 'app';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('app');
    const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('loaded');
    const [currentView, setCurrentView] = useState<View>('course-landing');
    const [userRole, setUserRole] = useState<UserRole>('learner');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(initialCourses.find(c => c.id === 'react-mastery') || null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [currentQuiz, setCurrentQuiz] = useState<Lesson | null>(null);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [instructorCourses, setInstructorCourses] = useState<Course[]>(initialInstructorCourses);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isCompletionModalOpen, setCompletionModalOpen] = useState(false);
    const [analyticsCourse, setAnalyticsCourse] = useState<Course | null>(null);
    const [applyingForJob, setApplyingForJob] = useState<Job | null>(null);
    const [isApplicationModalOpen, setApplicationModalOpen] = useState(false);
    const [userProfileData, setUserProfileData] = useState<UserProfile>(() => {
        try {
            const saved = localStorage.getItem('cognisacra_user_profile');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return initialUserProfile;
    });
    const [userSettingsData, setUserSettingsData] = useState<UserSettings>(initialUserSettings);
    const [instructorSettingsData, setInstructorSettingsData] = useState<InstructorSettings>(initialInstructorSettings);
    const [institutionData, setInstitutionData] = useState<FullInstitutionData>(() => {
        try {
            const saved = localStorage.getItem('cognisacra_institution_data');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return initialInstitutionData;
    });
    const [theme, setTheme] = useState<Theme>('dark');
    const [textSize, setTextSize] = useState<TextSize>('base');
    const [institutionSubscriptionPlan, setInstitutionSubscriptionPlan] = useState<string | null>(null);
    const [instructorSubscriptionPlan, setInstructorSubscriptionPlan] = useState<string | null>(null);
    const [bookmarkedCourseIds, setBookmarkedCourseIds] = useState<Set<string>>(new Set());
    const [isFlipping, setIsFlipping] = useState(false);
    const [learnerInterests, setLearnerInterests] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [session, setSession] = useState<any>(null);
    const [rejoinSession, setRejoinSession] = useState<any>(null);
    const [libraryActiveTab, setLibraryActiveTab] = useState<string>('twin');
    const [tutorActiveTab, setTutorActiveTab] = useState<string>('ask-tutor');
    const [isTourOpen, setTourOpen] = useState(false);
    const mainContainerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        try {
            const hasSeen = localStorage.getItem('cognisacra_tour_completed');
            if (!hasSeen) {
                const timer = setTimeout(() => setTourOpen(true), 1500);
                return () => clearTimeout(timer);
            }
        } catch (e) {
            // ignore
        }
    }, []);

     useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    
    // Supabase Auth Listener
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchUserProfile(session.user.id);
        }).catch(err => {
            console.warn("Supabase initial session fetch error:", err);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchUserProfile(session.user.id);
            else {
                // Handle logout state cleanup if necessary
                setUserProfileData(initialUserProfile);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (userId: string) => {
        try {
            // 1. Fetch Basic Profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError || !profile) {
                console.warn("Error fetching profile:", profileError?.message);
                return;
            }

            const currentRole = profile.role as UserRole;
            setUserRole(currentRole);

            // 2. Fetch Role Specific Data
            if (currentRole === 'learner') {
                const { data: learnerData, error: learnerError } = await supabase
                    .from('learners_data')
                    .select('*')
                    .eq('id', userId)
                    .single();
                
                if (learnerData && !learnerError) {
                    setUserProfileData(prev => ({
                        ...prev,
                        name: profile.full_name || prev.name,
                        avatarUrl: profile.avatar_url || prev.avatarUrl,
                        bio: learnerData.bio || prev.bio,
                        title: learnerData.title || prev.title,
                        username: learnerData.username || prev.username,
                        coverImageUrl: learnerData.cover_image_url || prev.coverImageUrl,
                        location: {
                            city: learnerData.location_city || '',
                            country: learnerData.location_country || ''
                        },
                        skills: learnerData.skills || prev.skills,
                        socialLinks: learnerData.social_links || prev.socialLinks,
                        education: learnerData.education || prev.education,
                        learningGoals: learnerData.learning_goals || prev.learningGoals,
                        mentorshipStatus: learnerData.mentorship_status || prev.mentorshipStatus,
                        targetCareer: learnerData.target_career || prev.targetCareer
                    }));
                }
            } else if (currentRole === 'instructor') {
                const { data: instructorData, error: instrError } = await supabase
                    .from('instructors_data')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (instructorData && !instrError) {
                    // Update main profile for header display
                    setUserProfileData(prev => ({
                        ...prev,
                        name: profile.full_name || prev.name,
                        avatarUrl: profile.avatar_url || prev.avatarUrl,
                    }));
                    
                    // Update Instructor Settings
                    setInstructorSettingsData(prev => ({
                        ...prev,
                        publicProfile: {
                            ...prev.publicProfile,
                            displayName: instructorData.display_name || profile.full_name,
                            bio: instructorData.bio || prev.publicProfile.bio,
                            socialLinks: instructorData.social_links || prev.publicProfile.socialLinks,
                            accreditations: instructorData.accreditations || prev.publicProfile.accreditations,
                            licenses: instructorData.licenses || prev.publicProfile.licenses,
                            resumeUrl: instructorData.resume_url || prev.publicProfile.resumeUrl
                        },
                        payout: instructorData.payout_settings || prev.payout,
                        notifications: instructorData.notification_settings || prev.notifications
                    }));
                }
            } else if (currentRole === 'institution') {
                 const { data: instData, error: instError } = await supabase
                    .from('institutions_data')
                    .select('*')
                    .eq('id', userId)
                    .single();
                
                if (instData && !instError) {
                    setInstitutionData(prev => ({
                        ...prev,
                        name: instData.name || prev.name,
                        profile: {
                            ...prev.profile,
                            tagline: instData.tagline || prev.profile.tagline,
                            about: instData.about || prev.profile.about,
                            bannerUrl: instData.banner_url || prev.profile.bannerUrl,
                            website: instData.website || prev.profile.website,
                            contact: {
                                email: instData.contact_email || prev.profile.contact.email,
                                phone: instData.contact_phone || prev.profile.contact.phone
                            }
                        },
                        branding: {
                            ...prev.branding,
                            logoUrl: instData.branding_logo_url || prev.branding.logoUrl,
                            primaryColor: instData.branding_primary_color || prev.branding.primaryColor
                        },
                        settings: instData.settings || prev.settings,
                        monetization: instData.monetization_settings || prev.monetization
                    }));
                }
            }

        } catch (err) {
            console.error("Profile fetch error:", err);
        }
    };

    const handleSetAppState = (state: AppState) => {
        setIsFlipping(true);
        setTimeout(() => {
            setAppState(state);
            setIsFlipping(false);
        }, 500); // Match CSS transition duration
    };

    useEffect(() => {
        if (appState === 'app' && onboardingStep === 'splash') {
            if (!session) {
                // If not logged in via Supabase, go to auth
                 try {
                    // Legacy check for backward compatibility or if using local storage alongside supabase
                    if (localStorage.getItem('cogniSacraRememberMe') === 'true') {
                       // Logic to handle remember me if separate from session
                    }
                } catch (e) {
                    console.warn("Could not access localStorage.");
                }
            } else {
                // If session exists, skip auth
                setOnboardingStep('role-selection');
            }
        }
    }, [appState, onboardingStep, session]);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) { 
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // initial check
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const getTextSizeClass = () => {
        switch(textSize) {
            case 'lg': return 'text-lg';
            case 'xl': return 'text-xl';
            default: return 'text-base';
        }
    }

    const allCoursesForLearner = useMemo(() => {
        const combined = [...courses, ...instructorCourses, ...institutionData.courses];
        const uniqueIds = new Set();
        return combined.filter(course => {
            if (uniqueIds.has(course.id)) {
                return false;
            }
            uniqueIds.add(course.id);
            return true;
        });
    }, [courses, instructorCourses, institutionData.courses]);

    const personalizedCourses = useMemo(() => {
        if (userRole !== 'learner' || learnerInterests.length === 0) {
            return allCoursesForLearner;
        }
        return allCoursesForLearner.filter(course =>
            learnerInterests.includes(course.category)
        );
    }, [allCoursesForLearner, learnerInterests, userRole]);


    const handleLogout = useCallback(async () => {
        try {
            await supabase.auth.signOut();
            localStorage.removeItem('cogniSacraRememberMe');
        } catch (e) {
            console.warn("Error signing out:", e);
        }
        handleSetAppState('landing');
        setOnboardingStep('splash');
        setCurrentView('dashboard');
        setUserRole('learner'); // Reset to a default
        setSelectedCourse(null);
        setCurrentLesson(null);
        setCurrentQuiz(null);
        setEditingCourse(null);
        setAnalyticsCourse(null);
        setApplyingForJob(null);
        setApplicationModalOpen(false);
        setCompletionModalOpen(false);
        setInstitutionSubscriptionPlan(null);
        setInstructorSubscriptionPlan(null);
    }, []);

    const handleSelectCourse = useCallback((course: Course) => {
        setSelectedCourse(course);
        if (course.progress === 0 && userRole === 'learner') {
            setCurrentView('course-landing');
        } else {
            setCurrentView('course');
        }
    }, [userRole]);

    const handleEnrollCourse = useCallback((courseToEnroll: Course) => {
        setCourses(prevCourses => prevCourses.map(c => 
            c.id === courseToEnroll.id ? { ...c, progress: 1 } : c
        ));
        setSelectedCourse(prev => prev ? { ...prev, progress: 1 } : courseToEnroll);
        setCurrentView('course');
    }, []);

    const handleNavigate = useCallback((view: View, subTab?: string) => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
        setCurrentView(view);
        if (view === 'library' && subTab) {
            setLibraryActiveTab(subTab);
        }
        if (view === 'tutor' && subTab) {
            setTutorActiveTab(subTab);
        }
        if (mainContainerRef.current) {
            mainContainerRef.current.scrollTop = 0;
        }
    }, []);

    const handleStartLesson = useCallback((lesson: Lesson, course: Course) => {
        setSelectedCourse(course);
        if (lesson.format === 'adaptive-quiz') {
            setCurrentQuiz(lesson);
            setCurrentView('adaptive-quiz');
        } else if (lesson.format === 'metaverse') {
            setCurrentLesson(lesson);
            setCurrentView('vr-classroom');
        } else if (lesson.format === 'project') {
            setCurrentLesson(lesson);
            setCurrentView('project-submission');
        } else if (lesson.format === 'live-session') {
            setCurrentLesson(lesson);
            setCurrentView('live-session');
        }
        else {
            setCurrentLesson(lesson);
            setCurrentView('learning');
        }
    }, []);

    const handleCompleteLesson = useCallback((lessonToComplete: Lesson) => {
        const updateLessonStatus = (courseList: Course[]) => courseList.map(c => {
            if (c.id === selectedCourse?.id) {
                return {
                    ...c,
                    modules: c.modules.map(m => ({
                        ...m,
                        lessons: m.lessons.map(l => l.id === lessonToComplete.id ? { ...l, isCompleted: true } : l)
                    }))
                };
            }
            return c;
        });
        setCourses(updateLessonStatus);
        setInstructorCourses(updateLessonStatus);

        setCompletionModalOpen(true);
    }, [selectedCourse]);
    
    const handleApplyJob = useCallback((job: Job) => {
        setApplyingForJob(job);
        setApplicationModalOpen(true);
    }, []);

    const handleAuthentication = useCallback((name: string, isNewSignUp: boolean = false) => {
        if (name) {
            setUserProfileData(prev => ({ ...prev, name }));
        }
        if (isNewSignUp) {
            // The Onboarding process is strictly accessible only after sign up
            setOnboardingStep('role-selection');
        } else {
            // Existing user sign-in: bypass onboarding and go directly to dashboard
            setOnboardingStep('loaded');
        }
    }, []);

    const handleSelectRoleOnboarding = useCallback(async (role: UserRole, institutionRecord?: AccreditationRecord) => {
        setUserRole(role);
        
        if (institutionRecord) {
            setUserProfileData(prev => ({
                ...prev,
                name: institutionRecord.memberName || prev.name,
                academicInstitution: institutionRecord.institutionName
            }));
            setInstitutionData(prev => ({
                ...prev,
                name: institutionRecord.institutionName
            }));
        }

        if (session && session.user) {
            try {
                // Update role in profiles table
                await supabase.from('profiles').update({ role: role }).eq('id', session.user.id);
                
                // Ensure corresponding table entry exists
                if (role === 'instructor') {
                    const { data } = await supabase.from('instructors_data').select('id').eq('id', session.user.id).single();
                    if (!data) {
                        await supabase.from('instructors_data').insert([{ id: session.user.id }]);
                    }
                } else if (role === 'institution') {
                    const { data } = await supabase.from('institutions_data').select('id').eq('id', session.user.id).single();
                    if (!data) {
                        await supabase.from('institutions_data').insert([{ id: session.user.id, name: institutionRecord?.institutionName || 'My Institution' }]);
                    }
                } else if (role === 'learner') {
                     const { data } = await supabase.from('learners_data').select('id').eq('id', session.user.id).single();
                    if (!data) {
                        await supabase.from('learners_data').insert([{ id: session.user.id }]);
                    }
                }
            } catch (e) {
                console.error("Error updating role in Supabase:", e);
            }
        }

        if (institutionRecord) {
            // Institutional accreditation code self-onboarding:
            // Route directly to the respective institutional dashboard!
            setOnboardingStep('loaded');
            if (role === 'instructor') {
                setCurrentView('instructor-dashboard');
            } else {
                setCurrentView('dashboard');
            }
        } else if (role === 'learner') {
            // Independent learner enters personalization to choose domain interests
            setOnboardingStep('personalization');
        } else if (role === 'institution') {
            setOnboardingStep('loaded');
            setCurrentView('institution-dashboard');
        } else { // private instructor
            setOnboardingStep('loaded');
            setCurrentView('instructor-dashboard');
        }
    }, [session]);

    const handlePersonalizationComplete = useCallback((interests: string[]) => {
        setLearnerInterests(interests);
        // Optimistically update local state, and sync to DB
        if (session) {
            supabase.from('learners_data').update({ skills: interests }).eq('id', session.user.id).then(({ error }) => {
                if (error) console.error("Error saving interests:", error);
            });
        }
        setOnboardingStep('welcome');
    }, [session]);

    const handleSelectInstitutionPlan = useCallback((planName: string) => {
        setInstitutionSubscriptionPlan(planName);
    }, []);

    const handleSelectInstructorPlan = useCallback((planName: string) => {
        setInstructorSubscriptionPlan(planName);
    }, []);

    const handleCreateCourse = useCallback(() => {
        const newCourse: Course = {
            id: `course-${Date.now()}`,
            title: 'New Course Title',
            instructor: userProfileData.name,
            imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`,
            progress: 0,
            category: 'New Category',
            description: '',
            isDraft: true,
            modules: [],
            priceType: 'free',
            price: 0,
        };
        setEditingCourse(newCourse);
        setCurrentView('course-builder');
    }, [userProfileData.name]);
    
    const handleCreateInstitutionCourse = useCallback(() => {
        const newCourse: Course = {
            id: `course-${Date.now()}`,
            title: 'New Institution Course',
            instructor: institutionData.profile.faculty[0]?.name || institutionData.name,
            university: institutionData.name,
            universityLogo: institutionData.branding.logoUrl,
            imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`,
            progress: 0,
            category: 'New Category',
            description: '',
            isDraft: true,
            modules: [],
            priceType: 'one-time',
            price: 99.99,
            status: 'active',
        };
        setEditingCourse(newCourse);
        setCurrentView('course-builder');
    }, [institutionData]);

    const handleEditCourse = useCallback((course: Course) => {
        setEditingCourse(course);
        setCurrentView('course-builder');
    }, []);

    const handleSaveCourse = useCallback((updatedCourse: Course) => {
        if (userRole === 'instructor') {
            setInstructorCourses(prev => {
                const index = prev.findIndex(c => c.id === updatedCourse.id);
                if (index > -1) {
                    const newCourses = [...prev];
                    newCourses[index] = updatedCourse;
                    return newCourses;
                }
                return [...prev, updatedCourse];
            });
            setCurrentView('instructor-dashboard');
        } else if (userRole === 'institution') {
            setInstitutionData(prev => {
                const existingCourses = prev.courses || [];
                const index = existingCourses.findIndex(c => c.id === updatedCourse.id);
                let newCourses;
                if (index > -1) {
                    newCourses = [...existingCourses];
                    newCourses[index] = updatedCourse;
                } else {
                    newCourses = [...existingCourses, updatedCourse];
                }
                return { ...prev, courses: newCourses };
            });
            setCurrentView('institution-dashboard');
        }
        setEditingCourse(null);
    }, [userRole]);

    const handleViewAnalytics = useCallback((course: Course) => {
        setAnalyticsCourse(course);
        setCurrentView('instructor-analytics');
    }, []);

    const handleNavigateToEditProfile = useCallback(() => {
        setCurrentView('profile-editing');
    }, []);

    const handleSaveProfile = useCallback((updatedProfile: UserProfile) => {
        setUserProfileData(updatedProfile);
        try {
            localStorage.setItem('cognisacra_user_profile', JSON.stringify(updatedProfile));
        } catch (e) {
            console.warn("Could not save profile to localStorage", e);
        }

        // Keep instructorSettingsData in sync with updated profile
        setInstructorSettingsData(prev => ({
            ...prev,
            publicProfile: {
                ...prev.publicProfile,
                displayName: updatedProfile.name,
                bio: updatedProfile.bio || prev.publicProfile.bio,
                title: updatedProfile.title || prev.publicProfile.title
            }
        }));
        
        // Sync to Supabase
        if (session) {
            const updates: any = {
                username: updatedProfile.username,
                bio: updatedProfile.bio,
                title: updatedProfile.title,
                location_city: updatedProfile.location?.city,
                location_country: updatedProfile.location?.country,
                skills: updatedProfile.skills,
                social_links: updatedProfile.socialLinks,
                learning_goals: updatedProfile.learningGoals,
                target_career: updatedProfile.targetCareer
            };
            
            // Also update main profile table for name/avatar
            supabase.from('profiles').update({
                full_name: updatedProfile.name,
                avatar_url: updatedProfile.avatarUrl
            }).eq('id', session.user.id).then();

            supabase.from('learners_data').update(updates).eq('id', session.user.id).then(({ error }) => {
                if (error) console.error("Error saving profile to DB:", error);
            });
        }

        setCurrentView('profile');
    }, [session]);
    
    const handleSaveInstitutionProfile = useCallback((updatedData: FullInstitutionData) => {
        setInstitutionData(updatedData);
        try {
            localStorage.setItem('cognisacra_institution_data', JSON.stringify(updatedData));
        } catch (e) {
            console.warn("Could not save institution data to localStorage", e);
        }
        setCurrentView('institution-profile');
    }, []);

    const handleNavigateToSettings = useCallback(() => {
        if (userRole === 'learner') {
            setCurrentView('profile-settings');
        } else if (userRole === 'instructor') {
            setCurrentView('instructor-settings');
        } else if (userRole === 'institution') {
            setCurrentView('institution-settings');
        }
    }, [userRole]);

    const handleToggleBookmark = useCallback((courseId: string) => {
        setBookmarkedCourseIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(courseId)) {
                newSet.delete(courseId);
            } else {
                newSet.add(courseId);
            }
            return newSet;
        });
    }, []);


    const renderContent = () => {
        const dashboardUserName = userRole === 'institution' ? institutionData.name : userProfileData.name;

        switch (currentView) {
            case 'dashboard':
                return <Dashboard 
                    courses={personalizedCourses} 
                    onSelectCourse={handleSelectCourse} 
                    onNavigate={handleNavigate} 
                    bookmarkedCourseIds={bookmarkedCourseIds}
                    onToggleBookmark={handleToggleBookmark}
                    userName={dashboardUserName}
                    searchTerm={searchTerm}
                    userRole={userRole}
                />;
            case 'course-landing':
                return selectedCourse ? (
                    <CourseLandingPage 
                        course={selectedCourse} 
                        onEnroll={handleEnrollCourse} 
                        onBack={() => setCurrentView('dashboard')}
                        userProfile={userProfileData}
                    />
                ) : (
                     <Dashboard 
                        courses={personalizedCourses} 
                        onSelectCourse={handleSelectCourse} 
                        onNavigate={handleNavigate} 
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                        userName={dashboardUserName}
                        searchTerm={searchTerm}
                        userRole={userRole}
                    />
                );
            case 'course':
                return selectedCourse ? (
                    <CourseDetailView 
                        course={selectedCourse} 
                        onBack={() => setCurrentView(userRole === 'instructor' ? 'instructor-dashboard' : (userRole === 'institution' ? 'institution-dashboard' : 'dashboard'))} 
                        onStartLesson={(lesson) => handleStartLesson(lesson, selectedCourse)}
                        allCourses={allCoursesForLearner}
                        onSelectCourse={handleSelectCourse}
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                    />
                ) : (
                    <Dashboard 
                        courses={personalizedCourses} 
                        onSelectCourse={handleSelectCourse} 
                        onNavigate={handleNavigate} 
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                        userName={dashboardUserName}
                        searchTerm={searchTerm}
                        userRole={userRole}
                    />
                );
            case 'learning':
                 return currentLesson && selectedCourse ? (
                    <LearningView 
                        course={selectedCourse} 
                        lesson={currentLesson} 
                        onBack={() => setCurrentView('course')} 
                        onCompleteLesson={handleCompleteLesson}
                        onNavigateLesson={(lesson) => handleStartLesson(lesson, selectedCourse)}
                    />
                ) : (
                    <Dashboard 
                        courses={personalizedCourses} 
                        onSelectCourse={handleSelectCourse} 
                        onNavigate={handleNavigate} 
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                        userName={dashboardUserName}
                        searchTerm={searchTerm}
                        userRole={userRole}
                    />
                );
            case 'live-session':
                 return currentLesson && selectedCourse ? (
                    <LiveSessionView 
                        course={selectedCourse} 
                        lesson={currentLesson} 
                        onBack={() => setCurrentView('course')} 
                    />
                ) : (
                    <Dashboard 
                        courses={personalizedCourses} 
                        onSelectCourse={handleSelectCourse} 
                        onNavigate={handleNavigate} 
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                        userName={dashboardUserName}
                        searchTerm={searchTerm}
                        userRole={userRole}
                    />
                );
            case 'vr-classroom':
                 return <Dashboard 
                    courses={personalizedCourses} 
                    onSelectCourse={handleSelectCourse} 
                    onNavigate={handleNavigate} 
                    bookmarkedCourseIds={bookmarkedCourseIds}
                    onToggleBookmark={handleToggleBookmark}
                    userName={dashboardUserName}
                    searchTerm={searchTerm}
                    userRole={userRole}
                />;
            case 'project-submission':
                 return currentLesson && selectedCourse ? (
                    <ProjectSubmissionView
                        course={selectedCourse} 
                        lesson={currentLesson} 
                        onBack={() => setCurrentView('course')} 
                    />
                ) : (
                    <Dashboard 
                        courses={personalizedCourses} 
                        onSelectCourse={handleSelectCourse} 
                        onNavigate={handleNavigate} 
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                        userName={dashboardUserName}
                        searchTerm={searchTerm}
                        userRole={userRole}
                    />
                );
            case 'tutor':
                return <AITutorView userRole={userRole} initialTab={tutorActiveTab} onTabChange={setTutorActiveTab} />;
            case 'profile':
                if (userRole === 'institution') {
                    return <InstitutionProfileView 
                        institutionData={institutionData} 
                        onNavigate={() => setCurrentView('institution-profile-editing')} 
                        userRole={userRole}
                        onSelectCourse={handleSelectCourse}
                    />;
                }
                return <ProfileView 
                    userProfile={userProfileData} 
                    instructorSettings={instructorSettingsData}
                    userRole={userRole}
                    courses={courses} 
                    allCourses={allCoursesForLearner}
                    instructorCourses={instructorCourses}
                    jobs={recommendedJobs} 
                    onSelectCourse={handleSelectCourse}
                    onApplyJob={handleApplyJob}
                    onEditProfile={handleNavigateToEditProfile}
                    bookmarkedCourseIds={bookmarkedCourseIds}
                    onToggleBookmark={handleToggleBookmark}
                />;
            case 'profile-editing':
                return <ProfileEditingView
                    userProfile={userProfileData}
                    userRole={userRole}
                    onChange={(updated) => setUserProfileData(updated)}
                    onSave={handleSaveProfile}
                    onBack={() => setCurrentView('profile')}
                />;
             case 'profile-settings':
                return <ProfileSettingsView
                    settings={userSettingsData}
                    onSaveSettings={setUserSettingsData}
                    onUpdateTheme={setTheme}
                    onUpdateTextSize={setTextSize}
                    currentTheme={theme}
                    currentTextSize={textSize}
                />;
            case 'jobs':
                return <JobBoardView jobs={recommendedJobs} onApplyJob={handleApplyJob} />;
            case 'community':
                return <CommunityHubView userRole={userRole} />;
            case 'calendar':
                return <CalendarView courses={allCoursesForLearner} mentorshipMeetings={mentorshipMeetings} />;
            case 'adaptive-quiz':
                return currentQuiz && selectedCourse ? (
                     <AdaptiveQuizView course={selectedCourse} quizLesson={currentQuiz} onBack={() => setCurrentView('course')} />
                ) : (
                     <Dashboard 
                        courses={personalizedCourses} 
                        onSelectCourse={handleSelectCourse} 
                        onNavigate={handleNavigate} 
                        bookmarkedCourseIds={bookmarkedCourseIds}
                        onToggleBookmark={handleToggleBookmark}
                        userName={dashboardUserName}
                        searchTerm={searchTerm}
                        userRole={userRole}
                    />
                );
            case 'instructor-dashboard': {
                // The Choose Your Instructor Plan page is only required if the Instructor is Independent.
                // If the instructor is joining through an institution, the Choose Your Instructor Plan must not appear.
                const isInstitutionalInstructor = Boolean(
                    userProfileData.academicInstitution || 
                    institutionData.profile.faculty?.some(f => f.name.toLowerCase() === userProfileData.name.toLowerCase())
                );

                if (userRole === 'instructor' && !instructorSubscriptionPlan && !isInstitutionalInstructor) {
                    return <SubscriptionView
                        onSelectPlan={handleSelectInstructorPlan}
                        planType="instructor"
                        title="Choose Your Instructor Plan"
                        subtitle="Independent instructors launch and monetize courses worldwide with sovereign W3C credentials and 100% direct payouts."
                        onAffiliateBypass={(code) => {
                            setUserProfileData(prev => ({
                                ...prev,
                                academicInstitution: 'Partner Academic Institution'
                            }));
                            setInstructorSubscriptionPlan(`Institution Covered (${code})`);
                        }}
                    />;
                }
                return <InstructorDashboardView 
                    courses={instructorCourses} 
                    onCreateCourse={handleCreateCourse} 
                    onEditCourse={handleEditCourse} 
                    onViewCourse={handleSelectCourse} 
                    onViewAnalytics={handleViewAnalytics} 
                    seekingMentorshipLearners={seekingMentorshipLearners}
                    subscriptionPlan={instructorSubscriptionPlan || (isInstitutionalInstructor ? 'Institutional Faculty Plan' : null)}
                    rejoinSession={rejoinSession}
                    onRejoinSession={() => {
                        setCurrentView('virtual-class');
                    }}
                />;
            }
            case 'course-builder':
                return editingCourse ? (
                    <CourseBuilderView 
                        initialCourse={editingCourse} 
                        onSave={handleSaveCourse} 
                        onBack={() => setCurrentView(userRole === 'instructor' ? 'instructor-dashboard' : 'institution-dashboard')}
                        userRole={userRole}
                        faculty={institutionData.profile.faculty}
                    />
                ) : (
                    userRole === 'instructor' ?
                    <InstructorDashboardView courses={instructorCourses} onCreateCourse={handleCreateCourse} onEditCourse={handleEditCourse} onViewCourse={handleSelectCourse} onViewAnalytics={handleViewAnalytics} seekingMentorshipLearners={seekingMentorshipLearners} subscriptionPlan={instructorSubscriptionPlan} />
                    : <InstitutionDashboardView institutionData={institutionData} onCreateCourse={handleCreateInstitutionCourse} onEditCourse={handleEditCourse} onViewCourse={handleSelectCourse} subscriptionPlan={institutionSubscriptionPlan} />
                );
            case 'instructor-analytics':
                 return analyticsCourse ? (
                    <InstructorAnalyticsView course={analyticsCourse} onBack={() => setCurrentView('instructor-dashboard')} />
                ) : (
                     <InstructorDashboardView courses={instructorCourses} onCreateCourse={handleCreateCourse} onEditCourse={handleEditCourse} onViewCourse={handleSelectCourse} onViewAnalytics={handleViewAnalytics} seekingMentorshipLearners={seekingMentorshipLearners} subscriptionPlan={instructorSubscriptionPlan} />
                );
            case 'instructor-settings':
                return <InstructorSettingsView settings={instructorSettingsData} onSave={setInstructorSettingsData} />;
            case 'instructor-integrations':
                return <InstructorIntegrationsView />;
            case 'institution-dashboard':
                if (userRole === 'institution' && !institutionSubscriptionPlan) {
                     return <SubscriptionView
                        onSelectPlan={handleSelectInstitutionPlan}
                        planType="institution"
                        title="Choose Your Institution Plan"
                        subtitle="Deploy an accredited institutional platform with automated faculty onboarding, sovereign degree ledger, and LMS sync."
                    />;
                }
                return <InstitutionDashboardView 
                            institutionData={institutionData} 
                            onCreateCourse={handleCreateInstitutionCourse} 
                            onEditCourse={handleEditCourse} 
                            onViewCourse={handleSelectCourse}
                            subscriptionPlan={institutionSubscriptionPlan}
                            onNavigate={handleNavigate}
                        />;
            case 'institution-accreditation':
                return <InstitutionAccreditationView 
                            institutionData={institutionData}
                            onSimulateAccess={(role, memberName, instName) => {
                                setUserRole(role);
                                setUserProfileData(prev => ({
                                    ...prev,
                                    name: memberName,
                                    academicInstitution: instName
                                }));
                                setCurrentView(role === 'instructor' ? 'instructor-dashboard' : 'dashboard');
                            }}
                        />;
            case 'institution-learners':
                return <InstitutionLearnersView institutionData={institutionData} setInstitutionData={setInstitutionData} />;
            case 'institution-settings':
                return <InstitutionSettingsView institutionData={institutionData} onSave={setInstitutionData} />;
            case 'institution-integrations':
                return <InstitutionIntegrationsView />;
            case 'institution-profile':
                return <InstitutionProfileView 
                    institutionData={institutionData} 
                    onNavigate={() => setCurrentView('institution-profile-editing')} 
                    userRole={userRole}
                    onSelectCourse={handleSelectCourse}
                />;
            case 'institution-profile-editing':
                return <InstitutionProfileEditingView 
                    institutionData={institutionData} 
                    onChange={(updated) => setInstitutionData(updated)}
                    onSave={handleSaveInstitutionProfile} 
                    onBack={() => setCurrentView('institution-profile')} 
                />;
            case 'about':
                return <AboutView />;
            case 'contact':
                return <ContactView />;
            case 'data-policy':
                return <DataPolicyView />;
            case 'terms-of-service':
                return <TermsOfServiceView />;
            case 'ai-tools':
                return <AIToolsView />;
            case 'ai-architect':
                return <AIArchitectView userRole={userRole} />;
            case 'library':
                return userRole === 'institution' ? <CogniSacraInstitutionalLibraryView /> : <VirtualLibraryView userRole={userRole} initialTab={libraryActiveTab} onTabChange={setLibraryActiveTab} />;
            case 'institution-portal':
                return <InstitutionPortalView institutionData={institutionData} />;
            case 'virtual-class':
                return (
                    <VirtualClassroomView 
                        userRole={userRole} 
                        rejoinSessionToLoad={rejoinSession}
                        onClearRejoinSession={() => setRejoinSession(null)}
                        onLeaveClass={(sess) => {
                            if (userRole === 'instructor') {
                                setRejoinSession(sess);
                                setCurrentView('instructor-dashboard');
                            } else if (userRole === 'institution') {
                                setRejoinSession(null);
                                setCurrentView('virtual-class');
                            } else {
                                setCurrentView('dashboard');
                            }
                        }}
                    />
                );
            default:
                return <Dashboard 
                    courses={personalizedCourses} 
                    onSelectCourse={handleSelectCourse} 
                    onNavigate={handleNavigate} 
                    bookmarkedCourseIds={bookmarkedCourseIds}
                    onToggleBookmark={handleToggleBookmark}
                    userName={dashboardUserName}
                    searchTerm={searchTerm}
                    userRole={userRole}
                />;
        }
    };
    
    const renderOnboarding = () => {
        switch(onboardingStep) {
            case 'splash':
                return <SplashScreen onFinish={() => setOnboardingStep('auth')} />;
            case 'auth':
                return <LoginView onAuthenticated={handleAuthentication} />;
            case 'role-selection':
                return <RoleSelectionView onSelectRole={handleSelectRoleOnboarding} />;
            case 'personalization':
                return <PersonalizationView onComplete={handlePersonalizationComplete} />;
            case 'welcome':
                return <WelcomeAssistantView onStart={() => setOnboardingStep('loaded')} />;
            default:
                return null;
        }
    };
    
    const renderAppContent = () => {
        if (onboardingStep !== 'loaded') {
            return (
                <ScrollDirectionProvider>
                    <div className="bg-[#08090A] min-h-screen flex items-center justify-center transition-opacity duration-500">
                        {renderOnboarding()}
                    </div>
                </ScrollDirectionProvider>
            )
        }
        return (
            <div className={`h-screen w-full overflow-hidden bg-[#08090A] text-[#F3F4F6] flex ${getTextSizeClass()}`}>
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
                        aria-hidden="true"
                    />
                )}
                
                {/* Sidebar - fixed on mobile, flex item on desktop (Elevated to z-50 to keep modals in front) */}
                <div className={`fixed inset-y-0 left-0 z-50 lg:static lg:relative lg:z-50 lg:h-full lg:flex-shrink-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-20 lg:translate-x-0'}`}>
                    <Sidebar 
                        isOpen={isSidebarOpen} 
                        onNavigate={handleNavigate} 
                        currentView={currentView}
                        setSidebarOpen={setSidebarOpen}
                        userRole={userRole}
                        libraryActiveTab={libraryActiveTab}
                        tutorActiveTab={tutorActiveTab}
                        userName={userRole === 'institution' ? institutionData.name : userProfileData.name}
                        userAvatarUrl={userRole === 'institution' ? institutionData.branding.logoUrl : (userProfileData.avatarUrl || '')}
                        institutionName={institutionData.name}
                        institutionLogo={institutionData.branding.logoUrl}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onSwitchRole={(newRole) => setUserRole(newRole)}
                        onLogout={handleLogout}
                        onNavigateToProfile={() => handleNavigate('profile')}
                        onNavigateToSettings={handleNavigateToSettings}
                        onOpenOnboarding={() => setOnboardingStep('role-selection')}
                        onOpenTour={() => setTourOpen(true)}
                    />
                </div>

                {/* Main Content Area (Header removed - controls unified in Sidebar) */}
                <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative z-0">
                    {/* Mobile-only Top Strip */}
                    <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-[#0B0E14] border-b border-zinc-800 text-white">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-xl bg-[#182130] border border-zinc-700 text-zinc-200 hover:text-white shadow-md cursor-pointer"
                            aria-label="Open navigation menu"
                        >
                            <Menu size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <img src="/cogni-sacra.jpeg" alt="CogniSacra" className="w-6 h-6 rounded-md object-contain border border-zinc-700" />
                            <div className="font-mono font-bold text-xs tracking-wider text-white">
                                CogniSacra
                            </div>
                        </div>
                        <button
                            onClick={() => setTourOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-[#182130] border border-zinc-700 text-emerald-300 text-xs font-mono font-bold shadow-md cursor-pointer"
                        >
                            Tour
                        </button>
                    </div>

                    <main ref={mainContainerRef} className="flex-1 overflow-y-auto w-full px-3 sm:px-6 lg:px-8 py-5">
                        <div className="w-full pb-10">
                            {renderContent()}
                        </div>
                    </main>
                </div>

                <PlatformTourGuide 
                    isOpen={isTourOpen} 
                    onClose={() => setTourOpen(false)} 
                />

                <LessonCompletionModal 
                    isOpen={isCompletionModalOpen}
                    onClose={() => setCompletionModalOpen(false)}
                    achievement={userProfileData.achievements.find(a => a.name === 'Lesson Leader')}
                />
                <ApplicationModal 
                    isOpen={isApplicationModalOpen}
                    onClose={() => setApplicationModalOpen(false)}
                    job={applyingForJob}
                    userProfile={userProfileData}
                />
            </div>
        )
    };

    return (
        <div className="min-h-screen">
            {/* Logic for Landing/App flip */}
            {appState === 'landing' ? (
                 <div className="absolute w-full h-full min-h-screen">
                     <LandingPage onGetStarted={() => handleSetAppState('app')} />
                </div>
            ) : (
                /* Once in app mode, render without the 3D wrapper to fix fixed positioning contexts */
                <div className="absolute w-full h-full min-h-screen bg-[#08090A] text-[#F3F4F6]">
                     {renderAppContent()}
                </div>
            )}
        </div>
    );
};

export default App;
