import React from 'react';
import { PAIN_POINTS } from '../constants';
import { AlertTriangle, XCircle } from 'lucide-react';

const ProblemSection = () => {
  return (
    <section id="problem" className="py-24 bg-zinc-900/50 border-y border-zinc-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 lg:order-1">
                <div className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400 mb-6">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    The Silent Crisis
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6 text-white">
                    Why does success feel like a trap?
                </h2>
                <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                    You did everything right. Good grades, top tier university, prestigious job. But now you realize the ladder you climbed is leaning against the wrong wall, and looking down is terrifying.
                </p>
                
                <div className="space-y-6">
                    {PAIN_POINTS.map((pain, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                    <pain.icon className="h-5 w-5" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-zinc-200">{pain.title}</h3>
                                <p className="text-zinc-400 mt-1">{pain.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="order-1 lg:order-2 relative">
                {/* Visual Representation of the Trap */}
                <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden p-8 flex flex-col items-center justify-center text-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 to-zinc-950 opacity-50"></div>
                    <div className="z-10 max-w-sm mx-auto space-y-6">
                        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl relative">
                            <div className="absolute -top-3 -right-3 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-zinc-900">
                                <XCircle className="h-4 w-4 text-white" />
                            </div>
                            <p className="font-mono text-sm text-zinc-500 mb-2">Current State</p>
                            <h4 className="text-2xl font-bold text-white mb-1">$250,000/yr</h4>
                            <p className="text-red-400 text-sm font-medium">High Burnout Risk</p>
                            <div className="mt-4 h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 w-[90%]"></div>
                            </div>
                            <p className="text-xs text-right mt-1 text-zinc-500">Stress Level: 90%</p>
                        </div>
                        
                        <div className="h-12 w-0.5 bg-zinc-800 mx-auto"></div>

                        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 border-dashed opacity-50">
                            <p className="font-mono text-sm text-zinc-500 mb-2">Desired State</p>
                            <h4 className="text-2xl font-bold text-zinc-300 mb-1">Purpose & Balance</h4>
                            <p className="text-zinc-500 text-sm">Unknown Path</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
