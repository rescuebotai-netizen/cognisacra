import React from 'react';
import { Course } from '../types';
import StarIcon from './icons/StarIcon';
import { useTranslation } from '../hooks/useTranslation';
import { GraduationCap, Globe, Archive, Rocket, Bookmark, Clock, ArrowRight } from 'lucide-react';

interface FeaturedCourseCardProps {
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
                classes: 'bg-emerald-500/15 text-emerald-300',
                icon: GraduationCap,
            };
        case 'Online':
            return {
                text: 'Online',
                classes: 'bg-blue-500/15 text-blue-300',
                icon: Globe,
            };
        case 'Archived':
            return {
                text: 'Archived',
                classes: 'bg-slate-500/15 text-slate-300',
                icon: Archive,
            };
        case 'Coming Soon':
            return {
                text: 'Coming Soon',
                classes: 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-300',
                icon: Rocket,
            };
        default:
            return {
                text: 'Self-Paced',
                classes: 'bg-emerald-500/15 text-emerald-300',
                icon: GraduationCap,
            };
    }
};

const FeaturedCourseCard: React.FC<FeaturedCourseCardProps> = ({ 
    course, 
    onSelect, 
    isBookmarked, 
    onToggleBookmark 
}) => {
    const featuredText = useTranslation('Featured Course');
    const statusLabel = getCourseStatusLabel(course);
    const badge = getBadgeConfig(statusLabel);

    return (
        <div
            className="group relative w-full text-left rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 block bg-[#0E131C] hover:bg-[#131A26]"
            onClick={() => onSelect(course)}
            onKeyDown={(e) => { 
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(course); 
                }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View featured course: ${course.title}`}
        >
            {/* Bookmark button */}
            <div className="absolute top-4 left-4 z-20">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(course.id);
                    }}
                    className={`p-2.5 rounded-xl transition duration-200 active:scale-95 shadow-lg ${
                        isBookmarked 
                            ? 'bg-emerald-500 text-black' 
                            : 'bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white backdrop-blur-md'
                    }`}
                    aria-label={isBookmarked ? 'Remove from saved courses' : 'Save course for later'}
                >
                    <Bookmark size={15} className={isBookmarked ? 'fill-black' : 'fill-transparent'} />
                </button>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-20 select-none">
                <div className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{badge.text}</span>
                </div>
            </div>

            {/* Poster Image */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#090C11]">
                <img 
                    src={course.imageUrl} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-90 select-none" 
                    aria-hidden="true" 
                />
                
                {/* Smooth Gradient Masks */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E131C] via-[#0E131C]/60 to-transparent"></div>
            </div>
            
            {/* Card Content Overlay */}
            <div className="p-6 sm:p-7 relative -mt-32 z-10 space-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        {featuredText}
                    </span>
                    <span className="text-zinc-400 text-xs font-mono">
                        {course.category}
                    </span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight leading-tight text-white group-hover:text-emerald-400 transition-colors duration-200">
                    {course.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 max-w-2xl leading-relaxed font-sans">
                    {course.description}
                </p>
                
                {/* Offering Entity Details */}
                <div className="p-3 rounded-xl bg-[#141B26]/90 backdrop-blur-md space-y-1 font-mono text-xs max-w-xl">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                            <span>{course.offeredBy === 'institution' ? '🏢' : '👨‍🏫'}</span>
                            <span>{course.offeredBy === 'institution' ? (course.institutionName || course.university || 'CogniSacra Academy') : course.instructor}</span>
                        </div>
                        <div className="text-zinc-400 text-[11px]">
                            {course.qualificationType || course.instructorCredentials || 'Accredited Curriculum'}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40 font-mono text-xs">
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-300">{course.instructor}</span>
                        {course.rating && course.reviews && (
                            <div className="flex items-center">
                                <StarIcon className="w-3.5 h-3.5 text-amber-400 fill-current mr-1" />
                                <span className="font-bold text-white">{course.rating.toFixed(1)}</span>
                                <span className="text-[10px] text-zinc-500 ml-1">({course.reviews.toLocaleString()})</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                            {course.price === 0 ? 'Scholarship Funded' : `$${course.price}`}
                        </span>
                        <div className="hidden sm:flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                            <span>Explore Module</span>
                            <ArrowRight size={13} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedCourseCard;
