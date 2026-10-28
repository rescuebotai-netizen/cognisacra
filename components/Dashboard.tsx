import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Course, UserRole } from '../types';
import { motivationalQuotes } from '../constants';
import CourseCard from './CourseCard';
import FireIcon from './icons/FireIcon';
import TrophyIcon from './icons/TrophyIcon';
import ClockIcon from './icons/ClockIcon';
import { useTranslation } from '../hooks/useTranslation';
import FeaturedCourseCard from './FeaturedCourseCard';
import EmptyState from './EmptyState';
import { getQuickAnswer } from '../services/geminiService';
import { 
  Sparkles, BookOpen, ArrowRight, Play, CheckCircle2, 
  Search, SlidersHorizontal, Award, Calendar, Compass, 
  GraduationCap, TrendingUp, Layers, ChevronRight, Zap,
  Building2, MapPin, Users, Globe, ExternalLink
} from 'lucide-react';

interface DashboardProps {
    courses: Course[];
    onSelectCourse: (course: Course) => void;
    onNavigate: (view: any) => void;
    bookmarkedCourseIds: Set<string>;
    onToggleBookmark: (courseId: string) => void;
    userName: string;
    searchTerm: string;
    userRole: UserRole;
}

const ProgressCircle: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full relative z-10" viewBox="0 0 120 120">
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#00F29A" />
                    </linearGradient>
                </defs>
                <circle 
                    className="text-[#141B26]" 
                    strokeWidth="8" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r={radius} 
                    cx="60" 
                    cy="60" 
                />
                <circle 
                    strokeWidth="8" 
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="url(#progressGradient)" 
                    fill="transparent" 
                    r={radius} 
                    cx="60" 
                    cy="60" 
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono select-none">
                <span className="text-2xl font-bold text-white tabular-nums">{percentage}%</span>
                <span className="text-[9px] uppercase font-semibold text-emerald-400 tracking-wider">COMPLETED</span>
            </div>
        </div>
    );
};

const QuickQuestionWidget: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAsk = useCallback(async () => {
        if (!question.trim()) return;
        setIsLoading(true);
        setAnswer('');
        try {
            const response = await getQuickAnswer(question);
            setAnswer(response.text);
        } catch (error) {
            console.error(error);
            setAnswer('Unable to retrieve immediate answer. Please consult the AI Tutor in the sidebar.');
        } finally {
            setIsLoading(false);
        }
    }, [question]);
    
    return (
        <div className="bg-[#0E131C] p-4 rounded-2xl shadow-xl relative overflow-hidden text-left">
            <div className="flex items-center justify-between mb-3 pb-1">
                <div className="flex items-center space-x-1.5 font-mono text-xs text-zinc-300">
                    <Sparkles size={14} className="text-emerald-400" />
                    <span className="font-semibold text-zinc-200">COGNISACRA ASSISTANT</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                    ONLINE
                </span>
            </div>
            <div className="relative">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
                    placeholder="Ask any concept or equation..."
                    className="w-full pl-3 pr-14 py-2.5 text-xs font-mono rounded-xl bg-[#141B26] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
                <button
                    onClick={handleAsk}
                    disabled={isLoading || !question.trim()}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-emerald-500 text-black font-mono font-bold text-[11px] rounded-lg hover:bg-emerald-400 disabled:opacity-40 transition-colors cursor-pointer"
                >
                    {isLoading ? '...' : 'Ask'}
                </button>
            </div>
            {answer && (
                <div className="mt-3 p-3 bg-[#141B26] rounded-xl text-xs font-sans text-zinc-200 leading-relaxed max-h-48 overflow-y-auto animate-fade-in">
                    <div className="text-[10px] text-emerald-400 mb-1 font-mono font-semibold">Response:</div>
                    {answer}
                </div>
            )}
        </div>
    );
};

