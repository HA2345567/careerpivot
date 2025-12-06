
import React from 'react';
import { PRICING_TIERS, EXECUTIVE_OFFER } from '../constants';
import { Button, Card, SectionHeader, Badge } from './ui/Primitives';
import { Check, ShieldCheck, Crown } from 'lucide-react';

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader 
            title="Invest in Your Future Self" 
            subtitle="Flexible plans designed for every stage of your transition journey. Start small or go all-in."
        />
        
        {/* Main Value Ladder */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto items-start mb-16">
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
                        <span className="text-zinc-500 font-medium">{tier.period}</span>
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

        {/* Backend Offer: Executive Escape */}
        <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden p-1 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800">
                <div className="bg-black rounded-xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Crown className="h-32 w-32 text-white" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                                <Crown className="h-6 w-6 text-amber-500" />
                                {EXECUTIVE_OFFER.name}
                            </h3>
                            <p className="text-zinc-400 max-w-lg">
                                {EXECUTIVE_OFFER.description} Includes private concierge, done-for-you branding, and board placement.
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-2">
                            <div className="text-3xl font-bold text-white">{EXECUTIVE_OFFER.price}</div>
                            <Button variant="glow" className="min-w-[180px]">
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;
