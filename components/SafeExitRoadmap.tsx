
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Button, Badge } from './ui/Primitives';
import { Map, ArrowRight, CheckCircle2, CheckSquare, Square, CalendarDays, Loader2, Target, Battery, Clock, ChevronDown, Save, ShieldAlert, Sparkles } from 'lucide-react';
import { roadmapService } from '../services/roadmapService';
import { RoadmapData } from '../types';

const TIMELINE_OPTIONS = [
  { value: '6', label: '6 Months', desc: 'Aggressive' },
  { value: '12', label: '1 Year', desc: 'Balanced' },
  { value: '24', label: '2 Years', desc: 'Safe' },
];

export const SafeExitRoadmap = () => {
  const [goal, setGoal] = useState('');
  const [constraints, setConstraints] = useState('');
  const [timeline, setTimeline] = useState('12');
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    const load = async () => {
      const data = await roadmapService.getRoadmap();
      if (data) {
        setRoadmap(data);
        // Pre-fill inputs for regen if desired
        if (data.goal) setGoal(data.goal);
        if (data.constraints) setConstraints(data.constraints);
      }
    };
    load();
  }, []);

  const handleGenerate = async () => {
    if (!goal.trim()) return;

    setIsGenerating(true);
    // Don't clear previous roadmap immediately to avoid flash if error
    // setRoadmap(null); 

    try {
      let data: RoadmapData | null = null;
      if (process.env.API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Create a hyper-tactical, "Anti-Generic" career transition roadmap.
        
        USER IDENTITY:
        Goal: "${goal}"
        Timeline: ${timeline} months
        Hours/Week: ${hoursPerWeek}
        Constraints: "${constraints || 'None'}"

        THE RULES (Read carefully):
        1. NO FLUFF. No tasks like "Research industry" or "Network with people". 
        2. BE PRECISE. Instead of "Update Resume", say "Rewrite resume summary to include 3 keywords from Job X".
        3. BE REALISTIC. Tasks must fit into ${hoursPerWeek} hours/week.
        4. RESPECT CONSTRAINTS. If they have kids/mortgage, focus on "Shadow IT" (doing it while employed) and low-risk validation.
        5. Phases must represent the "Psychology of Exit": Validation -> Upskilling -> Outreaching -> Exiting.

        OUTPUT FORMAT:
        JSON with 4 distinct phases. Each task MUST be a specific deliverable.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                phases: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      focus: { type: Type.STRING },
                      tasks: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            completed: { type: Type.BOOLEAN }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          // Ensure tasks have IDs if AI forgot them, though schema enforces it mostly
          const phases = parsed.phases.map((p: any) => ({
            ...p,
            tasks: p.tasks.map((t: any, i: number) => ({
              id: t.id || `task_${Date.now()}_${i}`,
              text: t.text || t, // Fallback if string
              completed: false
            }))
          }));

          data = {
            summary: parsed.summary,
            phases,
            lastUpdated: new Date().toISOString(),
            goal,
            constraints,
            timeline,
            hoursPerWeek
          };
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 2500));
        data = {
          summary: `A balanced ${timeline}-month strategy to pivot into ${goal} while managing your identified constraints (${constraints || 'maintaining stability'}). Designed for ${hoursPerWeek} hours/week.`,
          phases: [
            {
              name: "Phase 1: Risk-Free Validation",
              duration: "Month 1-2",
              focus: "Testing market viability without leaving your job",
              tasks: [
                { id: 't1', text: "Conduct 3 'Hidden Skills' audits on job descriptions", completed: false },
                { id: 't2', text: "Informational interviews during lunch breaks", completed: false },
                { id: 't3', text: "Calculate exact financial runway", completed: false }
              ]
            },
            {
              name: "Phase 2: Strategic Upskilling",
              duration: "Month 3-5",
              focus: "Filling gaps that justify your target salary",
              tasks: [
                { id: 't4', text: "Complete 1 high-signal certification (evenings)", completed: false },
                { id: 't5', text: "Build a 'shadow portfolio' based on current work", completed: false },
                { id: 't6', text: "Update LinkedIn headline to signal pivot", completed: false }
              ]
            },
            {
              name: "Phase 3: Network Activation",
              duration: "Month 6-9",
              focus: "Generating internal referrals",
              tasks: [
                { id: 't7', text: "Engage with 5 target company posts weekly", completed: false },
                { id: 't8', text: "Attend 2 virtual roundtables", completed: false },
                { id: 't9', text: "Direct outreach to hiring managers", completed: false }
              ]
            },
            {
              name: "Phase 4: The Exit Execution",
              duration: "Month 10-12",
              focus: "Interviewing & Salary Negotiation",
              tasks: [
                { id: 't10', text: "Tailor resumes to specific roles", completed: false },
                { id: 't11', text: "Mock interviews focused on transferable narrative", completed: false },
                { id: 't12', text: "Secure offer before resigning", completed: false }
              ]
            }
          ],
          lastUpdated: new Date().toISOString(),
          goal, constraints, timeline, hoursPerWeek
        };
      }

      if (data) {
        // Save to Supabase
        const saved = await roadmapService.saveRoadmap(data);
        if (saved) setRoadmap(saved);
        else setRoadmap(data); // Fallback if save fails (e.g. offline)
      }
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleToggleTask = async (phaseIdx: number, taskId: string) => {
    if (!roadmap) return;

    // Optimistic update
    const newPhases = [...roadmap.phases];
    const task = newPhases[phaseIdx].tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      setRoadmap({ ...roadmap, phases: newPhases });

      // Background save
      await roadmapService.toggleTask(roadmap, phaseIdx, taskId);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-0 bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[600px] relative">

      {/* Left Column: Config */}
      <div className="lg:col-span-4 p-8 border-r border-white/5 bg-zinc-950/50 flex flex-col overflow-y-auto custom-scrollbar max-h-[800px]">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Roadmap Designer
          </h3>
          <p className="text-zinc-500 text-sm">Reverse-engineer your path to freedom.</p>
        </div>

        <div className="space-y-6 flex-grow">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Transition Goal</label>
            <textarea
              className="w-full h-24 bg-black border border-white/10 rounded-xl p-4 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-primary/50 resize-none text-sm transition-all shadow-inner"
              placeholder="e.g. Current: Senior Marketing Manager. Target: Product Marketing in Climate Tech."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              Constraints & Reality
              <ShieldAlert className="h-3 w-3 text-amber-500" />
            </label>
            <textarea
              className="w-full h-24 bg-black border border-white/10 rounded-xl p-4 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 resize-none text-sm transition-all shadow-inner"
              placeholder="e.g. I have a mortgage ($3k/mo) and 2 kids. I can't take a pay cut. I can only study on weekends."
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Timeline</label>
            <div className="grid grid-cols-3 gap-2">
              {TIMELINE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTimeline(opt.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${timeline === opt.value
                    ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_-5px_hsl(var(--primary)/0.5)]'
                    : 'bg-zinc-900 border-white/5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                    }`}
                >
                  <span className="font-bold text-sm">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Weekly Hours</label>
              <span className="text-primary font-mono font-bold text-xs bg-primary/10 px-2 py-0.5 rounded">
                {hoursPerWeek} hrs
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !goal.trim()}
          className="w-full h-12 mt-6 font-bold"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {isGenerating ? 'Building Strategy...' : (roadmap ? 'Regenerate Plan' : 'Generate Plan')}
        </Button>
      </div>

      {/* Right Column: Visualization */}
      <div className="lg:col-span-8 bg-zinc-950 p-8 relative min-h-[500px] overflow-y-auto custom-scrollbar">
        {!roadmap && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-30 select-none pointer-events-none">
            <Map className="h-24 w-24 text-zinc-700 mb-6 stroke-[1]" />
            <p className="text-zinc-500 font-medium">Define your goal & constraints to see the path.</p>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-400 font-mono text-sm animate-pulse">Calculating optimal path...</p>
          </div>
        )}

        {roadmap && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-2xl mx-auto">
            <div className="flex justify-end mb-4">
              <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                <Save className="h-3 w-3" /> Saved to Cloud {new Date(roadmap.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
            <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
              <h4 className="text-primary font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Target className="h-4 w-4" /> Strategy Brief
              </h4>
              <p className="text-zinc-200 text-sm leading-relaxed font-light">
                {roadmap.summary}
              </p>
            </div>

            <div className="relative pl-4 space-y-12">
              {/* Vertical Line */}
              <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-zinc-800 to-zinc-900"></div>

              {roadmap.phases.map((phase, idx) => {
                const completedTasks = phase.tasks.filter(t => t.completed).length;
                const totalTasks = phase.tasks.length;
                const progress = Math.round((completedTasks / totalTasks) * 100);
                const isPhaseComplete = progress === 100;

                return (
                  <div key={idx} className="relative pl-12 group">
                    {/* Node */}
                    <div className={`absolute left-2 top-0 h-10 w-10 rounded-full border-4 transition-all z-10 flex items-center justify-center text-xs font-bold ${isPhaseComplete
                      ? 'bg-primary border-primary text-white shadow-[0_0_15px_-3px_hsl(var(--primary))]'
                      : 'bg-black border-zinc-800 text-zinc-500 group-hover:border-primary group-hover:text-white'
                      }`}>
                      {isPhaseComplete ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-6 hover:bg-zinc-900/80 hover:border-white/10 transition-all backdrop-blur-sm shadow-xl">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="text-lg font-bold text-white mb-1">{phase.name}</h5>
                          <p className="text-xs text-primary font-mono">{phase.duration}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="secondary" className="bg-white/5 text-zinc-400 border-white/5">
                            {phase.focus}
                          </Badge>
                          <span className="text-[10px] text-zinc-500 font-mono">{completedTasks}/{totalTasks} Done</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1 w-full bg-zinc-800 rounded-full mb-4 overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
                      </div>

                      <ul className="space-y-3">
                        {phase.tasks.map((task, tIdx) => (
                          <li
                            key={task.id || tIdx}
                            onClick={() => handleToggleTask(idx, task.id)}
                            className={`flex items-start gap-3 text-sm p-2 rounded-lg cursor-pointer transition-colors ${task.completed
                              ? 'text-zinc-500 line-through bg-black/20'
                              : 'text-zinc-300 hover:bg-white/5'
                              }`}
                          >
                            <div className={`mt-0.5 transition-colors ${task.completed ? 'text-primary' : 'text-zinc-700'}`}>
                              {task.completed ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                            </div>
                            <span className="leading-snug select-none">{task.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
