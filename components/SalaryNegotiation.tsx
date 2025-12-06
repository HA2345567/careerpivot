import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Button, Badge } from './ui/Primitives';
import { DollarSign, Send, ShieldCheck, Copy, Check, Loader2, AlertTriangle, TrendingUp } from 'lucide-react';

interface Script {
  type: string;
  tone: string;
  content: string;
  riskLevel: string;
}

interface NegotiationResult {
  strategy: string;
  scripts: Script[];
}

export const SalaryNegotiation = () => {
  const [offerAmount, setOfferAmount] = useState(120000);
  const [targetAmount, setTargetAmount] = useState(140000);
  const [role, setRole] = useState('');
  const [leverage, setLeverage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<NegotiationResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerate = async () => {
    if (!role.trim()) return;
    
    setIsGenerating(true);
    setResult(null);

    try {
      if (process.env.API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `Act as a high-stakes negotiation coach.
        Role: ${role}
        Current Offer: $${offerAmount}
        Target: $${targetAmount}
        Leverage/Context: ${leverage || "Market research indicates higher range"}
        
        Generate a negotiation strategy and 3 distinct scripts:
        1. "The Collaborative Email": Gentle, inquiring, assumes positive intent. Best for initial counter.
        2. "The Firm Phone Script": Confident, anchored on data/value. Best for verbal calls.
        3. "The Walk-Away": Professional but definitive. Use if they won't budge and you have options.
        
        For each, analyze the "Risk Level" (Low/Medium/High).`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                strategy: { type: Type.STRING },
                scripts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      tone: { type: Type.STRING },
                      content: { type: Type.STRING },
                      riskLevel: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        });

        if (response.text) {
          setResult(JSON.parse(response.text));
        }
      } else {
        // Simulation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResult({
          strategy: "Focus on the 'Value Gap'. You are asking for a 16% increase. Justify this not by need, but by the ROI you bring to the specific problems identified in the interview.",
          scripts: [
            {
              type: "The Collaborative Email",
              tone: "Professional & Enthusiastic",
              riskLevel: "Low",
              content: `Hi [Name],\n\nI'm incredibly excited about the offer to join the ${role} team. The team's vision for [Project/Goal] is exactly where I want to contribute.\n\nReviewing the details, I'm aiming for a base of $${targetAmount.toLocaleString()} to align with the market and the specific [Skill/Experience] I'm bringing to lead this initiative. Is there flexibility in the budget to bridge this gap, perhaps through a sign-on bonus or equity adjustment if the base is fixed?\n\nBest,\n[Your Name]`
            },
            {
              type: "The Firm Phone Script",
              tone: "Confident & Data-Backed",
              riskLevel: "Medium",
              content: `"Thank you for championing this offer. I want to make this work. Based on the scope we discussed—specifically my responsibility for [Key Task]—and current market data for this level of impact, $${offerAmount.toLocaleString()} is below where I need to be. My target is $${targetAmount.toLocaleString()}. If we can get to that number, I'm ready to sign today."`
            },
            {
              type: "The Walk-Away (Last Resort)",
              tone: "Polite but Final",
              riskLevel: "High",
              content: `"I appreciate you going to bat for me. I've given this a lot of thought. Unless we can meet at $${targetAmount.toLocaleString()}, I unfortunately won't be able to accept. I have to make the best decision for my long-term career trajectory. I hope you understand."`
            }
          ]
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl min-h-[600px]">
      
      {/* Inputs */}
      <div className="lg:col-span-5 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-zinc-900/20">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Negotiation Script Generator
          </h3>
          <p className="text-zinc-400 text-sm mb-6">
            Don't leave money on the table. We'll write the exact words to say.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">They Offered</label>
              <div className="relative">
                 <span className="absolute left-3 top-2.5 text-zinc-400">$</span>
                 <input 
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2 pl-7 pr-4 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"
                 />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-500 uppercase tracking-wider">You Want</label>
              <div className="relative">
                 <span className="absolute left-3 top-2.5 text-zinc-400">$</span>
                 <input 
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2 pl-7 pr-4 text-white focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
                 />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Role Title</label>
            <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Product Designer"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Your Leverage / Context</label>
            <textarea 
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                placeholder="e.g. I have a competing offer from Google. I am currently underpaid but have 10 years experience."
                className="w-full h-24 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !role}
            className="w-full h-12"
          >
             {isGenerating ? (
               <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Strategizing...</>
            ) : (
               <><TrendingUp className="h-4 w-4 mr-2" /> Generate Scripts</>
            )}
          </Button>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
             <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
             <p className="text-xs text-amber-200/80">
                <strong>Warning:</strong> Always negotiate via phone if possible. Use email only to set up the call or confirm details.
             </p>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-7 bg-zinc-900/30 p-6 md:p-8 relative min-h-[500px] overflow-y-auto custom-scrollbar">
        {!result && !isGenerating && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-40">
                <ShieldCheck className="h-16 w-16 text-zinc-600 mb-4" />
                <p className="text-zinc-500 font-medium">Ready to increase your compensation.</p>
             </div>
        )}

        {isGenerating && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-20">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-zinc-400 animate-pulse">Analyzing leverage points...</p>
            </div>
        )}

        {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Strategy Summary</h4>
                    <p className="text-zinc-200 text-sm leading-relaxed">{result.strategy}</p>
                </div>

                <div className="space-y-4">
                    {result.scripts.map((script, idx) => (
                        <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-600 transition-all">
                            <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center">
                                <div>
                                    <h5 className="font-bold text-white text-sm">{script.type}</h5>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-zinc-400">{script.tone}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                            script.riskLevel === 'Low' ? 'border-emerald-900 text-emerald-400 bg-emerald-950' :
                                            script.riskLevel === 'Medium' ? 'border-amber-900 text-amber-400 bg-amber-950' :
                                            'border-red-900 text-red-400 bg-red-950'
                                        }`}>
                                            {script.riskLevel} Risk
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleCopy(script.content, idx)}
                                    className="p-2 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white"
                                    title="Copy to clipboard"
                                >
                                    {copiedIndex === idx ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                </button>
                            </div>
                            <div className="p-5 bg-zinc-950">
                                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line font-mono">
                                    {script.content}
                                </p>
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
