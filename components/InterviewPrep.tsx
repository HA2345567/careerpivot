import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Button, Badge } from './ui/Primitives';
import { Mic, MessageSquare, Briefcase, ArrowRight, UserCircle2, Sparkles, Loader2, Quote } from 'lucide-react';

interface PrepResult {
  pivotPitch: string;
  transferableSkill: {
    name: string;
    explanation: string;
  };
  whyTheSwitch: string;
  starExample: string;
}

export const InterviewPrep = () => {
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PrepResult | null>(null);

  const handleGenerate = async () => {
    if (!currentRole.trim() || !targetRole.trim()) return;
    
    setIsGenerating(true);
    setResult(null);

    try {
      if (process.env.API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `Act as an expert career coach for a professional pivoting from '${currentRole}' to '${targetRole}'. 
        
        Generate an interview cheat sheet containing:
        1. "Pivot Pitch": A 2-sentence elevator pitch framing the transition as a strategic evolution, not a restart.
        2. "Transferable Skill": The single most valuable skill from the old role that applies to the new one, and why.
        3. "Why The Switch": A concise, confident answer to "Why are you leaving your current field?".
        4. "STAR Example": A brief example scenario (Situation, Task, Action, Result) that uses the old role context to prove competence for the new role.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                pivotPitch: { type: Type.STRING },
                transferableSkill: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  }
                },
                whyTheSwitch: { type: Type.STRING },
                starExample: { type: Type.STRING }
              }
            }
          }
        });

        if (response.text) {
          setResult(JSON.parse(response.text));
        }
      } else {
        // Simulation Mode
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResult({
          pivotPitch: `My background in ${currentRole} required managing high-stakes client expectations, which has perfectly prepared me for ${targetRole} where clear communication and prioritization are critical for product success.`,
          transferableSkill: {
            name: "Stakeholder Empathy",
            explanation: "You've spent years anticipating needs before they are spoken. In your new role, this translates directly to user-centric design and requirement gathering."
          },
          whyTheSwitch: "I've mastered the execution side of the business in my current role. Now, I'm eager to move upstream into strategy where I can influence the 'why' and 'how' before decisions are made, using my ground-level experience to ensure viability.",
          starExample: "Situation: In my previous role, a client demanded a feature we couldn't build. \nAction: I facilitated a workshop to uncover their underlying need rather than saying 'no'. \nResult: We built a simpler solution that solved 90% of the problem, saving 3 weeks of dev time—skills I'll use to manage scope creep here."
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl min-h-[500px]">
      
      {/* Left Column: Input */}
      <div className="lg:col-span-4 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-center bg-zinc-900/20">
        <div className="mb-8">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <Mic className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            The Pivot Prep
          </h3>
          <p className="text-zinc-400 text-sm">
            Don't let them label you "inexperienced." Frame your past as your unfair advantage.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Current Role</label>
            <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input 
                    type="text" 
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="e.g. High School Teacher"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="bg-zinc-800 rounded-full p-1.5 border border-zinc-700">
                <ArrowRight className="h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Target Role</label>
            <div className="relative">
                <Sparkles className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input 
                    type="text" 
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Corporate Trainer"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !currentRole || !targetRole}
            className="w-full h-12 mt-2"
          >
            {isGenerating ? (
               <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Coaching...</>
            ) : (
               <><MessageSquare className="h-4 w-4 mr-2" /> Generate Script</>
            )}
          </Button>
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="lg:col-span-8 bg-zinc-950 p-6 md:p-8 relative">
        {/* Empty State */}
        {!result && !isGenerating && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 opacity-40 select-none">
              <UserCircle2 className="h-20 w-20 text-zinc-700 mb-6" />
              <h4 className="text-xl font-medium text-zinc-500">Your AI Interview Coach is waiting.</h4>
              <p className="text-zinc-600 mt-2 max-w-sm">Enter your transition path to get a custom script for handling objections.</p>
           </div>
        )}

        {/* Loading */}
        {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-zinc-950/80 backdrop-blur-sm">
                <div className="flex items-center gap-1 mb-4">
                    <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-primary rounded-full animate-bounce"></span>
                </div>
                <p className="text-zinc-400 font-mono text-sm">Formulating your narrative...</p>
            </div>
        )}

        {/* Content */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 h-full overflow-y-auto custom-scrollbar">
            
            {/* The Pitch */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 relative">
                <Quote className="absolute top-4 right-4 h-12 w-12 text-primary/10 rotate-180" />
                <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    The Pivot Pitch
                </h4>
                <p className="text-lg text-zinc-200 leading-relaxed font-medium">
                    "{result.pivotPitch}"
                </p>
                <p className="text-xs text-primary/60 mt-3 uppercase tracking-wider font-bold">Use this in your "Tell me about yourself" answer</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Transferable Skill */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                    <h5 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Your Secret Weapon</h5>
                    <div className="text-white font-bold text-lg mb-2">{result.transferableSkill.name}</div>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        {result.transferableSkill.explanation}
                    </p>
                </div>

                {/* Objection Handling */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                     <h5 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Answering "Why Switch?"</h5>
                     <p className="text-zinc-300 text-sm leading-relaxed italic">
                        "{result.whyTheSwitch}"
                    </p>
                </div>
            </div>

            {/* STAR Example */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Badge variant="secondary">Behavioral Example</Badge>
                </h4>
                <div className="space-y-2">
                    <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                        {result.starExample}
                    </p>
                </div>
            </div>

            <div className="text-center pt-2">
                <Button variant="ghost" size="sm" onClick={() => setResult(null)} className="text-zinc-500 hover:text-white">
                    Start Over
                </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
