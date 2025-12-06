
import React, { useState, useMemo, useEffect } from 'react';
import { Button, Card, Badge } from './ui/Primitives';
import { AlertTriangle, CheckCircle2, Wallet, ArrowRight, RefreshCw, Lock, Save, Loader2, FileText, PieChart, TrendingDown, Shield, Activity } from 'lucide-react';
import { storage } from '../services/storage';
import { GoogleGenAI, Type } from "@google/genai";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
};

// Premium Custom Slider Component
const Slider = ({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  unit = '', 
  prefix = '' 
}: { 
  label: string; 
  value: number; 
  min: number; 
  max: number; 
  step: number; 
  onChange: (val: number) => void;
  unit?: string;
  prefix?: string;
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  return (
    <div className="group space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{label}</label>
        <div className="font-mono text-white font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-md text-sm min-w-[80px] text-right shadow-sm">
          {prefix}{value.toLocaleString()}{unit}
        </div>
      </div>
      
      <div className="relative w-full h-8 flex items-center cursor-pointer">
        {/* Track Background */}
        <div className="absolute w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
             {/* Active Fill */}
            <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-500" 
                style={{ width: `${percentage}%` }}
            />
        </div>
        
        {/* Range Input (Invisible overlay) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />
        
        {/* Custom Thumb */}
        <div 
            className="absolute h-5 w-5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10 pointer-events-none transition-transform duration-75 ease-out group-hover:scale-110 border-2 border-indigo-500"
            style={{ left: `calc(${percentage}% - 10px)` }} 
        />
      </div>
    </div>
  );
};

interface FinancialPlan {
  savingsStrategy: string;
  expenseAudits: string[];
  safetyNetAssessment: string;
  bridgeTactics: string;
}

export const SalaryBridgeCalculator = () => {
  const [currentSalary, setCurrentSalary] = useState(150000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(6000);
  const [transitionMonths, setTransitionMonths] = useState(6);
  const [targetSalary, setTargetSalary] = useState(110000);
  const [saved, setSaved] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [financialPlan, setFinancialPlan] = useState<FinancialPlan | null>(null);

  // Load from storage on mount
  useEffect(() => {
    const data = storage.getCalculatorSettings();
    if (data) {
        setCurrentSalary(data.currentSalary);
        setMonthlyExpenses(data.monthlyExpenses);
        setTransitionMonths(data.transitionMonths);
        setTargetSalary(data.targetSalary);
    }
  }, []);

  // Auto-save logic
  useEffect(() => {
    const timer = setTimeout(() => {
        storage.saveCalculatorSettings({
            currentSalary,
            monthlyExpenses,
            transitionMonths,
            targetSalary
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentSalary, monthlyExpenses, transitionMonths, targetSalary]);

  const { bridgeAmount, payCutImpact, isSafe, runwayScore, estimatedNet } = useMemo(() => {
    const TAX_RATE = 0.30;
    const bridge = monthlyExpenses * transitionMonths;
    const monthlyNetTarget = (targetSalary * (1 - TAX_RATE)) / 12;
    const gap = monthlyNetTarget - monthlyExpenses;
    
    // Simple Score: 0-100 based on safety
    let score = 50; 
    if (gap >= 0) score += 30;
    else score -= (Math.abs(gap) / monthlyExpenses) * 50;
    
    // Penalize high burn rate relative to savings needed
    if (bridge > currentSalary * 0.5) score -= 20;

    return {
      bridgeAmount: bridge,
      payCutImpact: gap,
      isSafe: gap >= 0,
      runwayScore: Math.max(0, Math.min(100, score)),
      estimatedNet: monthlyNetTarget
    };

  }, [monthlyExpenses, transitionMonths, targetSalary, currentSalary]);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setFinancialPlan(null);

    try {
      if (process.env.API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Generate a personalized financial transition plan for a career pivot.
        
        DATA:
        Current Salary: $${currentSalary}
        Monthly Expenses (Burn): $${monthlyExpenses}
        Runway Needed: ${transitionMonths} months
        Target Future Salary: $${targetSalary}
        Calculated Gap/Surplus: ${payCutImpact >= 0 ? 'Surplus' : 'Deficit'} of $${Math.abs(payCutImpact)}/mo
        
        OUTPUT REQUIREMENTS:
        1. "Savings Strategy": Concrete advice on how much to save monthly starting NOW to hit the runway goal ($${bridgeAmount}).
        2. "Expense Audits": 3 specific, actionable areas to cut costs temporarily during the transition.
        3. "Safety Net Assessment": Honest risk evaluation of the ${transitionMonths} month timeline.
        4. "Bridge Tactics": 1 creative way to bridge the income gap if the new role pays less.
        `;
        
        const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: prompt,
             config: {
                 responseMimeType: 'application/json',
                 responseSchema: {
                     type: Type.OBJECT,
                     properties: {
                         savingsStrategy: { type: Type.STRING },
                         expenseAudits: { type: Type.ARRAY, items: { type: Type.STRING } },
                         safetyNetAssessment: { type: Type.STRING },
                         bridgeTactics: { type: Type.STRING }
                     }
                 }
             }
        });
        
        if (response.text) {
            setFinancialPlan(JSON.parse(response.text));
        }

      } else {
        // Simulation for Demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        setFinancialPlan({
            savingsStrategy: `To secure your ${transitionMonths}-month runway of ${formatCurrency(bridgeAmount)}, you need to set aside approximately ${formatCurrency(bridgeAmount / 6)}/month for the next 6 months before quitting.`,
            expenseAudits: [
                "Pause all aggressive investment contributions (401k match only) to maximize liquidity.",
                "Audit subscription services and negotiate recurring bills (internet, insurance).",
                "Reduce discretionary dining/travel budget by 40% temporarily."
            ],
            safetyNetAssessment: isSafe 
                ? "Your target salary covers your burn rate, making this a Low Risk transition." 
                : "High Risk: Your burn rate exceeds your target income. You will need to dip into savings monthly.",
            bridgeTactics: "Consider negotiating a signing bonus or taking on a short-term advisory contract to buffer the lower base salary."
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-0 bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group">
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none"></div>

      {/* Left Column: Inputs */}
      <div className="lg:col-span-7 p-8 md:p-10 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950/50">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <Wallet className="h-6 w-6 text-primary" />
              Configuration
            </h3>
            <p className="text-zinc-500 text-sm">Model your financial reality to find your safe exit window.</p>
          </div>
          <div className={`transition-all duration-300 flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full border ${saved ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 opacity-100' : 'opacity-0'}`}>
            <Save className="h-3 w-3" />
            Saved
          </div>
        </div>

        <div className="space-y-10 flex-grow">
          <Slider 
            label="Current Annual Salary" 
            value={currentSalary} 
            min={50000} 
            max={500000} 
            step={5000} 
            prefix="$"
            onChange={setCurrentSalary} 
          />
          
          <Slider 
            label="Monthly Burn Rate (Expenses)" 
            value={monthlyExpenses} 
            min={2000} 
            max={20000} 
            step={500} 
            prefix="$"
            onChange={setMonthlyExpenses} 
          />

          <div className="p-6 rounded-xl bg-white/5 border border-white/5 space-y-8">
             <div className="flex items-center gap-2 mb-4">
                <Lock className="h-4 w-4 text-zinc-400" />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Transition Variables</span>
             </div>
             <Slider 
              label="Transition Runway (Months Off)" 
              value={transitionMonths} 
              min={1} 
              max={24} 
              step={1} 
              unit=" mo"
              onChange={setTransitionMonths} 
            />
            <Slider 
                label="Target New Salary" 
                value={targetSalary} 
                min={40000} 
                max={300000} 
                step={5000} 
                prefix="$"
                onChange={setTargetSalary} 
            />
          </div>
        </div>

        {/* Live Projection Footer */}
        <div className="mt-8 pt-6 border-t border-white/5">
            <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/5 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -right-6 -top-6 h-24 w-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
                
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity className="h-3 w-3" /> 
                    Live Monthly Projection
                </h4>
                
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Est. Target Net Income</span>
                        <span className="text-zinc-300 font-mono">+{formatCurrency(estimatedNet)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Monthly Burn</span>
                        <span className="text-rose-400 font-mono">-{formatCurrency(monthlyExpenses)}</span>
                    </div>
                    <div className="h-px bg-white/10 my-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 font-medium text-sm">Net Cashflow</span>
                        <span className={`text-lg font-bold font-mono ${payCutImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {payCutImpact >= 0 ? '+' : ''}{formatCurrency(payCutImpact)}
                        </span>
                    </div>
                </div>
            </div>
            <p className="text-[10px] text-zinc-600 mt-3 text-center">
                *Values estimated post-tax (approx 30%).
            </p>
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="lg:col-span-5 bg-gradient-to-b from-zinc-900 to-black p-8 md:p-10 flex flex-col relative overflow-hidden h-full overflow-y-auto custom-scrollbar">
        
        {/* Background FX */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none mix-blend-screen" />

        <div className="relative z-10 space-y-8 flex-shrink-0">
          
          {/* Freedom Number */}
          <div className="text-center lg:text-left">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Required Freedom Capital</div>
            <div className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-2 tabular-nums">
              {formatCurrency(bridgeAmount)}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-xs text-zinc-300">Savings needed for {transitionMonths} months</span>
            </div>
          </div>

          {/* Status Card */}
          <div className={`p-6 rounded-2xl border backdrop-blur-md transition-colors duration-500 ${isSafe ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'}`}>
            <div className="flex items-start gap-4">
              {isSafe ? (
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 text-rose-400">
                    <AlertTriangle className="h-6 w-6" />
                </div>
              )}
              <div>
                <h4 className={`text-lg font-bold ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isSafe ? "Green Light: Sustainable" : "Caution: Gap Detected"}
                </h4>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  {isSafe 
                    ? `Your target salary generates a surplus of ${formatCurrency(payCutImpact)}/mo. You can rebuild savings immediately.`
                    : `You will have a monthly deficit of ${formatCurrency(Math.abs(payCutImpact))}. Consider extending your timeline or adjusting lifestyle.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex-shrink-0">
          <Button 
            className="w-full h-14 text-base font-bold shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_-5px_rgba(99,102,241,0.6)]"
            onClick={handleGeneratePlan}
            disabled={isGenerating}
          >
             {isGenerating ? (
                <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Calculating...
                </>
             ) : (
                <>
                    Generate Full Financial Plan
                    <ArrowRight className="h-5 w-5 ml-2" />
                </>
             )}
          </Button>
          <div className="flex justify-center gap-6 mt-6">
             <div className="text-center">
                <div className="text-[10px] text-zinc-600 uppercase font-bold">Risk Score</div>
                <div className="text-lg font-mono text-zinc-300 font-bold">{100 - Math.round(runwayScore)}/100</div>
             </div>
             <div className="w-px bg-white/10 h-10"></div>
             <div className="text-center">
                <div className="text-[10px] text-zinc-600 uppercase font-bold">Est. Savings Time</div>
                <div className="text-lg font-mono text-zinc-300 font-bold">~{Math.max(1, Math.ceil(bridgeAmount / Math.max(1, (currentSalary/12 - monthlyExpenses))))} mo</div>
             </div>
          </div>
        </div>

        {/* Generated Plan Section */}
        {financialPlan && (
            <div className="relative z-10 mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                <div className="flex items-center gap-4">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Your Custom Strategy</div>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {/* Main Strategy Card */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
                    <div className="relative rounded-xl bg-zinc-950 p-6 border border-white/10">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]">
                                <PieChart className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Savings Strategy</h4>
                                <p className="text-xs text-zinc-500">To reach {formatCurrency(bridgeAmount)}</p>
                            </div>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed font-medium pl-1">
                            {financialPlan.savingsStrategy}
                        </p>
                    </div>
                </div>

                {/* Cuts Section */}
                <div className="rounded-xl bg-zinc-900/40 border border-white/5 p-6">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-4">
                        <TrendingDown className="h-4 w-4" /> Immediate Expense Audits
                    </h4>
                    <div className="grid gap-3">
                        {financialPlan.expenseAudits.map((item, i) => (
                            <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-black/20 border border-white/5 hover:bg-black/40 transition-colors">
                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                <span className="text-sm text-zinc-400 leading-snug">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Two Column Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-zinc-900/40 border border-white/5 p-5 hover:border-amber-500/20 transition-colors group/risk">
                         <div className="flex items-center gap-2 mb-3">
                            <Shield className="h-4 w-4 text-amber-500 group-hover/risk:text-amber-400 transition-colors" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover/risk:text-zinc-300">Risk Assessment</h4>
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-400 group-hover/risk:text-zinc-300 transition-colors border-l border-amber-500/20 pl-3">
                            {financialPlan.safetyNetAssessment}
                        </p>
                    </div>

                    <div className="rounded-xl bg-zinc-900/40 border border-white/5 p-5 hover:border-emerald-500/20 transition-colors group/bridge">
                         <div className="flex items-center gap-2 mb-3">
                            <RefreshCw className="h-4 w-4 text-emerald-500 group-hover/bridge:text-emerald-400 transition-colors" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover/bridge:text-zinc-300">Bridge Tactic</h4>
                        </div>
                        <p className="text-xs leading-relaxed text-zinc-400 group-hover/bridge:text-zinc-300 transition-colors border-l border-emerald-500/20 pl-3">
                            {financialPlan.bridgeTactics}
                        </p>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
