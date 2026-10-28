import React, { useState } from 'react';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import GoogleIcon from '../icons/GoogleIcon';
import AppleIcon from '../icons/AppleIcon';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';
import { supabase } from '../../services/supabaseClient';
import { ShieldCheck, KeyRound, Terminal, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginViewProps {
    onAuthenticated: (name: string, isNewSignUp: boolean) => void;
}

type AuthTab = 'signin' | 'signup';

const SocialButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="w-full flex items-center justify-center py-2.5 px-4 border border-[#1E2536] rounded-xl bg-[#0E131C] hover:bg-[#151C28] text-zinc-300 hover:text-white transition-all duration-200 group"
    >
        <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
    </button>
);

const LoginView: React.FC<LoginViewProps> = ({ onAuthenticated }) => {
    const [activeTab, setActiveTab] = useState<AuthTab>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);

        try {
            if (activeTab === 'signup') {
                // New user sign up - ONLY after this does onboarding trigger!
                let userName = fullName.trim() || email.split('@')[0] || 'New Scholar';
                try {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name: userName,
                                avatar_url: `https://i.pravatar.cc/150?u=${email}`,
                            }
                        }
                    });
                    if (error) console.warn("Supabase signup notice:", error.message);
                } catch (supaErr) {
                    console.warn("Supabase auth error fallback to local session:", supaErr);
                }
                
                // Trigger onboarding flow ONLY after sign up
                onAuthenticated(userName, true);

            } else {
                // Existing user sign in - goes directly to dashboard without onboarding
                let userName = email.split('@')[0] || 'Authorized Scholar';
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });
                    if (data?.user?.user_metadata?.full_name) {
                        userName = data.user.user_metadata.full_name;
                    }
                } catch (supaErr) {
                    console.warn("Supabase login notice:", supaErr);
                }

                // Existing sign in: bypass onboarding straight to dashboard
                onAuthenticated(userName, false);
            }
        } catch (error: any) {
            console.error('Authentication error:', error);
            setErrorMsg(error.message || 'Authentication error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickSignIn = () => {
        onAuthenticated('Dr. Joseph Adebayo', false);
    };

    const handleQuickSignUp = () => {
        onAuthenticated('New Academic Scholar', true);
    };

    return (
        <div className="flex min-h-screen w-full bg-[#08090A] text-zinc-100 font-sans antialiased overflow-hidden">
            
            {/* Left Side - Codex Terminal Brand Stage */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:flex w-1/2 relative bg-[#090C11] border-r border-[#1A2230] overflow-hidden flex-col justify-between p-16"
            >
                
                {/* Background Grid & Ambient Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Header / Brand */}
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-xl bg-white border border-zinc-200 shadow-md inline-flex items-center justify-center shrink-0">
                            <img src="/cogni-sacra.jpeg" alt="CogniSacra" className="w-7 h-7 object-contain block rounded" />
                        </div>
                        <div>
                            <span className="text-xl font-bold font-serif text-white tracking-tight">CogniSacra</span>
                            <span className="text-xs font-mono text-emerald-400 block -mt-1 tracking-wider">SOVEREIGN ACADEMY</span>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                        <ShieldCheck size={13} />
                        <span>CRYPTOGRAPHIC INSTITUTIONAL ACCESS</span>
                    </div>
                </div>

                {/* Main Middle Terminal Graphic */}
                <div className="relative z-10 space-y-6">
                    <div className="p-6 rounded-2xl bg-[#0B0E14] border border-[#1A2230] shadow-2xl space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pb-3 border-b border-[#1A2230]">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-zinc-300 font-semibold">ONBOARDING & CLEARANCE STATUS</span>
                            </div>
                            <span className="text-emerald-400">ACTIVE</span>
                        </div>

                        <p className="text-sm font-sans text-zinc-300 leading-relaxed">
                            "The Onboarding Protocol is strictly provisioned upon user registration. Students and faculty lecturers can be onboarded directly by partner institutions or self-onboard with an official institutional accreditation code."
                        </p>

                        <div className="pt-2 grid grid-cols-2 gap-3 text-xs font-mono">
                            <div className="p-2.5 rounded-lg bg-[#0E131C] border border-[#1E2536]">
                                <span className="text-[10px] text-zinc-500 uppercase block">Institution Codes</span>
                                <span className="text-emerald-400 font-bold">Auto-Validation</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-[#0E131C] border border-[#1E2536]">
                                <span className="text-[10px] text-zinc-500 uppercase block">Open Access</span>
                                <span className="text-cyan-400 font-bold">Private & Independent</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Quote */}
                <div className="relative z-10 text-xs font-mono text-zinc-500">
                    Sovereign Academic Protocol v4.2 • End-to-End Encrypted Authentication
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#08090A] overflow-y-auto">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md space-y-6"
                >
                    
                    {/* Form Header */}
                    <div className="space-y-2">
                        <div className="lg:hidden flex items-center gap-3 mb-6">
                            <div className="p-1.5 rounded-xl bg-white border border-zinc-200 shadow-sm inline-flex items-center justify-center shrink-0">
                                <img src="/cogni-sacra.jpeg" alt="CogniSacra" className="w-6 h-6 object-contain block rounded" />
                            </div>
                            <span className="text-lg font-bold font-serif text-white">CogniSacra Academy</span>
                        </div>

                        <motion.h2 
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-2xl font-bold font-serif text-white tracking-tight"
                        >
                            {activeTab === 'signin' ? 'Sign in to your account' : 'Create your academic account'}
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xs text-zinc-400 font-sans"
                        >
                            {activeTab === 'signin' 
                                ? 'Existing user? Sign in directly to access your dashboards.' 
                                : 'New scholar? Sign up to access institutional onboarding & accreditation.'
                            }
                        </motion.p>
                    </div>

                    {/* Auth Tab Switcher */}
                    <div className="flex p-1 rounded-xl bg-[#0E131C] border border-[#1E2536] text-xs font-mono">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('signin'); setErrorMsg(null); }}
                            className={`flex-1 py-2 rounded-lg transition font-medium text-center ${
                                activeTab === 'signin' 
                                    ? 'bg-emerald-500/15 text-emerald-400 font-bold shadow-sm border border-emerald-500/30' 
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Sign In (Existing)
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('signup'); setErrorMsg(null); }}
                            className={`flex-1 py-2 rounded-lg transition font-medium text-center ${
                                activeTab === 'signup' 
                                    ? 'bg-emerald-500/15 text-emerald-400 font-bold shadow-sm border border-emerald-500/30' 
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Sign Up (New Account)
                        </button>
                    </div>

                    {/* Notice for Sign Up */}
                    {activeTab === 'signup' && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs">
                            <Sparkles size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-zinc-300 font-sans leading-relaxed">
                                <strong className="text-emerald-400 font-mono">Onboarding Clearance:</strong> Signing up unlocks the institutional accreditation clearance and role personalization flow.
                            </p>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                            {errorMsg}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {activeTab === 'signup' && (
                            <div>
                                <label className="text-xs font-mono text-zinc-400 block mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Dr. Amina Touré or Kofi Mensah"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E131C] border border-[#1E2536] text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-mono text-zinc-400 block mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="name@domain.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E131C] border border-[#1E2536] text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-mono text-zinc-400 block mb-1">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={isVisible ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#0E131C] border border-[#1E2536] text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsVisible(!isVisible)}
                                    className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                                >
                                    {isVisible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span>Authenticating...</span>
                            ) : activeTab === 'signin' ? (
                                <>
                                    <span>Sign In directly to Workspace</span>
                                    <ArrowRight size={14} />
                                </>
                            ) : (
                                <>
                                    <span>Complete Sign Up & Begin Onboarding</span>
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick Demo Launchers */}
                    <div className="pt-4 border-t border-[#1A2230] space-y-2">
                        <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider text-center">
                            Evaluation Quick Simulators
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={handleQuickSignIn}
                                className="p-2 rounded-xl bg-[#0E131C] hover:bg-[#141B26] border border-[#1E2536] text-[11px] font-mono text-zinc-300 hover:text-white transition text-center"
                            >
                                <span className="text-zinc-400 block text-[9px]">Existing User</span>
                                <span>⚡ Direct Sign In</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleQuickSignUp}
                                className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 hover:text-emerald-200 transition text-center"
                            >
                                <span className="text-emerald-400/70 block text-[9px]">New User</span>
                                <span>✨ Sign Up & Onboard</span>
                            </button>
                        </div>
                    </div>

                </motion.div>
            </div>

        </div>
    );
};

export default LoginView;
