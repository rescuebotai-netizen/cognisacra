import React from 'react';

const TermsOfServiceView: React.FC = () => {
    return (
        <div className="w-full animate-fade-in bg-[#0E131C] p-6 sm:p-10 rounded-2xl shadow-xl text-zinc-200">
            <div className="mb-6 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    Sovereign Governance
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">Terms of Service</h1>
                <p className="text-xs font-mono text-zinc-500">Last Updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm font-sans text-zinc-300 leading-relaxed max-w-4xl">
                <section className="p-4 rounded-xl bg-[#141B26] space-y-2">
                    <h2 className="text-sm font-bold font-serif text-white">1. Agreement to Terms</h2>
                    <p className="text-zinc-400">
                        By accessing or utilizing CogniSacra, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not initialize or access the platform or its sovereign node networks.
                    </p>
                </section>

                <section className="p-4 rounded-xl bg-[#141B26] space-y-2">
                    <h2 className="text-sm font-bold font-serif text-white">2. Scholar & Institutional Accounts</h2>
                    <p className="text-zinc-400">
                        You are responsible for safeguarding your cryptographically signed identity keys and account credentials. Academic micro-credentials, research datasets, and verified achievements are bound to your verified decentralized profile.
                    </p>
                </section>

                <section className="p-4 rounded-xl bg-[#141B26] space-y-2">
                    <h2 className="text-sm font-bold font-serif text-white">3. Intellectual Property & Institutional Publishing</h2>
                    <p className="text-zinc-400">
                        Faculty, researchers, and institutions retain sovereign ownership of their published syllabi, lecture sets, and research monographs, granting CogniSacra distribution licenses for verified academic cohorts.
                    </p>
                </section>

                <section className="p-4 rounded-xl bg-[#141B26] space-y-2">
                    <h2 className="text-sm font-bold font-serif text-white">4. Cognitive AI & Socratic Assistance Policy</h2>
                    <p className="text-zinc-400">
                        The CogniSacra Socratic Engine and AI Tutor companions are engineered to facilitate critical thinking and cognitive recall. Unauthorized extraction of proprietary training weights or model spoofing is strictly prohibited.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfServiceView;
