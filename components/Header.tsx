import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import MenuIcon from './icons/MenuIcon';
import UserIcon from './icons/UserIcon';
import { UserRole } from '../types';
import LogoutIcon from './icons/LogoutIcon';
import GlobeAltIcon from './icons/GlobeAltIcon';
import { useLanguage } from '../contexts/LanguageContext';
import CogIcon from './icons/CogIcon';
import SearchIcon from './icons/SearchIcon';
import BellIcon from './icons/BellIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import SparklesIcon from './icons/SparklesIcon';
import ChatBubbleOvalLeftIcon from './icons/ChatBubbleOvalLeftIcon';

interface HeaderProps {
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
    userRole: UserRole;
    onLogout: () => void;
    onNavigateToProfile: () => void;
    onNavigateToSettings: () => void;
    userName: string;
    userAvatarUrl: string;
    institutionName: string;
    institutionLogoUrl: string;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onSwitchRole?: (role: UserRole) => void;
    onOpenOnboarding?: () => void;
}

const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'sw', name: 'Kiswahili' },
];

type NotificationType = 'achievement' | 'reminder' | 'mention';
type Notification = {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  { id: 1, type: 'achievement', message: 'You unlocked the "Course Conqueror" achievement!', time: '2 hours ago', read: false },
  { id: 2, type: 'reminder', message: 'Your project for "Advanced React" is due tomorrow.', time: '1 day ago', read: false },
  { id: 3, type: 'mention', message: 'Jane Doe mentioned you in the community hub.', time: '3 days ago', read: true },
];

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'achievement':
            return <SparklesIcon className="w-5 h-5 text-yellow-500" />;
        case 'reminder':
            return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
        case 'mention':
            return <ChatBubbleOvalLeftIcon className="w-5 h-5 text-green-500" />;
        default:
            return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
};

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, userRole, onLogout, onNavigateToProfile, onNavigateToSettings, userName, userAvatarUrl, institutionName, institutionLogoUrl, searchTerm, onSearchChange, onSwitchRole, onOpenOnboarding }) => {
    const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [isNotifDropdownOpen, setNotifDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    
    const { language, setLanguage } = useLanguage();
    
    const userMenuRef = useRef<HTMLDivElement>(null);
    const langMenuRef = useRef<HTMLDivElement>(null);
    const notifMenuRef = useRef<HTMLDivElement>(null);
    
    const unreadCount = notifications.filter(n => !n.read).length;

    const selectedLang = languages.find(l => l.code === language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isUserMenuOpen || isNotifDropdownOpen) {
                return;
            }
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setLangDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isUserMenuOpen, isNotifDropdownOpen, langMenuRef]);

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const displayName = userRole === 'institution' ? institutionName : userName;
    const displayAvatarUrl = userRole === 'institution' ? institutionLogoUrl : userAvatarUrl;

    const handleLogoutClick = async () => {
        setUserMenuOpen(false);
        await onLogout();
    };

    return (
        <header className="sticky top-3 z-50 mx-4 sm:mx-6 lg:mx-8 mb-4">
            <div className="bg-[#0E141F] border border-zinc-700 rounded-xl px-4 py-2.5 shadow-2xl flex items-center justify-between transition-all duration-200">
                <div className="flex items-center space-x-3 flex-1">
                    <button onClick={onToggleSidebar} className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-[#182130] md:hidden transition-colors" aria-label="Toggle sidebar">
                        <MenuIcon />
                    </button>
                    <div className="relative hidden sm:block w-full max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-xs font-mono text-emerald-400">&gt;</span>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search courses, modules, institutions..."
                            aria-label="Search courses and institutions"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-7 pr-12 py-1.5 rounded-lg bg-[#141C28] border border-zinc-700 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/30 focus:outline-none transition-all text-xs font-mono text-zinc-100 placeholder-zinc-400"
                        />
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                            <kbd className="text-[10px] font-mono text-zinc-400 bg-[#1C2637] border border-zinc-700 px-1.5 py-0.5 rounded">⌘K</kbd>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <button className="sm:hidden p-2 rounded-lg hover:bg-[#182130] text-zinc-300">
                        <SearchIcon className="w-5 h-5"/>
                    </button>

                    {/* Solid Notifications Button (Non-transparent) */}
                    <div className="relative" ref={notifMenuRef}>
                        <button 
                            onClick={() => setNotifDropdownOpen(!isNotifDropdownOpen)}
                            className="relative p-2 rounded-xl bg-[#182130] hover:bg-[#202C3F] text-zinc-100 border border-zinc-700 shadow-md transition-all active:scale-95 cursor-pointer"
                            aria-label={`View notifications, ${unreadCount} unread`}
                        >
                            <BellIcon className="w-5 h-5 text-zinc-200"/>
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-[#10B981] ring-2 ring-[#141C28] animate-pulse" />
                            )}
                        </button>
                        {isNotifDropdownOpen && typeof document !== 'undefined' && createPortal(
                            <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto" role="dialog" aria-modal="true">
                                <div className="fixed inset-0 cursor-pointer" onClick={() => setNotifDropdownOpen(false)} aria-hidden="true" />
                                <div 
                                    className="relative w-full max-w-2xl bg-[#0E141F] border border-zinc-700 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col my-auto animate-fade-in text-left z-10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-5 flex justify-between items-center border-b border-zinc-700 bg-[#141C28]">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                                                <BellIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-mono text-sm font-bold text-zinc-100 uppercase tracking-wider">System Notifications</h3>
                                                <p className="text-xs text-zinc-400 font-sans">Active network dispatches & course milestones</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {unreadCount > 0 && <button onClick={handleMarkAllAsRead} className="px-3 py-1.5 rounded-lg bg-[#182130] text-[11px] font-mono text-emerald-400 hover:bg-[#202C3F] font-semibold border border-emerald-500/30">Mark all read</button>}
                                            <button onClick={() => setNotifDropdownOpen(false)} className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"><XMarkIcon className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                    <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                                        {notifications.length > 0 ? (
                                            notifications.map(notif => (
                                                <div key={notif.id} className={`p-4 rounded-xl flex items-start space-x-3 transition-colors border ${!notif.read ? 'bg-[#182232] border-emerald-500/40' : 'bg-[#141C28] border-zinc-800'}`}>
                                                    <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notif.type)}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-zinc-200 font-sans font-medium">{notif.message}</p>
                                                        <p className="text-[10px] font-mono text-zinc-400 mt-1">{notif.time}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-10 text-center font-mono">
                                                <BellIcon className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                                                <p className="text-xs text-zinc-400">No active alerts</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 px-6 bg-[#141C28] border-t border-zinc-800 flex justify-end">
                                        <button onClick={() => setNotifDropdownOpen(false)} className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-white">Close Modal</button>
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )}
                    </div>

                    {/* Solid Language Selector (Non-glassmorphic) */}
                    <div className="relative block" ref={langMenuRef}>
                        <button onClick={() => setLangDropdownOpen(!isLangDropdownOpen)} className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-[#182130] hover:bg-[#202C3F] text-zinc-100 flex items-center gap-1.5 border border-zinc-700 shadow-md transition-all active:scale-95 cursor-pointer" aria-label={`Select language. Current is ${selectedLang.name}`}>
                            <GlobeAltIcon className="w-4 h-4 text-emerald-400"/>
                            <span className="text-[11px] font-mono font-bold uppercase text-zinc-100">{selectedLang.code}</span>
                        </button>
                        {isLangDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-[9990]" onClick={() => setLangDropdownOpen(false)} />
                                <div className="absolute right-0 mt-3 w-44 bg-[#141C28] rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] ring-1 ring-white/10 py-1.5 z-[9999] animate-fade-in origin-top-right border border-zinc-700 overflow-hidden">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code);
                                                setLangDropdownOpen(false);
                                            }}
                                            className={`block w-full text-left px-3 py-2 text-xs font-mono transition-colors ${language === lang.code ? 'text-emerald-300 font-bold bg-[#1C2637]' : 'text-zinc-200 hover:bg-[#1E293B] hover:text-white'}`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Learner Drop Button (Solid & Non-glassmorphic UI, Front Layer) */}
                    <div className="relative pl-3 border-l border-zinc-700" ref={userMenuRef}>
                        <button onClick={() => setUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-[#182130] hover:bg-[#202C3F] border border-zinc-700 shadow-md transition-all active:scale-95 cursor-pointer" aria-label="Open user menu">
                            <img className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-600 shadow-sm" src={displayAvatarUrl} alt="User avatar" />
                            <div className="hidden lg:block text-left mr-1">
                                <p className="font-bold text-xs text-white leading-tight">{displayName}</p>
                                <p className="text-[10px] font-mono text-emerald-300 capitalize font-medium">{userRole}</p>
                            </div>
                        </button>
                        {isUserMenuOpen && typeof document !== 'undefined' && createPortal(
                            <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto" role="dialog" aria-modal="true">
                                <div className="fixed inset-0 cursor-pointer" onClick={() => setUserMenuOpen(false)} aria-hidden="true" />
                                <div 
                                    className="relative w-full max-w-2xl bg-[#0E141F] border border-zinc-700 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col my-auto animate-fade-in text-left z-10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-6 bg-gradient-to-r from-emerald-950/70 via-[#182130] to-cyan-950/70 border-b border-zinc-800 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <img className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/50" src={displayAvatarUrl} alt="User avatar" />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-xl font-serif font-bold text-white">{displayName}</h2>
                                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase">{userRole}</span>
                                                </div>
                                                <p className="text-xs font-mono text-zinc-400 mt-0.5">Authenticated Sovereign Node Scholar</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setUserMenuOpen(false)} className="p-2 rounded-xl bg-[#0E141F] text-zinc-400 hover:text-white border border-zinc-700"><XMarkIcon className="w-5 h-5" /></button>
                                    </div>

                                    <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                                            <button onClick={() => { onNavigateToProfile(); setUserMenuOpen(false); }} className="p-3.5 rounded-xl bg-[#141C28] hover:bg-[#1C2637] border border-zinc-700 text-left text-zinc-200">
                                                <div className="font-bold text-white">{userRole === 'institution' ? 'Institution Profile' : 'My Public Profile'}</div>
                                                <div className="text-[10px] text-zinc-400 mt-0.5">View public registry and badges</div>
                                            </button>
                                            <button onClick={() => { onNavigateToSettings(); setUserMenuOpen(false); }} className="p-3.5 rounded-xl bg-[#141C28] hover:bg-[#1C2637] border border-zinc-700 text-left text-zinc-200">
                                                <div className="font-bold text-white">Account Settings</div>
                                                <div className="text-[10px] text-zinc-400 mt-0.5">Privacy, notifications & credentials</div>
                                            </button>
                                            {onOpenOnboarding && (
                                                <button onClick={() => { onOpenOnboarding(); setUserMenuOpen(false); }} className="p-3.5 rounded-xl bg-[#141C28] hover:bg-[#1C2637] border border-zinc-700 text-left text-zinc-200">
                                                    <div className="font-bold text-emerald-400">Restart Onboarding</div>
                                                    <div className="text-[10px] text-zinc-400 mt-0.5">Reconfigure role & verification</div>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 px-6 bg-[#141C28] border-t border-zinc-800 flex justify-between items-center">
                                        <button onClick={handleLogoutClick} className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">Terminate Session</button>
                                        <button onClick={() => setUserMenuOpen(false)} className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold">Close Modal</button>
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
