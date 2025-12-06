import React from 'react';
import { InterviewPrep } from './InterviewPrep';
import { SectionHeader } from './ui/Primitives';

const InterviewPrepSection = () => {
  return (
    <section id="interview-prep" className="py-24 bg-zinc-900/20 relative border-t border-zinc-800">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader 
          title="Interview Like an Insider" 
          subtitle="Stop apologizing for your background. We teach you how to sell your 'unrelated' experience as a competitive advantage."
          centered={true}
        />
        
        <div className="max-w-5xl mx-auto">
          <InterviewPrep />
        </div>
      </div>
    </section>
  );
};

export default InterviewPrepSection;
