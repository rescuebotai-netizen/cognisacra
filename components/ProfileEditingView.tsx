import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { UserProfile, UserRole } from '../types';
import { 
    ArrowLeft, Camera, Upload, Sparkles, Check, CheckCircle2, 
    ShieldCheck, GraduationCap, Building2, MapPin, Globe, 
    ExternalLink, Save, X, Plus, Trash2,
    BookOpen, Award, Mail, Phone, Users, Layers, AlertCircle, Link2
} from 'lucide-react';

interface ProfileEditingViewProps {
    userProfile: UserProfile;
    userRole?: UserRole;
    onChange?: (updatedProfile: UserProfile) => void;
    onSave: (updatedProfile: UserProfile) => void;
    onBack: () => void;
}

type EditTab = 'visuals' | 'identity' | 'skills' | 'contact' | 'mentorship';

const coverPresets = [
    { label: 'Quantum Computing Lab', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80' },
    { label: 'Historic Oxford Library', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80' },
    { label: 'Sovereign Neural Network', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=80' },
    { label: 'Academic Cybernetics', url: 'https://images.unsplash.com/photo-1507842229450-7990e3488c73?w=1600&q=80' },
];

const avatarPresets = [
    { label: 'Academic Scholar', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
    { label: 'Senior Lecturer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
    { label: 'Fellow Researcher', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
    { label: 'Autonomous Node', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
];

const suggestSkills = async (currentSkills: string[]): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const allPossible = [
        "Distributed Systems", "PostgreSQL", "Cognitive AI", "Curriculum Architecture", 
        "Cryptographic Proofs", "Neural Computing", "TypeScript", "Formal Verification"
    ];
    return allPossible.filter(s => !currentSkills.some(cs => cs.toLowerCase() === s.toLowerCase())).slice(0, 5);
};

export const ProfileEditingView: React.FC<ProfileEditingViewProps> = ({ 
    userProfile, 
    userRole = 'instructor',
    onChange,
    onSave, 
    onBack 
}) => {
    const isInstructor = userRole === 'instructor';
    const [profile, setProfile] = useState<UserProfile>({
        ...userProfile,
        coverImageUrl: userProfile.coverImageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80',
        avatarUrl: userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
        title: userProfile.title || (isInstructor ? 'Lead Faculty & Research Chair in Distributed Systems' : 'Scholar'),
        academicInstitution: userProfile.academicInstitution || 'CogniSacra Sovereign Academic Network',
        skills: userProfile.skills?.length ? userProfile.skills : ['Distributed Systems', 'PostgreSQL', 'Cognitive AI', 'TypeScript'],
        learningGoals: userProfile.learningGoals || [],
        socialLinks: userProfile.socialLinks || { linkedin: '', github: '', portfolio: '' },
    });

    const isFirstMount = useRef(true);
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        onChange?.(profile);
    }, [profile, onChange]);

    const [activeTab, setActiveTab] = useState<EditTab>('visuals');
    const [skillInput, setSkillInput] = useState('');
    const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [savedToast, setSavedToast] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // File input refs for real-time upload
    const coverFileInputRef = useRef<HTMLInputElement>(null);
    const avatarFileInputRef = useRef<HTMLInputElement>(null);

    // Real-time Cover Upload
    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('Cover image exceeds 5MB limit. Please choose a smaller file.');
                return;
            }
            setUploadError(null);
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setProfile(prev => ({ ...prev, coverImageUrl: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Real-time Avatar / Logo Upload
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('Profile image exceeds 5MB limit. Please choose a smaller file.');
                return;
            }
            setUploadError(null);
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setProfile(prev => ({ ...prev, avatarUrl: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [name]: value },
        }));
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && !profile.skills?.includes(skillInput.trim())) {
            setProfile(prev => ({ ...prev, skills: [...(prev.skills || []), skillInput.trim()] }));
            setSkillInput('');
        }
    };

    const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setProfile(prev => ({ ...prev, skills: prev.skills?.filter(s => s !== skillToRemove) }));
    };

    const handleAISuggestions = async () => {
        setIsSuggesting(true);
        const suggestions = await suggestSkills(profile.skills || []);
        setSuggestedSkills(suggestions);
        setIsSuggesting(false);
    };

    const addSuggestedSkill = (skill: string) => {
        if (!profile.skills?.includes(skill)) {
            setProfile(prev => ({ ...prev, skills: [...(prev.skills || []), skill] }));
            setSuggestedSkills(prev => prev.filter(s => s !== skill));
        }
    };

    const handleSave = () => {
        onSave(profile);
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 2500);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-fade-in text-zinc-100 font-sans text-left">
            
            {/* Top Navigation & Action Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0E131C] p-5 rounded-2xl border border-zinc-800 shadow-xl">
                <div className="flex items-center gap-3">
                    <button 
                        type="button"
                        onClick={onBack}
                        className="p-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-300 hover:text-white border border-zinc-700/80 transition cursor-pointer"
                        title="Return to Profile"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider border ${
                                isInstructor 
                                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' 
                                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            }`}>
                                {isInstructor ? 'Instructor Editorial Suite' : 'Scholar Profile Editor'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[9px] uppercase font-bold border border-emerald-500/30 flex items-center gap-1">
                                <ShieldCheck size={10} /> Sovereign W3C Identity Verified
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                            {isInstructor ? 'Edit Instructor Profile & Academic Credentials' : 'Edit Scholar Public Identity'}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-4 py-2 text-xs font-mono font-bold text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button"
                        onClick={handleSave}
                        className={`px-5 py-2 text-xs font-mono font-bold text-slate-950 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                            isInstructor
                                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400'
                                : 'bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400'
                        }`}
                    >
                        <Save size={14} />
                        <span>Save & Publish</span>
                    </button>
                </div>
            </div>

            {/* Saved Toast Notification */}
            {savedToast && (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in shadow-xl">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Profile saved and synchronized to the sovereign cryptographic registry!</span>
                </div>
            )}

            {/* LIVE PROFILE HEADER PREVIEW (Reflects uploads and field edits in real time) */}
            <div className="bg-[#0E131C] rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl relative">
                {/* Live Cover Preview */}
                <div className="h-44 sm:h-56 w-full overflow-hidden bg-slate-900 relative">
                    <img 
                        src={profile.coverImageUrl} 
                        alt="Cover Preview" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10 flex items-center gap-1.5">
                        <Camera size={11} className="text-cyan-400" />
                        <span>Live Profile Banner Preview</span>
                    </span>
                </div>

                {/* Profile Identity Strip */}
                <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div className="flex items-end gap-4 -mt-12 sm:-mt-16">
                        {/* Live Avatar Preview */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0E131C] border-4 border-[#0E131C] shadow-2xl p-1 shrink-0 overflow-hidden relative">
                            <img 
                                src={profile.avatarUrl} 
                                alt={profile.name} 
                                className="w-full h-full object-cover rounded-xl bg-zinc-800 border border-zinc-700"
                            />
                            <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0E131C] flex items-center justify-center text-black" title="Verified Sovereign Node">
                                <Check size={11} className="stroke-[3]" />
                            </span>
                        </div>

                        <div className="space-y-1 mb-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg sm:text-2xl font-serif font-bold text-white truncate">
                                    {profile.name || 'Scholar Name'}
                                </h3>
                                <CheckCircle2 size={18} className="text-cyan-400 fill-cyan-500/20 shrink-0" />
                            </div>
                            <p className="text-xs text-zinc-300 font-sans line-clamp-1 max-w-xl">
                                {profile.title || 'Lead Faculty & Instructor'}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                                <span className="flex items-center gap-1 truncate text-amber-300/90">
                                    <Building2 size={11} className="text-amber-400" />
                                    <span>{profile.academicInstitution || 'CogniSacra Sovereign Node'}</span>
                                </span>
                                <span>·</span>
                                <span className="text-emerald-400">Verified Charter</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                        <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                            <ShieldCheck size={12} /> Live LinkedIn Scholar Format
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Tabs Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Section Navigation Tabs (3 Cols) */}
                <div className="lg:col-span-3 space-y-1.5 bg-[#0E131C] p-3 rounded-2xl border border-zinc-800 font-mono text-xs shadow-xl">
                    <span className="text-[10px] text-zinc-500 uppercase px-3 py-1 block font-bold tracking-wider">
                        Editor Sections
                    </span>
                    {[
                        { id: 'visuals', label: 'Cover & Portrait (Real-Time)', icon: <Camera size={14} /> },
                        { id: 'identity', label: 'Academic & Professional Identity', icon: <GraduationCap size={14} /> },
                        { id: 'skills', label: `Skills & Research (${profile.skills?.length || 0})`, icon: <BookOpen size={14} /> },
                        { id: 'contact', label: 'Scholarly Footprint & Links', icon: <Globe size={14} /> },
                        { id: 'mentorship', label: 'Mentorship Availability', icon: <Users size={14} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id as EditTab)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                                activeTab === tab.id
                                    ? isInstructor 
                                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                                        : 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                                    : 'text-zinc-400 hover:bg-[#141B26] hover:text-zinc-200'
                            }`}
                        >
                            <span className={activeTab === tab.id ? (isInstructor ? 'text-cyan-400' : 'text-emerald-400') : 'text-zinc-500'}>
                                {tab.icon}
                            </span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Form Panels (9 Cols) */}
                <div className="lg:col-span-9 bg-[#0E131C] p-6 sm:p-8 rounded-2xl border border-zinc-800 shadow-xl space-y-6">
                    
                    {/* TAB 1: VISUAL ASSETS & REAL-TIME UPLOAD */}
                    {activeTab === 'visuals' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div className="border-b border-zinc-800 pb-3">
                                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                    <Camera size={18} className="text-cyan-400" />
                                    <span>Brand Assets & Visual Identity</span>
                                </h3>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Upload your hero banner cover page and official portrait/logo in real time with instant live preview.
                                </p>
                            </div>

                            {uploadError && (
                                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center justify-between">
                                    <span>{uploadError}</span>
                                    <button type="button" onClick={() => setUploadError(null)} className="text-zinc-400 hover:text-white"><X size={14} /></button>
                                </div>
                            )}

                            {/* Real-time Cover Page Card */}
                            <div className="p-5 rounded-2xl bg-[#141B26] border border-zinc-700/80 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                                    <div>
                                        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                            <Upload size={14} className="text-cyan-400" />
                                            <span>Instructor Cover Page / Hero Banner</span>
                                        </h4>
                                        <p className="text-[11px] text-zinc-400 mt-0.5">
                                            Shown at the header of your public course listings and verified researcher portfolio.
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-500">1600 × 500 px recommended · Max 5MB</span>
                                </div>

                                <div className="relative rounded-xl overflow-hidden border border-zinc-700/80 bg-zinc-900 group">
                                    <div className="h-36 sm:h-44 w-full">
                                        <img 
                                            src={profile.coverImageUrl} 
                                            alt="Current Cover" 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <input 
                                            type="file" 
                                            ref={coverFileInputRef} 
                                            accept="image/*" 
                                            onChange={handleCoverUpload} 
                                            className="hidden" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => coverFileInputRef.current?.click()}
                                            className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 shadow-2xl transition cursor-pointer active:scale-95"
                                        >
                                            <Upload size={15} />
                                            <span>Upload Cover Page in Real Time</span>
                                        </button>
                                    </div>

                                    <span className="absolute bottom-2 left-3 text-[10px] font-mono text-zinc-300 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
                                        Real-Time Synchronized Cover
                                    </span>
                                </div>

                                <div className="space-y-2 pt-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold mr-1">Curated Presets:</span>
                                        {coverPresets.map(preset => (
                                            <button
                                                key={preset.label}
                                                type="button"
                                                onClick={() => setProfile(prev => ({ ...prev, coverImageUrl: preset.url }))}
                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition cursor-pointer ${
                                                    profile.coverImageUrl === preset.url 
                                                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold' 
                                                        : 'bg-[#1C2637] hover:bg-[#253247] text-zinc-300 border-zinc-700'
                                                }`}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="pt-1">
                                        <input 
                                            type="url"
                                            name="coverImageUrl"
                                            value={profile.coverImageUrl || ''}
                                            onChange={handleInputChange}
                                            placeholder="Or paste direct image URL (https://...)"
                                            className="w-full px-3 py-2 text-xs text-white bg-[#0E131C] border border-zinc-700 rounded-xl focus:border-cyan-400 focus:outline-none font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Real-time Portrait / Logo Card */}
                            <div className="p-5 rounded-2xl bg-[#141B26] border border-zinc-700/80 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                                    <div>
                                        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                            <GraduationCap size={14} className="text-cyan-400" />
                                            <span>Instructor Official Portrait / Emblem Logo</span>
                                        </h4>
                                        <p className="text-[11px] text-zinc-400 mt-0.5">
                                            Verified portrait displayed on lecture certificates, student feedback, and mentor office hours.
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-500">Square 400 × 400 px · Max 5MB</span>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-5">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0E131C] border-2 border-zinc-700 p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-xl relative group">
                                        <img 
                                            src={profile.avatarUrl} 
                                            alt={profile.name} 
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => avatarFileInputRef.current?.click()}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-cyan-300"
                                            title="Upload portrait or logo"
                                        >
                                            <Camera size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-3 flex-1 w-full text-left">
                                        <input 
                                            type="file" 
                                            ref={avatarFileInputRef} 
                                            accept="image/*" 
                                            onChange={handleAvatarUpload} 
                                            className="hidden" 
                                        />
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <button
                                                type="button"
                                                onClick={() => avatarFileInputRef.current?.click()}
                                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
                                            >
                                                <Upload size={14} />
                                                <span>Upload Portrait in Real Time</span>
                                            </button>
                                            {avatarPresets.map(preset => (
                                                <button
                                                    key={preset.label}
                                                    type="button"
                                                    onClick={() => setProfile(prev => ({ ...prev, avatarUrl: preset.url }))}
                                                    className="px-2.5 py-1.5 rounded-xl bg-[#1C2637] hover:bg-[#253247] text-zinc-300 font-mono text-[10px] border border-zinc-700 transition cursor-pointer"
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div>
                                            <input 
                                                type="url"
                                                name="avatarUrl"
                                                value={profile.avatarUrl || ''}
                                                onChange={handleInputChange}
                                                placeholder="Or paste direct image URL (https://...)"
                                                className="w-full px-3 py-2 text-xs text-white bg-[#0E131C] border border-zinc-700 rounded-xl focus:border-cyan-400 focus:outline-none font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: IDENTITY & ACADEMIC CREDENTIALS */}
                    {activeTab === 'identity' && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            <div className="border-b border-zinc-800 pb-3">
                                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                    <GraduationCap size={18} className="text-cyan-400" />
                                    <span>Academic & Professional Identity</span>
                                </h3>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Official legal name, university affiliation, academic rank, and research summary.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                        Full Professional Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={profile.name} 
                                        onChange={handleInputChange} 
                                        placeholder="e.g. Dr. Kwame Nkrumah, Prof. Adeyemi"
                                        className="w-full px-3.5 py-2.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                        Username / Sovereign Slug
                                    </label>
                                    <div className="flex items-center gap-1 px-3 py-2 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono">
                                        <span className="text-zinc-500">@</span>
                                        <input 
                                            type="text" 
                                            name="username" 
                                            value={profile.username || ''} 
                                            onChange={handleInputChange} 
                                            placeholder="adeyemi.sovereign"
                                            className="w-full bg-transparent text-white focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                        Academic Title & Faculty Chair
                                    </label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        value={profile.title} 
                                        onChange={handleInputChange} 
                                        placeholder="e.g. Chair of Distributed Systems & Autonomous Protocols"
                                        className="w-full px-3.5 py-2.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                        Affiliated Academic Institution
                                    </label>
                                    <input 
                                        type="text" 
                                        name="academicInstitution" 
                                        value={profile.academicInstitution || ''} 
                                        onChange={handleInputChange} 
                                        placeholder="e.g. University of Oxford / CogniSacra Node"
                                        className="w-full px-3.5 py-2.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Location Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                        City / Campus Location
                                    </label>
                                    <input 
                                        type="text" 
                                        value={profile.location?.city || ''} 
                                        onChange={(e) => setProfile(prev => ({
                                            ...prev,
                                            location: { ...(prev.location || { city: '', country: '' }), city: e.target.value }
                                        }))} 
                                        placeholder="e.g. Nairobi, Oxford, Boston"
                                        className="w-full px-3.5 py-2.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                        Country / Jurisdiction
                                    </label>
                                    <input 
                                        type="text" 
                                        value={profile.location?.country || ''} 
                                        onChange={(e) => setProfile(prev => ({
                                            ...prev,
                                            location: { ...(prev.location || { city: '', country: '' }), country: e.target.value }
                                        }))} 
                                        placeholder="e.g. Kenya, United Kingdom, USA"
                                        className="w-full px-3.5 py-2.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                    Biography & Teaching Philosophy
                                </label>
                                <textarea 
                                    name="bio" 
                                    value={profile.bio || ''} 
                                    onChange={handleInputChange} 
                                    rows={5} 
                                    placeholder="Outline your research focus, curriculum contributions, and scholarly background..."
                                    className="w-full p-3.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs text-white leading-relaxed focus:border-cyan-400 focus:outline-none font-sans"
                                />
                                <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                                    Rendered in the executive summary of your public profile and course syllabus.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: SKILLS & RESEARCH */}
                    {activeTab === 'skills' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div className="border-b border-zinc-800 pb-3">
                                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                    <BookOpen size={18} className="text-cyan-400" />
                                    <span>Pedagogical Skills & Research Focus</span>
                                </h3>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Add competencies that students and peer reviewers can endorse across the network.
                                </p>
                            </div>

                            {/* AI Skill Builder */}
                            <div className="p-4 rounded-2xl bg-[#141B26] border border-cyan-500/30 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                                            <Sparkles size={16} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-mono font-bold text-white uppercase">AI Curriculum Recommender</h4>
                                            <p className="text-[11px] text-zinc-400">Scan syllabus for sovereign compute competencies</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleAISuggestions} 
                                        disabled={isSuggesting}
                                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40 transition cursor-pointer disabled:opacity-50"
                                    >
                                        {isSuggesting ? 'Analyzing...' : 'Suggest Competencies'}
                                    </button>
                                </div>

                                {suggestedSkills.length > 0 && (
                                    <div className="pt-2 border-t border-zinc-800 space-y-1.5">
                                        <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">Click to append:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {suggestedSkills.map(skill => (
                                                <button
                                                    key={skill}
                                                    type="button"
                                                    onClick={() => addSuggestedSkill(skill)}
                                                    className="px-2.5 py-1 rounded-lg bg-[#1C2637] hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30 transition cursor-pointer"
                                                >
                                                    + {skill}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Current Skills Chips */}
                            <div className="space-y-2">
                                <span className="text-xs font-mono font-bold text-zinc-300 uppercase block">Active Competencies:</span>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills?.map(skill => (
                                        <div 
                                            key={skill} 
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141B26] border border-zinc-700 text-xs font-mono text-zinc-200 shadow-sm"
                                        >
                                            <span>{skill}</span>
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveSkill(skill)} 
                                                className="text-zinc-500 hover:text-rose-400 transition cursor-pointer"
                                                title="Remove skill"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Add Skill Input */}
                            <div>
                                <label htmlFor="skillInput" className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                    Add Competency or Tool
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        id="skillInput" 
                                        value={skillInput} 
                                        onChange={(e) => setSkillInput(e.target.value)} 
                                        onKeyDown={handleSkillKeyDown} 
                                        placeholder="Type skill and press Enter (e.g. Zero-Knowledge Proofs)" 
                                        className="flex-1 px-3.5 py-2.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleAddSkill} 
                                        className="px-4 py-2.5 bg-[#1C2637] hover:bg-[#253247] text-zinc-200 rounded-xl font-mono text-xs font-bold border border-zinc-700 transition cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: CONTACT & SCHOLARLY LINKS */}
                    {activeTab === 'contact' && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            <div className="border-b border-zinc-800 pb-3">
                                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                    <Globe size={18} className="text-cyan-400" />
                                    <span>Scholarly Footprint & Public Channels</span>
                                </h3>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Links students and academic collaborators can use to explore your papers and codebase.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5 flex items-center gap-1.5">
                                        <Link2 size={13} className="text-blue-400" />
                                        <span>LinkedIn Profile</span>
                                    </label>
                                    <input 
                                        type="url" 
                                        name="linkedin" 
                                        value={profile.socialLinks?.linkedin || ''} 
                                        onChange={handleSocialChange} 
                                        placeholder="https://linkedin.com/in/username" 
                                        className="w-full px-3.5 py-2.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5 flex items-center gap-1.5">
                                        <ExternalLink size={13} className="text-zinc-300" />
                                        <span>GitHub / Code Repository</span>
                                    </label>
                                    <input 
                                        type="url" 
                                        name="github" 
                                        value={profile.socialLinks?.github || ''} 
                                        onChange={handleSocialChange} 
                                        placeholder="https://github.com/username" 
                                        className="w-full px-3.5 py-2.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5 flex items-center gap-1.5">
                                        <Globe size={13} className="text-emerald-400" />
                                        <span>Google Scholar / Academic Portfolio</span>
                                    </label>
                                    <input 
                                        type="url" 
                                        name="portfolio" 
                                        value={profile.socialLinks?.portfolio || ''} 
                                        onChange={handleSocialChange} 
                                        placeholder="https://scholar.google.com/citations?user=..." 
                                        className="w-full px-3.5 py-2.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5 flex items-center gap-1.5">
                                        <Mail size={13} className="text-amber-400" />
                                        <span>Official Academic Email</span>
                                    </label>
                                    <input 
                                        type="email" 
                                        value={profile.contact?.email || 'adeyemi@cognisacra.io'} 
                                        onChange={(e) => setProfile(prev => ({
                                            ...prev,
                                            contact: { ...(prev.contact || { email: '' }), email: e.target.value }
                                        }))}
                                        placeholder="instructor@institution.edu" 
                                        className="w-full px-3.5 py-2.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: MENTORSHIP & OFFICE HOURS */}
                    {activeTab === 'mentorship' && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            <div className="border-b border-zinc-800 pb-3">
                                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                    <Users size={18} className="text-cyan-400" />
                                    <span>Mentorship & Faculty Office Hours</span>
                                </h3>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Set your availability for thesis guidance, code review, and student 1-on-1 consultations.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { id: 'offering', title: 'Open to Mentorship', desc: 'Accepting scholar requests for active thesis and research advising.' },
                                    { id: 'seeking', title: 'Cohort Peer Exchange', desc: 'Collaborating with other academic researchers in joint peer reviews.' },
                                    { id: 'none', title: 'Consultations Paused', desc: 'Currently focused on curriculum authoring and grading.' }
                                ].map(option => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setProfile(p => ({ ...p, mentorshipStatus: option.id as any }))}
                                        className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                                            profile.mentorshipStatus === option.id
                                                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40'
                                                : 'bg-[#141B26] border-zinc-700/80 hover:bg-[#1A2433] text-zinc-400'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-mono font-bold text-white">{option.title}</span>
                                            {profile.mentorshipStatus === option.id && <CheckCircle2 size={14} className="text-cyan-400" />}
                                        </div>
                                        <p className="text-[11px] font-sans text-zinc-400 leading-snug">
                                            {option.desc}
                                        </p>
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                        Office Hours Schedule
                                    </label>
                                    <input 
                                        type="text" 
                                        name="officeHours" 
                                        value={profile.officeHours || ''} 
                                        onChange={handleInputChange} 
                                        placeholder="e.g. Tuesdays & Thursdays, 14:00 - 16:00 GMT" 
                                        className="w-full px-3.5 py-2.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                    />
                                    <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                                        Displayed to students and fellows wishing to book advisory slots.
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                        Consultation Rate (USD / hour)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-2.5 text-zinc-500 font-mono text-xs">$</span>
                                        <input 
                                            type="number" 
                                            name="hourlyRate" 
                                            value={profile.hourlyRate || 85} 
                                            onChange={(e) => setProfile(p => ({ ...p, hourlyRate: Number(e.target.value) || 0 }))} 
                                            placeholder="85" 
                                            className="w-full pl-8 pr-3.5 py-2.5 bg-[#141B26] border border-zinc-700 rounded-xl text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                                        Direct sovereign payout rate for independent consultations.
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
};

export default ProfileEditingView;
