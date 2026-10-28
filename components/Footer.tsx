import React from 'react';
import LinkedInIcon from './icons/LinkedInIcon';
import GitHubIcon from './icons/GitHubIcon';

interface FooterProps {
    onNavigate: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-[#08090A] border-t border-[#1A2230] mt-auto font-mono text-xs">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-zinc-400">
                <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <p className="text-[11px] text-zinc-500">&copy; {new Date().getFullYear()} CogniSacra. System Engine v3.5.</p>
                </div>
                <div className="flex space-x-5 mt-3 sm:mt-0 text-[11px]">
                    <button onClick={() => onNavigate('contact')} className="text-zinc-400 hover:text-emerald-400 transition-colors">Documentation</button>
                    <button onClick={() => onNavigate('data-policy')} className="text-zinc-400 hover:text-emerald-400 transition-colors">Security Policy</button>
                    <button onClick={() => onNavigate('terms-of-service')} className="text-zinc-400 hover:text-emerald-400 transition-colors">Runtime Terms</button>
                    <div className="h-3 w-px bg-[#1F2633] my-auto"></div>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300"><span className="sr-only">LinkedIn</span><LinkedInIcon className="w-4 h-4" /></a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300"><span className="sr-only">GitHub</span><GitHubIcon className="w-4 h-4" /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
