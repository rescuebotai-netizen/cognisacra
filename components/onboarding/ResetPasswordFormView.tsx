import React, { useState } from 'react';
import CogniSacraLogo from '../icons/IntelliLearnLogo';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import { authService } from '../../services/authService';

interface ResetPasswordFormViewProps {
    token: string;
    onSuccess: () => void;
    onBackToLogin: () => void;
}

const ResetPasswordFormView: React.FC<ResetPasswordFormViewProps> = ({ token, onSuccess, onBackToLogin }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const passwordValid = password.length >= 8;
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        if (!passwordValid) {
            setErrorMsg('Password must be at least 8 characters.');
            return;
        }

        if (!passwordsMatch) {
            setErrorMsg('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const result = await authService.resetPassword({ token, password });
            setSuccessMsg(result.message || 'Password has been reset successfully! You can now sign in.');
            // Clear the URL token after successful reset
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error: any) {
            console.error('Reset password error:', error);
            setErrorMsg(error.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-900 animate-fade-in overflow-hidden">
            {/* Left Side - Brand */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-crimson/40 to-blue-900/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-between w-full p-16">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white rounded-xl shadow-md border border-zinc-200 inline-flex items-center justify-center shrink-0">
                                <img src="/cogni-sacra.jpeg" alt="CogniSacra" className="w-8 h-8 object-contain block rounded" />
                            </div>
                            <span className="text-2xl font-bold text-white font-serif tracking-tight">CogniSacra</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-serif font-medium text-white leading-relaxed">
                                Secure your account with a new password
                            </h3>
                            <p className="text-white/60 text-lg">
                                Choose a strong password to keep your learning journey safe.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-gray-900">
                <div className="w-full max-w-md space-y-10">
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-serif tracking-tight">
                            Set new password
                        </h2>
                        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
                            Enter your new password below to reset your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errorMsg && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                                {errorMsg}
                            </div>
                        )}
                        {successMsg && (
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm flex items-start gap-2">
                                <CheckCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        {!successMsg && (
                            <>
                                <div className="space-y-1.5">
                                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                                        New Password
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="new-password"
                                            type={isVisible ? 'text' : 'password'}
                                            required
                                            minLength={8}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all duration-200"
                                            placeholder="Enter new password"
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

                                <div className="space-y-1.5">
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative group">
                                        <input
                                            id="confirm-password"
                                            type={isConfirmVisible ? 'text' : 'password'}
                                            required
                                            minLength={8}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all duration-200"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                        >
                                            {isConfirmVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className={`flex items-center gap-2 text-xs ${passwordValid ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
                                        <CheckCircleIcon className="w-4 h-4" /> Must be at least 8 characters
                                    </div>
                                    {confirmPassword.length > 0 && (
                                        <div className={`flex items-center gap-2 text-xs ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                            <CheckCircleIcon className="w-4 h-4" /> Passwords match
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !passwordValid || !passwordsMatch}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-crimson hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Resetting...' : 'Reset password'}
                                </button>
                            </>
                        )}

                        {successMsg && (
                            <button
                                type="button"
                                onClick={onSuccess}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-crimson hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Sign in now
                            </button>
                        )}
                    </form>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        <button
                            onClick={onBackToLogin}
                            className="font-bold text-crimson hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        >
                            Back to sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordFormView;
