import React, { useState } from 'react';
import { authService } from '../../services/authService';

interface PasswordResetViewProps {
    onBack: () => void;
}

const PasswordResetView: React.FC<PasswordResetViewProps> = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        setMessage(null);

        try {
            const msg = await authService.forgotPassword({ email });
            setMessage(msg || 'Check your email for a password reset link.');
        } catch (error: any) {
            console.error('Password reset error:', error);
            setErrorMsg(error.message || 'Failed to send reset email.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif tracking-tight">
                    Reset your password
                </h2>
                <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                    Enter your email and we'll send you a reset link.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                        {errorMsg}
                    </div>
                )}
                {message && (
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">
                        {message}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                        Email
                    </label>
                    <input
                        id="reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all duration-200"
                        placeholder="e.g. alex@example.com"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-crimson hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crimson transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Sending...' : 'Send reset link'}
                </button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                <button
                    onClick={onBack}
                    className="font-bold text-crimson hover:text-red-700 dark:hover:text-red-400 transition-colors"
                >
                    Back to sign in
                </button>
            </p>
        </div>
    );
};

export default PasswordResetView;
