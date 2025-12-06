import React from 'react';
import { NetworkOfEscapists } from './NetworkOfEscapists';
import { SectionHeader } from './ui/Primitives';

const NetworkSection = () => {
  return (
    <section id="network" className="py-24 bg-background relative border-t border-zinc-800">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader 
          title="Network of Escapists" 
          subtitle="You can't become what you can't see. Find mentors who have already walked the path you're afraid to take."
          centered={true}
        />
        
        <div className="max-w-6xl mx-auto">
          <NetworkOfEscapists />
        </div>
      </div>
    </section>
  );
};

export default NetworkSection;
