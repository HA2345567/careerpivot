
import { supabase } from './supabase';
import { CalculatorSettings } from '../types';

export interface FinancialPlan {
    savingsStrategy: string;
    expenseAudits: string[];
    safetyNetAssessment: string;
    bridgeTactics: string;
}

export interface SavedScenario extends CalculatorSettings {
    id: string;
    financialPlan: FinancialPlan | null;
    createdAt: string;
}

export const calculatorService = {
    // Get the most recent saved scenario
    getLatestScenario: async (): Promise<SavedScenario | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('salary_scenarios')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            currentSalary: data.current_salary,
            monthlyExpenses: data.monthly_expenses,
            transitionMonths: data.transition_months,
            targetSalary: data.target_salary,
            financialPlan: data.financial_plan,
            createdAt: data.created_at
        };
    },

    // Save a new scenario
    saveScenario: async (settings: CalculatorSettings, plan: FinancialPlan | null) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const payload = {
            user_id: user.id,
            current_salary: settings.currentSalary,
            monthly_expenses: settings.monthlyExpenses,
            transition_months: settings.transitionMonths,
            target_salary: settings.targetSalary,
            financial_plan: plan
        };

        const { data, error } = await supabase
            .from('salary_scenarios')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
