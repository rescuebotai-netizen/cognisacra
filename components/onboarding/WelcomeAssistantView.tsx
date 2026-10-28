import React from 'react';
import { Terminal, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeAssistantViewProps {
    onStart: () => void;
}

const WelcomeAssistantView: React.FC<WelcomeAssistantViewProps> = ({ onStart }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg p-6 sm:p-8 bg-[#0B0E14] border border-[#1A2230] rounded-2xl shadow-2xl text-center text-zinc-100 space-y-6"
        >
            <motion.div 
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
                <Terminal size={36} />
            </motion.div>

            <div className="space-y-2">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[11px]"
                >
                    <CheckCircle2 size={13} />
                    <span>AUTHENTICATION & ONBOARDING CLEARED</span>
                </motion.div>
                <motion.h2 
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight"
                >
                    Academic Workspace Ready
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="text-xs sm:text-sm text-zinc-400 font-sans max-w-sm mx-auto"
                >
                    Your account has been verified. The CogniSacra AI Tutor, library, and interactive laboratory are initialized and ready for execution.
                </motion.p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-3.5 rounded-xl bg-[#080B10] border border-[#1A2230] font-mono text-[11px] text-zinc-400 text-left space-y-1"
            >
                <div className="text-emerald-400">[SYS_INIT] Profile synchronized</div>
                <div className="text-emerald-400">[NET_SYNC] Sovereign Node connected</div>
                <div className="text-zinc-500">[STATUS] Academic clearance granted: ACTIVE</div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="pt-2"
            >
                <button
                    onClick={onStart}
                    className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:scale-105 active:scale-95"
                >
                    <span>Launch Academic Workspace</span>
                    <ArrowRight size={14} />
                </button>
            </motion.div>
        </motion.div>
    );
};

export default WelcomeAssistantView;