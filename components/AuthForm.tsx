import React, { useState } from 'react';
import { authHelpers } from '../lib/supabase';

interface AuthFormProps {
    onAuthSuccess: () => void;
    language: 'ar' | 'en';
}

type AuthView = 'signin' | 'signup' | 'reset';

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess, language }) => {
    const [view, setView] = useState<AuthView>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const isRTL = language === 'ar';

    const texts = {
        ar: {
            signin: 'تسجيل الدخول',
            signup: 'إنشاء حساب',
            reset: 'إعادة تعيين كلمة المرور',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            confirmPassword: 'تأكيد كلمة المرور',
            submit: 'إرسال',
            switchToSignup: 'ليس لديك حساب؟ سجل الآن',
            switchToSignin: 'لديك حساب؟ سجل الدخول',
            forgotPassword: 'نسيت كلمة المرور؟',
            backToSignin: 'العودة لتسجيل الدخول',
            signInWithGoogle: 'تسجيل الدخول بواسطة Google',
            signInWithGithub: 'تسجيل الدخول بواسطة GitHub',
            orContinueWith: 'أو تابع باستخدام',
            passwordMismatch: 'كلمات المرور غير متطابقة',
            resetEmailSent: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني',
            invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
            accountCreated: 'تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني',
        },
        en: {
            signin: 'Sign In',
            signup: 'Sign Up',
            reset: 'Reset Password',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            submit: 'Submit',
            switchToSignup: "Don't have an account? Sign up",
            switchToSignin: 'Already have an account? Sign in',
            forgotPassword: 'Forgot password?',
            backToSignin: 'Back to sign in',
            signInWithGoogle: 'Sign in with Google',
            signInWithGithub: 'Sign in with GitHub',
            orContinueWith: 'Or continue with',
            passwordMismatch: 'Passwords do not match',
            resetEmailSent: 'Password reset link sent to your email',
            invalidCredentials: 'Invalid email or password',
            accountCreated: 'Account created successfully! Check your email',
        },
    };

    const t = texts[language];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (view === 'signin') {
                const { data, error } = await authHelpers.signIn(email, password);
                if (error) throw new Error(error.message);
                if (data.user) {
                    onAuthSuccess();
                }
            } else if (view === 'signup') {
                if (password !== confirmPassword) {
                    throw new Error(t.passwordMismatch);
                }
                const { data, error } = await authHelpers.signUp(email, password);
                if (error) throw new Error(error.message);
                setSuccess(t.accountCreated);
                setTimeout(() => setView('signin'), 3000);
            } else if (view === 'reset') {
                const { error } = await authHelpers.resetPassword(email);
                if (error) throw new Error(error.message);
                setSuccess(t.resetEmailSent);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        setError(null);
        setLoading(true);
        try {
            const { error } = await authHelpers.signInWithOAuth(provider);
            if (error) throw new Error(error.message);
        } catch (err: any) {
            setError(err.message || 'OAuth sign in failed');
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {view === 'signin' && t.signin}
                            {view === 'signup' && t.signup}
                            {view === 'reset' && t.reset}
                        </h2>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            {success}
                        </div>
                    )}

                    {/* OAuth Buttons */}
                    {view !== 'reset' && (
                        <div className="space-y-3 mb-6">
                            <button
                                type="button"
                                onClick={() => handleOAuthSignIn('google')}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="text-gray-700 font-medium">{t.signInWithGoogle}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleOAuthSignIn('github')}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-900 hover:bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span className="font-medium">{t.signInWithGithub}</span>
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">{t.orContinueWith}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="example@email.com"
                            />
                        </div>

                        {view !== 'reset' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.password}
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {view === 'signup' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.confirmPassword}
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    {t.submit}...
                                </span>
                            ) : (
                                t.submit
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center space-y-2">
                        {view === 'signin' && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setView('reset')}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    {t.forgotPassword}
                                </button>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setView('signup')}
                                        className="text-sm text-gray-600 hover:text-gray-700"
                                    >
                                        {t.switchToSignup}
                                    </button>
                                </div>
                            </>
                        )}
                        {view === 'signup' && (
                            <button
                                type="button"
                                onClick={() => setView('signin')}
                                className="text-sm text-gray-600 hover:text-gray-700"
                            >
                                {t.switchToSignin}
                            </button>
                        )}
                        {view === 'reset' && (
                            <button
                                type="button"
                                onClick={() => setView('signin')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {t.backToSignin}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
