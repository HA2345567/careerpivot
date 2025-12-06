
import React from 'react';
import { Button } from './ui/Primitives';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface CTAProps {
  onStart?: () => void;
}

const CTA = ({ onStart }: CTAProps) => {
  return (
    <section className="py-24 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-primary/10 blur-[100px] rounded-full"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Don't Let Another Year Slip By.
        </h2>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            The best time to plant a tree was 20 years ago. The best time to plan your exit is today. Try the AI Career Blueprint risk-free.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
             <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 py-6 text-lg gap-2 shadow-xl hover:shadow-primary/20 hover:scale-105 transition-all"
                onClick={onStart}
             >
                Start My Free Assessment
                <ArrowRight className="h-5 w-5" />
            </Button>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <ShieldCheck className="h-4 w-4" />
            <span>14-day money-back guarantee. No credit card required for basic assessment.</span>
        </div>
      </div>
    </section>
  );
};

export default CTA;
