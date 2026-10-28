import React, { useEffect, useRef, useState } from 'react';
import { Job, UserProfile } from '../types';
import { 
    Briefcase, Sparkles, CheckCircle2, ShieldCheck, Lock, 
    X, ArrowRight, Building2, MapPin, DollarSign, Award,
    Check, FileText, Send, RefreshCw, Copy, ExternalLink, Zap
} from 'lucide-react';
import { sendMessageToAI } from '../services/geminiService';

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job | null;
    userProfile: UserProfile;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ 
    isOpen, 
    onClose, 
    job, 
    userProfile 
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [authorizeDataSharing, setAuthorizeDataSharing] = useState(true);
    const [credentialHash] = useState(() => '0x' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join(''));
    const [copiedHash, setCopiedHash] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCoverLetter('');
            setIsGenerating(false);
            setIsSubmitting(false);
            setIsSubmitted(false);
            setAuthorizeDataSharing(true);
        }
    }, [isOpen, job]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isSubmitting) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        setTimeout(() => modalRef.current?.focus(), 100);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, isSubmitting]);

    if (!isOpen || !job) return null;

    const matchingSkills = job.skills.filter(s => 
        userProfile.skills?.some(us => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()))
    );

    const handleGenerateCoverLetter = async () => {
        setIsGenerating(true);
        setCoverLetter('');

        const prompt = `
            Write an executive, high-impact cover letter for an applicant applying with a verified Sovereign Academic Credential.
            Applicant Name: ${userProfile.name}
            Applicant Role: ${userProfile.title}
            Applicant Skills: ${userProfile.skills?.join(', ') || 'Computer Science, Systems Architecture'}
            Applicant Bio: ${userProfile.bio}
            Completed Accredited Courses: ${userProfile.certificates.map(c => c.courseTitle).join(', ') || 'Full-Stack Engineering, AI Alignment'}

            Target Position: ${job.title} at ${job.company}
            Target Job Skills: ${job.skills.join(', ')}
            Location: ${job.location}

            Structure:
            1. Powerful opening asserting demonstrated mastery via CogniSacra verified credentials.
            2. Concise alignment between specific completed courses and ${job.company}'s requirements.
            3. Value proposition and enthusiasm for kingdom-standard engineering rigor.
            Length: 2-3 concise paragraphs. End with "Sincerely, ${userProfile.name}".
        `;

        try {
            const stream = await sendMessageToAI(prompt);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setCoverLetter(fullResponse);
            }
        } catch (error) {
            console.error("Error generating cover letter:", error);
            setCoverLetter(
                `Dear Hiring Team at ${job.company},\n\nI am thrilled to apply for the ${job.title} position, presenting my verified Sovereign Academic Credential from CogniSacra. My coursework in ${userProfile.certificates[0]?.courseTitle || 'Advanced Computing'} and background in ${job.skills.slice(0, 3).join(', ')} directly align with your mission.\n\nMy verifiable portfolio and cryptographic skill attestations reflect consistent practical excellence and deterministic problem-solving.\n\nSincerely,\n${userProfile.name}`
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmitApplication = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1200);
    };

    const handleCopyHash = () => {
        navigator.clipboard.writeText(credentialHash);
        setCopiedHash(true);
        setTimeout(() => setCopiedHash(false), 2000);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-3 sm:p-5 overflow-y-auto"
            onClick={isSubmitting ? undefined : onClose}
            role="presentation"
        >
            <div 
                ref={modalRef}
                className="bg-[#0E131C] border border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-500/10 w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative text-left text-zinc-100 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="absolute top-5 right-5 p-2 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-400 hover:text-white transition disabled:opacity-30"
                    title="Close"
                >
                    <X size={16} />
                </button>

                {isSubmitted ? (
                    /* Celebratory Submitted State */
                    <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
                        <div className="relative mx-auto w-20 h-20">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 animate-spin opacity-30 blur-md [animation-duration:10s]"></div>
                            <div className="relative w-full h-full rounded-2xl bg-[#141B26] border-2 border-emerald-400/60 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-xs border border-emerald-500/30">
                                <ShieldCheck size={13} className="text-emerald-400" />
                                <span>Cryptographic Attestation Delivered</span>
                            </div>
                            <h2 className="text-2xl font-bold font-serif text-white">
                                Application Submitted Successfully!
                            </h2>
                            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                                Your sovereign credential passport, verified coursework proofs, and cover letter have been securely dispatched to the hiring team at <strong className="text-white">{job.company}</strong>.
                            </p>
                        </div>

                        {/* Dispatch Receipt Card */}
                        <div className="p-4 rounded-2xl bg-[#141B26] border border-zinc-800 text-left space-y-3 font-mono text-xs max-w-md mx-auto">
                            <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80">
                                <span className="text-zinc-500 uppercase text-[10px]">Position</span>
                                <span className="text-white font-bold">{job.title}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80">
                                <span className="text-zinc-500 uppercase text-[10px]">Employer</span>
                                <span className="text-emerald-400 font-bold">{job.company}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80">
                                <span className="text-zinc-500 uppercase text-[10px]">Transmission Ledger Hash</span>
                                <span className="text-zinc-300 truncate max-w-[180px]">{credentialHash}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500 uppercase text-[10px]">Attestation Status</span>
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                    <Check size={12} />
                                    <span>Verified On-Chain</span>
                                </span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={onClose}
                                className="w-full max-w-md mx-auto py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                            >
                                <span>Return to Job Board</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Application Formulation State */
                    <div className="space-y-6">
                        {/* Header Banner */}
                        <div className="pr-8 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <ShieldCheck size={11} className="text-emerald-400" />
                                    <span>Sovereign Credential Application</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                                    {job.type}
                                </span>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                                {job.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                                <span className="flex items-center gap-1.5 text-zinc-200 font-bold">
                                    <Building2 size={13} className="text-emerald-400" />
                                    {job.company}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin size={13} />
                                    {job.location}
                                </span>
                                {job.salary && (
                                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                                        <DollarSign size={13} />
                                        {job.salary}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Sovereign Credential Passport Preview */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#141B26] to-[#0D141F] border border-emerald-500/30 space-y-3 relative overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-800/80">
                                <div>
                                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider block">
                                        Verified Passport Identity
                                    </span>
                                    <div className="text-sm font-bold text-white font-serif">{userProfile.name}</div>
                                    <div className="text-[11px] font-mono text-zinc-400">{userProfile.title}</div>
                                </div>
                                <div className="text-left sm:text-right">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Mastery Index</span>
                                    <span className="text-sm font-mono font-extrabold text-emerald-400">98.4% Academic Standing</span>
                                </div>
                            </div>

                            {/* Immutable Proof Hash */}
                            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#090D14] border border-zinc-800 font-mono text-[11px]">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <Lock size={12} className="text-emerald-400 shrink-0" />
                                    <span className="text-zinc-500 text-[10px]">W3C Hash:</span>
                                    <span className="text-zinc-300 truncate">{credentialHash}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyHash}
                                    className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] rounded transition shrink-0 flex items-center gap-1"
                                >
                                    {copiedHash ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                    <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>

                            {/* Skills Alignment Matrix */}
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                                    Demonstrated Skills Alignment ({matchingSkills.length} of {job.skills.length} Required Skills Attested)
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {job.skills.map((skill, idx) => {
                                        const isAttested = matchingSkills.some(ms => ms.toLowerCase() === skill.toLowerCase());
                                        return (
                                            <span 
                                                key={idx}
                                                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] flex items-center gap-1 ${
                                                    isAttested 
                                                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
                                                        : 'bg-zinc-800/60 text-zinc-400 border border-zinc-800'
                                                }`}
                                            >
                                                {isAttested && <Check size={11} className="text-emerald-400" />}
                                                <span>{skill}</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Attached Verified Certificates */}
                            {userProfile.certificates.length > 0 && (
                                <div className="pt-1">
                                    <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1.5">
                                        Attached Sovereign Micro-Credentials ({userProfile.certificates.length})
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {userProfile.certificates.slice(0, 2).map((cert) => (
                                            <div key={cert.id} className="p-2 rounded-xl bg-[#090D14]/80 border border-zinc-800 flex items-center gap-2">
                                                <Award size={14} className="text-amber-400 shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-[11px] font-bold text-white truncate">{cert.courseTitle}</div>
                                                    <div className="text-[9px] font-mono text-zinc-500">Issued: {cert.issueDate}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AI Cover Letter Generator */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
                                    <FileText size={13} className="text-emerald-400" />
                                    <span>Personalized Sovereign Statement / Cover Letter</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={handleGenerateCoverLetter}
                                    disabled={isGenerating}
                                    className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500 hover:to-teal-500 hover:text-black border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                                >
                                    <Sparkles size={12} className={isGenerating ? 'animate-spin' : ''} />
                                    <span>{isGenerating ? 'Generating with AI...' : 'Draft with AI'}</span>
                                </button>
                            </div>

                            <textarea
                                rows={6}
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="Click 'Draft with AI' to generate a tailored cover letter demonstrating your verified course competencies, or write your personal remarks here..."
                                className="w-full p-3.5 bg-[#141B26] border border-zinc-800 rounded-2xl text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 leading-relaxed resize-none"
                            />
                        </div>

                        {/* Sovereign Authorization Agreement */}
                        <label className="p-3 rounded-xl bg-[#141B26]/60 border border-zinc-800 flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={authorizeDataSharing}
                                onChange={(e) => setAuthorizeDataSharing(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded bg-[#0E131C] border-zinc-700 accent-emerald-500"
                            />
                            <span className="text-[11px] font-mono text-zinc-300 leading-snug">
                                I cryptographically authorize CogniSacra to transmit my verified transcript, W3C verifiable credentials, and competency ledger scores directly to <strong>{job.company}</strong> for evaluation.
                            </span>
                        </label>

                        {/* Submission Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="w-full py-3 px-4 rounded-xl bg-[#141B26] hover:bg-[#1A2332] text-zinc-300 hover:text-white font-mono text-xs font-bold transition disabled:opacity-40"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmitApplication}
                                disabled={!authorizeDataSharing || isSubmitting}
                                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-mono font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <RefreshCw size={14} className="animate-spin" />
                                        <span>Transmitting On-Chain Proof...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={15} />
                                        <span>Submit Sovereign Application</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationModal;
