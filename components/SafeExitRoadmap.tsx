import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Button, Badge } from './ui/Primitives';
import { Map, ArrowRight, CheckCircle2, CalendarDays, Loader2, Target, Battery, Clock, ChevronDown } from 'lucide-react';

interface Phase {
  name: string;
  duration: string;
  focus: string;
  tasks: string[];
}

interface Roadmap {
  summary: string;
  phases: Phase[];
}

const TIMELINE_OPTIONS = [
  { value: '6', label: '6 Months', desc: 'Aggressive' },
  { value: '12', label: '1 Year', desc: 'Balanced' },
  { value: '24', label: '2 Years', desc: 'Safe' },
];

export const SafeExitRoadmap = () => {
  const [goal, setGoal] = useState('');
  const [timeline, setTimeline] = useState('12');
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    
    setIsGenerating(true);
    setRoadmap(null);

    try {
      if (process.env.API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Create a step-by-step career transition roadmap. Context: "${goal}". Timeline: ${timeline} months. Weekly availability: ${hoursPerWeek} hours. Break it down into 4 distinct phases.`;

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
                      tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                }
              }
            }
          }
        });

        if (response.text) setRoadmap(JSON.parse(response.text));
      } else {
        await new Promise(resolve => setTimeout(resolve, 2500));
        setRoadmap({
          summary: `A balanced ${timeline}-month strategy to pivot from your current role while maintaining financial stability, dedicating ${hoursPerWeek} hours/week.`,
          phases: [
            {
              name: "Phase 1: Audit & Discovery",
              duration: "Month 1-2",
              focus: "Identifying transferable assets and market gaps",
              tasks: ["Conduct 'Hidden Skills Audit'", "Informational interviews with 3 people", "Define financial runway"]
            },
            {
              name: "Phase 2: Strategic Upskilling",
              duration: "Month 3-5",
              focus: "Filling critical knowledge gaps efficiently",
              tasks: ["Complete 1 high-signal certification", "Build one portfolio project", "Rewrite LinkedIn headline"]
            },
            {
              name: "Phase 3: Network Activation",
              duration: "Month 6-9",
              focus: "Building advocates inside target companies",
              tasks: ["Engage with 5 target company posts weekly", "Attend 2 virtual roundtables", "Direct outreach to hiring managers"]
            },
            {
              name: "Phase 4: The Exit Execution",
              duration: "Month 10-12",
              focus: "Interviewing and negotiation",
              tasks: ["Tailor resumes", "Mock interviews focused on narrative", "Secure offer"]
            }
          ]
        });
      }
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-0 bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[600px] relative">
      
      {/* Left Column: Config */}
      <div className="lg:col-span-4 p-8 border-r border-white/5 bg-zinc-950/50 flex flex-col">
        <div className="mb-8">
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
              className="w-full h-32 bg-black border border-white/10 rounded-xl p-4 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-primary/50 resize-none text-sm transition-all shadow-inner"
              placeholder="e.g. Current: Senior Marketing Manager. Target: Product Marketing in Climate Tech."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Timeline</label>
            <div className="grid grid-cols-3 gap-2">
              {TIMELINE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTimeline(opt.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    timeline === opt.value 
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
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
            {isGenerating ? 'Building Strategy...' : 'Generate Plan'}
        </Button>
      </div>

      {/* Right Column: Visualization */}
      <div className="lg:col-span-8 bg-zinc-950 p-8 relative min-h-[500px] overflow-y-auto custom-scrollbar">
        {!roadmap && !isGenerating && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-30 select-none pointer-events-none">
              <Map className="h-24 w-24 text-zinc-700 mb-6 stroke-[1]" />
              <p className="text-zinc-500 font-medium">Define your goal to see the path.</p>
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

              {roadmap.phases.map((phase, idx) => (
                <div key={idx} className="relative pl-12 group">
                  {/* Node */}
                  <div className="absolute left-2 top-0 h-10 w-10 rounded-full bg-black border-4 border-zinc-800 group-hover:border-primary transition-colors z-10 flex items-center justify-center text-xs font-bold text-zinc-500 group-hover:text-white">
                    {idx + 1}
                  </div>
                  
                  {/* Card */}
                  <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-6 hover:bg-zinc-900/80 hover:border-white/10 transition-all backdrop-blur-sm shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="text-lg font-bold text-white mb-1">{phase.name}</h5>
                        <p className="text-xs text-primary font-mono">{phase.duration}</p>
                      </div>
                      <Badge variant="secondary" className="bg-white/5 text-zinc-400 border-white/5">
                        {phase.focus}
                      </Badge>
                    </div>

                    <ul className="space-y-3">
                      {phase.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-3 text-sm text-zinc-400 group/item">
                          <CheckCircle2 className="h-4 w-4 text-zinc-700 group-hover/item:text-emerald-500 mt-0.5 flex-shrink-0 transition-colors" />
                          <span className="group-hover/item:text-zinc-200 transition-colors">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
