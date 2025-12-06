import React from 'react';
import { SafeExitRoadmap } from './SafeExitRoadmap';
import { SectionHeader } from './ui/Primitives';

const SafeExitSection = () => {
  return (
    <section id="roadmap" className="py-24 bg-background relative border-t border-zinc-800">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader 
          title="The 'Safe Exit' Roadmap" 
          subtitle="Stop relying on 'leap of faith' advice. We build a calculated bridge from your current reality to your future career."
          centered={true}
        />
        
        <div className="max-w-6xl mx-auto">
          <SafeExitRoadmap />
        </div>
      </div>
    </section>
  );
};

export default SafeExitSection;
