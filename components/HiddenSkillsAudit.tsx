import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Button, Card, Badge } from './ui/Primitives';
import { Search, Sparkles, ArrowRight, BrainCircuit, Briefcase, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

interface Skill {
  name: string;
  description: string;
}

interface Role {
  title: string;
  matchReason: string;
}

interface AnalysisResult {
  skills: Skill[];
  roles: Role[];
}

export const HiddenSkillsAudit = () => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { skillsService } = await import('../services/skillsService');
        const data = await skillsService.getLatestAudit();
        if (data) {
          setInput(data.input);
          setResult(data.result);
        }
      } catch (e) {
        console.error("Failed to load skills audit", e);
      }
    };
    load();
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Check if API Key is available
      if (process.env.API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Role: You are an elite Executive Headhunter rewriting a candidate's profile for a pivot.
          
          Input: "${input}"
          
          Your Goal:
          1. Ignore the obvious. Dig deeper.
          2. Translate "duties" into "High-Value Assets". (e.g. instead of "managed team", say "Operational Scalability").
          3. NO GENERIC SOFT SKILLS. If you say "Communication", I will fire you. Say "Cross-Functional Negotiation" or "Executive Storytelling".
          4. Suggest 3 "Wildcard" roles—jobs they haven't thought of but are 80% qualified for.
          `,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                skills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING }
                    }
                  }
                },
                roles: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      matchReason: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        });

        if (response.text) {
          const parsedResult = JSON.parse(response.text);
          setResult(parsedResult);

          // Save persistence
          const { skillsService } = await import('../services/skillsService');
          await skillsService.saveAudit(input, parsedResult);

        } else {
          throw new Error("No response from AI");
        }

      } else {
        // Fallback Simulation for Demo if no API Key
        console.warn("No API_KEY found. Using simulation mode.");
        await new Promise(resolve => setTimeout(resolve, 2000)); // Fake network delay

        // Simple heuristic mock based on input content
        const isTech = input.toLowerCase().includes('code') || input.toLowerCase().includes('engineer') || input.toLowerCase().includes('software');
        const isSales = input.toLowerCase().includes('sales') || input.toLowerCase().includes('revenue') || input.toLowerCase().includes('client');

        let simResult: AnalysisResult;

        if (isTech) {
          simResult = {
            skills: [
              { name: "Systems Thinking", description: "Ability to visualize complex interdependencies and optimize workflows." },
              { name: "Algorithmic Problem Solving", description: "Breaking down massive challenges into executable, logical steps." },
              { name: "Technical Translation", description: "Bridging the gap between complex engineering concepts and business value." },
              { name: "Rapid Adaptation", description: "Mastering new tools and frameworks under pressure." }
            ],
            roles: [
              { title: "Technical Product Manager", matchReason: "Leverages your understanding of build feasibility." },
              { title: "Developer Advocate", matchReason: "Uses your empathy for the builder experience." },
              { title: "Solutions Architect", matchReason: "Applies your systems thinking to client problems." }
            ]
          };
        } else if (isSales) {
          simResult = {
            skills: [
              { name: "Strategic Negotiation", description: "Navigating high-stakes discussions to find mutual value." },
              { name: "Relationship Architecture", description: "Building and maintaining complex webs of stakeholder influence." },
              { name: "Revenue Forecasting", description: "Using data signals to predict future business outcomes." },
              { name: "Resilience Modeling", description: "Thriving in high-rejection environments." }
            ],
            roles: [
              { title: "Partnerships Lead", matchReason: "Scales your ability to build alliances." },
              { title: "Customer Success Director", matchReason: "Focuses on long-term value over transactional wins." },
              { title: "Fundraising/Development", matchReason: "Translates your persuasion skills to mission-driven capital." }
            ]
          };
        } else {
          // Generic high-level professional fallback
          simResult = {
            skills: [
              { name: "Cross-Functional Leadership", description: "Aligning diverse teams (marketing, product, sales) towards a single metric." },
              { name: "Crisis Management", description: "Maintaining operational stability during periods of high uncertainty." },
              { name: "Data-Driven Storytelling", description: "Turning raw analytics into compelling narratives for executive buy-in." },
              { name: "Resource Optimization", description: "Doing more with less by identifying and removing process waste." }
            ],
            roles: [
              { title: "Chief of Staff", matchReason: "Perfect for your ability to handle diverse, high-priority problems." },
              { title: "Product Operations Manager", matchReason: "Leverages your knack for process and efficiency." },
              { title: "Program Director", matchReason: "Utilizes your experience managing complex timelines and stakeholders." }
            ]
          };
        }

        setResult(simResult);
        // Save simulation
        const { skillsService } = await import('../services/skillsService');
        await skillsService.saveAudit(input, simResult);
      }
    } catch (err) {
      console.error(err);
      setError("We couldn't analyze your profile right now. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl min-h-[500px]">

      {/* Left Column: Input */}
      <div className="lg:col-span-5 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Hidden Skills Audit
          </h3>
          <p className="text-zinc-400 text-sm mb-6">
            Paste your LinkedIn "About" section, a bio, or just describe what you do every day. We'll find the gold.
          </p>
        </div>

        <div className="flex-grow flex flex-col gap-4">
          <textarea
            className="w-full h-48 bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
            placeholder="e.g., I manage a team of 5 sales reps, handle quarterly reporting using Salesforce, and deal with angry clients..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !input.trim()}
            className="w-full h-12 text-base shadow-lg shadow-primary/20 relative overflow-hidden group"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Analyzing Profile...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Reveal My Hidden Skills
              </>
            )}
            {!isAnalyzing && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />}
          </Button>

          {error && (
            <div className="text-red-400 text-sm flex items-center gap-2 mt-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="lg:col-span-7 bg-zinc-900/30 p-6 md:p-8 relative">
        {!result && !isAnalyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-50">
            <BrainCircuit className="h-16 w-16 text-zinc-700 mb-4" />
            <h4 className="text-xl font-semibold text-zinc-500">Ready to Scan</h4>
            <p className="text-zinc-600 max-w-sm">
              Your current job title hides your true value. Let's uncover what you're actually capable of.
            </p>
          </div>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-zinc-950/50 backdrop-blur-sm z-10">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-zinc-800 border-t-primary animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>
            <h4 className="text-xl font-semibold text-white mt-6 animate-pulse">Deconstructing your experience...</h4>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Detected Skills */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Detected Transferable Assets</h4>
                <Badge variant="secondary" className="bg-emerald-950 text-emerald-400 border-emerald-900">
                  {result.skills.length} Skills Found
                </Badge>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {result.skills.map((skill, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl hover:border-primary/50 transition-colors group">
                    <h5 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{skill.name}</h5>
                    <p className="text-xs text-zinc-500 leading-relaxed">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-zinc-800/50" />

            {/* Suggested Pivots */}
            <div>
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Recommended Pivot Paths</h4>
              <div className="space-y-3">
                {result.roles.map((role, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 rounded-lg bg-zinc-800/20 border border-transparent hover:bg-zinc-800/40 hover:border-zinc-700 transition-all">
                    <div className="mt-1 h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 text-zinc-400">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-semibold text-zinc-200">{role.title}</h5>
                      <p className="text-sm text-zinc-500">{role.matchReason}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-600 mt-2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <p className="text-xs text-center text-zinc-600">
                *AI analysis based on provided input. Full platform includes validated assessments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
