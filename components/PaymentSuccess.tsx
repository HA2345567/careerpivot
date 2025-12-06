
import React, { useEffect, useState } from 'react';
import { Button, Card } from './ui/Primitives';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../services/supabase';

export const PaymentSuccess = ({ onContinue }: { onContinue: () => void }) => {
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

    useEffect(() => {
        const verifyPayment = async () => {
            const params = new URLSearchParams(window.location.search);
            const sessionId = params.get('session_id');

            if (!sessionId) {
                // If no session ID is present, we cannot verify. 
                // In demo mode, we might want to fail or just show a warning.
                // For this strict fix, we fail.
                console.error("No session_id found in URL");
                setStatus('error');
                return;
            }

            try {
                // Call our Edge Function to verify with Stripe
                const { data, error } = await supabase.functions.invoke('verify-checkout-session', {
                    body: { sessionId }
                });

                if (error || !data?.valid) {
                    throw new Error('Payment verification failed');
                }

                setStatus('success');

                // Optional: Sync with DB here if not handled by webhook
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // await supabase.from('subscriptions').upsert({ ... })
                }
            } catch (err) {
                console.error("Verification error:", err);
                setStatus('error');
            }
        };

        verifyPayment();
    }, []);

    if (status === 'verifying') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="max-w-md w-full p-8 text-center border-white/10 bg-zinc-900/50 backdrop-blur">
                    <div className="flex justify-center mb-6">
                        <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Verifying Payment...</h2>
                    <p className="text-zinc-400">Please wait while we confirm your subscription.</p>
                </Card>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="max-w-md w-full p-8 text-center border-red-500/20 bg-zinc-900/50 backdrop-blur">
                    <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center">
                            <span className="text-3xl text-red-500 font-bold">!</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                    <p className="text-zinc-400 mb-8">
                        We couldn't confirm your payment. If you were charged, please contact support.
                    </p>
                    <Button onClick={() => window.location.href = '/'} className="w-full">
                        Return to Home
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="max-w-md w-full p-8 text-center border-primary/20 bg-zinc-900/50 backdrop-blur animate-in zoom-in-95 duration-300">
                <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-primary" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                <p className="text-zinc-400 mb-8">
                    You have successfully upgraded your CareerPivot plan. Your account has been instantly updated.
                </p>

                <Button onClick={onContinue} className="w-full gap-2">
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
            </Card>
        </div>
    );
};
