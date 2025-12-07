
import { supabase } from './supabase';

export interface Skill {
    name: string;
    description: string;
}

export interface Role {
    title: string;
    matchReason: string;
}

export interface AnalysisResult {
    skills: Skill[];
    roles: Role[];
}

export const skillsService = {
    getLatestAudit: async (): Promise<{ input: string; result: AnalysisResult } | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('skills_audits')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) return null;

        return {
            input: data.input_text,
            result: data.analysis_result as AnalysisResult
        };
    },

    saveAudit: async (input: string, result: AnalysisResult) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from('skills_audits')
            .insert({
                user_id: user.id,
                input_text: input,
                analysis_result: result
            });

        if (error) throw error;
    }
};
