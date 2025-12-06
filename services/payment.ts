
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
    if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
        stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
};

export async function checkoutSubscription(priceId: string) {
    const stripe = await getStripe();
    if (!stripe) throw new Error('Stripe failed to initialize');

    const { data: { session }, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId }
    });

    if (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }

    if (session) {
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: session.id });
        if (stripeError) throw stripeError;
    }
}
