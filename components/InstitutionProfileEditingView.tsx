import React, { useState, useRef, useEffect } from 'react';
import { 
    FullInstitutionData, CampusLocation, Program, Course, 
    GalleryItem, ImpactStory, Testimonial, OfficeHour 
} from '../types';
import { 
    ArrowLeft, CheckCircle2, Building2, MapPin, Globe, Phone, 
    Mail, ExternalLink, Image as ImageIcon, Sparkles, Plus, 
    Trash2, Eye, ShieldCheck, GraduationCap, Clock, Award, 
    Save, Link2, Share2, HelpCircle, Layers, Check, Upload,
    Camera, RefreshCw
} from 'lucide-react';

interface InstitutionProfileEditingViewProps {
    institutionData: FullInstitutionData;
    onChange?: (updatedData: FullInstitutionData) => void;
    onSave: (updatedData: FullInstitutionData) => void;
    onBack: () => void;
}

type EditTab = 'branding' | 'overview' | 'admissions' | 'campuses' | 'programs' | 'mentorship';

export const InstitutionProfileEditingView: React.FC<InstitutionProfileEditingViewProps> = ({ 
    institutionData, 
    onChange,
    onSave, 
    onBack 
}) => {
    const [data, setData] = useState<FullInstitutionData>(institutionData);
    const [activeTab, setActiveTab] = useState<EditTab>('branding');
    const [savedToast, setSavedToast] = useState(false);

    const isFirstMount = useRef(true);
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        onChange?.(data);
    }, [data, onChange]);

    // Real-time file upload refs & state
    const bannerFileInputRef = useRef<HTMLInputElement>(null);
    const logoFileInputRef = useRef<HTMLInputElement>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('Banner image exceeds 5MB limit. Please choose a smaller file.');
                return;
            }
            setUploadError(null);
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, bannerUrl: result }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('Logo image exceeds 5MB limit. Please choose a smaller file.');
                return;
            }
            setUploadError(null);
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setData(prev => ({
                    ...prev,
                    branding: { ...prev.branding, logoUrl: result }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // New item inputs
    const [newLocation, setNewLocation] = useState({ name: '', address: '' });
    const [newProgram, setNewProgram] = useState({ title: '', type: 'Micro-Credential' as Program['type'], description: '' });
    const [newOfficeHour, setNewOfficeHour] = useState({ day: 'Monday', time: '14:00 - 16:00 GMT', facultyName: '' });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            profile: { ...prev.profile, [name]: value }
        }));
    };
    
    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                contact: { ...prev.profile.contact, [name]: value }
            }
        }));
    };

    const handleSupportLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                supportLinks: { ...(prev.profile.supportLinks || {}), [name]: value }
            }
        }));
    };

    const handleBrandingChange = (key: 'logoUrl' | 'primaryColor', val: string) => {
        setData(prev => ({
            ...prev,
            branding: { ...prev.branding, [key]: val }
        }));
    };

    const handleAddLocation = () => {
        if (newLocation.name.trim() && newLocation.address.trim()) {
            const locationToAdd: CampusLocation = {
                id: `loc-${Date.now()}`,
                name: newLocation.name.trim(),
                address: newLocation.address.trim(),
                imageUrl: `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80`
            };
            setData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    locations: [...(prev.profile.locations || []), locationToAdd]
                }
            }));
            setNewLocation({ name: '', address: '' });
        }
    };
    
    const handleRemoveLocation = (id: string) => {
        setData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                locations: (prev.profile.locations || []).filter(loc => loc.id !== id)
            }
        }));
    };

    const handleAddProgram = () => {
        if (newProgram.title.trim()) {
            const programToAdd: Program = {
                id: `prog-${Date.now()}`,
                title: newProgram.title.trim(),
                type: newProgram.type,
                description: newProgram.description.trim() || 'Accredited faculty program'
            };
            setData(prev => ({
                ...prev,
                programs: [...(prev.programs || []), programToAdd]
            }));
            setNewProgram({ title: '', type: 'Micro-Credential', description: '' });
        }
    };
    
    const handleRemoveProgram = (id: string) => {
        setData(prev => ({
            ...prev,
            programs: (prev.programs || []).filter(p => p.id !== id)
        }));
    };

    const handleAddOfficeHour = () => {
        if (newOfficeHour.facultyName.trim()) {
            const officeHourToAdd: OfficeHour = {
                id: `oh-${Date.now()}`,
                ...newOfficeHour
            };
            setData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    mentorshipProgram: {
                        ...prev.profile.mentorshipProgram,
                        officeHours: [...(prev.profile.mentorshipProgram?.officeHours || []), officeHourToAdd]
                    }
                }
            }));
            setNewOfficeHour({ day: 'Monday', time: '14:00 - 16:00 GMT', facultyName: '' });
        }
    };

    const handleRemoveOfficeHour = (id: string) => {
        setData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                mentorshipProgram: {
                    ...prev.profile.mentorshipProgram,
                    officeHours: (prev.profile.mentorshipProgram?.officeHours || []).filter(oh => oh.id !== id)
                }
            }
        }));
    };

    const handleSaveTrigger = () => {
        onSave(data);
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
                        title="Return to Institution Page"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono text-[9px] uppercase font-bold tracking-wider border border-amber-500/30">
                                Institutional CMS
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[9px] uppercase font-bold border border-emerald-500/30 flex items-center gap-1">
                                <ShieldCheck size={10} /> Live LinkedIn Company Format
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                            Edit Institution Profile & Public Registry
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
                        onClick={handleSaveTrigger}
                        className="px-5 py-2 text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                        <Save size={14} />
                        <span>Save & Publish</span>
                    </button>
                </div>
            </div>

            {/* Live LinkedIn Company Page Header Preview */}
            <div className="bg-[#0E131C] rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl relative">
                <div className="h-40 sm:h-52 w-full overflow-hidden bg-slate-900 relative">
                    <img 
                        src={data.profile.bannerUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80'} 
                        alt="Banner Preview" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
                        Live Company Banner Preview
                    </span>
                </div>

                <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div className="flex items-end gap-4 -mt-12 sm:-mt-16">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0E131C] border-4 border-[#0E131C] shadow-2xl p-2 shrink-0 overflow-hidden">
                            <img 
                                src={data.branding.logoUrl || 'https://picsum.photos/seed/cognisacra/200/200'} 
                                alt="Logo Preview" 
                                className="w-full h-full object-contain rounded-xl bg-white/5"
                            />
                        </div>
                        <div className="space-y-1 mb-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg sm:text-2xl font-serif font-bold text-white">
                                    {data.name || 'Institution Name'}
                                </h3>
                                <CheckCircle2 size={18} className="text-emerald-400 fill-emerald-500/20 shrink-0" />
                            </div>
                            <p className="text-xs text-zinc-300 font-sans line-clamp-1 max-w-xl">
                                {data.profile.tagline || 'Pioneering sovereign higher education and accredited research.'}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                                <span className="flex items-center gap-1"><MapPin size={11} className="text-zinc-500" /> {data.profile.locations?.[0]?.address || 'Global Campus'}</span>
                                <span>·</span>
                                <span className="text-emerald-400">Verified Academic Charter</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Check size={12} /> Active Page
                        </span>
                        {data.profile.website && (
                            <a 
                                href={data.profile.website} 
                                target="_blank" 
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-[#141B26] text-zinc-300 hover:text-white border border-zinc-700/80 flex items-center gap-1"
                            >
                                <Globe size={12} />
                                <span>Preview Site</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Tabs Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Section Navigation Tabs (4 Cols) */}
                <div className="lg:col-span-3 space-y-1.5 bg-[#0E131C] p-3 rounded-2xl border border-zinc-800 font-mono text-xs shadow-xl">
                    <span className="text-[10px] text-zinc-500 uppercase px-3 py-1 block font-bold tracking-wider">
                        Page Sections
                    </span>
                    {[
                        { id: 'branding', label: 'Branding & Visuals', icon: <ImageIcon size={14} /> },
                        { id: 'overview', label: 'Identity & Overview', icon: <Building2 size={14} /> },
                        { id: 'admissions', label: 'Admissions & Links', icon: <Globe size={14} /> },
                        { id: 'campuses', label: `Campuses (${data.profile.locations?.length || 0})`, icon: <MapPin size={14} /> },
                        { id: 'programs', label: `Programs (${data.programs?.length || 0})`, icon: <GraduationCap size={14} /> },
                        { id: 'mentorship', label: 'Office Hours & Mentors', icon: <Clock size={14} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id as EditTab)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                                activeTab === tab.id
                                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                                    : 'text-zinc-400 hover:bg-[#141B26] hover:text-zinc-200'
                            }`}
                        >
                            <span className={activeTab === tab.id ? 'text-amber-400' : 'text-zinc-500'}>
                                {tab.icon}
                            </span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Form Editor Panels (9 Cols) */}
                <div className="lg:col-span-9 bg-[#0E131C] p-6 sm:p-8 rounded-2xl border border-zinc-800 shadow-xl space-y-6">
                    
                    {/* TAB 1: BRANDING & VISUALS */}
                    {activeTab === 'branding' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div className="border-b border-zinc-800 pb-3">
                                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                    <ImageIcon size={18} className="text-amber-400" />
                                    <span>Brand Assets & Visual Identity</span>
                                </h3>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Customize the hero banner, institutional emblem, and color themes shown across all student portals.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {uploadError && (
                                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center justify-between">
                                        <span>{uploadError}</span>
                                        <button type="button" onClick={() => setUploadError(null)} className="text-zinc-400 hover:text-white"><X size={14} /></button>
                                    </div>
                                )}

                                {/* Real-time Cover Page Upload Card */}
                                <div className="p-4 sm:p-5 rounded-2xl bg-[#141B26] border border-zinc-700/80 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                                        <div>
                                            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                <Camera size={14} className="text-amber-400" />
                                                <span>Institution Cover Page / Hero Banner</span>
                                            </h4>
                                            <p className="text-[11px] text-zinc-400 mt-0.5">
                                                Displayed across the public institutional portal and student dashboards in real time.
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-mono text-zinc-500">1600 × 500 px recommended · Max 5MB</span>
                                    </div>

                                    {/* Live Banner Preview & Upload Trigger */}
                                    <div className="relative rounded-xl overflow-hidden border border-zinc-700/80 bg-zinc-900 group">
                                        <div className="h-36 sm:h-44 w-full">
                                            <img 
                                                src={data.profile.bannerUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80'} 
                                                alt="Current Banner" 
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        </div>

                                        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <input 
                                                type="file" 
                                                ref={bannerFileInputRef} 
                                                accept="image/*" 
                                                onChange={handleBannerFileUpload} 
                                                className="hidden" 
                                            />
                                            <button
                                                type="button"
                                                onClick={() => bannerFileInputRef.current?.click()}
                                                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 shadow-2xl transition cursor-pointer active:scale-95"
                                            >
                                                <Upload size={14} />
                                                <span>Upload Cover Page in Real Time</span>
                                            </button>
                                        </div>

                                        <span className="absolute bottom-2 left-3 text-[10px] font-mono text-zinc-300 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
                                            Real-Time Active Cover
                                        </span>
                                    </div>

                                    {/* Cover Presets & Manual URL fallback */}
                                    <div className="space-y-2 pt-1">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold mr-1">Quick Presets:</span>
                                            {[
                                                { label: 'Historic Oxford', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80' },
                                                { label: 'Modern Campus', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80' },
                                                { label: 'Quantum Tech Lab', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80' },
                                                { label: 'Gothic Library', url: 'https://images.unsplash.com/photo-1507842229450-7990e3488c73?w=1600&q=80' },
                                            ].map(preset => (
                                                <button
                                                    key={preset.label}
                                                    type="button"
                                                    onClick={() => setData(prev => ({ ...prev, profile: { ...prev.profile, bannerUrl: preset.url } }))}
                                                    className="px-2.5 py-1 rounded-lg bg-[#1C2637] hover:bg-[#253247] text-zinc-300 text-[10px] font-mono border border-zinc-700 transition cursor-pointer"
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-2 pt-1">
                                            <input 
                                                type="url"
                                                name="bannerUrl"
                                                value={data.profile.bannerUrl || ''}
                                                onChange={handleProfileChange}
                                                placeholder="Or paste direct image URL (https://...)"
                                                className="flex-1 px-3 py-2 text-xs text-white bg-[#0E131C] border border-zinc-700 rounded-xl focus:border-amber-400 focus:outline-none font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Real-time Logo / Emblem Upload Card */}
                                <div className="p-4 sm:p-5 rounded-2xl bg-[#141B26] border border-zinc-700/80 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                                        <div>
                                            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                <Building2 size={14} className="text-amber-400" />
                                                <span>Institution Official Logo & Emblem</span>
                                            </h4>
                                            <p className="text-[11px] text-zinc-400 mt-0.5">
                                                Appears on degree credentials, certificates, search index, and top navigation.
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-mono text-zinc-500">Square 400 × 400 px · PNG or SVG</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-5">
                                        {/* Logo Preview */}
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0E131C] border-2 border-zinc-700 p-2 shrink-0 flex items-center justify-center overflow-hidden shadow-xl relative group">
                                            <img 
                                                src={data.branding.logoUrl || 'https://picsum.photos/seed/cognisacra/200/200'} 
                                                alt="Logo Preview" 
                                                className="w-full h-full object-contain rounded-xl bg-white/5"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => logoFileInputRef.current?.click()}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-amber-300"
                                                title="Upload logo"
                                            >
                                                <Camera size={20} />
                                            </button>
                                        </div>

                                        <div className="space-y-3 flex-1 w-full text-left">
                                            <input 
                                                type="file" 
                                                ref={logoFileInputRef} 
                                                accept="image/*" 
                                                onChange={handleLogoFileUpload} 
                                                className="hidden" 
                                            />
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <button
                                                    type="button"
                                                    onClick={() => logoFileInputRef.current?.click()}
                                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
                                                >
                                                    <Upload size={14} />
                                                    <span>Upload Logo in Real Time</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleBrandingChange('logoUrl', 'https://picsum.photos/seed/oxford/200/200')}
                                                    className="px-3 py-2 rounded-xl bg-[#1C2637] hover:bg-[#253247] text-zinc-300 font-mono text-xs border border-zinc-700 transition cursor-pointer"
                                                >
                                                    Preset Crest
                                                </button>
                                            </div>

                                            <div>
                                                <input 
                                                    type="url"
                                                    value={data.branding.logoUrl || ''}
                                                    onChange={(e) => handleBrandingChange('logoUrl', e.target.value)}
                                                    placeholder="Or paste direct logo URL (https://...)"
                                                    className="w-full px-3 py-2 text-xs text-white bg-[#0E131C] border border-zinc-700 rounded-xl focus:border-amber-400 focus:outline-none font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                            Primary Brand Accent Color
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="color"
                                                value={data.branding.primaryColor || '#D97706'}
                                                onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                                                className="w-10 h-10 rounded-xl border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                                            />
                                            <input 
                                                type="text"
                                                value={data.branding.primaryColor || '#D97706'}
                                                onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                                                className="flex-1 px-3 py-2 text-xs text-white bg-[#141B26] border border-zinc-700/80 rounded-xl font-mono focus:border-amber-400 focus:outline-none uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                            Custom Subdomain / Slug
                                        </label>
                                        <div className="flex items-center gap-1 px-3 py-2 bg-[#141B26] border border-zinc-700/80 rounded-xl text-xs font-mono">
                                            <span className="text-zinc-500">cognisacra.io/inst/</span>
                                            <input 
                                                type="text"
                                                value={data.settings.customDomain || 'oxford-fellowship'}
                                                onChange={(e) => setData(prev => ({
                                                    ...prev,
                                                    settings: { ...prev.settings, customDomain: e.target.value }
                                                }))}
                                                className="flex-1 text-white bg-transparent focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: IDENTITY & OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div className="border-b border-zinc-800 pb-3">
                                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                    <Building2 size={18} className="text-amber-400" />
                                    <span>Institution Identity & Mission Narrative</span>
                                </h3>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Core legal naming, public tagline, and comprehensive narrative for learners and academic partners.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                        Official Academic Institution Name *
                                    </label>
                                    <input 
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-2.5 text-xs text-white bg-[#141B26] border border-zinc-700/80 rounded-xl focus:border-amber-400 focus:outline-none font-sans font-bold text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                        Company / Institution Tagline (One-liner)
                                    </label>
                                    <input 
                                        type="text"
                                        name="tagline"
                                        value={data.profile.tagline || ''}
                                        onChange={handleProfileChange}
                                        placeholder="Pioneering sovereign higher education, ethical STEM labs, and accredited degrees."
                                        className="w-full px-4 py-2.5 text-xs text-white bg-[#141B26] border border-zinc-700/80 rounded-xl focus:border-amber-400 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                        Full About Narrative (Vision, History & Accreditation Standards)
                                    </label>
                                    <textarea 
                                        name="about"
                                        rows={6}
                                        value={data.profile.about || ''}
                                        onChange={handleProfileChange}
                                        placeholder="Describe your university charter, academic rigor, faculty competencies, and pedagogical philosophy..."
                                        className="w-full px-4 py-3 text-xs text-white bg-[#141B26] border border-zinc-700/80 rounded-xl focus:border-amber-400 focus:outline-none leading-relaxed font-sans"
                                    />
                                </div>

                                <div className="p-4 rounded-xl bg-slate-900 border border-zinc-800 space-y-2">
                                    <div className="flex items-center justify-between text-xs font-mono">
                                        <span className="text-zinc-400 font-bold uppercase">Sovereign W3C Credential DID</span>
                                        <span className="text-emerald-400 font-bold">Ledger Verified</span>
                                    </div>
                                    <div className="p-2.5 bg-black/50 rounded-lg text-emerald-400 font-mono text-[11px] truncate">
                                        did:ion:cognisacra:inst:{data.name.toLowerCase().replace(/[^a-z0-9]/g, '')}:849201f849e8a93
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: ADMISSIONS & WEB */}
                    {activeTab === 'admissions' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div className="border-b border-zinc-800 pb-3">
                                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                    <Globe size={18} className="text-amber-400" />
                                    <span>Admissions, Website & Inquiries</span>
                                </h3>
                                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                    Configure external application portals, official domain, and registrar communication channels.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                            Official Institution Website
                                        </label>
                                        <input 
                                            type="url"
                                            name="website"
                                            value={data.profile.website || ''}
                                            onChange={handleProfileChange}
                                            placeholder="https://university.edu"
                                            className="w-full px-3 py-2 text-xs text-white bg-[#141B26] border border-zinc-700/80 rounded-xl focus:border-amber-400 focus:outline-none font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                            Admissions & Application Portal Link
                                        </label>
                                        <input 
                                            type="url"
                                            name="applicationPortal"
                                            value={data.profile.supportLinks?.applicationPortal || ''}
                                            onChange={handleSupportLinkChange}
                                            placeholder="https://admissions.university.edu/apply"
                                            className="w-full px-3 py-2 text-xs text-white bg-[#141B26] border border-zinc-700/80 rounded-xl focus:border-amber-400 focus:outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                            Registrar Contact Email
                                        </label>
                                        <input 
                                            type="email"
                                            name="email"
                                            value={data.profile.contact.email || ''}
                                            onChange={handleContactChange}
                                            placeholder="admissions@university.edu"
                                            className="w-full px-3 py-2 text-xs text-white bg-[#141B26] border border-zinc-700/80 rounded-xl focus:border-amber-400 focus:outline-none font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                            Registrar / Campus Phone
                                        </label>
                                        <input 
                                            type="tel"
                                            name="phone"
                                            value={data.profile.contact.phone || ''}
                                            onChange={handleContactChange}
                                            placeholder="+254 (0) 20 491 0000"
                                            className="w-full px-3 py-2 text-xs text-white bg-[#141B26] border border-zinc-700/80 rounded-xl focus:border-amber-400 focus:outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                            Student Help Desk URL
                                        </label>
                                        <input 
                                            type="url"
                                            name="helpDesk"
                                            value={data.profile.supportLinks?.helpDesk || ''}
                                            onChange={handleSupportLinkChange}
                                            placeholder="https://help.university.edu"
                                            className="w-full px-3 py-2 text-xs text-white bg-[#141B26] border border-zinc-700/80 rounded-xl focus:border-amber-400 focus:outline-none font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1.5">
                                            FAQ & Academic Charter URL
                                        </label>
                                        <input 
                                            type="url"
                                            name="faq"
                                            value={data.profile.supportLinks?.faq || ''}
                                            onChange={handleSupportLinkChange}
                                            placeholder="https://university.edu/faq"
                                            className="w-full px-3 py-2 text-xs text-white bg-[#141B26] border border-zinc-700/80 rounded-xl focus:border-amber-400 focus:outline-none font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: CAMPUSES & LOCATIONS */}
                    {activeTab === 'campuses' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                        <MapPin size={18} className="text-amber-400" />
                                        <span>Campus Locations & Facilities</span>
                                    </h3>
                                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                        Add physical research hubs, satellite centers, and laboratory addresses.
                                    </p>
                                </div>
                                <span className="text-xs font-mono font-bold text-amber-400">
                                    {data.profile.locations?.length || 0} Listed
                                </span>
                            </div>

                            {/* Existing Campuses */}
                            <div className="space-y-3">
                                {(data.profile.locations || []).map(loc => (
                                    <div 
                                        key={loc.id} 
                                        className="p-4 rounded-xl bg-[#141B26] border border-zinc-800 flex items-center justify-between gap-3 text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                                <Building2 size={16} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold font-serif text-white">{loc.name}</h4>
                                                <p className="text-[11px] font-mono text-zinc-400">{loc.address}</p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveLocation(loc.id)}
                                            className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition cursor-pointer"
                                            title="Remove campus"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Location Form */}
                            <div className="p-4 rounded-xl bg-slate-900 border border-zinc-800 space-y-3">
                                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                                    <Plus size={14} className="text-emerald-400" />
                                    <span>Add Regional Campus</span>
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input 
                                        type="text"
                                        placeholder="Campus Name (e.g. Kigali Quantum Research Hub)"
                                        value={newLocation.name}
                                        onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                                        className="px-3 py-2 text-xs text-white bg-[#141B26] border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-400"
                                    />
                                    <input 
                                        type="text"
                                        placeholder="Address / City (e.g. Sector 4, Kigali, Rwanda)"
                                        value={newLocation.address}
                                        onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                                        className="px-3 py-2 text-xs text-white bg-[#141B26] border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-400"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddLocation}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-lg transition cursor-pointer"
                                >
                                    + Add Campus Location
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: PROGRAMS */}
                    {activeTab === 'programs' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                        <GraduationCap size={18} className="text-amber-400" />
                                        <span>Academic Programs & Micro-Credentials</span>
                                    </h3>
                                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                        Manage official degree tracks, diplomas, and technical micro-credentials.
                                    </p>
                                </div>
                                <span className="text-xs font-mono font-bold text-amber-400">
                                    {data.programs?.length || 0} Registered
                                </span>
                            </div>

                            <div className="space-y-3">
                                {(data.programs || []).map(prog => (
                                    <div 
                                        key={prog.id} 
                                        className="p-4 rounded-xl bg-[#141B26] border border-zinc-800 flex items-start justify-between gap-3 text-left"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-bold font-serif text-white">{prog.title}</h4>
                                                <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-mono text-[9px] uppercase font-bold border border-blue-500/30">
                                                    {prog.type}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-zinc-400 mt-1">{prog.description}</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveProgram(prog.id)}
                                            className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition cursor-pointer"
                                            title="Remove program"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Program Form */}
                            <div className="p-4 rounded-xl bg-slate-900 border border-zinc-800 space-y-3">
                                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                                    <Plus size={14} className="text-emerald-400" />
                                    <span>Register Academic Track</span>
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input 
                                        type="text"
                                        placeholder="Program Title (e.g. Executive Fellowship in AI Ethics)"
                                        value={newProgram.title}
                                        onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                                        className="sm:col-span-2 px-3 py-2 text-xs text-white bg-[#141B26] border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-400"
                                    />
                                    <select
                                        value={newProgram.type}
                                        onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value as Program['type'] })}
                                        className="px-3 py-2 text-xs text-zinc-200 bg-[#141B26] border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-400 font-mono"
                                    >
                                        <option value="Degree">Degree</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Certificate">Certificate</option>
                                        <option value="Micro-Credential">Micro-Credential</option>
                                    </select>
                                </div>
                                <input 
                                    type="text"
                                    placeholder="Short Curriculum Brief (e.g. 12-month post-graduate research fellowship)"
                                    value={newProgram.description}
                                    onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                                    className="w-full px-3 py-2 text-xs text-white bg-[#141B26] border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-400"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddProgram}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-lg transition cursor-pointer"
                                >
                                    + Add Academic Program
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB 6: MENTORSHIP & OFFICE HOURS */}
                    {activeTab === 'mentorship' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                                        <Clock size={18} className="text-amber-400" />
                                        <span>Faculty Mentorship & Office Hours</span>
                                    </h3>
                                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                                        Schedule public academic advisory hours open to enrolled fellows.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {(data.profile.mentorshipProgram?.officeHours || []).map(oh => (
                                    <div 
                                        key={oh.id}
                                        className="p-3.5 rounded-xl bg-[#141B26] border border-zinc-800 flex items-center justify-between gap-3 text-left font-mono text-xs"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                                                {oh.day}
                                            </span>
                                            <div>
                                                <p className="text-white font-bold">{oh.facultyName}</p>
                                                <p className="text-zinc-400 text-[11px]">{oh.time}</p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveOfficeHour(oh.id)}
                                            className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition cursor-pointer"
                                            title="Remove office hour"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Office Hour Form */}
                            <div className="p-4 rounded-xl bg-slate-900 border border-zinc-800 space-y-3 font-mono text-xs">
                                <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                                    <Plus size={14} className="text-emerald-400" />
                                    <span>Schedule Advisory Slot</span>
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input 
                                        type="text"
                                        placeholder="Professor Name"
                                        value={newOfficeHour.facultyName}
                                        onChange={(e) => setNewOfficeHour({ ...newOfficeHour, facultyName: e.target.value })}
                                        className="px-3 py-2 text-white bg-[#141B26] border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-400"
                                    />
                                    <select
                                        value={newOfficeHour.day}
                                        onChange={(e) => setNewOfficeHour({ ...newOfficeHour, day: e.target.value })}
                                        className="px-3 py-2 text-zinc-200 bg-[#141B26] border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-400"
                                    >
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <input 
                                        type="text"
                                        placeholder="Time (e.g. 15:00 - 17:00 EAT)"
                                        value={newOfficeHour.time}
                                        onChange={(e) => setNewOfficeHour({ ...newOfficeHour, time: e.target.value })}
                                        className="px-3 py-2 text-white bg-[#141B26] border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-400"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddOfficeHour}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-lg transition cursor-pointer"
                                >
                                    + Add Advisory Schedule
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* In-app Save Confirmation Toast */}
            {savedToast && (
                <div className="fixed bottom-6 right-6 z-50 bg-[#0E131C] border border-emerald-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-mono animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Institution Profile successfully published to public registry.</span>
                </div>
            )}
        </div>
    );
};

export default InstitutionProfileEditingView;