const DashboardSidebar: React.FC<{ onNavigate: (view: 'profile') => void, courses: Course[] }> = ({ onNavigate, courses }) => {
    const yourProgressText = useTranslation('Your Progress');
    const avgCompletionText = useTranslation('Average completion across courses');
    const upcomingDeadlinesText = useTranslation('Upcoming Deadlines');
    const noDeadlinesText = useTranslation('No upcoming deadlines.');
    const myAchievementsText = useTranslation('My Achievements');
    const viewAchievementsText = useTranslation('View unlocked sovereign credentials');

    const ongoingCourses = useMemo(() => courses.filter(c => c.progress > 0 && c.progress < 100), [courses]);
    const avgProgress = useMemo(() => ongoingCourses.length > 0 ? Math.round(ongoingCourses.reduce((acc, c) => acc + c.progress, 0) / ongoingCourses.length) : 0, [ongoingCourses]);
    
    const deadlines = useMemo(() => {
        const allDeadlines: { date: Date; title: string; course: string; }[] = [];
        courses.forEach(c => c.modules.forEach(m => m.lessons.forEach(l => {
            if (l.deadline && !l.isCompleted && new Date(l.deadline) > new Date()) {
                allDeadlines.push({ date: new Date(l.deadline), title: l.title, course: c.title });
            }
        })));
        return allDeadlines.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 3);
    }, [courses]);
    
    return (
        <div className="space-y-4 text-left">
            {/* Progress Card */}
            <div className="bg-[#0E131C] p-5 rounded-2xl shadow-xl flex flex-col items-center text-center">
                <div className="flex items-center justify-between w-full mb-2">
                    <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">{yourProgressText}</h3>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <ProgressCircle percentage={avgProgress} />
                <p className="text-[11px] font-mono text-zinc-400 mt-2">{avgCompletionText}</p>
                <div className="mt-3 pt-3 border-t border-zinc-800/40 w-full flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Enrolled: <strong className="text-white">{courses.filter(c => c.isEnrolled).length}</strong></span>
                    <span>Completed: <strong className="text-emerald-400">{courses.filter(c => c.progress === 100).length}</strong></span>
                </div>
            </div>
            
            {/* Quick Socratic Question Widget */}
            <QuickQuestionWidget />

            {/* Upcoming Deadlines */}
            <div className="bg-[#0E131C] p-4 rounded-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-1">
                    <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                        <ClockIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{upcomingDeadlinesText}</span>
                    </h3>
                    <Calendar size={13} className="text-zinc-500" />
                </div>
                {deadlines.length > 0 ? (
                    <ul className="space-y-2">
                        {deadlines.map((d, i) => (
                            <li key={i} className="p-3 bg-[#141B26] rounded-xl space-y-0.5">
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                    <span className="font-bold text-emerald-400 uppercase tracking-wider">
                                        {d.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="text-zinc-500">Upcoming</span>
                                </div>
                                <div className="font-medium text-xs text-zinc-200 line-clamp-1">{d.title}</div>
                                <div className="text-[10px] font-mono text-zinc-400 truncate">{d.course}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-xs font-mono text-zinc-500 italic py-2 text-center">{noDeadlinesText}</p>
                )}
            </div>
            
            {/* Achievements Launcher */}
            <div 
                className="bg-[#0E131C] hover:bg-[#141B26] p-4 rounded-2xl shadow-xl flex items-center space-x-3 transition-colors cursor-pointer" 
                onClick={() => onNavigate('profile')}
            >
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
                    <TrophyIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="font-mono font-semibold text-xs text-zinc-200">{myAchievementsText}</h3>
                    <p className="text-[10px] font-mono text-zinc-400 mt-0.5 flex items-center justify-between">
                        <span>{viewAchievementsText}</span>
                        <ChevronRight size={13} className="text-emerald-400" />
                    </p>
                </div>
            </div>
        </div>
    );
};

const DashboardHero: React.FC<{ 
    quote: string; 
    userName: string; 
    userRole: UserRole;
    ongoingCourses: Course[];
    onSelectCourse: (course: Course) => void;
}> = ({ quote, userName, userRole, ongoingCourses, onSelectCourse }) => {
    const welcomeText = useTranslation('Welcome back,');
    const displayName = userRole === 'institution' ? userName : (userName.split(' ')[0] || 'Learner');
    const latestOngoing = ongoingCourses.length > 0 ? ongoingCourses[0] : null;
    
    return (
        <div className="relative p-6 sm:p-7 rounded-2xl overflow-hidden bg-[#0E131C] shadow-xl text-left">
            <div className="relative z-10 flex flex-col lg:flex-row justify-between lg:items-center gap-6 text-white">
                <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        <span className="text-emerald-400 font-semibold tracking-wider">
                            ACADEMIC HUB
                        </span>
                        <span className="text-zinc-600">·</span>
                        <div className="inline-flex items-center space-x-1.5 text-zinc-300">
                            <FireIcon className="w-3.5 h-3.5 text-amber-400" />
                            <span>5 Day Study Streak</span>
                        </div>
                    </div>
                    
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
                        <span className="text-zinc-400 font-sans text-sm block font-normal pb-0.5">{welcomeText}</span>
                        {displayName}
                    </h1>

                    <p className="text-xs font-sans text-zinc-300 max-w-lg leading-relaxed">
                        Track curriculum competencies, continue active modules, and explore accredited sovereign degree paths.
                    </p>

                    {quote && (
                        <p className="text-xs font-mono italic text-zinc-400 pt-1 border-t border-zinc-800/40">
                            "{quote}"
                        </p>
                    )}
                </div>

                {/* Instant Resume Hero Action if user has an ongoing course */}
                {latestOngoing && (
                    <div className="p-4 rounded-xl bg-[#141B26] max-w-sm w-full space-y-3 shrink-0">
                        <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-emerald-400 font-bold uppercase text-[10px]">Resume Active Track</span>
                            <span className="text-white font-bold">{latestOngoing.progress}%</span>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold font-serif text-white line-clamp-1">{latestOngoing.title}</h3>
                            <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
                                {latestOngoing.instructor}
                            </p>
                        </div>
                        <div className="w-full bg-[#0E131C] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${latestOngoing.progress}%` }} />
                        </div>
                        <button
                            onClick={() => onSelectCourse(latestOngoing)}
                            className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <Play size={13} className="fill-black" />
                            <span>Continue Lesson</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ 
    courses, 
    onSelectCourse, 
    onNavigate, 
    bookmarkedCourseIds, 
    onToggleBookmark, 
    userName, 
    searchTerm, 
    userRole 
}) => {
    const [quote, setQuote] = useState('');
    const [courseTypeFilter, setCourseTypeFilter] = useState<'all' | 'instructor' | 'institution'>('all');
    const [filters, setFilters] = useState({
        subject: 'All',
        level: 'All',
        price: 'All',
        university: 'All',
        language: 'All',
    });

    const continueJourneyText = useTranslation('Continue Your Journey');
    const exploreCoursesText = useTranslation('Explore Courses');
    const trendingSkillsText = useTranslation('Trending Specializations');
    const freeCoursesText = useTranslation('Scholarship & Open Courses');

    useEffect(() => {
        setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, []);

    const handleScrollToCatalog = useCallback(() => {
        const catalogElement = document.getElementById('explore-catalog');
        if (catalogElement) {
            catalogElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const ongoingCourses = useMemo(() => courses.filter(c => c.progress > 0 && c.progress < 100), [courses]);
    const categories = useMemo(() => ['All', ...Array.from(new Set(courses.map(c => c.category)))], [courses]);
    const universities = useMemo(() => ['All', ...Array.from(new Set(courses.map(c => c.university).filter(Boolean)))], [courses]);
    const languages = useMemo(() => ['All', ...Array.from(new Set(courses.map(c => c.language).filter(Boolean)))], [courses]);
    
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const typeMatch = courseTypeFilter === 'all' || 
                              (courseTypeFilter === 'instructor' && !course.university) || 
                              (courseTypeFilter === 'institution' && !!course.university);

            const searchMatch = searchTerm === '' || 
                                course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                course.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
            const subjectMatch = filters.subject === 'All' || course.category === filters.subject;
            const levelMatch = filters.level === 'All' || course.level === filters.level;
            const priceMatch = filters.price === 'All' || (filters.price === 'Free' && course.price === 0);
            const universityMatch = filters.university === 'All' || course.university === filters.university;
            const languageMatch = filters.language === 'All' || course.language === filters.language;
            
            return typeMatch && searchMatch && subjectMatch && levelMatch && priceMatch && universityMatch && languageMatch;
        });
    }, [courses, searchTerm, filters, courseTypeFilter]);

    const partnerInstitutions = useMemo(() => [
        {
            id: 'cognisacra-inst',
            name: 'CogniSacra Sovereign Academy & Research Institute',
            tagline: 'Pioneering sovereign higher education, ethical AI systems, and accredited continental learning credentials.',
            location: 'Nairobi, Kenya',
            type: 'Chartered Sovereign Research University',
            verified: true,
            logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&q=80',
            facultyCount: 18,
            enrolledCount: 2450,
            coursesOffered: 14,
            badge: 'Official Host Campus'
        },
        {
            id: 'oxford-fellowship',
            name: "University of Oxford - St. Antony's Academic Fellowship",
            tagline: 'Global diplomatic ethics, historical institutional statecraft, and distributed algorithmic governance.',
            location: 'Oxford, United Kingdom',
            type: 'Collegiate Research University',
            verified: true,
            logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&q=80',
            facultyCount: 12,
            enrolledCount: 1820,
            coursesOffered: 8,
            badge: 'Accredited Partner'
        },
        {
            id: 'aims-network',
            name: 'African Institute for Mathematical Sciences (AIMS)',
            tagline: 'Pan-African network of centers of excellence for postgraduate training and quantum research.',
            location: 'Kigali, Rwanda · Cape Town, SA',
            type: 'Pan-African Mathematical Center',
            verified: true,
            logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=120&q=80',
            facultyCount: 22,
            enrolledCount: 3100,
            coursesOffered: 11,
            badge: 'Continental Center'
        },
        {
            id: 'mit-csail',
            name: 'Massachusetts Institute of Technology (MIT) - CSAIL Open',
            tagline: 'Computer Science and Artificial Intelligence Laboratory collaborative research and open robotics.',
            location: 'Cambridge, MA, USA',
            type: 'Polytechnic Institute',
            verified: true,
            logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&q=80',
            facultyCount: 30,
            enrolledCount: 5400,
            coursesOffered: 16,
            badge: 'Research Lab'
        },
        {
            id: 'ashesi-univ',
            name: 'Ashesi University - Center for Applied Ethics & Tech',
            tagline: 'Educating ethical, entrepreneurial leaders in Africa to transform a continent.',
            location: 'Berekuso, Ghana',
            type: 'Liberal Arts & Engineering',
            verified: true,
            logo: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=120&q=80',
            facultyCount: 15,
            enrolledCount: 1650,
            coursesOffered: 9,
            badge: 'African Partner'
        }
    ], []);

    const filteredInstitutions = useMemo(() => {
        if (!searchTerm) return partnerInstitutions;
        const term = searchTerm.toLowerCase();
        return partnerInstitutions.filter(inst => 
            inst.name.toLowerCase().includes(term) ||
            inst.location.toLowerCase().includes(term) ||
            inst.tagline.toLowerCase().includes(term) ||
            inst.type.toLowerCase().includes(term)
        );
    }, [searchTerm, partnerInstitutions]);

    const isSearchingInstitutions = Boolean(
        courseTypeFilter === 'institution' || 
        (searchTerm && filteredInstitutions.length > 0 && searchTerm.length >= 2)
    );

    const freeCourses = useMemo(() => courses.filter(c => c.price === 0), [courses]);
    const trendingCourses = useMemo(() => [...courses].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 5), [courses]);
    const featuredCourse = trendingCourses.length > 0 ? trendingCourses[0] : null;

    const gridKey = useMemo(() => JSON.stringify(filters) + searchTerm + courseTypeFilter, [filters, searchTerm, courseTypeFilter]);

    return (
        <div className="animate-fade-in pb-12 space-y-6">
            
            {/* 1. HERO BANNER WITH INSTANT RESUME ACTION */}
            <DashboardHero 
                quote={quote} 
                userName={userName} 
                userRole={userRole} 
                ongoingCourses={ongoingCourses}
                onSelectCourse={onSelectCourse}
            />

            {/* 2. MAIN 2-COLUMN GRID (MAIN 8 COLS + SIDEBAR 4 COLS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Main Content Area (8 Cols) */}
                <div className="lg:col-span-8 space-y-8 text-left">
                     
                     {/* Empty state if nothing enrolled */}
                     {ongoingCourses.length === 0 && bookmarkedCourseIds.size === 0 && (
                         <EmptyState onBrowse={handleScrollToCatalog} />
                     )}
                     
                     {/* Ongoing / In Progress Courses */}
                     {ongoingCourses.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white font-serif tracking-tight flex items-center gap-2">
                                    <BookOpen size={18} className="text-emerald-400" />
                                    <span>{continueJourneyText}</span>
                                </h2>
                                <span className="text-xs font-mono text-zinc-400">
                                    {ongoingCourses.length} in progress
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ongoingCourses.map(course => (
                                    <CourseCard 
                                        key={course.id} 
                                        course={course} 
                                        onSelect={onSelectCourse} 
                                        isBookmarked={bookmarkedCourseIds.has(course.id)}
                                        onToggleBookmark={onToggleBookmark}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Catalog Exploration Area */}
                    <div id="explore-catalog" className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                            <div>
                                <h2 className="text-lg font-bold text-white font-serif tracking-tight flex items-center gap-2">
                                    <Compass size={18} className="text-emerald-400" />
                                    <span>{exploreCoursesText}</span>
                                </h2>
                                <p className="text-xs font-mono text-zinc-400">
                                    Browse peer-reviewed curricula, academic modules, and verifiable certifications
                                </p>
                            </div>
                            <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full font-bold self-start sm:self-center">
                                {filteredCourses.length} Modules Available
                            </span>
                        </div>
                        
                        {/* Featured Course Spotlight */}
                        {featuredCourse && (
                            <div className="my-4">
                                <FeaturedCourseCard 
                                    course={featuredCourse} 
                                    onSelect={onSelectCourse} 
                                    isBookmarked={bookmarkedCourseIds.has(featuredCourse.id)}
                                    onToggleBookmark={onToggleBookmark}
                                />
                            </div>
                        )}

                        {/* Filter Toolbar (Segment buttons + Select dropdowns + Category pills) */}
                        <div className="p-4 bg-[#0E131C] rounded-2xl shadow-xl space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                                    {(['all', 'instructor', 'institution'] as const).map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setCourseTypeFilter(type)}
                                            className={`px-3 py-1.5 text-xs font-mono rounded-xl capitalize transition cursor-pointer ${
                                                courseTypeFilter === type
                                                    ? 'bg-emerald-500 text-black font-bold'
                                                    : 'bg-[#141B26] text-zinc-400 hover:text-white'
                                            }`}
                                        >
                                            {type === 'instructor' ? 'Faculty / Instructors' : (type === 'institution' ? 'Partner Universities' : 'All Offerings')}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                                    <SlidersHorizontal size={13} className="text-emerald-400" />
                                    <span>Filter Criteria</span>
                                </div>
                            </div>

                            {/* Dropdown Filters */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 border-t border-zinc-800/40">
                                <SelectFilter label="Level" value={filters.level} onChange={(v) => setFilters({...filters, level: v})} options={['All', 'Beginner', 'Intermediate', 'Advanced']} />
                                <SelectFilter label="Price" value={filters.price} onChange={(v) => setFilters({...filters, price: v})} options={['All', 'Free']} />
                                <SelectFilter label="Partner" value={filters.university} onChange={(v) => setFilters({...filters, university: v})} options={universities} />
                                <SelectFilter label="Language" value={filters.language} onChange={(v) => setFilters({...filters, language: v})} options={languages} />
                            </div>

                            {/* Category Filter Pills */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800/40">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setFilters({ ...filters, subject: category })}
                                        className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition cursor-pointer ${
                                            filters.subject === category 
                                                ? 'bg-emerald-500/20 text-emerald-300 font-bold' 
                                                : 'bg-[#141B26] text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Accredited Partner Institutions Directory (Always visible when filtering by institutions or searching) */}
                        {isSearchingInstitutions && (
                            <div className="space-y-3 pt-2 pb-3 animate-in fade-in duration-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={16} className="text-amber-400" />
                                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                                            Accredited Partner Academic Institutions ({filteredInstitutions.length})
                                        </h3>
                                    </div>
                                    <span className="text-[11px] font-mono text-zinc-400">
                                        LinkedIn Company Profile Compatible
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {filteredInstitutions.map((inst) => (
                                        <div 
                                            key={inst.id}
                                            className="p-4 rounded-2xl bg-[#0E131C] border border-zinc-800 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-xl text-left"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <img 
                                                            src={inst.logo} 
                                                            alt={inst.name} 
                                                            className="w-12 h-12 rounded-xl object-cover bg-white/5 border border-zinc-700/80 p-0.5 shrink-0"
                                                        />
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <h4 className="text-xs font-bold font-serif text-white hover:text-amber-300 transition">
                                                                    {inst.name}
                                                                </h4>
                                                                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 mt-0.5">
                                                                <MapPin size={10} className="text-zinc-500" />
                                                                <span>{inst.location}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono text-[9px] uppercase font-bold border border-amber-500/20 shrink-0">
                                                        {inst.badge}
                                                    </span>
                                                </div>

                                                <p className="text-[11px] text-zinc-300 mt-2.5 line-clamp-2 leading-relaxed">
                                                    {inst.tagline}
                                                </p>

                                                {/* Stats pills */}
                                                <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 mt-3 pt-2.5 border-t border-zinc-800/80">
                                                    <span>👥 {inst.facultyCount} Faculty</span>
                                                    <span>·</span>
                                                    <span>🎓 {inst.coursesOffered} Courses</span>
                                                    <span>·</span>
                                                    <span className="text-emerald-400">{inst.enrolledCount.toLocaleString()} Fellows</span>
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-2 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onNavigate('institution-profile')}
                                                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-mono font-bold border border-amber-500/30 flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                                                >
                                                    <Building2 size={13} />
                                                    <span>View Institution Page</span>
                                                    <ChevronRight size={13} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFilters({ ...filters, university: inst.name })}
                                                    className="p-2 rounded-xl bg-[#141B26] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 transition cursor-pointer"
                                                    title={`Filter courses by ${inst.name}`}
                                                >
                                                    <Search size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Course Cards Grid */}
                        <div key={gridKey} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {filteredCourses.map((course, index) => (
                                <div key={course.id} className="animate-fade-in" style={{ animationDelay: `${index * 40}ms` }}>
                                    <CourseCard
                                        course={course} 
                                        onSelect={onSelectCourse} 
                                        isBookmarked={bookmarkedCourseIds.has(course.id)}
                                        onToggleBookmark={onToggleBookmark}
                                    />
                                </div>
                            ))}
                        </div>

                        {filteredCourses.length === 0 && (
                            <div className="text-center py-16 text-zinc-400 bg-[#0E131C] rounded-2xl shadow-xl mt-4">
                                <p className="text-sm font-semibold text-zinc-200">No courses match your filter criteria.</p>
                                <p className="text-xs mt-1 text-zinc-500 font-mono">Try adjusting your subject or level selections.</p>
                                <button
                                    onClick={() => {
                                        setFilters({ subject: 'All', level: 'All', price: 'All', university: 'All', language: 'All' });
                                        setCourseTypeFilter('all');
                                    }}
                                    className="mt-4 px-4 py-1.5 rounded-xl bg-emerald-500 text-black font-mono text-xs font-bold"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Trending & Open Courses Horizontal Carousels */}
                    <div className="space-y-6 pt-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                                    <TrendingUp size={16} className="text-amber-400" />
                                    <span>{trendingSkillsText}</span>
                                </h3>
                                <span className="text-xs font-mono text-zinc-500">Highest rated this term</span>
                            </div>
                            <div className="flex overflow-x-auto space-x-4 pb-3 -mx-4 px-4 no-scrollbar">
                                {trendingCourses.map(course => (
                                    <div key={course.id} className="flex-shrink-0 w-72 sm:w-80">
                                        <CourseCard 
                                            course={course} 
                                            onSelect={onSelectCourse} 
                                            isBookmarked={bookmarkedCourseIds.has(course.id)}
                                            onToggleBookmark={onToggleBookmark}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                                    <GraduationCap size={16} className="text-emerald-400" />
                                    <span>{freeCoursesText}</span>
                                </h3>
                                <span className="text-xs font-mono text-zinc-500">Sponsored academic tracks</span>
                            </div>
                            <div className="flex overflow-x-auto space-x-4 pb-3 -mx-4 px-4 no-scrollbar">
                                {freeCourses.map(course => (
                                    <div key={course.id} className="flex-shrink-0 w-72 sm:w-80">
                                        <CourseCard 
                                            course={course} 
                                            onSelect={onSelectCourse} 
                                            isBookmarked={bookmarkedCourseIds.has(course.id)}
                                            onToggleBookmark={onToggleBookmark}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (4 Cols) */}
                <div className="lg:col-span-4 space-y-4">
                    <DashboardSidebar onNavigate={onNavigate} courses={courses} />
                </div>

            </div>
        </div>
    );
};

const SelectFilter: React.FC<{ label: string; value: string; onChange: (val: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="sr-only">Filter by {label}</label>
        <select 
            value={value} 
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-[#141B26] text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors cursor-pointer"
        >
            <option value="All">{label}: All</option>
            {options.filter(o => o !== 'All').map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

export default Dashboard;
