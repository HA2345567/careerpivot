import React from 'react';
import { HERO_CONTENT } from '../constants';
import { Button } from './ui/Primitives';
import { ShieldCheck, TrendingUp, Briefcase, CheckCircle2 } from 'lucide-react';

interface HeroProps {
    onStart?: (email?: string) => void;
    onViewPricing?: () => void;
}

const Hero = ({ onViewPricing }: HeroProps) => {
    const handleDeepDive = () => {
        if (onViewPricing) {
            onViewPricing();
        } else {
            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative overflow-hidden bg-[#050507] min-h-[90vh] flex items-center pt-32 pb-20 border-b border-white/5">

            {/* Elevion Style Background Spotlights - Restored & Polished */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#050507] to-transparent pointer-events-none z-0"></div>

            {/* Secondary softer glow for depth */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>

            {/* Subtle Grid backing */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-20">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

                    {/* Left Column: Typography & Content */}
                    <div className="flex-1 flex flex-col justify-center space-y-8 max-w-2xl lg:max-w-none mx-auto lg:mx-0 text-center lg:text-left">

                        {/* Pill Badge */}
                        <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 backdrop-blur-md transition-colors w-fit mx-auto lg:mx-0 shadow-[0_0_15px_-5px_rgba(99,102,241,0.5)]">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                            <span className="text-xs text-indigo-200 font-medium tracking-wide">Let AI Supercharge Your Pivot</span>
                        </div>

                        <div className="space-y-6">
                            {/* Headline: Mixed Typography */}
                            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-sans font-medium tracking-tight text-white leading-[1.1]">
                                Master Your <br />
                                <span className="font-serif italic text-zinc-300 opacity-90">
                                    Career Pivot.
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                                {HERO_CONTENT.subheadline}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-2">
                            {/* Primary CTA */}
                            <Button
                                size="lg"
                                className="h-12 px-8 bg-[#6366f1] hover:bg-[#575add] text-white rounded-lg shadow-[0_0_20px_-5px_rgba(99,102,241,0.6)] border border-indigo-400/20 font-medium transition-all hover:scale-105"
                                onClick={() => handleDeepDive()}
                            >
                                Get Started
                            </Button>

                            {/* Secondary CTA */}
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-12 px-8 bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white rounded-lg backdrop-blur-sm transition-all"
                                onClick={handleDeepDive}
                            >
                                Our Features
                            </Button>
                        </div>

                        <div className="pt-8 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-sm text-zinc-500 font-medium">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                                <span>Bank-Level Privacy</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                                <span>10k+ Success Stories</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: High-Fidelity Dashboard Mockup with Glow */}
                    <div className="flex-1 w-full max-w-[600px] lg:max-w-full relative group">

                        {/* The "Glow" Backdrop Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>

                        {/* The Interface Container */}
                        <div className="relative bg-[#0A0A0B] rounded-2xl border border-white/10 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col transform transition-all duration-700 hover:rotate-1 hover:scale-[1.01]">

                            {/* Window Controls */}
                            <div className="h-12 border-b border-white/5 bg-[#0F0F12] flex items-center justify-between px-5">
                                <div className="text-[10px] font-mono text-zinc-500">9:41 AM</div>
                                <div className="flex gap-1.5 opacity-50">
                                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-600"></div>
                                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-600"></div>
                                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-600"></div>
                                </div>
                            </div>

                            {/* Dashboard Body */}
                            <div className="flex-1 p-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0A0A0B] to-[#0A0A0B] relative">

                                {/* Header Mockup */}
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <div className="text-3xl font-serif italic text-white mb-1">Growth</div>
                                        <div className="text-xs text-indigo-400 font-mono tracking-wider uppercase">Active Strategy</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                            <span className="text-xs font-bold text-indigo-300">Live</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Central Metric */}
                                <div className="mb-10 text-center relative z-10">
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-bold">Estimated Freedom Capital</div>
                                    <div className="text-5xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                        $124,500
                                    </div>
                                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                                        <TrendingUp className="h-3 w-3" />
                                        +12.4% vs Target
                                    </div>
                                </div>

                                {/* Floating Cards (Glassmorphism) */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md relative overflow-hidden group/card hover:bg-white/10 transition-colors">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                        <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-3 text-indigo-400">
                                            <Briefcase className="h-4 w-4" />
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-1">4</div>
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold">Offer Letters</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md relative overflow-hidden group/card hover:bg-white/10 transition-colors">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                        <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3 text-purple-400">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-1">High</div>
                                        <div className="text-[10px] text-zinc-500 uppercase font-bold">Safety Score</div>
                                    </div>
                                </div>

                                {/* Bottom Glow */}
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Floating Badge (Like the '64K+' in screenshot) */}
                        <div className="absolute -right-6 top-1/3 bg-[#0F0F12] border border-white/10 p-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce [animation-duration:3s]">
                            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-xs text-zinc-400 font-bold uppercase">Pivot Speed</div>
                                <div className="text-sm font-bold text-white">3.5 Months</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
