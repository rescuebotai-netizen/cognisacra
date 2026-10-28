import React from 'react';

const AboutView: React.FC = () => {
    return (
        <div className="w-full animate-fade-in bg-[#0E131C] p-6 sm:p-10 rounded-2xl shadow-xl text-zinc-200">
            <div className="text-center mb-8 space-y-2">
                <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 mb-2">
                    <div className="p-1.5 bg-white rounded-xl shadow-md border border-zinc-200 inline-flex items-center justify-center shrink-0">
                        <img src="/cogni-sacra.jpeg" alt="CogniSacra" className="w-10 h-10 object-contain block shrink-0" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-white">CogniSacra</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">About CogniSacra</h1>
                <p className="text-sm font-mono text-emerald-400">Sovereign Academic Knowledge Architecture</p>
            </div>
            
            <div className="space-y-6 text-sm font-sans text-zinc-300 max-w-4xl mx-auto leading-relaxed">
                <p>
                    CogniSacra is a next-generation academic operating system dedicated to delivering world-class sovereign digital learning experiences. We believe education should be borderless, rigorous, and cognitive-first for every learner, scholar, and institution.
                </p>
                <p>
                    Our mission is to empower learners, educators, and partner universities globally through neural Socratic tutoring, peer-verified micro-credentials, and institutional repository monetization.
                </p>
                
                <div className="pt-4">
                    <h2 className="text-xl font-bold font-serif text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>Core Sovereign Principles</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-[#141B26] space-y-1">
                            <span className="font-semibold text-emerald-400 font-mono text-xs block">01. Learner Autonomy</span>
                            <p className="text-xs text-zinc-300">Curricula structured for sovereign advancement, active recall diagnostics, and student-owned credentials.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#141B26] space-y-1">
                            <span className="font-semibold text-emerald-400 font-mono text-xs block">02. Cognitive AI Intelligence</span>
                            <p className="text-xs text-zinc-300">Grounding inquiries with Socratic reasoning, real-time code verification, and personalized AI knowledge twins.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#141B26] space-y-1">
                            <span className="font-semibold text-emerald-400 font-mono text-xs block">03. Open Verification</span>
                            <p className="text-xs text-zinc-300">High-integrity academic registries, multi-institution syllabus alignment, and digital ledger certifications.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#141B26] space-y-1">
                            <span className="font-semibold text-emerald-400 font-mono text-xs block">04. Global Knowledge Mesh</span>
                            <p className="text-xs text-zinc-300">Decentralized university publishing, multilingual translation tracks, and international research collaboration.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutView;
