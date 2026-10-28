import React from 'react';

const DataPolicyView: React.FC = () => {
    return (
        <div className="w-full animate-fade-in bg-[#0E131C] p-6 sm:p-10 rounded-2xl shadow-xl text-zinc-200">
            <div className="mb-6 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    Sovereign Privacy & Security
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">Data Policy & Academic Privacy</h1>
                <p className="text-xs font-mono text-zinc-500">Last Updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm font-sans text-zinc-300 leading-relaxed max-w-4xl">
                <section className="p-4 rounded-xl bg-[#141B26] space-y-2">
                    <h2 className="text-sm font-bold font-serif text-white">1. Introduction & Sovereign Scope</h2>
                    <p className="text-zinc-400">
                        CogniSacra prioritizes individual learner sovereignty, institutional privacy, and rigorous data protection standards aligned with global compliance frameworks (including GDPR and regional educational privacy statutes).
                    </p>
                </section>

                <section className="p-4 rounded-xl bg-[#141B26] space-y-2">
                    <h2 className="text-sm font-bold font-serif text-white">2. Learner Telemetry & Assessment Diagnostics</h2>
                    <p className="text-zinc-400">
                        We process active learning diagnostics, recall latency intervals, and module completions solely to adapt the Socratic AI model to individual learner pacing and to certify course mastery.
                    </p>
                </section>

                <section className="p-4 rounded-xl bg-[#141B26] space-y-2">
                    <h2 className="text-sm font-bold font-serif text-white">3. Zero Selling of Academic Telemetry</h2>
                    <p className="text-zinc-400">
                        We never sell, rent, or trade student assessment logs, research submissions, or institution-specific curriculum blueprints to commercial third-party aggregators.
                    </p>
                </section>

                <section className="p-4 rounded-xl bg-[#141B26] space-y-2">
                    <h2 className="text-sm font-bold font-serif text-white">4. Institutional Security Integrity</h2>
                    <p className="text-zinc-400">
                        All student verification tokens and SIS identity handshakes are cryptographically verified with ephemeral tokens, ensuring tamper-proof academic audit trails.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default DataPolicyView;
