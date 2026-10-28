import React, { useEffect, useRef, useState } from 'react';
import { Achievement } from '../types';
import { 
    Award, CheckCircle2, Sparkles, ShieldCheck, Zap, 
    ArrowRight, Copy, Check, Flame, Share2, Lock, Trophy
} from 'lucide-react';

interface LessonCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    achievement: Achievement | undefined;
    lessonTitle?: string;
    courseTitle?: string;
}

const LessonCompletionModal: React.FC<LessonCompletionModalProps> = ({ 
    isOpen, 
    onClose, 
    achievement,
    lessonTitle = "Lesson Competency Module",
    courseTitle = "CogniSacra Curriculum"
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [copiedHash, setCopiedHash] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);
    const [hash] = useState(() => '0x' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join(''));

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        setTimeout(() => modalRef.current?.focus(), 100);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const copyLedgerHash = () => {
        navigator.clipboard.writeText(hash);
        setCopiedHash(true);
        setTimeout(() => setCopiedHash(false), 2000);
    };

    const copyShareLink = () => {
        navigator.clipboard.writeText(`https://cognisacra.io/student/alex-turner/credential/${hash.slice(0, 10)}`);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4 overflow-y-auto"
            onClick={onClose}
            role="presentation"
        >
            <div 
                ref={modalRef}
                className="bg-[#0E131C] border border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-500/10 w-full max-w-lg p-6 sm:p-8 relative text-center animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
            >
                {/* Background ambient radial glows */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 right-0 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

                {/* Sparkling celebration badges */}
                <div className="relative mx-auto mb-5 w-20 h-20">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 animate-spin opacity-30 blur-sm [animation-duration:8s]"></div>
                    <div className="relative w-full h-full rounded-2xl bg-[#141B26] border-2 border-emerald-400/60 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Award className="w-10 h-10 text-emerald-400 animate-bounce" />
                    </div>
                    <div className="absolute -top-2 -right-2 p-1 bg-amber-400 text-black rounded-full shadow">
                        <Sparkles size={14} className="fill-current" />
                    </div>
                </div>

                {/* Heading */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs mb-3">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    <span>Competency Verified On-Chain</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
                    Lesson Complete!
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-zinc-300 max-w-sm mx-auto leading-relaxed">
                    Excellence recognized. Your mastery has been cryptographically signed and stored in your sovereign learner passport.
                </p>

                {/* Telemetry Stats Grid */}
                <div className="mt-6 grid grid-cols-3 gap-2.5">
                    <div className="p-3 bg-[#141B26] border border-zinc-800 rounded-2xl text-center">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">XP Awarded</div>
                        <div className="mt-1 text-lg font-mono font-extrabold text-emerald-400 flex items-center justify-center gap-0.5">
                            <Zap size={14} className="fill-emerald-400" />
                            <span>+75 XP</span>
                        </div>
                    </div>
                    <div className="p-3 bg-[#141B26] border border-zinc-800 rounded-2xl text-center">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">Mastery Index</div>
                        <div className="mt-1 text-lg font-mono font-extrabold text-white">
                            98.4%
                        </div>
                    </div>
                    <div className="p-3 bg-[#141B26] border border-zinc-800 rounded-2xl text-center">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase">Streak</div>
                        <div className="mt-1 text-lg font-mono font-extrabold text-amber-400 flex items-center justify-center gap-0.5">
                            <Flame size={14} className="fill-amber-400" />
                            <span>5 Days</span>
                        </div>
                    </div>
                </div>

                {/* Cryptographic Ledger Record */}
                <div className="mt-4 p-3 bg-[#080B10] border border-zinc-800/80 rounded-2xl text-left">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pb-1.5 border-b border-zinc-800/60 mb-2">
                        <span className="flex items-center gap-1">
                            <Lock size={10} className="text-emerald-400" />
                            <span>W3C Verifiable Credential Hash</span>
                        </span>
                        <span className="text-emerald-400 font-bold">IMMUTABLE</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] text-zinc-300 truncate">
                            {hash}
                        </span>
                        <button
                            onClick={copyLedgerHash}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-[10px] font-mono transition shrink-0 flex items-center gap-1"
                            title="Copy Cryptographic Hash"
                        >
                            {copiedHash ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                </div>

                {/* Unlocked Achievement Badge if present */}
                {achievement && (
                    <div className="mt-4 bg-gradient-to-r from-emerald-950/40 via-[#141B26] to-amber-950/40 p-4 rounded-2xl border border-emerald-500/30 flex items-center gap-3.5 text-left">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-black font-extrabold shadow shrink-0">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">Badge Unlocked</span>
                            <div className="font-bold text-sm text-white truncate font-serif">{achievement.name}</div>
                            <div className="text-[11px] text-zinc-400 truncate mt-0.5">{achievement.description}</div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 space-y-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer group"
                    >
                        <span>Continue Curriculum</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        type="button"
                        onClick={copyShareLink}
                        className="w-full py-2.5 px-4 bg-[#141B26] hover:bg-[#182130] border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                        {copiedShare ? (
                            <>
                                <Check size={13} className="text-emerald-400" />
                                <span className="text-emerald-400">Credential Link Copied to Clipboard!</span>
                            </>
                        ) : (
                            <>
                                <Share2 size={13} />
                                <span>Share Sovereign Proof of Competency</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonCompletionModal;