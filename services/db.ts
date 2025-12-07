
import { supabase } from './supabase';
import { UserContextType } from '../types';

export const db = {
    async upsertProfile(user: UserContextType) {
        if (!user.email) return; // Need email or auth ID to identify

        // In a real app, we'd use the auth session ID. 
        // Here we're using a loose mapping for demonstration if specific auth isn't fully enforced yet.

        // Check if we have an auth session
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
            const { error } = await supabase.from('profiles').upsert({
                id: session.user.id,
                email: session.user.email,
                full_name: user.name,
                current_job_title: user.currentRole,
                target_job_title: user.targetRole,
                current_salary: user.currentSalary,
                monthly_expenses: user.monthlyExpenses,
                burnout_level: user.burnoutLevel,
                start_date: user.startDate ? new Date(user.startDate).toISOString() : null,
                plan: user.plan,
                role: user.role
            });

            if (error) console.error('Error syncing profile:', error);
        }
    },

    async recordSubscription(userId: string, planId: string, status: string = 'active') {
        const { error } = await supabase.from('subscriptions').insert({
            user_id: userId,
            plan_id: planId,
            status: status,
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days mock
        });
        if (error) console.error('Error recording subscription:', error);
    }
};
