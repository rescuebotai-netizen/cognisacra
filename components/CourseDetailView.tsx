import React, { useState, useMemo } from 'react';
import { Course, Module, Lesson } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import { getLessonIcon } from './utils/uiUtils';
import ComingSoonModal from './ComingSoonModal';
import FeedbackModal from './FeedbackModal';
import CourseCard from './CourseCard';
import { 
  Play, CheckCircle2, Lock, Clock, BookOpen, Award, 
  FileText, Share2, Bookmark, Star, ArrowLeft, ArrowRight, 
  Sparkles, Building2, UserCheck, ShieldCheck, Download,
  Check, HelpCircle, AlertCircle
} from 'lucide-react';

interface CourseDetailViewProps {
    course: Course;
    onBack: () => void;
    onStartLesson: (lesson: Lesson) => void;
    allCourses: Course[];
    onSelectCourse: (course: Course) => void;
    bookmarkedCourseIds: Set<string>;
    onToggleBookmark: (courseId: string) => void;
}

const getLessonActionText = (format: Lesson['format']) => {
    switch (format) {
        case 'video':
            return 'Watch Video';
        case 'reading':
            return 'Read Module';
        case 'quiz':
            return 'Take Quiz';
        case 'adaptive-quiz':
            return 'Start Assessment';
        case 'project':
            return 'Open Project Lab';
        case 'live-session':
            return 'Join Live Stage';
        default:
            return 'Start Lesson';
    }
};

const LessonItem: React.FC<{ 
    lesson: Lesson; 
    onStartLesson: (lesson: Lesson) => void; 
    onShowComingSoon: () => void;
}> = ({ lesson, onStartLesson, onShowComingSoon }) => {
    const handleActionClick = () => {
        if (lesson.isLocked) return;
        onStartLesson(lesson);
    };
    
    return (
        <div className={`p-4 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left ${
            lesson.isLocked 
                ? 'bg-[#0E131C]/60 opacity-60' 
                : (lesson.isCompleted ? 'bg-[#141B26]/80 hover:bg-[#182130]' : 'bg-[#141B26] hover:bg-[#1A2332]')
        }`}>
            <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    lesson.isCompleted 
                        ? 'bg-emerald-500/15 text-emerald-400' 
                        : (lesson.isLocked ? 'bg-[#0E131C] text-zinc-600' : 'bg-[#0E131C] text-zinc-200')
                }`}>
                    {lesson.isLocked ? (
                        <Lock size={16} />
                    ) : (
                        lesson.isCompleted ? <CheckCircle2 size={18} /> : getLessonIcon(lesson.format, "w-5 h-5")
                    )}
                </div>

                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-xs sm:text-sm text-white">{lesson.title}</p>
                        {lesson.isCompleted && (
                            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                COMPLETED
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                            <Clock size={11} className="text-zinc-500" />
                            <span>{lesson.duration}</span>
                        </span>
                        <span>·</span>
                        <span className="capitalize">{lesson.format.replace('-', ' ')}</span>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleActionClick}
                disabled={lesson.isLocked}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-center cursor-pointer ${
                    lesson.isLocked
                        ? 'bg-[#0E131C] text-zinc-500 cursor-not-allowed'
                        : (lesson.isCompleted 
                            ? 'bg-[#0E131C] hover:bg-emerald-500 hover:text-black text-emerald-300' 
                            : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 active:scale-95')
                }`}
            >
                <span>{lesson.isCompleted ? 'Review' : getLessonActionText(lesson.format)}</span>
                <ArrowRight size={12} />
            </button>
        </div>
    );
};

