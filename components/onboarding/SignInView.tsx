import React, { useState } from 'react';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';
import PasswordResetView from './PasswordResetView';
import { authService } from '../../services/authService';

interface SignInViewProps {
    onAuthenticated: (name: string) => void;
    onNavigateToSignUp: () => void;
}

const SignInView: React.FC<SignInViewProps> = ({ onAuthenticated, onNavigateToSignUp }) => {
    const [mode, setMode] = useState<'auth' | 'reset'>('auth');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [verificationMsg, setVerificationMsg] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(() => {
        try {
            const saved = localStorage.getItem('cogniSacraRememberMe');
            return saved !== 'false';
        } catch (e) {
            return true;
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        setVerificationMsg(null);

        try {
            const response = await authService.login({
                email,
                password,
            });

            if (response.user) {
                try {
                    localStorage.setItem('cogniSacraRememberMe', rememberMe ? 'true' : 'false');
                } catch (e) {
                    console.warn("Could not access localStorage.");
                }
                onAuthenticated(response.user.name || email);
            }
        } catch (error: any) {
            console.error('Authentication error:', error);
            setErrorMsg(error.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-900 animate-fade-in">
            {/* Left Side - Artistic / Brand */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-crimson/40 to-blue-900/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-between w-full p-16">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-2xl shadow-lg border border-zinc-200 shrink-0 inline-flex items-center justify-center">
                            <img src="/cogni-sacra.jpeg" alt="CogniSacra" className="w-12 h-12 object-contain block rounded-lg" />
                        </div>
                        <span className="text-2xl font-bold text-white font-serif tracking-tight">
                            CogniSacra
                        </span>
                    </div>

                    <div className="space-y-8">
                        <blockquote className="space-y-4">
                            <p className="text-3xl font-serif font-medium text-white leading-relaxed">
                                "This platform completely transformed how I approach learning. The AI tutor feels like having a personal mentor available 24/7."
                            </p>
                            <footer className="flex items-center gap-4">
                                <img src="https://i.pravatar.cc/150?u=sarahconnor" alt="User" className="w-12 h-12 rounded-full border-2 border-white/20" />
                                <div>
                                    <div className="text-white font-bold">Sarah Connor</div>
                                    <div className="text-white/60 text-sm">Full Stack Developer</div>
                                </div>
                            </footer>
                        </blockquote>

                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <div className="w-2 h-2 rounded-full bg-white/30"></div>
                            <div className="w-2 h-2 rounded-full bg-white/30"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-gray-900 overflow-y-auto">
                <div className="w-full max-w-md space-y-8 my-auto">
                    {mode === 'reset' ? (
                        <PasswordResetView onBack={() => setMode('auth')} />
                    ) : (
                        <>
                            <div className="text-center lg:text-left">
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-serif tracking-tight">
                                    Welcome back
                                </h2>
                                <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
                                    Enter your details to access your account.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {errorMsg && (
                                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                                        {errorMsg}
                                    </div>
                                )}
                                {verificationMsg && (
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                                        {verificationMsg}
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all duration-200"
                                        placeholder="e.g. alex@example.com"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                                    <div className="relative group">
                                        <input
                                            id="password"
                                            type={isVisible ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all duration-200"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsVisible(!isVisible)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                        >
                                            {isVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-crimson focus:ring-crimson"
                                        />
                                        Remember me
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setMode('reset')}
                                        className="text-sm font-bold text-crimson hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-crimson hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Processing...' : 'Sign in'}
                                </button>
                            </form>

                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?{' '}
                                <button
                                    onClick={onNavigateToSignUp}
                                    className="font-bold text-crimson hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                >
                                    Sign up
                                </button>
                            </p>

                            {/* F6S Badge at bottom */}
                            <div className="flex justify-center pt-4">
                                <a
                                    href="https://www.f6s.com/cognisacra"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:opacity-80 transition-opacity"
                                >
                                    <img src="/f6s.jpeg" alt="F6S" className="h-8 w-auto object-contain" />
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignInView;
