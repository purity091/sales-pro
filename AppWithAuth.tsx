import React, { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/AuthForm';
import App from './App';
import { Language } from './types';

const AppWithAuth: React.FC = () => {
    const { user, loading, authenticated, signOut } = useAuth();
    const [language, setLanguage] = useState<'ar' | 'en'>('ar');

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 animate-pulse shadow-2xl">
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">سيريَن سيلز برو AI</h2>
                    <div className="flex items-center gap-2 justify-center mt-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Not authenticated - show login
    if (!authenticated) {
        return <AuthForm onAuthSuccess={() => { }} language={language} />;
    }

    // Authenticated - show main app with user info
    return (
        <div className="relative">
            {/* User Info Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                            <svg
                                className="w-4 h-4"
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
                        <div className="text-sm">
                            <div className="font-bold">{user?.email}</div>
                            <div className="text-xs text-white/80">مرحباً بك في سيريَن سيلز برو</div>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-semibold transition-all border border-white/30 flex items-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        تسجيل الخروج
                    </button>
                </div>
            </div>

            {/* Main App */}
            <div className="pt-12">
                <App />
            </div>
        </div>
    );
};

export default AppWithAuth;