const ModuleItem: React.FC<{ 
    module: Module; 
    moduleIndex: number;
    onStartLesson: (lesson: Lesson) => void; 
    onShowComingSoon: () => void;
}> = ({ module, moduleIndex, onStartLesson, onShowComingSoon }) => {
    const completedCount = module.lessons.filter(l => l.isCompleted).length;
    const isAllComplete = completedCount === module.lessons.length && module.lessons.length > 0;

    return (
        <div className="bg-[#0E131C] rounded-2xl shadow-xl overflow-hidden text-left space-y-4 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/40">
                <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                        Module {String(moduleIndex + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-bold text-white font-serif tracking-tight">
                        {module.title}
                    </h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span className="bg-[#141B26] px-2.5 py-1 rounded-lg">
                        {completedCount}/{module.lessons.length} Lessons Completed
                    </span>
                    {isAllComplete && (
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                            <CheckCircle2 size={14} />
                            <span>Mastered</span>
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-2.5">
                {module.lessons.map(lesson => (
                    <LessonItem 
                        key={lesson.id} 
                        lesson={lesson} 
                        onStartLesson={onStartLesson} 
                        onShowComingSoon={onShowComingSoon} 
                    />
                ))}
            </div>
        </div>
    );
};

const CourseDetailView: React.FC<CourseDetailViewProps> = ({ 
    course, 
    onBack, 
    onStartLesson, 
    allCourses, 
    onSelectCourse, 
    bookmarkedCourseIds, 
    onToggleBookmark 
}) => {
    const [isComingSoonModalOpen, setComingSoonModalOpen] = useState(false);
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const isBookmarked = bookmarkedCourseIds.has(course.id);

    const relatedCourses = useMemo(() => {
        return allCourses
            .filter(c => c.category === course.category && c.id !== course.id)
            .slice(0, 3);
    }, [allCourses, course]);

    // Find first incomplete lesson to resume
    const nextLessonToResume = useMemo(() => {
        for (const module of course.modules) {
            for (const lesson of module.lessons) {
                if (!lesson.isCompleted && !lesson.isLocked) {
                    return lesson;
                }
            }
        }
        return course.modules[0]?.lessons[0] || null;
    }, [course]);

    const totalLessons = useMemo(() => {
        return course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    }, [course]);

    const completedLessons = useMemo(() => {
        return course.modules.reduce((acc, m) => acc + m.lessons.filter(l => l.isCompleted).length, 0);
    }, [course]);

    const copyCourseLink = () => {
        navigator.clipboard.writeText(window.location.href);
        showToast('Course link copied to clipboard');
    };

    return (
        <div className="w-full space-y-6 animate-fade-in pb-16 text-zinc-100">
            
            {/* Dynamic Toast */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#141B26] text-emerald-400 font-mono text-xs shadow-2xl flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 size={15} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Back Navigation Bar */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-400 hover:text-emerald-400 transition cursor-pointer"
                >
                    <ArrowLeft size={14} />
                    <span>Back to Courses</span>
                </button>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onToggleBookmark(course.id)}
                        className={`p-2 rounded-xl transition cursor-pointer ${
                            isBookmarked 
                                ? 'bg-emerald-500 text-black' 
                                : 'bg-[#0E131C] text-zinc-400 hover:text-white'
                        }`}
                        title={isBookmarked ? 'Remove from saved' : 'Save course'}
                    >
                        <Bookmark size={15} className={isBookmarked ? 'fill-black' : ''} />
                    </button>
                    <button
                        onClick={copyCourseLink}
                        className="p-2 rounded-xl bg-[#0E131C] text-zinc-400 hover:text-white transition cursor-pointer"
                        title="Share course"
                    >
                        <Share2 size={15} />
                    </button>
                    <button
                        onClick={() => setFeedbackModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-[#0E131C] text-zinc-300 hover:text-white text-xs font-mono transition cursor-pointer"
                    >
                        Leave Feedback
                    </button>
                </div>
            </div>

            {/* ============================================================
                COURSE HERO SHOWCASE (PREMIUM MODERN HEADER)
               ============================================================ */}
            <div className="bg-[#0E131C] rounded-2xl shadow-xl overflow-hidden relative text-left">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                    
                    {/* Course Media Poster (5 Cols) */}
                    <div className="lg:col-span-5 relative min-h-[260px] bg-[#090C11] overflow-hidden">
                        <img 
                            src={course.imageUrl} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-transparent to-[#0E131C]/90" />
                        
                        {/* Play button overlay */}
                        {nextLessonToResume && (
                            <button
                                onClick={() => onStartLesson(nextLessonToResume)}
                                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-emerald-500/90 text-black flex items-center justify-center hover:scale-110 hover:bg-emerald-400 transition shadow-2xl cursor-pointer"
                                title="Play lesson"
                            >
                                <Play size={24} className="fill-black ml-1" />
                            </button>
                        )}
                    </div>

                    {/* Course Details (7 Cols) */}
                    <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                        <div className="space-y-2.5">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                                    {course.category}
                                </span>
                                <span>·</span>
                                <span className="text-zinc-400">
                                    {course.level || 'Academic Track'}
                                </span>
                                <span>·</span>
                                <span className="text-zinc-400">
                                    {course.duration || '12 Weeks'}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight leading-tight">
                                {course.title}
                            </h1>

                            <p className="text-xs sm:text-sm font-sans text-zinc-300 leading-relaxed max-w-xl">
                                {course.description}
                            </p>

                            {/* Offering Authority & Accreditation */}
                            <div className="p-3.5 rounded-xl bg-[#141B26] text-xs font-mono space-y-1">
                                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                                    {course.offeredBy === 'institution' ? <Building2 size={14} /> : <UserCheck size={14} />}
                                    <span>
                                        {course.offeredBy === 'institution' 
                                            ? `Accredited by ${course.institutionName || course.university || 'CogniSacra Sovereign Academy'}`
                                            : `Taught by ${course.instructor}`
                                        }
                                    </span>
                                </div>
                                <p className="text-[11px] text-zinc-400">
                                    {course.qualificationType || course.instructorCredentials || 'Accredited NQF Level 8 Sovereign Credential'}
                                </p>
                            </div>
                        </div>

                        {/* Progress and Resume Action Row */}
                        <div className="pt-3 border-t border-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1 font-mono text-xs">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-zinc-400">Course Mastery</span>
                                    <span className="text-emerald-400 font-bold">{course.progress}%</span>
                                </div>
                                <div className="w-48 bg-[#141B26] h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }} />
                                </div>
                                <p className="text-[10px] text-zinc-500">
                                    {completedLessons} of {totalLessons} lessons finished
                                </p>
                            </div>

                            {nextLessonToResume && (
                                <button
                                    onClick={() => onStartLesson(nextLessonToResume)}
                                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
                                >
                                    <Play size={14} className="fill-black" />
                                    <span>Resume: {nextLessonToResume.title.slice(0, 22)}...</span>
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* ============================================================
                CURRICULUM SYLLABUS SECTION
               ============================================================ */}
            <div className="space-y-4">
                <div className="flex items-center justify-between text-left">
                    <div>
                        <h2 className="text-lg font-bold font-serif text-white tracking-tight flex items-center gap-2">
                            <BookOpen size={18} className="text-emerald-400" />
                            <span>Curriculum Syllabus</span>
                        </h2>
                        <p className="text-xs font-mono text-zinc-400">
                            {course.modules.length} Modules · {totalLessons} Lessons · Accredited Learning Objectives
                        </p>
                    </div>

                    <button
                        onClick={() => showToast('Downloading complete module syllabus in PDF...')}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0E131C] hover:bg-[#141B26] text-zinc-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                    >
                        <Download size={13} />
                        <span className="hidden sm:inline">Export Syllabus</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {course.modules.map((module, idx) => (
                        <ModuleItem 
                            key={module.id} 
                            module={module} 
                            moduleIndex={idx}
                            onStartLesson={onStartLesson} 
                            onShowComingSoon={() => setComingSoonModalOpen(true)} 
                        />
                    ))}
                </div>
            </div>

            {/* ============================================================
                INSTRUCTOR SPOTLIGHT CARD
               ============================================================ */}
            <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl text-left space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-serif text-white">Course Faculty & Leadership</h3>
                    <span className="text-xs font-mono text-emerald-400">Verified Instructor</span>
                </div>

                <div className="flex items-start gap-4">
                    <img 
                        src={course.instructorAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'} 
                        alt={course.instructor}
                        className="w-14 h-14 rounded-2xl object-cover bg-[#141B26] shrink-0" 
                    />
                    <div className="space-y-1 flex-1">
                        <h4 className="text-sm font-bold font-serif text-white">{course.instructor}</h4>
                        <p className="text-xs font-mono text-emerald-400">
                            {course.instructorCredentials || 'Professor of Distributed Computing & Lead Curriculum Architect'}
                        </p>
                        <p className="text-xs font-sans text-zinc-300 leading-relaxed pt-1">
                            {course.instructorBio || `${course.instructor} is an internationally published scholar directing advanced computer science and sovereign system curricula, with over 15 years of industry leadership and doctoral supervision.`}
                        </p>
                    </div>
                </div>
            </div>

            {/* ============================================================
                RELATED COURSES SECTION
               ============================================================ */}
            {relatedCourses.length > 0 && (
                <div className="space-y-4 text-left pt-4">
                    <h2 className="text-lg font-bold font-serif text-white tracking-tight">
                        Related Specializations & Tracks
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {relatedCourses.map(relatedCourse => (
                            <CourseCard
                                key={relatedCourse.id}
                                course={relatedCourse}
                                onSelect={onSelectCourse}
                                isBookmarked={bookmarkedCourseIds.has(relatedCourse.id)}
                                onToggleBookmark={onToggleBookmark}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Modals */}
            <ComingSoonModal 
                isOpen={isComingSoonModalOpen}
                onClose={() => setComingSoonModalOpen(false)}
                featureName="Feature Coming Soon"
                featureDescription="This module component is currently being staged for production."
            />
            <FeedbackModal 
                isOpen={isFeedbackModalOpen}
                onClose={() => setFeedbackModalOpen(false)}
                courseTitle={course.title}
            />

        </div>
    );
};

export default CourseDetailView;
