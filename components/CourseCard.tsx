import React from 'react';
import { Course } from '../types';
import StarIcon from './icons/StarIcon';
import { useTranslation } from '../hooks/useTranslation';
import BookmarkIcon from './icons/BookmarkIcon';
import { GraduationCap, Globe, Archive, Rocket, Sparkles, Shield, Bookmark, Clock } from 'lucide-react';

const calculateEstimatedReadingTime = (course: Course): string => {
    let totalMinutes = 0;
    
    if (course.modules && course.modules.length > 0) {
        course.modules.forEach(module => {
            if (module.lessons && module.lessons.length > 0) {
                module.lessons.forEach(lesson => {
                    // Base estimation by lesson format in minutes
                    switch (lesson.format) {
                        case 'reading':
                            totalMinutes += 12;
                            break;
                        case 'video':
                            totalMinutes += 15;
                            break;
                        case 'quiz':
                        case 'adaptive-quiz':
                            totalMinutes += 10;
                            break;
                        case 'project':
                            totalMinutes += 45;
                            break;
                        case 'live-session':
                        case 'metaverse':
                            totalMinutes += 30;
                            break;
                        default:
                            totalMinutes += 15;
                    }
                });
            }
        });
    }
    
    if (totalMinutes === 0) {
        return course.duration || '2 hours';
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0) {
        return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
    }
    return `${mins} min`;
};

interface CourseCardProps {
    course: Course;
    onSelect: (course: Course) => void;
    isBookmarked: boolean;
    onToggleBookmark: (courseId: string) => void;
}

const getCourseStatusLabel = (course: Course): 'Self-Paced' | 'Online' | 'Archived' | 'Coming Soon' => {
    if (course.statusLabel) return course.statusLabel;
    if (course.status === 'upcoming') return 'Coming Soon';
    if (course.status === 'archived') return 'Archived';
    if (course.offeredBy === 'institution' && course.status === 'active') return 'Online';
    return 'Self-Paced';
};

const getBadgeConfig = (statusLabel: 'Self-Paced' | 'Online' | 'Archived' | 'Coming Soon') => {
    switch (statusLabel) {
        case 'Self-Paced':
            return {
                text: 'Self-Paced',
                classes: 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:shadow-[0_0_12px_rgba(16,185,129,0.35)]',
                icon: GraduationCap,
            };
        case 'Online':
            return {
                text: 'Online',
                classes: 'bg-blue-600/10 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-600/20 hover:shadow-[0_0_12px_rgba(37,99,235,0.4)] animate-pulse-subtle',
                icon: Globe,
            };
        case 'Archived':
            return {
                text: 'Archived',
                classes: 'bg-slate-500/10 dark:bg-slate-550/15 text-slate-700 dark:text-slate-400 border-slate-500/20 hover:bg-slate-500/20 hover:opacity-90',
                icon: Archive,
            };
        case 'Coming Soon':
            return {
                text: 'Coming Soon',
                classes: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/15 dark:to-orange-500/20 text-amber-700 dark:text-amber-400 border-amber-500/25 hover:from-amber-500/20 hover:to-orange-500/25 hover:shadow-[0_0_12px_rgba(245,158,11,0.4)] relative overflow-hidden',
                icon: Rocket,
                isShimmer: true
            };
        default:
            return {
                text: 'Self-Paced',
                classes: 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
                icon: GraduationCap,
            };
    }
};

