import React, { useState, useMemo } from 'react';
import { Button, Card } from './ui/Primitives';
import { AlertTriangle, CheckCircle2, Wallet, ArrowRight, RefreshCw, Lock } from 'lucide-react';

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

export const SalaryBridgeCalculator = () => {
  const [currentSalary, setCurrentSalary] = useState(150000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(6000);
  const [transitionMonths, setTransitionMonths] = useState(6);
  const [targetSalary, setTargetSalary] = useState(110000);

  const { bridgeAmount, payCutImpact, isSafe, runwayScore } = useMemo(() => {
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
      runwayScore: Math.max(0, Math.min(100, score))
    };

  }, [monthlyExpenses, transitionMonths, targetSalary, currentSalary]);

  return (
    <div className="grid lg:grid-cols-12 gap-0 bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group">
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none"></div>

      {/* Left Column: Inputs */}
      <div className="lg:col-span-7 p-8 md:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950/50">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <Wallet className="h-6 w-6 text-primary" />
            Configuration
          </h3>
          <p className="text-zinc-500 text-sm">Model your financial reality to find your safe exit window.</p>
        </div>

        <div className="space-y-10">
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
      </div>

      {/* Right Column: Results */}
      <div className="lg:col-span-5 bg-gradient-to-b from-zinc-900 to-black p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
        
        {/* Background FX */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none mix-blend-screen" />

        <div className="relative z-10 space-y-8">
          
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
        <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
          <Button className="w-full h-14 text-base font-bold shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_-5px_rgba(99,102,241,0.6)]">
            Generate Full Financial Plan
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <div className="flex justify-center gap-6 mt-6">
             <div className="text-center">
                <div className="text-[10px] text-zinc-600 uppercase font-bold">Risk Score</div>
                <div className="text-lg font-mono text-zinc-300 font-bold">{100 - Math.round(runwayScore)}/100</div>
             </div>
             <div className="w-px bg-white/10 h-10"></div>
             <div className="text-center">
                <div className="text-[10px] text-zinc-600 uppercase font-bold">Est. Savings Time</div>
                <div className="text-lg font-mono text-zinc-300 font-bold">~{Math.ceil(bridgeAmount / (currentSalary/12 - monthlyExpenses))} mo</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
