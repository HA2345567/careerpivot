import React from 'react';
import { PRICING_TIERS } from '../constants';
import { Button, Card, SectionHeader, Badge } from './ui/Primitives';
import { Check } from 'lucide-react';

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader 
            title="Invest in Your Future Self" 
            subtitle="Flexible plans designed for every stage of your transition journey."
        />
        
        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto items-start">
            {PRICING_TIERS.map((tier, index) => (
                <Card 
                    key={index} 
                    className={`relative p-8 flex flex-col h-full ${tier.highlighted ? 'border-primary shadow-lg shadow-primary/10 bg-zinc-900 scale-105 z-10' : 'bg-zinc-950/50 hover:bg-zinc-900 transition-colors'}`}
                >
                    {tier.highlighted && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <Badge>Most Popular</Badge>
                        </div>
                    )}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                        <p className="text-sm text-zinc-500 mt-2">{tier.description}</p>
                    </div>
                    <div className="mb-6">
                        <span className="text-4xl font-bold text-white">{tier.price}</span>
                        <span className="text-zinc-500">{tier.period}</span>
                    </div>
                    <div className="flex-grow space-y-4 mb-8">
                        {tier.features.map((feature, fIndex) => (
                            <div key={fIndex} className="flex items-start gap-3">
                                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                <span className="text-sm text-zinc-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                    <Button 
                        variant={tier.highlighted ? 'primary' : 'outline'} 
                        className="w-full"
                        size="lg"
                    >
                        {tier.cta}
                    </Button>
                    <p className="text-xs text-center text-zinc-600 mt-4">Best for: {tier.bestFor}</p>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
