import React from 'react';
import { Sparkles, Briefcase, BookOpen, BarChart3, Users, Network, Terminal, Cpu } from 'lucide-react';

const ServiceCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-[#0B0E14] p-7 rounded-xl border border-[#1A2230] text-left hover:border-emerald-500/50 hover:bg-[#0E131C] transition duration-200 flex flex-col justify-between space-y-4 shadow-xl font-mono">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            {icon}
        </div>
        <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{children}</p>
        </div>
    </div>
);

const LandingServices: React.FC = () => {
    return (
        <div className="bg-[#08090A] text-zinc-100 font-sans antialiased pt-24 min-h-screen">
            <section className="py-20 lg:py-24 bg-[#090C11] border-b border-[#1A2230]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-3">
                        <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold block">// SYSTEM CAPABILITIES &amp; APIS</span>
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                            Platform Solutions &amp; SDKs
                        </h1>
                        <p className="mt-4 max-w-3xl mx-auto text-zinc-400 text-sm sm:text-base font-mono">
                            High-throughput modules engineered specifically for individual scholars, technical creators, and distributed universities.
                        </p>
                    </div>

                    {/* For Learners */}
                    <div className="mt-16 space-y-6">
                        <div className="flex items-center gap-2 border-b border-[#1A2230] pb-2">
                            <span className="text-emerald-400 font-mono text-xs">&gt;</span>
                            <h3 className="text-xl font-bold text-white font-mono">FOR LEARNERS &amp; RESEARCHERS</h3>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <ServiceCard icon={<Sparkles size={22} />} title="Adaptive Neural Pathways">
                                Contextual tutees analyze conceptual checkpoints to dynamically deliver curriculum materials without buffering or latency.
                            </ServiceCard>
                            <ServiceCard icon={<Briefcase size={22} />} title="Sovereign Career Portability">
                                Port cryptographic credentials directly to employer nodes, bypassing traditional manual verification bottlenecks.
                            </ServiceCard>
                        </div>
                    </div>

                    {/* For Instructors */}
                    <div className="mt-16 space-y-6">
                        <div className="flex items-center gap-2 border-b border-[#1A2230] pb-2">
                            <span className="text-emerald-400 font-mono text-xs">&gt;</span>
                            <h3 className="text-xl font-bold text-white font-mono">FOR INSTRUCTORS &amp; AUTHORS</h3>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <ServiceCard icon={<BookOpen size={22} />} title="AI-Assisted Curriculum Studio">
                                Generate structured module outlines, synthesize adaptive quizzes, and map learning codes to international standards instantly.
                            </ServiceCard>
                            <ServiceCard icon={<BarChart3 size={22} />} title="Department Drift Monitoring">
                                Maintain sync across virtual campuses, automate lecture approvals, and settle royalty splits directly on-chain.
                            </ServiceCard>
                        </div>
                    </div>

                    {/* For Institutions */}
                    <div className="mt-16 space-y-6">
                        <div className="flex items-center gap-2 border-b border-[#1A2230] pb-2">
                            <span className="text-emerald-400 font-mono text-xs">&gt;</span>
                            <h3 className="text-xl font-bold text-white font-mono">FOR INSTITUTIONAL NETWORKS</h3>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <ServiceCard icon={<Users size={22} />} title="Campus Multitenancy OS">
                                Oversee enterprise student registers, manage faculty workloads, and run regulatory accreditation health checks.
                            </ServiceCard>
                            <ServiceCard icon={<Network size={22} />} title="Federated Research Mesh">
                                Link physical labs, DOI publication registers, and citation graphs with sovereign ownership intact.
                            </ServiceCard>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default LandingServices;
