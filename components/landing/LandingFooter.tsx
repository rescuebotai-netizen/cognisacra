import React from 'react';
import LinkedInIcon from '../icons/LinkedInIcon';
import GitHubIcon from '../icons/GitHubIcon';
import { LandingView } from './LandingPage';
import { Terminal, Database, ShieldCheck, Cpu, GitBranch, Key, Activity } from 'lucide-react';

interface LandingFooterProps {
    setView: (view: LandingView) => void;
}

const FooterLink: React.FC<{ view: LandingView, setView: (v: LandingView) => void, children: React.ReactNode }> = ({ view, setView, children }) => (
    <button onClick={() => setView(view)} className="text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors">
        {children}
    </button>
);

const LandingFooter: React.FC<LandingFooterProps> = ({ setView }) => {
    return (
        <footer className="bg-[#06080B] text-zinc-300 border-t border-[#1A2230] relative overflow-hidden text-left font-sans" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer Command Center</h2>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Mini Command Center Monitor Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10 p-3.5 bg-[#0B0E14] border border-[#1A2230] rounded-xl items-center shadow-lg">
                    <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                        <Terminal size={14} className="text-emerald-400" />
                        <span>Console Node: <strong className="text-emerald-400">OK-C2</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                        <Database size={14} className="text-emerald-400" />
                        <span>CogniSacra Models: <strong className="text-zinc-200">ACTIVE</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                        <ShieldCheck size={14} className="text-emerald-400 animate-pulse" />
                        <span>Verification Engine: <strong className="text-emerald-400">VERIFIED</strong></span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 md:col-span-3 lg:col-span-1 justify-end">
                        <Activity size={14} className="text-emerald-400" />
                        <span>Global Uplink: <strong className="text-emerald-400">99.98%</strong></span>
                    </div>
                </div>

                <div className="xl:grid xl:grid-cols-4 xl:gap-12">
                    <div className="space-y-4 xl:col-span-1">
                        <div className="flex items-center space-x-2.5">
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
                        <p className="text-zinc-400 text-xs leading-relaxed font-mono">
                            The premier AI-powered education and simulation operating system, built on the CogniSacra architecture.
                        </p>
                        <div className="flex space-x-3 pt-2">
                            <a href="#" className="p-2 bg-[#0E131C] hover:bg-[#151C28] rounded-lg border border-[#1E2536] transition text-zinc-400 hover:text-emerald-400">
                                <span className="sr-only">LinkedIn</span>
                                <LinkedInIcon className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-[#0E131C] hover:bg-[#151C28] rounded-lg border border-[#1E2536] transition text-zinc-400 hover:text-emerald-400">
                                <span className="sr-only">GitHub</span>
                                <GitHubIcon className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="pt-2">
                            <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-2 font-bold tracking-wider">
                                Accelerated &amp; Listed On
                            </span>
                            <a 
                                href="https://www.f6s.com/cognisacra" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block p-2 bg-white rounded-xl shadow-md hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-200 border border-zinc-200"
                                title="F6S CogniSacra"
                            >
                                <img 
                                    src="/f6s.jpeg" 
                                    alt="F6S" 
                                    className="h-8 w-auto object-contain block" 
                                />
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3">
                        <div className="md:grid md:grid-cols-3 md:gap-8">
                            
                            {/* Col 1 */}
                            <div>
                                <h3 className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider uppercase pb-2 border-b border-[#1A2230]">
                                    Platform Links
                                </h3>
                                <ul className="mt-4 space-y-2.5">
                                    <li><FooterLink view="home" setView={setView}>Console Home</FooterLink></li>
                                    <li><FooterLink view="about" setView={setView}>Architecture</FooterLink></li>
                                    <li><FooterLink view="contact" setView={setView}>Documentation</FooterLink></li>
                                    <li><FooterLink view="services" setView={setView}>API & Infrastructure</FooterLink></li>
                                </ul>
                            </div>

                            {/* Col 2 */}
                            <div>
                                <h3 className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider uppercase pb-2 border-b border-[#1A2230]">
                                    Institution Portal
                                </h3>
                                <ul className="mt-4 space-y-2.5">
                                    <li>
                                        <a href="#" className="text-xs font-mono text-zinc-400 hover:text-emerald-400 transition">
                                            Chancellor Dashboard
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-xs font-mono text-zinc-400 hover:text-emerald-400 transition">
                                            Accreditation Node
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-xs font-mono text-zinc-400 hover:text-emerald-400 transition">
                                            Settlement APIs
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-xs font-mono text-zinc-400 hover:text-emerald-400 transition">
                                            Research Repositories
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Col 3 */}
                            <div>
                                <h3 className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider uppercase pb-2 border-b border-[#1A2230]">
                                    Developer & Model APIs
                                </h3>
                                <ul className="mt-4 space-y-2.5">
                                    <li>
                                        <a href="#" className="text-xs font-mono text-zinc-400 hover:text-emerald-400 transition">
                                            SDK Documentation
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-xs font-mono text-zinc-400 hover:text-emerald-400 transition">
                                            CogniSacra Fine-tuning
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-xs font-mono text-zinc-400 hover:text-emerald-400 transition">
                                            CLI & Agent Protocol
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-xs font-mono text-zinc-400 hover:text-emerald-400 transition">
                                            Citation Hash Engine
                                        </a>
                                    </li>
                                </ul>
                            </div>

                        </div>

                        {/* Extra Mini Command Grid for sovereign contact details */}
                        <div className="bg-[#0B0E14] border border-[#1A2230] rounded-xl p-4 flex flex-col justify-between shadow-xl">
                            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-bold pb-1 border-b border-[#1A2230] block">Telemetry Gateway</span>
                            <div className="space-y-1 py-3 text-zinc-300 font-mono">
                                <p className="text-xs font-bold text-white">COGNISACRA HQ</p>
                                <p className="text-[10px] text-zinc-400">Node Cluster: EU-WEST-2</p>
                                <p className="text-[10px] text-emerald-400 select-all">terminal@cognisacra.ai</p>
                            </div>
                            <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Uplink 100% Operational
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-[#1A2230] pt-6 flex flex-col sm:flex-row justify-between items-center text-zinc-500 gap-4 font-mono text-xs">
                    <div className="flex items-center gap-3">
                        <a 
                            href="https://www.f6s.com/cognisacra" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-1 bg-white rounded-md inline-flex items-center shadow-sm hover:scale-105 transition-transform"
                            title="F6S CogniSacra"
                        >
                            <img src="/f6s.jpeg" alt="F6S" className="h-5 w-auto object-contain block" />
                        </a>
                        <p className="text-zinc-400 text-center sm:text-left">
                            &copy; {new Date().getFullYear()} CogniSacra. Academic Operating Infrastructure.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="text-zinc-400 hover:text-emerald-400 transition">Terms of Service</a>
                        <span className="text-zinc-700">|</span>
                        <a href="#" className="text-zinc-400 hover:text-emerald-400 transition">Privacy & Security</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default LandingFooter;
