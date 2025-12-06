import React, { useState } from 'react';
import { Button } from './ui/Primitives';
import { ArrowRight, User, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import { UserContextType } from '../types';

interface OnboardingModalProps {
  onComplete: (data: UserContextType) => void;
}

export const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserContextType>>({
    name: '',
    currentRole: '',
    targetRole: '',
    currentSalary: 120000,
    burnoutLevel: 7,
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        ...formData,
        startDate: new Date(),
      } as UserContextType);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-zinc-800 w-full">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="h-12 w-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 mb-4">
                <User className="h-6 w-6 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Let's build your file.</h2>
                <p className="text-zinc-400">We need a few baselines to calibrate your escape plan.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-1">First Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Alex"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-1">Current Burnout Level (1-10)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      className="flex-grow h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                      value={formData.burnoutLevel}
                      onChange={e => setFormData({...formData, burnoutLevel: parseInt(e.target.value)})}
                    />
                    <span className="font-mono text-xl font-bold text-red-500 w-8 text-center">{formData.burnoutLevel}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="h-12 w-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 mb-4">
                <Briefcase className="h-6 w-6 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Where are you stuck?</h2>
                <p className="text-zinc-400">This helps us identify your golden handcuffs.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-1">Current Role</label>
                  <input 
                    autoFocus
                    type="text" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    value={formData.currentRole}
                    onChange={e => setFormData({...formData, currentRole: e.target.value})}
                    placeholder="e.g. Senior Marketing Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-1">Current Annual Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-zinc-500">$</span>
                    <input 
                      type="number" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 pl-7 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      value={formData.currentSalary}
                      onChange={e => setFormData({...formData, currentSalary: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="h-12 w-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 mb-4">
                <TrendingUp className="h-6 w-6 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Where are we going?</h2>
                <p className="text-zinc-400">Don't overthink it. A rough direction is enough.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-1">Target Industry / Role</label>
                  <input 
                    autoFocus
                    type="text" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    value={formData.targetRole}
                    onChange={e => setFormData({...formData, targetRole: e.target.value})}
                    placeholder="e.g. Product Management in EdTech"
                  />
                </div>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary/80 leading-relaxed">
                        We'll use this to pre-load your interview prep and mentor network. You can change it anytime.
                    </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button onClick={handleNext} disabled={!formData.name} className="w-full sm:w-auto">
              {step === 3 ? 'Launch Command Center' : 'Next Step'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
