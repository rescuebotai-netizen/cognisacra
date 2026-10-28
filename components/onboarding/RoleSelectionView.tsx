import React, { useState } from 'react';
import { UserRole } from '../../types';
import { 
  ShieldCheck, Award, GraduationCap, Building2, User, KeyRound, 
  Check, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Terminal, 
  Search, ExternalLink, BookOpen, Compass, Users
} from 'lucide-react';
import { accreditationService, AccreditationRecord } from '../../services/accreditationService';
import { motion } from 'motion/react';

interface RoleSelectionViewProps {
    onSelectRole: (role: UserRole, institutionRecord?: AccreditationRecord) => void;
}

const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({ onSelectRole }) => {
    const [selectedPath, setSelectedPath] = useState<'accredited' | 'independent'>('accredited');
    const [code, setCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifiedRecord, setVerifiedRecord] = useState<AccreditationRecord | null>(null);
    const [verificationError, setVerificationError] = useState<string | null>(null);

    const handleVerify = (inputCode: string = code) => {
        const clean = inputCode.trim();
        if (!clean) {
            setVerificationError('Please enter a valid institutional accreditation code.');
            return;
        }

        setIsVerifying(true);
        setVerificationError(null);

        setTimeout(() => {
            const match = accreditationService.verifyCode(clean);
            setIsVerifying(false);

            if (match) {
                if (match.status === 'revoked') {
                    setVerificationError('This accreditation code has been revoked by the issuing institution.');
                    setVerifiedRecord(null);
                } else {
                    setVerifiedRecord(match);
                    setVerificationError(null);
                }
            } else {
                setVerificationError(`Code "${clean}" was not recognized in the sovereign accreditation registry. Check for typos or select an independent role below.`);
                setVerifiedRecord(null);
            }
        }, 350);
    };

    const handleSelectQuickCode = (sampleCode: string) => {
        setCode(sampleCode);
        handleVerify(sampleCode);
    };

    const handleRedeemAndProceed = () => {
        if (!verifiedRecord) return;
        accreditationService.redeemCode(verifiedRecord.code, verifiedRecord.memberEmail);
        onSelectRole(verifiedRecord.targetRole, verifiedRecord);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl p-6 sm:p-10 text-zinc-100 font-sans"
        >
            
            {/* Header Stage */}
            <div className="text-center space-y-3 max-w-2xl mx-auto mb-8">
                <motion.div 
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono"
                >
                    <ShieldCheck size={14} />
                    <span>SOVEREIGN ACADEMIC CLEARANCE PROTOCOL</span>
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif"
                >
                    Institutional Onboarding & Verification
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-sm text-zinc-400 font-sans"
                >
                    Authenticate via your Institution Accreditation Code for verified campus & lecturer access, or continue as an independent scholar or private educator.
                </motion.p>
            </div>

            {/* Path Selection Tabs */}
            <div className="flex p-1.5 rounded-2xl bg-[#0B0E14] border border-[#1A2230] max-w-xl mx-auto mb-8 text-xs font-mono">
                <button
                    type="button"
                    onClick={() => { setSelectedPath('accredited'); setVerificationError(null); }}
                    className={`flex-1 py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 font-bold ${
                        selectedPath === 'accredited'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            : 'text-zinc-400 hover:text-white'
                    }`}
                >
                    <KeyRound size={15} />
                    <span>Institutional Accreditation Code</span>
                </button>
                <button
                    type="button"
                    onClick={() => { setSelectedPath('independent'); setVerificationError(null); }}
                    className={`flex-1 py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 font-bold ${
                        selectedPath === 'independent'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            : 'text-zinc-400 hover:text-white'
                    }`}
                >
                    <Compass size={15} />
                    <span>Independent / Private Track</span>
                </button>
            </div>

            {/* TAB 1: INSTITUTIONAL ACCREDITATION CODE VERIFICATION */}
            {selectedPath === 'accredited' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                    
                    <div className="p-6 sm:p-8 rounded-2xl bg-[#0B0E14] border border-[#1A2230] shadow-2xl space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                                <Award size={18} className="text-emerald-400" />
                                <span>Enter Your Institutional Accreditation Code</span>
                            </h2>
                            <p className="text-xs text-zinc-400 font-sans">
                                Provided by your university, faculty, or institutional administrator for direct self-onboarding.
                            </p>
                        </div>

                        {/* Code Input Form */}
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <KeyRound size={16} className="absolute left-3.5 top-3.5 text-zinc-500" />
                                    <input
                                        type="text"
                                        placeholder="e.g. COG-STU-2026-9F4B or COG-LEC-2026-7A1C"
                                        value={code}
                                        onChange={(e) => {
                                            setCode(e.target.value.toUpperCase());
                                            if (verifiedRecord) setVerifiedRecord(null);
                                        }}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleVerify(); }}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#07090D] border border-[#1E2536] text-sm font-mono text-emerald-300 placeholder-zinc-500 tracking-wider focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleVerify()}
                                    disabled={isVerifying}
                                    className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
                                >
                                    {isVerifying ? (
                                        <span>Verifying...</span>
                                    ) : (
                                        <>
                                            <span>Verify Code</span>
                                            <ArrowRight size={14} />
                                        </>
                                    )}
                                </button>
                            </div>

                            {verificationError && (
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-start gap-2">
                                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                                    <span>{verificationError}</span>
                                </div>
                            )}
                        </div>

                        {/* VERIFIED CREDENTIAL CARD (shown on successful check) */}
                        {verifiedRecord && (
                            <div className="p-6 rounded-xl bg-gradient-to-br from-[#0F1E18] to-[#0A120F] border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] space-y-5 animate-fade-in">
                                
                                <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
                                    <div className="space-y-0.5">
                                        <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                            <CheckCircle2 size={12} />
                                            <span>ACCREDITATION CLEARED & CONFIRMED</span>
                                        </div>
                                        <h4 className="text-lg font-bold font-serif text-white">
                                            {verifiedRecord.institutionName}
                                        </h4>
                                        <div className="text-xs text-zinc-400 font-mono">
                                            {verifiedRecord.campusName} • {verifiedRecord.department}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                                        verifiedRecord.targetRole === 'instructor'
                                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    }`}>
                                        {verifiedRecord.targetRole === 'instructor' ? 'Lecturer (Faculty)' : 'Student (Learner)'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                                    <div>
                                        <span className="text-[10px] text-zinc-500 uppercase block">Registered Member</span>
                                        <span className="text-white font-sans font-semibold">{verifiedRecord.memberName}</span>
                                        <div className="text-[11px] text-zinc-400">{verifiedRecord.memberEmail}</div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-zinc-500 uppercase block">Academic Program</span>
                                        <span className="text-zinc-200">{verifiedRecord.program}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-zinc-500 uppercase block">Clearance Code</span>
                                        <span className="text-emerald-400 font-bold">{verifiedRecord.code}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-zinc-500 uppercase block">Cryptographic Hash</span>
                                        <span className="text-zinc-400 truncate block">{verifiedRecord.accreditationHash}</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={handleRedeemAndProceed}
                                        className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99]"
                                    >
                                        <span>
                                            Enter Institutional {verifiedRecord.targetRole === 'instructor' ? 'Lecturer Dashboard' : 'Learner Dashboard'}
                                        </span>
                                        <ArrowRight size={15} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Quick Test Codes Helper */}
                        <div className="pt-4 border-t border-[#1A2230] space-y-2">
                            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">
                                Quick Test Sample Accreditation Codes:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                                <button
                                    type="button"
                                    onClick={() => handleSelectQuickCode('COG-STU-2026-9F4B')}
                                    className="p-2.5 rounded-xl bg-[#0E131C] hover:bg-[#151C28] border border-[#1E2536] text-left transition flex items-center justify-between group"
                                >
                                    <div>
                                        <div className="text-emerald-400 font-bold group-hover:text-emerald-300">COG-STU-2026-9F4B</div>
                                        <div className="text-[10px] text-zinc-400">Student • AI & Neural Computing</div>
                                    </div>
                                    <ArrowRight size={13} className="text-zinc-500 group-hover:text-emerald-400" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleSelectQuickCode('COG-LEC-2026-7A1C')}
                                    className="p-2.5 rounded-xl bg-[#0E131C] hover:bg-[#151C28] border border-[#1E2536] text-left transition flex items-center justify-between group"
                                >
                                    <div>
                                        <div className="text-cyan-400 font-bold group-hover:text-cyan-300">COG-LEC-2026-7A1C</div>
                                        <div className="text-[10px] text-zinc-400">Lecturer • Decentralized Agronomy</div>
                                    </div>
                                    <ArrowRight size={13} className="text-zinc-500 group-hover:text-cyan-400" />
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
            )}

            {/* TAB 2: INDEPENDENT SCHOLARS & PRIVATE INSTRUCTORS (OPEN ACCESS) */}
            {selectedPath === 'independent' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                    
                    <div className="text-center max-w-xl mx-auto space-y-1 mb-6">
                        <h2 className="text-xl font-bold font-serif text-white">
                            Select Your Independent Pathway
                        </h2>
                        <p className="text-xs text-zinc-400">
                            Open access for private instructors, independent scholars, and autonomous academic institutions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Independent Learner Card */}
                        <div 
                            onClick={() => onSelectRole('learner')}
                            className="p-6 rounded-2xl bg-[#0B0E14] border border-[#1A2230] hover:border-emerald-500/50 hover:bg-[#0E131C] transition-all duration-300 cursor-pointer text-left space-y-4 group shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <GraduationCap size={24} />
                                </div>
                                <h3 className="text-lg font-bold font-serif text-white group-hover:text-emerald-300 transition">
                                    Independent Learner
                                </h3>
                                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                                    Self-directed learning with interactive AI tutoring, comprehensive STEM labs, and verifiable micro-credentials.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-[#1A2230] flex items-center justify-between text-xs font-mono text-emerald-400">
                                <span>Continue as Learner</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        {/* Private Instructor Card */}
                        <div 
                            onClick={() => onSelectRole('instructor')}
                            className="p-6 rounded-2xl bg-[#0B0E14] border border-[#1A2230] hover:border-cyan-500/50 hover:bg-[#0E131C] transition-all duration-300 cursor-pointer text-left space-y-4 group shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Award size={24} />
                                </div>
                                <h3 className="text-lg font-bold font-serif text-white group-hover:text-cyan-300 transition">
                                    Private Instructor
                                </h3>
                                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                                    Publish rich multimedia courses, host live virtual sessions, manage student analytics, and monetize your domain expertise.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-[#1A2230] flex items-center justify-between text-xs font-mono text-cyan-400">
                                <span>Continue as Instructor</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        {/* Institution Admin Card */}
                        <div 
                            onClick={() => onSelectRole('institution')}
                            className="p-6 rounded-2xl bg-[#0B0E14] border border-[#1A2230] hover:border-amber-500/50 hover:bg-[#0E131C] transition-all duration-300 cursor-pointer text-left space-y-4 group shadow-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Building2 size={24} />
                                </div>
                                <h3 className="text-lg font-bold font-serif text-white group-hover:text-amber-300 transition">
                                    Institutional Administrator
                                </h3>
                                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                                    Establish an institutional node, onboard faculty and students, and issue official accreditation credentials.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-[#1A2230] flex items-center justify-between text-xs font-mono text-amber-400">
                                <span>Manage Institution</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                    </div>

                </div>
            )}

        </motion.div>
    );
};

export default RoleSelectionView;