
import { supabase } from './supabase';
import { RoadmapData, RoadmapPhase, RoadmapTask } from '../types';

export const roadmapService = {
    // Fetch the user's latest roadmap
    getRoadmap: async (): Promise<RoadmapData | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            if (error.code !== 'PGRST116') { // Not found code
                console.error('Error fetching roadmap:', error);
            }
            return null;
        }

        if (!data) return null;

        // Map DB snake_case to app camelCase
        return {
            id: data.id,
            summary: data.summary,
            phases: data.phases as RoadmapPhase[],
            lastUpdated: data.updated_at,
            goal: data.goal,
            constraints: data.constraints,
            timeline: data.timeline,
            hoursPerWeek: data.hours_per_week
        };
    },

    // Save (Create or Update)
    saveRoadmap: async (roadmap: RoadmapData): Promise<RoadmapData | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const payload = {
            user_id: user.id,
            goal: roadmap.goal || '',
            constraints: roadmap.constraints || '',
            timeline: roadmap.timeline || '',
            hours_per_week: roadmap.hoursPerWeek || 0,
            summary: roadmap.summary,
            phases: roadmap.phases,
            updated_at: new Date().toISOString()
        };

        let result;

        // Always upsert user's single roadmap for now, or insert new if building history
        // We'll simplisticly look for existing ID or insert new
        if (roadmap.id) {
            const { data, error } = await supabase
                .from('roadmaps')
                .update(payload)
                .eq('id', roadmap.id)
                .select()
                .single();
            if (error) throw error;
            result = data;
        } else {
            // Check if one exists to update instead of creating duplicates endlessly
            const existing = await roadmapService.getRoadmap();
            if (existing && existing.id) {
                const { data, error } = await supabase
                    .from('roadmaps')
                    .update(payload)
                    .eq('id', existing.id)
                    .select()
                    .single();
                if (error) throw error;
                result = data;
            } else {
                const { data, error } = await supabase
                    .from('roadmaps')
                    .insert(payload)
                    .select()
                    .single();
                if (error) throw error;
                result = data;
            }
        }

        return {
            id: result.id,
            summary: result.summary,
            phases: result.phases as RoadmapPhase[],
            lastUpdated: result.updated_at,
            goal: result.goal,
            constraints: result.constraints,
            timeline: result.timeline,
            hoursPerWeek: result.hours_per_week
        };
    },

    // Toggle task completion
    toggleTask: async (roadmap: RoadmapData, phaseIndex: number, taskId: string): Promise<RoadmapData | null> => {
        const newPhases = [...roadmap.phases];
        const phase = newPhases[phaseIndex];
        const taskIndex = phase.tasks.findIndex(t => t.id === taskId);

        if (taskIndex === -1) return null;

        // Toggle
        phase.tasks[taskIndex] = {
            ...phase.tasks[taskIndex],
            completed: !phase.tasks[taskIndex].completed
        };

        // Save entire roadmap update
        const updatedRoadmap = { ...roadmap, phases: newPhases };
        return await roadmapService.saveRoadmap(updatedRoadmap);
    }
};
