import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { UserRole } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    Home, 
    Calendar, 
    Video, 
    Globe, 
    Sparkles, 
    Trophy, 
    Briefcase, 
    BookOpen, 
    BarChart3, 
    Settings, 
    Building2, 
    Users, 
    Info, 
    Mail, 
    ChevronLeft,
    Brain,
    Network,
    Compass,
    Database,
    Film,
    ShoppingCart,
    Award,
    MessageSquare,
    Mic,
    Search,
    Bell,
    Check,
    LogOut,
    User as UserIcon,
    HelpCircle,
    ChevronDown,
    X,
    Shield,
    Upload,
    CreditCard,
    Plug,
    CheckCircle2,
    MapPin
} from 'lucide-react';

export const ECOSYSTEM_INSTITUTIONS = [
    {
        id: 'cognisacra-inst',
        name: 'CogniSacra Sovereign Academy & Research Institute',
        tagline: 'Pioneering sovereign higher education and accredited continental learning credentials.',
        location: 'Nairobi, Kenya',
        type: 'Chartered Sovereign Research University',
        badge: 'Official Host Campus',
        logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&q=80',
    },
    {
        id: 'oxford-fellowship',
        name: "University of Oxford - St. Antony's Academic Fellowship",
        tagline: 'Global diplomatic ethics and distributed algorithmic governance.',
        location: 'Oxford, United Kingdom',
        type: 'Collegiate Research University',
        badge: 'Accredited Partner',
        logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&q=80',
    },
    {
        id: 'aims-network',
        name: 'African Institute for Mathematical Sciences (AIMS)',
        tagline: 'Pan-African center of excellence for mathematical science and AI research.',
        location: 'Kigali, Rwanda / Cape Town, SA',
        type: 'Postgraduate Center of Excellence',
        badge: 'Research Node',
        logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&q=80',
    },
    {
        id: 'mit-csail-node',
        name: 'MIT CSAIL Sovereign Ethics Initiative',
        tagline: 'Polytechnic intelligence, verification proofs, and autonomous systems safety.',
        location: 'Cambridge, Massachusetts, USA',
        type: 'Frontier AI Research Laboratory',
        badge: 'Alliance Partner',
        logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&q=80',
    },
    {
        id: 'ashesi-cybernetics',
        name: 'Ashesi University & Pan-African Cybernetics Hub',
        tagline: 'Liberal arts, ethical engineering, and sovereign software architecture.',
        location: 'Berekuso, Ghana',
        type: 'Engineering Leadership University',
        badge: 'Chartered Affiliate',
        logo: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=120&q=80',
    }
];

const LinkedinIcon = ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
);

const GithubIcon = ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
    </svg>
);

export type NavView = 'dashboard' | 'tutor' | 'profile' | 'jobs' | 'instructor-dashboard' | 'institution-dashboard' | 'instructor-analytics' | 'community' | 'institution-learners' | 'institution-settings' | 'calendar' | 'institution-profile' | 'instructor-settings' | 'about' | 'contact' | 'data-policy' | 'terms-of-service' | 'ai-tools' | 'virtual-class' | 'institution-portal' | 'library' | 'ai-architect' | 'institution-accreditation' | 'course-builder' | 'instructor-integrations' | 'institution-integrations';

export interface SidebarProps {
    isOpen: boolean;
    onNavigate: (view: NavView, subTab?: string) => void;
    currentView: string;
    setSidebarOpen: (isOpen: boolean) => void;
    userRole: UserRole;
    libraryActiveTab?: string;
    tutorActiveTab?: string;
    // Integrated Header controls
    userName: string;
    userAvatarUrl?: string;
    institutionName?: string;
    institutionLogo?: string;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onSwitchRole?: (role: UserRole) => void;
    onLogout: () => void;
    onNavigateToProfile: () => void;
    onNavigateToSettings: () => void;
    onOpenOnboarding?: () => void;
    onOpenTour?: () => void;
}

const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'sw', name: 'Kiswahili' },
];

interface NotificationItem {
    id: number | string;
    title: string;
    text: string;
    time: string;
    read: boolean;
    category: 'system' | 'academic' | 'credential' | 'security';
}

const initialNotifications: NotificationItem[] = [
    { 
        id: 1, 
        title: 'Curriculum Synchronized',
        text: 'Course "AI & Neural Computing" updated with new sovereign decentralized compute module.', 
        time: '12m ago', 
        read: false,
        category: 'academic'
    },
    { 
        id: 2, 
        title: 'Accreditation Pass Confirmed',
        text: 'W3C cryptographic credential verified for Semester Academic Registry.', 
        time: '1h ago', 
        read: false,
        category: 'credential'
    },
    { 
        id: 3, 
        title: 'New Adaptive Quiz Online',
        text: 'Real-time quiz on Sovereign Vector Databases is now open in Study Lab.', 
        time: '3h ago', 
        read: false,
        category: 'academic'
    },
    { 
        id: 4, 
        title: 'Node Session Active',
        text: 'Encrypted communication link verified with local sovereign node runtime on Port 3000.', 
        time: '1d ago', 
        read: true,
        category: 'security'
    },
    { 
        id: 5, 
        title: 'Faculty Mentorship Window',
        text: 'Prof. Adeyemi opened live office hours for computational neuroscience review.', 
        time: '2d ago', 
        read: true,
        category: 'academic'
    }
];

