import React, { useState, useMemo } from 'react';
import { Course, Lesson, Coupon, UserProfile } from '../types';
import AcademicCapIcon from './icons/AcademicCapIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import PlayIcon from './icons/PlayIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { getLessonIcon } from './utils/uiUtils';
import { 
  Building2, UserCheck, ShieldCheck, Clock, Award, 
  ArrowLeft, CheckCircle2, Play, Check, X, Sparkles, 
  Tag, Gift, ExternalLink, GraduationCap, Lock
} from 'lucide-react';

interface CourseLandingPageProps {
    course: Course;
    onEnroll: (course: Course) => void;
    onBack: () => void;
    userProfile?: UserProfile;
}

const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
};

const CourseLandingPage: React.FC<CourseLandingPageProps> = ({ 
    course, 
    onEnroll, 
    onBack, 
    userProfile 
}) => {
    const [openModuleId, setOpenModuleId] = useState<string | null>(course.modules[0]?.id || null);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
    const [showFinancialAidModal, setShowFinancialAidModal] = useState(false);
    const [financialAidSubmitted, setFinancialAidSubmitted] = useState(false);
    const [financialAidReason, setFinancialAidReason] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const videoEmbedUrl = useMemo(() => {
        return getYouTubeEmbedUrl(course.videoTrailerUrl || (course as any).videoUrl);
    }, [course.videoTrailerUrl, (course as any).videoUrl]);

    const handleApplyCoupon = () => {
        setCouponError(null);
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }
        const foundCoupon = course.coupons?.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
        if (foundCoupon) {
            setAppliedCoupon(foundCoupon);
            showToast(`Coupon applied! ${foundCoupon.type === 'percentage' ? `${foundCoupon.discount}% discount` : `$${foundCoupon.discount} off`}`);
        } else {
            setCouponError('Invalid or expired coupon code');
        }
    };

    const finalPrice = useMemo(() => {
        if (!course.price || !appliedCoupon) {
            return course.price;
        }
        if (appliedCoupon.type === 'percentage') {
            return course.price * (1 - appliedCoupon.discount / 100);
        }
        if (appliedCoupon.type === 'fixed') {
            return Math.max(0, course.price - appliedCoupon.discount);
        }
        return course.price;
    }, [course.price, appliedCoupon]);

    const totalLessons = useMemo(() => {
        return course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    }, [course]);

    return (
        <div className="animate-fade-in max-w-6xl mx-auto space-y-6 pb-16 text-zinc-100">
            
            {/* Dynamic Toast */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#141B26] text-emerald-400 font-mono text-xs shadow-2xl flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 size={15} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Back Button */}
            <div className="text-left">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-400 hover:text-emerald-400 transition cursor-pointer"
                >
                    <ArrowLeft size={14} />
                    <span>Back to Explore</span>
                </button>
            </div>

            {/* 2-Column Landing Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
                
                {/* Left Column (8 Cols): Main Presentation */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Hero Header */}
                    <div className="bg-[#0E131C] p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                                    {course.category}
                                </span>
                                <span>·</span>
                                <span className="text-zinc-400">
                                    {course.level || 'Academic Specialization'}
                                </span>
                                <span>·</span>
                                <span className="text-zinc-400">
                                    {course.duration || '12 Weeks'}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight leading-tight">
                                {course.title}
                            </h1>

                            <p className="text-sm sm:text-base font-sans text-zinc-300 leading-relaxed">
                                {course.description}
                            </p>
                        </div>

                        {/* Offering Authority Information Card */}
                        <div className="p-4 rounded-xl bg-[#141B26] text-xs font-mono space-y-2">
                            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                                {course.offeredBy === 'institution' ? <Building2 size={16} /> : <UserCheck size={16} />}
                                <span>
                                    {course.offeredBy === 'institution' 
                                        ? (course.institutionName || course.university || 'CogniSacra Academy')
                                        : course.instructor
                                    }
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-zinc-400 text-[11px] pt-1 border-t border-zinc-800/40">
                                <div>
                                    <span className="text-zinc-500 uppercase block text-[9px]">Faculty Track</span>
                                    <span className="text-zinc-200">{course.facultyName || 'Sovereign Curriculum'}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-500 uppercase block text-[9px]">Campus Node</span>
                                    <span className="text-zinc-200">{course.campusName || 'Main Academic Campus'}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-500 uppercase block text-[9px]">Accreditation</span>
                                    <span className="text-emerald-300 font-bold">{course.qualificationType || 'NQF Level 8 Sovereign Credential'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* What You'll Learn / Outcomes */}
                    {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                        <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4">
                            <h2 className="text-base font-bold font-serif text-white flex items-center gap-2">
                                <Sparkles size={16} className="text-emerald-400" />
                                <span>What You Will Master</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans text-zinc-200">
                                {course.learningOutcomes.map((outcome, index) => (
                                    <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#141B26]">
                                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                        <span className="leading-snug">{outcome}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Syllabus Preview Accordion */}
                    <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold font-serif text-white">
                                Course Syllabus & Modules
                            </h2>
                            <span className="text-xs font-mono text-zinc-400">
                                {course.modules.length} Modules · {totalLessons} Lessons
                            </span>
                        </div>

                        <div className="space-y-2.5">
                            {course.modules.map((module, idx) => {
                                const isOpen = openModuleId === module.id;
                                return (
                                    <div key={module.id} className="rounded-xl bg-[#141B26] overflow-hidden">
                                        <button 
                                            onClick={() => setOpenModuleId(isOpen ? null : module.id)}
                                            className="w-full flex justify-between items-center text-left p-4 hover:bg-[#1A2332] transition cursor-pointer"
                                            aria-expanded={isOpen}
                                        >
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                                                    Module {String(idx + 1).padStart(2, '0')}
                                                </span>
                                                <h3 className="font-serif text-sm font-bold text-white">{module.title}</h3>
                                            </div>
                                            <ChevronDownIcon className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isOpen && (
                                            <div className="px-4 pb-4 pt-1 border-t border-zinc-800/40 space-y-2">
                                                {module.lessons.map(lesson => (
                                                    <div key={lesson.id} className="p-2.5 rounded-lg bg-[#0E131C] flex items-center justify-between text-xs font-mono text-zinc-300">
                                                        <div className="flex items-center gap-2.5">
                                                            <span className="text-emerald-400">{getLessonIcon(lesson.format, "w-4 h-4")}</span>
                                                            <span className="text-white font-sans">{lesson.title}</span>
                                                        </div>
                                                        <span className="text-zinc-500 text-[11px]">{lesson.duration}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Testimonials */}
                    {course.testimonials && course.testimonials.length > 0 && (
                        <div className="bg-[#0E131C] p-6 rounded-2xl shadow-xl space-y-4">
                            <h2 className="text-base font-bold font-serif text-white">Learner Reviews & Endorsements</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {course.testimonials.map(t => (
                                    <div key={t.id} className="p-4 rounded-xl bg-[#141B26] space-y-2.5 flex flex-col justify-between">
                                        <p className="text-xs font-sans text-zinc-300 leading-relaxed italic">
                                            "{t.quote}"
                                        </p>
                                        <div className="flex items-center gap-2.5 pt-2 border-t border-zinc-800/40">
                                            <img src={t.avatarUrl} alt={t.name} className="w-8 h-8 rounded-full object-cover bg-[#0E131C]" />
                                            <div>
                                                <h4 className="text-xs font-bold font-serif text-white">{t.name}</h4>
                                                <span className="text-[10px] font-mono text-emerald-400">Verified Graduate</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Column (4 Cols): Sticky Enrollment Card */}
                <div className="lg:col-span-4">
                    <div className="sticky top-6 space-y-4">
                        <div className="bg-[#0E131C] rounded-2xl shadow-2xl overflow-hidden text-left">
                            
                            {/* Video Trailer Preview Stage */}
                            {isPlayingTrailer && videoEmbedUrl ? (
                                <div className="aspect-video bg-black overflow-hidden relative">
                                    <iframe 
                                        src={`${videoEmbedUrl}?autoplay=1`} 
                                        title={course.title} 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen 
                                        className="w-full h-full"
                                    />
                                    <button 
                                        onClick={() => setIsPlayingTrailer(false)} 
                                        className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white rounded-lg p-1.5 text-xs font-mono"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    onClick={() => {
                                        if (videoEmbedUrl) {
                                            setIsPlayingTrailer(true);
                                        } else {
                                            showToast('No external trailer URL; click Enroll to access lessons');
                                        }
                                    }} 
                                    className="aspect-video bg-[#090C11] relative flex items-center justify-center cursor-pointer group overflow-hidden" 
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Play course trailer"
                                >
                                    <img 
                                        src={course.imageUrl} 
                                        alt={course.title} 
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-300" 
                                    />
                                    <div className="absolute inset-0 bg-black/40" />
                                    <div className="relative z-10 w-14 h-14 rounded-full bg-emerald-500/90 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-emerald-400 transition">
                                        <Play size={20} className="fill-black ml-1" />
                                    </div>
                                    <span className="absolute bottom-3 text-white text-[10px] font-mono uppercase tracking-wider font-bold z-10">
                                        Preview Course
                                    </span>
                                </div>
                            )}

                            {/* Card Content & Checkout Action */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-baseline justify-between">
                                    <div className="flex items-baseline gap-2 font-mono">
                                        <span className="text-3xl font-extrabold text-white">
                                            {finalPrice === 0 ? 'Scholarship Funded' : `$${finalPrice?.toFixed(2)}`}
                                        </span>
                                        {appliedCoupon && course.price && (
                                            <span className="text-sm font-medium text-zinc-500 line-through">
                                                ${course.price.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                                        Full Access
                                    </span>
                                </div>

                                <button 
                                    onClick={() => onEnroll(course)} 
                                    className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
                                >
                                    {course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                                </button>

                                {/* Coupon Code Field */}
                                <div className="pt-3 border-t border-zinc-800/40 space-y-1.5">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Coupon Code (Optional)"
                                            className="w-full px-3 py-2 text-xs font-mono bg-[#141B26] text-white placeholder-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                                        />
                                        <button 
                                            onClick={handleApplyCoupon} 
                                            className="px-4 py-2 text-xs font-mono font-bold bg-[#141B26] hover:bg-[#1A2332] text-zinc-200 hover:text-white rounded-xl transition cursor-pointer"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {couponError && (
                                        <p className="text-[11px] font-mono text-rose-400">{couponError}</p>
                                    )}
                                    {appliedCoupon && (
                                        <p className="text-[11px] font-mono text-emerald-400">
                                            "{appliedCoupon.code}" applied!
                                        </p>
                                    )}
                                </div>

                                {/* Financial Aid Link */}
                                <div className="pt-2 border-t border-zinc-800/40 text-center">
                                    {userProfile?.academicInstitution ? (
                                        <button 
                                            onClick={() => {
                                                setFinancialAidSubmitted(false);
                                                setShowFinancialAidModal(true);
                                            }}
                                            className="text-xs font-mono text-emerald-400 hover:underline flex items-center justify-center mx-auto gap-1.5 cursor-pointer"
                                        >
                                            <GraduationCap size={14} />
                                            <span>Financial Aid via {userProfile.academicInstitution}</span>
                                        </button>
                                    ) : (
                                        <div className="text-[11px] font-mono text-zinc-400 p-2.5 bg-[#141B26] rounded-xl text-left">
                                            <p className="font-bold text-zinc-200 mb-0.5">Need Financial Aid?</p>
                                            <span>Set your academic institution in your profile to request institutional grants.</span>
                                        </div>
                                    )}
                                </div>

                                {/* Trust Highlights */}
                                <div className="pt-2 text-[11px] font-mono text-zinc-400 space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={13} className="text-emerald-400" />
                                        <span>On-Chain Cryptographic Certificate</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={13} className="text-emerald-400" />
                                        <span>Self-paced lifetime access</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            {/* Financial Aid Modal */}
            {showFinancialAidModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
                    <div className="bg-[#0E131C] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-800/40 pb-3">
                            <h3 className="text-base font-bold font-serif text-white">Apply for Financial Aid</h3>
                            <button onClick={() => setShowFinancialAidModal(false)} className="text-zinc-400 hover:text-white p-1">
                                <X size={16} />
                            </button>
                        </div>

                        {!financialAidSubmitted ? (
                            <div className="space-y-3 text-xs font-mono">
                                <p className="text-zinc-300 font-sans leading-relaxed">
                                    As an enrolled student of <strong className="text-emerald-400">{userProfile?.academicInstitution}</strong>, you qualify for 100% scholarship tuition waivers.
                                </p>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-zinc-500 uppercase">Reason for application</label>
                                    <textarea
                                        rows={3}
                                        value={financialAidReason}
                                        onChange={(e) => setFinancialAidReason(e.target.value)}
                                        placeholder="Briefly state your academic focus or research reason..."
                                        className="w-full p-2.5 bg-[#141B26] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none"
                                    />
                                </div>
                                <div className="pt-2 flex justify-end gap-2">
                                    <button 
                                        onClick={() => setShowFinancialAidModal(false)}
                                        className="px-3 py-1.5 rounded-xl bg-[#141B26] text-zinc-400 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setFinancialAidSubmitted(true);
                                            showToast('Financial aid application submitted for review');
                                        }}
                                        className="px-4 py-1.5 rounded-xl bg-emerald-500 text-black font-bold"
                                    >
                                        Submit Application
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-4 text-center space-y-3 font-mono">
                                <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
                                <h4 className="text-sm font-bold text-white">Application Received!</h4>
                                <p className="text-xs text-zinc-400 font-sans">
                                    Your institutional dean will verify your enrollment within 24 hours. Check your inbox for confirmation.
                                </p>
                                <button 
                                    onClick={() => setShowFinancialAidModal(false)}
                                    className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default CourseLandingPage;