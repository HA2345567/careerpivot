
import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import { Button } from '../ui/Primitives';
import { X, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'signin' | 'signup';
    defaultEmail?: string;
}

export const AuthModal = ({ isOpen, onClose, defaultMode = 'signin', defaultEmail = '' }: AuthModalProps) => {
    const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verificationPending, setVerificationPending] = useState(false);

    React.useEffect(() => {
        if (isOpen && defaultEmail) {
            setEmail(defaultEmail);
        }
    }, [isOpen, defaultEmail]);

    // Reset state when modal opens/closes
    React.useEffect(() => {
        if (!isOpen) {
            setVerificationPending(false);
            setError(null);
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;

                // If signup was successful but no session, email verification is required
                if (data.user && !data.session) {
                    setVerificationPending(true);
                } else {
                    onClose();
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onClose();
            }
        } catch (err: any) {
            if (err.message && err.message.includes("Email not confirmed")) {
                setVerificationPending(true);
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (verificationPending) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
                    <p className="text-zinc-400 mb-8">
                        We've sent a confirmation link to <span className="text-white font-medium">{email}</span>.
                        Please click the link to verify your account and sign in.
                    </p>

                    <Button
                        onClick={() => {
                            setVerificationPending(false);
                            setMode('signin');
                        }}
                        className="w-full"
                    >
                        Back to Sign In
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-zinc-400 text-sm">
                        {mode === 'signin'
                            ? 'Enter your credentials to access your dashboard'
                            : 'Join CareerPivot to accelerate your career journey'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-400 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-6"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-500">
                    {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                        className="text-primary hover:underline font-medium"
                    >
                        {mode === 'signin' ? 'Sign up' : 'Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};
