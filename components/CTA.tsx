
import React from 'react';
import { Button } from './ui/Primitives';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface CTAProps {
  onStart?: () => void;
}

const CTA = ({ onStart }: CTAProps) => {
  return (
    <section className="py-24 flex items-center justify-center p-4">
      {/* Container echoing the design */}
      <div className="relative w-full max-w-5xl bg-[#6366f1] rounded-[2.5rem] overflow-hidden py-16 px-6 md:px-20 text-center shadow-2xl shadow-indigo-500/30">

        {/* Noise overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 mix-blend-overlaypointer-events-none"></div>

        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Stop Dreaming. Start Pivoting.
          </h2>
          <p className="text-lg text-indigo-100 font-medium max-w-2xl mx-auto">
            Join 10,000+ professionals who have successfully transitioned to their dream careers using our AI-powered roadmap.
          </p>

          <div className="pt-2">
            <Button
              variant="glow"
              size="lg"
              className="text-[#6366f1] hover:text-[#4f46e5] hover:bg-gray-50 font-bold px-8 h-12 rounded-full shadow-lg transition-transform hover:scale-105"
              onClick={onStart}
            >
              Start My Free Assessment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