const getBonusLabels = (course: Course): string[] => {
    const labels: string[] = [];
    if (course.price === 0) {
        labels.push('Scholarship');
    }
    if (course.offeredBy === 'institution') {
        labels.push('Faculty Led');
    } else {
        labels.push('Professional');
    }
    if (course.level === 'Advanced') {
        labels.push('Research');
    } else if (course.level === 'Intermediate') {
        labels.push('Accredited');
    } else {
        labels.push('Featured');
    }
    return labels;
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, isBookmarked, onToggleBookmark }) => {
    const byText = useTranslation('by');
    const completeText = useTranslation('complete');
    const freeText = useTranslation('Free');

    const statusLabel = getCourseStatusLabel(course);
    const badge = getBadgeConfig(statusLabel);
    const StatusIcon = badge.icon;
    const bonusLabels = getBonusLabels(course);

    const [animatedProgress, setAnimatedProgress] = React.useState(0);
    React.useEffect(() => {
        setAnimatedProgress(0);
        const timer = setTimeout(() => {
            setAnimatedProgress(course.progress);
        }, 150);
        return () => clearTimeout(timer);
    }, [course.progress]);

    return (
        <div
            className="group relative bg-[#0E131C] hover:bg-[#131926] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col text-left h-full"
            onClick={() => onSelect(course)}
            onKeyDown={(e) => { 
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(course); 
                }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View course: ${course.title}`}
        >
            {/* Bookmark action at Top-Left */}
            <div className="absolute top-3 left-3 z-20">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(course.id);
                    }}
                    className={`p-2 rounded-xl transition-all duration-200 active:scale-95 shadow-md ${
                        isBookmarked 
                        ? 'bg-emerald-500 text-black' 
                        : 'bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white backdrop-blur-md'
                    }`}
                    aria-label={isBookmarked ? 'Remove from saved' : 'Save course'}
                >
                    <Bookmark className={`w-3.5 h-3.5 transition-transform duration-200 ${isBookmarked ? 'fill-black' : 'fill-transparent'}`} />
                </button>
            </div>

            {/* Status Badge at Top-Right */}
            <div className="absolute top-3 right-3 z-20 select-none">
                <div 
                    className="h-6 px-2.5 rounded-lg bg-black/60 backdrop-blur-md font-mono text-[10px] text-emerald-400 flex items-center justify-center gap-1.5 shadow-sm"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="tracking-wide uppercase">{badge.text}</span>
                </div>
            </div>

            {/* Card Hero Image Area */}
            <div className="relative overflow-hidden h-44 select-none bg-[#090C11]">
                <img 
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                    src={course.imageUrl} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    aria-hidden="true" 
                />
                
                {/* Gradient mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E131C] via-transparent to-transparent"></div>
                
                {/* Category label */}
                <div className="absolute bottom-2.5 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider text-emerald-300 uppercase bg-black/60 backdrop-blur-md rounded-lg">
                        {course.category}
                    </span>
                </div>
            </div>
            
            {/* Card Body Information */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-base font-semibold text-zinc-100 line-clamp-2 group-hover:text-emerald-400 transition-colors duration-200 leading-snug">
                    {course.title}
                </h3>
                
                {/* Detail Block */}
                <div className="mt-2.5 mb-3 p-2.5 rounded-xl bg-[#141B26] text-[11px] font-mono leading-snug space-y-1">
                    <div className="text-emerald-400 font-semibold truncate">
                        {course.offeredBy === 'institution' ? (course.institutionName || course.university || 'CogniSacra Academy') : course.instructor}
                    </div>
                    <div className="text-zinc-400 truncate">
                        {course.qualificationType || course.instructorCredentials || 'Certified Course'}
                    </div>
                </div>

                {/* Estimate */}
                <div className="flex items-center gap-1.5 mb-3 text-[11px] font-mono text-zinc-400 select-none">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Duration: <strong className="text-zinc-200">{calculateEstimatedReadingTime(course)}</strong></span>
                </div>

                {/* Footer Metadata & Pricing */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center space-x-2">
                        {course.rating && course.reviews ? (
                            <div className="flex items-center select-none font-mono">
                                <StarIcon className="w-3.5 h-3.5 text-amber-400 fill-current mr-1" />
                                <span className="font-semibold text-xs text-zinc-200 mr-1">{course.rating.toFixed(1)}</span>
                                <span className="text-[10px] text-zinc-500">
                                    ({course.reviews})
                                </span>
                            </div>
                        ) : null}
                    </div>

                    <div className="flex items-center space-x-3">
                        {course.progress > 0 ? (
                            <div className="flex items-center space-x-2 font-mono">
                                <div className="w-14 h-1.5 bg-[#141B26] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                                        style={{ width: `${animatedProgress}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-emerald-400">{course.progress}%</span>
                            </div>
                        ) : (
                            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                                {course.price === 0 ? freeText : `$${course.price}`}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
