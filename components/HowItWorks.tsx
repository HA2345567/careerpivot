import React from 'react';
import { STEPS } from '../constants';
import { SectionHeader } from './ui/Primitives';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader 
            title="Your Escape Plan in 3 Steps" 
            subtitle="We replace anxiety with a systematic process."
        />
        
        <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-zinc-800 via-primary/50 to-zinc-800"></div>

            {STEPS.map((step, index) => (
                <div key={index} className="relative flex flex-col items-center text-center">
                    <div className="z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl transition-transform hover:scale-110 duration-300">
                        <step.icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                        {index + 1}. {step.title}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed max-w-xs">
                        {step.description}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
