import React from 'react';
import { DailyAccountability } from './DailyAccountability';
import { SectionHeader } from './ui/Primitives';

const AccountabilitySection = () => {
  return (
    <section id="accountability" className="py-24 bg-zinc-900/30 relative border-t border-zinc-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <DailyAccountability />
        </div>
      </div>
    </section>
  );
};

export default AccountabilitySection;