const NavItem: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    isActive: boolean; 
    isOpen: boolean; 
    onClick: () => void;
    isDisabled?: boolean;
    badge?: string;
}> = ({ icon, label, isActive, isOpen, onClick, isDisabled = false, badge }) => {
    const translatedLabel = useTranslation(label);
    return (
        <li
            onClick={!isDisabled ? onClick : undefined}
            className={`relative flex items-center p-2.5 my-0.5 rounded-xl transition-all duration-200 group cursor-pointer
                ${isActive 
                    ? 'bg-emerald-500/15 text-emerald-300 font-semibold shadow-sm' 
                    : 'text-zinc-400 hover:bg-[#141B26] hover:text-white'
                } 
                ${isOpen ? 'justify-start' : 'justify-center'} 
                ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={label}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
        >
            <span className={`shrink-0 transition-transform duration-200 ${isActive ? 'text-emerald-400 scale-105' : 'group-hover:scale-105'}`}>
                {icon}
            </span>
            {isOpen && (
                <div className="ml-3 flex-1 flex items-center justify-between overflow-hidden">
                    <span className="text-xs font-mono tracking-tight truncate">
                        {translatedLabel}
                    </span>
                    {badge && (
                        <span className="ml-1 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                            {badge}
                        </span>
                    )}
                </div>
            )}
            {!isOpen && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-[#141B26] text-zinc-100 text-xs font-mono rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-2xl">
                    {translatedLabel}
                </div>
            )}
        </li>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
    isOpen, 
    onNavigate, 
    currentView, 
    setSidebarOpen, 
    userRole, 
    libraryActiveTab, 
    tutorActiveTab,
    userName,
    userAvatarUrl,
    institutionName,
    institutionLogo,
    searchTerm,
    onSearchChange,
    onSwitchRole,
    onLogout,
    onNavigateToProfile,
    onNavigateToSettings,
    onOpenOnboarding,
    onOpenTour
}) => {
    const { language, setLanguage } = useLanguage();
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [isLangOpen, setLangOpen] = useState(false);
    const [isNotifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [isLibraryExpanded, setLibraryExpanded] = useState(currentView === 'library');
    const [isTutorExpanded, setTutorExpanded] = useState(currentView === 'tutor');

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // When full modal pages are open outside the menu, their backdrop handles closing
            if (isUserMenuOpen || isNotifOpen) {
                return;
            }
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen, isNotifOpen]);

    // Handle Escape key & lock scroll when full modal pages are open outside the menu
    useEffect(() => {
        if (isUserMenuOpen || isNotifOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            const handleKeyDown = (e: globalThis.KeyboardEvent) => {
                if (e.key === 'Escape') {
                    setUserMenuOpen(false);
                    setNotifOpen(false);
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                document.body.style.overflow = originalOverflow;
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isUserMenuOpen, isNotifOpen]);

    useEffect(() => {
        if (currentView === 'library') setLibraryExpanded(true);
        if (currentView === 'tutor') setTutorExpanded(true);
    }, [currentView]);

    const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'academic' | 'security'>('all');
    const unreadCount = notifications.filter(n => !n.read).length;
    const filteredNotifications = notifications.filter(n => {
        if (notifFilter === 'unread') return !n.read;
        if (notifFilter === 'academic') return n.category === 'academic';
        if (notifFilter === 'security') return n.category === 'security';
        return true;
    });
    const selectedLang = languages.find(l => l.code === language) || languages[0];
    const displayAvatar = userAvatarUrl || `https://i.pravatar.cc/150?u=${userName || 'user'}`;

    const dynamicEcosystemInstitutions = useMemo(() => {
        return ECOSYSTEM_INSTITUTIONS.map(inst => {
            if (inst.id === 'cognisacra-inst') {
                return {
                    ...inst,
                    name: institutionName || inst.name,
                    logo: institutionLogo || inst.logo,
                };
            }
            return inst;
        });
    }, [institutionName, institutionLogo]);

    const matchingInstitutions = searchTerm.trim().length > 0
        ? dynamicEcosystemInstitutions.filter(inst => 
            inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inst.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inst.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inst.badge.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    const librarySubItems = [
        { id: 'twin', label: 'CogniSacra Twin', icon: <Brain size={14} /> },
        { id: 'universe', label: 'Knowledge Universe', icon: <Network size={14} /> },
        { id: 'reader', label: 'AI Reading Mode', icon: <BookOpen size={14} /> },
        { id: 'research', label: 'Research Desk', icon: <Compass size={14} /> },
        { id: 'labs', label: 'STEM Sandbox', icon: <Database size={14} /> },
        { id: 'workspace', label: 'Study Cockpit', icon: <Settings size={14} /> },
        { id: 'passport', label: 'Academic Passport', icon: <Award size={14} /> },
    ];

    const tutorSubItems = [
        { id: 'ask-tutor', label: 'CogniSacra Chat Tutor', icon: <MessageSquare size={13} /> },
        { id: 'homework-help', label: 'Homework Helper', icon: <Upload size={13} /> },
        { id: 'exam-prep', label: 'Exam Prep', icon: <Award size={13} /> },
    ];

    const learnerNav = (
        <>
            <NavItem
                icon={<Home size={18} />}
                label="Home"
                isActive={currentView === 'dashboard'}
                isOpen={isOpen}
                onClick={() => onNavigate('dashboard')}
            />
            <NavItem
                icon={<BookOpen size={18} />}
                label="Library"
                isActive={currentView === 'library'}
                isOpen={isOpen}
                onClick={() => {
                    onNavigate('library');
                    setLibraryExpanded(!isLibraryExpanded);
                }}
            />
            {isOpen && isLibraryExpanded && (
                <ul className="pl-3 space-y-0.5 my-1 ml-4 animate-fade-in text-left">
                    {librarySubItems.map(item => {
                        const isSubActive = currentView === 'library' && libraryActiveTab === item.id;
                        return (
                            <li
                                key={item.id}
                                onClick={() => onNavigate('library', item.id)}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition cursor-pointer select-none
                                    ${isSubActive 
                                        ? 'bg-emerald-500/15 text-emerald-400 font-semibold' 
                                        : 'text-zinc-400 hover:bg-[#141B26] hover:text-white'
                                    }`}
                            >
                                <span className={`shrink-0 ${isSubActive ? 'text-emerald-400' : 'text-zinc-500'}`}>{item.icon}</span>
                                <span className="truncate">{item.label}</span>
                            </li>
                        );
                    })}
                </ul>
            )}

            <NavItem
                icon={<Sparkles size={18} />}
                label="AI Tutor"
                isActive={currentView === 'tutor'}
                isOpen={isOpen}
                onClick={() => {
                    onNavigate('tutor');
                    setTutorExpanded(!isTutorExpanded);
                }}
            />
            {isOpen && isTutorExpanded && (
                <ul className="pl-3 space-y-0.5 my-1 ml-4 animate-fade-in text-left">
                    {tutorSubItems.map(item => {
                        const isSubActive = currentView === 'tutor' && tutorActiveTab === item.id;
                        return (
                            <li
                                key={item.id}
                                onClick={() => onNavigate('tutor', item.id)}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition cursor-pointer select-none
                                    ${isSubActive 
                                        ? 'bg-emerald-500/15 text-emerald-400 font-semibold' 
                                        : 'text-zinc-400 hover:bg-[#141B26] hover:text-white'
                                    }`}
                            >
                                <span className={`shrink-0 ${isSubActive ? 'text-emerald-400' : 'text-zinc-500'}`}>{item.icon}</span>
                                <span className="truncate">{item.label}</span>
                            </li>
                        );
                    })}
                </ul>
            )}

            <NavItem
                icon={<Trophy size={18} />}
                label="Profile"
                isActive={currentView === 'profile'}
                isOpen={isOpen}
                onClick={() => onNavigate('profile')}
            />
            <NavItem
                icon={<Briefcase size={18} />}
                label="Career Board"
                isActive={currentView === 'jobs'}
                isOpen={isOpen}
                onClick={() => onNavigate('jobs')}
            />
            <NavItem
                icon={<Globe size={18} />}
                label="Community"
                isActive={currentView === 'community'}
                isOpen={isOpen}
                onClick={() => onNavigate('community')}
            />
            <NavItem
                icon={<Video size={18} />}
                label="Virtual Class"
                isActive={currentView === 'virtual-class'}
                isOpen={isOpen}
                onClick={() => onNavigate('virtual-class')}
            />
        </>
    );

    const instructorNav = (
        <>
            <NavItem
                icon={<BarChart3 size={18} />}
                label="Instructor Dashboard"
                isActive={currentView === 'instructor-dashboard'}
                isOpen={isOpen}
                onClick={() => onNavigate('instructor-dashboard')}
            />
            <NavItem
                icon={<Sparkles size={18} />}
                label="AI Curriculum Builder"
                isActive={currentView === 'course-builder'}
                isOpen={isOpen}
                onClick={() => onNavigate('course-builder')}
            />
            <NavItem
                icon={<Video size={18} />}
                label="Live Studio"
                isActive={currentView === 'virtual-class'}
                isOpen={isOpen}
                onClick={() => onNavigate('virtual-class')}
            />
            <NavItem
                icon={<CreditCard size={18} />}
                label="Payment Settings"
                isActive={currentView === 'instructor-settings'}
                isOpen={isOpen}
                onClick={() => onNavigate('instructor-settings')}
            />
            <NavItem
                icon={<Plug size={18} className="text-emerald-400" />}
                label="Integrations"
                isActive={currentView === 'instructor-integrations'}
                isOpen={isOpen}
                onClick={() => onNavigate('instructor-integrations')}
            />
        </>
    );

    const institutionNav = (
        <>
            <NavItem
                icon={<Building2 size={18} className="text-amber-400" />}
                label="Institution Profile"
                isActive={currentView === 'profile' || currentView === 'institution-profile'}
                isOpen={isOpen}
                onClick={() => onNavigate('profile')}
                badge="PAGE"
            />
            <NavItem
                icon={<BarChart3 size={18} />}
                label="Analytics"
                isActive={currentView === 'institution-dashboard'}
                isOpen={isOpen}
                onClick={() => onNavigate('institution-dashboard')}
            />
            <NavItem
                icon={<Award size={18} className="text-emerald-400" />}
                label="Accreditation Hub"
                isActive={currentView === 'institution-accreditation'}
                isOpen={isOpen}
                onClick={() => onNavigate('institution-accreditation')}
                badge="NEW"
            />
            <NavItem
                icon={<Users size={18} />}
                label="Students & Faculty"
                isActive={currentView === 'institution-learners'}
                isOpen={isOpen}
                onClick={() => onNavigate('institution-learners')}
            />
            <NavItem
                icon={<Building2 size={18} />}
                label="Proctoring & Audits"
                isActive={currentView === 'institution-portal'}
                isOpen={isOpen}
                onClick={() => onNavigate('institution-portal')}
            />
            <NavItem
                icon={<BookOpen size={18} />}
                label="Academy Library"
                isActive={currentView === 'library'}
                isOpen={isOpen}
                onClick={() => onNavigate('library')}
            />
            <NavItem
                icon={<Plug size={18} className="text-emerald-400" />}
                label="Integrations"
                isActive={currentView === 'institution-integrations'}
                isOpen={isOpen}
                onClick={() => onNavigate('institution-integrations')}
            />
            <NavItem
                icon={<Settings size={18} />}
                label="Settings"
                isActive={currentView === 'institution-settings'}
                isOpen={isOpen}
                onClick={() => onNavigate('institution-settings')}
            />
        </>
    );

    const renderNav = () => {
        switch (userRole) {
            case 'learner': return learnerNav;
            case 'instructor': return instructorNav;
            case 'institution': return institutionNav;
            default: return learnerNav;
        }
    };

    return (
        <aside 
            className={`h-full my-3 ml-3 rounded-2xl bg-[#0B0E14] flex flex-col shadow-2xl transition-all duration-300 ease-in-out select-none relative z-50 ${isOpen ? 'w-64' : 'w-20'}`}
            ref={menuRef}
        >
            {/* Top Brand & Collapse Bar (Borderless) */}
            <div className="flex items-center h-16 px-4 justify-between flex-shrink-0">
                <div className={`flex items-center space-x-2.5 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    <div className="p-1 bg-white rounded-lg shadow-sm border border-zinc-200 inline-flex items-center justify-center shrink-0">
                        <img 
                            src="/cogni-sacra.jpeg" 
                            alt="CogniSacra" 
                            className="w-7 h-7 rounded object-contain block shrink-0" 
                        />
                    </div>
                    <div>
                        <div className="font-mono font-bold text-sm tracking-wide text-white">
                            CogniSacra
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 truncate max-w-[120px]">
                            {institutionName || 'Sovereign Node'}
                        </div>
                    </div>
                </div>

                {!isOpen && (
                    <div className="w-full flex justify-center">
                        <div className="p-1 bg-white rounded-lg shadow-sm border border-zinc-200 inline-flex items-center justify-center shrink-0" title="CogniSacra">
                            <img 
                                src="/cogni-sacra.jpeg" 
                                alt="CogniSacra" 
                                className="w-7 h-7 rounded object-contain block shrink-0" 
                            />
                        </div>
                    </div>
                )}

                <button 
                    onClick={() => setSidebarOpen(!isOpen)} 
                    className={`hidden lg:flex p-1.5 rounded-xl hover:bg-[#151C28] text-zinc-400 hover:text-white transition-all ${isOpen ? '' : 'rotate-180 absolute -right-3 top-5 bg-[#0E131C] shadow-lg'}`} 
                    aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    <ChevronLeft size={16} />
                </button>
            </div>

            {/* INTEGRATED HEADER MODULE (Solid, High-Contrast & Visible) */}
            {isOpen && (
                <div className="px-3 pb-3 space-y-2.5 animate-fade-in flex-shrink-0">
                    
                    {/* User Profile Card & Dropdown Trigger (Learner drop button - Solid UI) */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                            className="w-full p-2.5 rounded-xl bg-[#182130] hover:bg-[#202C3F] border border-zinc-700 shadow-md transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99] text-left"
                            aria-label="User profile and role menu"
                        >
                            <div className="flex items-center space-x-2.5 min-w-0">
                                <img 
                                    src={displayAvatar} 
                                    alt={userName} 
                                    className="w-8 h-8 rounded-lg object-cover bg-zinc-800 border border-zinc-600 shrink-0"
                                />
                                <div className="min-w-0 text-left">
                                    <p className="text-xs font-bold text-white truncate leading-tight group-hover:text-emerald-300 transition">
                                        {userName || 'Scholar'}
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className="text-[10px] font-mono capitalize px-2 py-0.5 rounded-md bg-[#101722] text-emerald-300 border border-emerald-500/40 font-semibold">
                                            {userRole}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <ChevronDown size={14} className={`text-zinc-300 group-hover:text-white transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* FULL MODAL PAGE FOR LEARNER & PROFILE SWITCHER (OUTSIDE THE MENU) */}
                        {isUserMenuOpen && typeof document !== 'undefined' && createPortal(
                            <div 
                                className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
                                role="dialog"
                                aria-modal="true"
                                aria-label="Learner Profile & Role Switcher"
                            >
                                <div className="fixed inset-0 cursor-pointer" onClick={() => setUserMenuOpen(false)} aria-hidden="true" />
                                <div 
                                    className="relative w-full max-w-2xl bg-[#0E141F] border border-zinc-700 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col my-auto animate-fade-in text-left z-10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Header with profile banner and verified node styling */}
                                    <div className="relative bg-gradient-to-r from-emerald-950/70 via-[#182130] to-cyan-950/70 p-6 border-b border-zinc-800">
                                        <button
                                            type="button"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="absolute top-5 right-5 p-2 rounded-xl bg-[#0E141F]/80 hover:bg-[#1C2637] text-zinc-400 hover:text-white border border-zinc-700 transition cursor-pointer"
                                            aria-label="Close modal"
                                        >
                                            <X size={18} />
                                        </button>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <div className="relative shrink-0">
                                                <img 
                                                    src={displayAvatar} 
                                                    alt={userName} 
                                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-zinc-800 border-2 border-emerald-500/50 shadow-xl"
                                                />
                                                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0E141F] flex items-center justify-center text-black" title="Sovereign Verified">
                                                    <CheckCircle2 size={12} className="stroke-[3]" />
                                                </span>
                                            </div>

                                            <div className="min-w-0 flex-1 space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white truncate">
                                                        {userName || 'Scholar Member'}
                                                    </h2>
                                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] font-bold uppercase">
                                                        {userRole}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 truncate">
                                                    <Building2 size={13} className="text-amber-400 shrink-0" />
                                                    <span>{institutionName || 'CogniSacra Sovereign Academic Network'}</span>
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 pt-0.5">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                                    <span>Node 0x7F9B · Encrypted Session Active</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="p-6 space-y-6 overflow-y-auto max-h-[65vh]">
                                        

                                        {/* Profile Navigation Hub */}
                                        <div className="space-y-3">
                                            <span className="text-xs font-mono uppercase font-bold text-zinc-300 tracking-wider block">
                                                Account Controls & Preferences
                                            </span>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                <button
                                                    type="button"
                                                    onClick={() => { onNavigateToProfile(); setUserMenuOpen(false); }}
                                                    className="p-3.5 rounded-xl bg-[#141C28] hover:bg-[#1C2637] border border-zinc-700/80 transition flex items-center justify-between group cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                                                            <UserIcon size={16} />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-xs font-mono font-bold text-white group-hover:text-emerald-300">My Public Profile</div>
                                                            <div className="text-[10px] text-zinc-400">View sovereign credentials & badges</div>
                                                        </div>
                                                    </div>
                                                    <ChevronDown size={14} className="text-zinc-500 -rotate-90 group-hover:text-white" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => { onNavigateToSettings(); setUserMenuOpen(false); }}
                                                    className="p-3.5 rounded-xl bg-[#141C28] hover:bg-[#1C2637] border border-zinc-700/80 transition flex items-center justify-between group cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
                                                            <Settings size={16} />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-xs font-mono font-bold text-white group-hover:text-cyan-300">Console Settings</div>
                                                            <div className="text-[10px] text-zinc-400">Security, playback, and notifications</div>
                                                        </div>
                                                    </div>
                                                    <ChevronDown size={14} className="text-zinc-500 -rotate-90 group-hover:text-white" />
                                                </button>

                                                {onOpenOnboarding && (
                                                    <button
                                                        type="button"
                                                        onClick={() => { onOpenOnboarding(); setUserMenuOpen(false); }}
                                                        className="p-3.5 rounded-xl bg-[#141C28] hover:bg-[#1C2637] border border-zinc-700/80 transition flex items-center justify-between group cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                                                                <Shield size={16} />
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="text-xs font-mono font-bold text-white group-hover:text-amber-300">Restart Onboarding</div>
                                                                <div className="text-[10px] text-zinc-400">Re-verify role & academic credentials</div>
                                                            </div>
                                                        </div>
                                                        <ChevronDown size={14} className="text-zinc-500 -rotate-90 group-hover:text-white" />
                                                    </button>
                                                )}

                                                {onOpenTour && (
                                                    <button
                                                        type="button"
                                                        onClick={() => { onOpenTour(); setUserMenuOpen(false); }}
                                                        className="p-3.5 rounded-xl bg-[#141C28] hover:bg-[#1C2637] border border-zinc-700/80 transition flex items-center justify-between group cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20">
                                                                <Compass size={16} />
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="text-xs font-mono font-bold text-white group-hover:text-purple-300">Interactive Walkthrough</div>
                                                                <div className="text-[10px] text-zinc-400">Guided tour of features and navigation</div>
                                                            </div>
                                                        </div>
                                                        <ChevronDown size={14} className="text-zinc-500 -rotate-90 group-hover:text-white" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="p-4 px-6 bg-[#141C28] border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                                        <button
                                            type="button"
                                            onClick={() => { onLogout(); setUserMenuOpen(false); }}
                                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                                        >
                                            <LogOut size={14} />
                                            <span>Terminate Session & Sign Out</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold transition cursor-pointer"
                                        >
                                            Close Modal
                                        </button>
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )}
                    </div>

                    {/* Integrated Quick Search Bar (Solid & Bordered) */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-zinc-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search courses, institutions..."
                            className="w-full pl-8 pr-7 py-2 bg-[#141C28] border border-zinc-700 text-xs font-mono text-zinc-100 placeholder-zinc-400 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-[#182130] transition shadow-sm"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => onSearchChange('')}
                                className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white"
                            >
                                <X size={12} />
                            </button>
                        )}

                        {/* Instant Ecosystem Institutions Search Suggestions Dropdown (Solid, Front Layer) */}
                        {searchTerm.trim().length > 0 && (
                            <>
                                <div className="fixed inset-0 z-[9990]" onClick={() => onSearchChange('')} />
                                <div className="absolute left-0 right-0 top-full mt-2 bg-[#141C28] border border-zinc-700 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] ring-1 ring-white/10 p-2 z-[9999] animate-fade-in text-left space-y-1.5 max-h-64 overflow-y-auto no-scrollbar">
                                <div className="px-1.5 py-1 flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase font-bold tracking-wider border-b border-zinc-800/60 pb-1">
                                    <span className="flex items-center gap-1.5">
                                        <Building2 size={12} className="text-amber-400" />
                                        <span>Registered Institutions ({matchingInstitutions.length})</span>
                                    </span>
                                </div>
                                {matchingInstitutions.length > 0 ? (
                                    matchingInstitutions.map((inst) => (
                                        <button
                                            key={inst.id}
                                            type="button"
                                            onClick={() => {
                                                onNavigate(userRole === 'institution' ? 'profile' : 'institution-profile');
                                                onSearchChange('');
                                            }}
                                            className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-[#1C2637] hover:bg-[#253247] text-left transition group cursor-pointer border border-zinc-700/80 hover:border-amber-400/50"
                                        >
                                            <img 
                                                src={inst.logo} 
                                                alt={inst.name} 
                                                className="w-7 h-7 rounded-md object-cover bg-white/5 border border-zinc-700/60 shrink-0"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[11px] font-serif font-bold text-white group-hover:text-amber-300 truncate">
                                                        {inst.name}
                                                    </span>
                                                    <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                                                </div>
                                                <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-400 truncate">
                                                    <MapPin size={9} className="text-zinc-500 shrink-0" />
                                                    <span>{inst.location}</span>
                                                    <span>·</span>
                                                    <span className="text-amber-400/90 font-medium">{inst.badge}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-2 text-center text-[10px] font-mono text-zinc-400">
                                        No institutions matching "{searchTerm}"
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    </div>

                    {/* Quick Utilities Strip: Platform Tour, Language Selector, Notifications (All Solid, Non-Glassmorphic) */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                        
                        {/* Solid Platform Tour Launcher Button (Text Removed) */}
                        {onOpenTour && (
                            <button
                                type="button"
                                onClick={onOpenTour}
                                className="p-2 px-2.5 rounded-xl bg-[#182130] hover:bg-[#202C3F] text-emerald-300 border border-zinc-700 shadow-md transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                                title="Interactive Platform Tour"
                                aria-label="Platform Tour"
                            >
                                <Compass size={15} />
                            </button>
                        )}

                        {/* Solid Language Selector (No glassmorphic UI) */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => { setLangOpen(!isLangOpen); setNotifOpen(false); }}
                                className="p-2 px-2.5 rounded-xl bg-[#182130] hover:bg-[#202C3F] text-zinc-100 text-xs font-mono font-bold flex items-center gap-1.5 border border-zinc-700 shadow-md transition-all active:scale-95 cursor-pointer"
                                aria-label="Select language"
                            >
                                <Globe size={14} className="text-emerald-400 shrink-0" />
                                <span>{selectedLang.code.toUpperCase()}</span>
                            </button>

                            {isLangOpen && (
                                <>
                                    <div className="fixed inset-0 z-[9990]" onClick={() => setLangOpen(false)} />
                                    <div className="absolute left-0 top-full mt-2 w-44 bg-[#141C28] border border-zinc-700 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] ring-1 ring-white/10 p-1.5 z-[9999] animate-fade-in text-left">
                                        <div className="px-2.5 py-1 text-[10px] font-mono text-zinc-400 uppercase font-bold border-b border-zinc-700/80 mb-1">
                                            Select Language
                                        </div>
                                        {languages.map(lang => (
                                            <button
                                                key={lang.code}
                                                onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer font-medium ${language === lang.code ? 'bg-emerald-500 text-black font-bold shadow-sm' : 'text-zinc-200 hover:bg-[#202C3F] hover:text-white'}`}
                                            >
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Solid Notifications Bell Trigger */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => { setNotifOpen(!isNotifOpen); setLangOpen(false); }}
                                className="p-2 px-2.5 rounded-xl bg-[#182130] hover:bg-[#202C3F] text-zinc-100 border border-zinc-700 shadow-md transition-all active:scale-95 relative cursor-pointer"
                                aria-label="Open notifications"
                            >
                                <Bell size={15} className="text-zinc-200" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#141C28] animate-pulse"></span>
                                )}
                            </button>

                            {/* FULL MODAL PAGE FOR NOTIFICATIONS (OUTSIDE THE MENU) */}
                            {isNotifOpen && typeof document !== 'undefined' && createPortal(
                                <div 
                                    className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
                                    role="dialog"
                                    aria-modal="true"
                                    aria-label="System & Protocol Notifications"
                                >
                                    <div className="fixed inset-0 cursor-pointer" onClick={() => setNotifOpen(false)} aria-hidden="true" />
                                    <div 
                                        className="relative w-full max-w-3xl bg-[#0E141F] border border-zinc-700 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col my-auto animate-fade-in text-left z-10"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        
                                        {/* Header */}
                                        <div className="bg-[#141C28] p-6 border-b border-zinc-800 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                    <Bell size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                                                            System & Protocol Notifications
                                                        </h2>
                                                        {unreadCount > 0 && (
                                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black font-mono text-[10px] font-bold">
                                                                {unreadCount} Unread
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-mono text-zinc-400 mt-0.5">
                                                        Real-time academic alerts, credential mints, and sovereign network dispatches
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setNotifOpen(false)}
                                                className="p-2 rounded-xl bg-[#0E141F] hover:bg-[#1C2637] text-zinc-400 hover:text-white border border-zinc-700 transition cursor-pointer"
                                                aria-label="Close notifications"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>

                                        {/* Notification Filter Controls */}
                                        <div className="px-6 py-3 bg-[#111722] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setNotifFilter('all')}
                                                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                                        notifFilter === 'all'
                                                            ? 'bg-emerald-500 text-black font-bold'
                                                            : 'bg-[#182130] text-zinc-300 hover:bg-[#202C3F]'
                                                    }`}
                                                >
                                                    All ({notifications.length})
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNotifFilter('unread')}
                                                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                                        notifFilter === 'unread'
                                                            ? 'bg-emerald-500 text-black font-bold'
                                                            : 'bg-[#182130] text-zinc-300 hover:bg-[#202C3F]'
                                                    }`}
                                                >
                                                    Unread ({unreadCount})
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNotifFilter('academic')}
                                                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                                        notifFilter === 'academic'
                                                            ? 'bg-emerald-500 text-black font-bold'
                                                            : 'bg-[#182130] text-zinc-300 hover:bg-[#202C3F]'
                                                    }`}
                                                >
                                                    Academic
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNotifFilter('security')}
                                                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                                        notifFilter === 'security'
                                                            ? 'bg-emerald-500 text-black font-bold'
                                                            : 'bg-[#182130] text-zinc-300 hover:bg-[#202C3F]'
                                                    }`}
                                                >
                                                    Protocol
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {unreadCount > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                                                        className="px-3 py-1.5 rounded-lg bg-[#182130] hover:bg-[#202C3F] text-emerald-300 border border-emerald-500/30 transition cursor-pointer font-bold"
                                                    >
                                                        Mark All Read
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setNotifications([])}
                                                    className="px-3 py-1.5 rounded-lg bg-[#182130] hover:bg-[#202C3F] text-zinc-400 hover:text-white transition cursor-pointer"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>

                                        {/* Notifications List */}
                                        <div className="p-6 space-y-3 overflow-y-auto max-h-[55vh]">
                                            {filteredNotifications.length > 0 ? (
                                                filteredNotifications.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                                                            !n.read
                                                                ? 'bg-[#182232] border-emerald-500/40 shadow-sm'
                                                                : 'bg-[#121824] border-zinc-800 hover:border-zinc-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3.5 min-w-0">
                                                            <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                                                                n.category === 'credential'
                                                                    ? 'bg-amber-500/15 text-amber-400'
                                                                    : n.category === 'security'
                                                                    ? 'bg-cyan-500/15 text-cyan-400'
                                                                    : 'bg-emerald-500/15 text-emerald-400'
                                                            }`}>
                                                                {n.category === 'credential' ? <Award size={18} /> : n.category === 'security' ? <Shield size={18} /> : <BookOpen size={18} />}
                                                            </div>
                                                            <div className="space-y-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                                                                        {n.title || 'System Notification'}
                                                                    </h4>
                                                                    {!n.read && (
                                                                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                                                                    )}
                                                                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#0E141F] text-zinc-400 border border-zinc-700">
                                                                        {n.category}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs font-sans text-zinc-300 leading-relaxed">
                                                                    {n.text}
                                                                </p>
                                                                <div className="text-[10px] font-mono text-zinc-500 pt-0.5">
                                                                    {n.time}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: !item.read } : item))}
                                                            className="px-2.5 py-1 rounded-lg bg-[#0E141F] hover:bg-[#1C2637] text-zinc-400 hover:text-emerald-400 border border-zinc-700 text-[10px] font-mono shrink-0 transition cursor-pointer"
                                                            title={n.read ? 'Mark as unread' : 'Mark as read'}
                                                        >
                                                            {n.read ? 'Mark Unread' : 'Mark Read'}
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-12 text-center font-mono space-y-2">
                                                    <div className="w-12 h-12 rounded-2xl bg-zinc-800/60 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-500">
                                                        <CheckCircle2 size={24} />
                                                    </div>
                                                    <h4 className="text-sm font-bold text-zinc-300">All Clear</h4>
                                                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                                                        No notifications match your current filter. Your sovereign node queue is completely up to date.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="p-4 px-6 bg-[#141C28] border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                                <span>Dispatcher: 100% Operational (Port 3000)</span>
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setNotifOpen(false)}
                                                className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition cursor-pointer"
                                            >
                                                Close Modal
                                            </button>
                                        </div>
                                    </div>
                                </div>,
                                document.body
                            )}
                        </div>

                    </div>

                </div>
            )}

            {/* Collapsed state quick icon launchers */}
            {!isOpen && (
                <div className="flex flex-col items-center py-2 space-y-2">
                    <img 
                        src={displayAvatar} 
                        alt={userName} 
                        onClick={() => setSidebarOpen(true)}
                        className="w-8 h-8 rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-emerald-500 transition" 
                        title={`Logged in as ${userName} (${userRole})`}
                    />
                    {onOpenTour && (
                        <button
                            type="button"
                            onClick={onOpenTour}
                            className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                            title="Take Platform Tour"
                        >
                            <Compass size={16} />
                        </button>
                    )}
                </div>
            )}

            {/* Navigation Links Area (Scrollable, Borderless) */}
            <nav className="flex-1 px-2.5 py-2 flex flex-col justify-between overflow-y-auto no-scrollbar">
                <div className="space-y-0.5">
                    <ul>
                        {renderNav()}
                    </ul>
                </div>

                {/* Comprehensive Platform Footer Integrated in Menu Sidebar */}
                <div className="pt-2 mt-auto">
                    <ul>
                        <NavItem
                            icon={<Info size={17} />}
                            label="About"
                            isActive={currentView === 'about'}
                            isOpen={isOpen}
                            onClick={() => onNavigate('about')}
                        />
                        <NavItem
                            icon={<Mail size={17} />}
                            label="Contact"
                            isActive={currentView === 'contact'}
                            isOpen={isOpen}
                            onClick={() => onNavigate('contact')}
                        />
                    </ul>
                    
                    {isOpen ? (
                        <div className="mt-2.5 p-3 rounded-2xl bg-[#0D1117] text-left space-y-2">
                            {/* Policy & Terms row */}
                            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                                <button onClick={() => onNavigate('data-policy')} className="hover:text-emerald-400 transition cursor-pointer">
                                    Security Policy
                                </button>
                                <span>•</span>
                                <button onClick={() => onNavigate('terms-of-service')} className="hover:text-emerald-400 transition cursor-pointer">
                                    Terms
                                </button>
                                <span>•</span>
                                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition cursor-pointer">
                                    Docs
                                </button>
                            </div>

                            {/* System Status and Copyright */}
                            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/40">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Engine v3.5</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition" aria-label="LinkedIn">
                                        <LinkedinIcon size={12} />
                                    </a>
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition" aria-label="GitHub">
                                        <GithubIcon size={12} />
                                    </a>
                                </div>
                            </div>

                            <p className="text-[9px] font-mono text-zinc-600 text-center">
                                &copy; {new Date().getFullYear()} CogniSacra. Sovereign Academic OS.
                            </p>
                        </div>
                    ) : (
                        <div className="py-2 flex flex-col items-center gap-2 text-zinc-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Engine v3.5 Active" />
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition" aria-label="GitHub">
                                <GithubIcon size={13} />
                            </a>
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
