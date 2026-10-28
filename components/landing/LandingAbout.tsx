import React from 'react';
import { teamMembers } from '../../constants';
import { ShieldCheck, Heart, Users, Compass, ExternalLink, Terminal } from 'lucide-react';

const TeamMemberCard: React.FC<{ name: string; title: string; avatarUrl: string; }> = ({ name, title, avatarUrl }) => (
    <div className="text-center group p-6 bg-[#0B0E14] border border-[#1A2230] rounded-xl hover:border-emerald-500/50 hover:bg-[#0E131C] transition duration-200 font-mono shadow-xl">
        <div className="relative mx-auto h-28 w-28 rounded-xl overflow-hidden border border-[#1A2230] group-hover:border-emerald-400 transition duration-200">
            <img className="h-full w-full object-cover transform group-hover:scale-105 transition duration-200" src={avatarUrl} alt={name} />
        </div>
        <h3 className="mt-4 text-base font-bold text-white">{name}</h3>
        <p className="mt-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{title}</p>
    </div>
);

const LandingAbout: React.FC = () => {
    return (
        <div className="bg-[#08090A] text-zinc-100 font-sans antialiased pt-24 min-h-screen">
            {/* Page Header */}
            <section className="py-20 relative overflow-hidden bg-[#090C11] border-b border-[#1A2230]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04),transparent)] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// SYSTEM ORIGIN &amp; MISSION</span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none">
                        Decentralized Academic Infrastructure
                    </h1>
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-mono max-w-2xl mx-auto">
                        Built on the CogniSacra architecture to power primary, tertiary, and independent academic pipelines across the globe. We believe education is a fundamental sovereign computing resource.
                    </p>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-20 border-b border-[#1A2230] bg-[#08090A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-[#0B0E14] rounded-xl border border-[#1A2230] space-y-3 hover:border-emerald-500/40 transition font-mono shadow-xl">
                            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg w-fit"><ShieldCheck size={20} /></div>
                            <h3 className="text-base font-bold text-white">Cryptographic Trust</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Zero reliance on unverifiable certificates. Direct on-chain signatures protect student achievements and intellectual property.
                            </p>
                        </div>
                        <div className="p-6 bg-[#0B0E14] rounded-xl border border-[#1A2230] space-y-3 hover:border-emerald-500/40 transition font-mono shadow-xl">
                            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg w-fit"><Users size={20} /></div>
                            <h3 className="text-base font-bold text-white">Open Architecture</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Fully structured to facilitate cross-border settlements, localized offline-first modules, and edge AI companions.
                            </p>
                        </div>
                        <div className="p-6 bg-[#0B0E14] rounded-xl border border-[#1A2230] space-y-3 hover:border-emerald-500/40 transition font-mono shadow-xl">
                            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg w-fit"><Compass size={20} /></div>
                            <h3 className="text-base font-bold text-white">Continuous Evolution</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Adapting dynamically to match international requirements, learner velocity checkpoints, and real-time simulations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Team / Contributors */}
            <section className="py-20 bg-[#090C11]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-3 mb-16">
                        <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// DIRECTORS &amp; RESEARCH LEADS</span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-white">The Engineering Committee</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member) => (
                            <TeamMemberCard key={member.name} {...member} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingAbout;
