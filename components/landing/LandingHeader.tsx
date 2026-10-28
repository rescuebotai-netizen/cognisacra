import React, { useState } from 'react';
import MenuIcon from '../icons/MenuIcon';
import XMarkIcon from '../icons/XMarkIcon';
import { LandingView } from './LandingPage';

interface LandingHeaderProps {
    currentView: LandingView;
    setView: (view: LandingView) => void;
    onGetStarted: () => void;
}

const NavLink: React.FC<{
    view: LandingView;
    current: LandingView;
    setView: (view: LandingView) => void;
    children: React.ReactNode;
    isMobile?: boolean;
}> = ({ view, current, setView, children, isMobile = false }) => (
    <button
        onClick={() => setView(view)}
        className={`${isMobile ? 'block w-full text-left px-4 py-2 font-mono text-sm' : 'px-3 py-1.5 rounded-md text-xs font-mono transition-colors'} ${
            current === view
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#121722]'
        }`}
    >
        {children}
    </button>
);

const LandingHeader: React.FC<LandingHeaderProps> = ({ currentView, setView, onGetStarted }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navItems: { view: LandingView; label: string }[] = [
        { view: 'home', label: 'Console' },
        { view: 'about', label: 'Architecture' },
        { view: 'services', label: 'Models & API' },
        { view: 'pricing', label: 'Tiers' },
        { view: 'contact', label: 'Documentation' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#08090A]/95 backdrop-blur-md border-b border-[#1A2230]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center space-x-2.5 cursor-pointer" onClick={() => setView('home')}>
                        <div className="p-1 bg-white rounded-lg shadow-sm border border-zinc-200 inline-flex items-center justify-center shrink-0">
                            <img 
                                src="/cogni-sacra.jpeg" 
                                alt="CogniSacra" 
                                className="w-7 h-7 rounded object-contain block shrink-0" 
                            />
                        </div>
                        <span className="font-mono font-bold text-base tracking-wide text-white">
                            CogniSacra
                        </span>
                    </div>
                    <div className="hidden md:flex md:items-center md:space-x-1 bg-[#0E131C] p-1 rounded-lg border border-[#1E2536]">
                        {navItems.map(item => (
                            <NavLink key={item.view} view={item.view} current={currentView} setView={setView}>
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center space-x-3">
                         <button 
                            onClick={onGetStarted} 
                            className="px-4 py-2 text-xs font-mono font-bold text-black bg-[#10B981] hover:bg-[#00F29A] rounded-lg shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all duration-200"
                        >
                            Launch Console →
                         </button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#121722] focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <XMarkIcon className="block h-5 w-5 text-zinc-200" /> : <MenuIcon className="block h-5 w-5 text-zinc-200" />}
                        </button>
                    </div>
                </div>
            </div>
            
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#0B0E14] border-b border-[#1A2230]" id="mobile-menu">
                    <div className="px-3 pt-2 pb-5 space-y-1 sm:px-3">
                         {navItems.map(item => (
                            <NavLink key={item.view} view={item.view} current={currentView} setView={(v) => { setView(v); setIsMobileMenuOpen(false); }} isMobile>
                                {item.label}
                            </NavLink>
                        ))}
                         <button onClick={onGetStarted} className="mt-3 w-full block px-4 py-2.5 rounded-lg text-xs font-mono font-bold text-black bg-[#10B981] hover:bg-[#00F29A]">
                            Launch Console →
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default LandingHeader;
