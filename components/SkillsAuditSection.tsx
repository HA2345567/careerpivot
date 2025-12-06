import React from 'react';
import { HiddenSkillsAudit } from './HiddenSkillsAudit';
import { SectionHeader } from './ui/Primitives';

const SkillsAuditSection = () => {
  return (
    <section id="skills-audit" className="py-24 bg-zinc-900/20 relative">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader 
          title="The Hidden Skills Audit" 
          subtitle="You're not 'starting over'—you're repackaging. Use our AI to translate your current experience into your new career language."
          centered={true}
        />
        
        <div className="max-w-5xl mx-auto">
          <HiddenSkillsAudit />
        </div>
      </div>
    </section>
  );
};

export default SkillsAuditSection;
