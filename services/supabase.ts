
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase URL or Anon Key. Database features will not work.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function createPaymentSession(priceId: string) {
    // In a real app, this calls a backend function/Edge Function to create a valid Stripe Checkout Session
    // to avoid exposing secret keys on the client.
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId }
    });

    if (error) throw error;
    return data;
}
