import React from 'react';
import { FEATURES } from '../constants';
import { Card, SectionHeader } from './ui/Primitives';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader 
            title="More Than Just Career Advice" 
            subtitle="A complete operating system engineered to move you from 'stuck' to 'started' without risking your financial stability."
        />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Card key={index} className="p-6 transition-all hover:border-primary/50 hover:bg-zinc-900/80 group">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-zinc-100">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
