
import React from 'react';
import { HERO_CONTENT } from '../constants';
import { Button, Badge } from './ui/Primitives';
import { ArrowRight, PlayCircle, ShieldCheck, TrendingUp, Briefcase, FileText, CheckCircle2, Lock } from 'lucide-react';
import Aurora from './ui/Aurora';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background min-h-[90vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-0 border-b border-white/5">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 opacity-40 pointer-events-none">
          <Aurora colorStops={["#2E1065", "#4C1D95", "#5B21B6"]} speed={0.5} />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Copy */}
          <div className="flex-1 flex flex-col justify-center space-y-8 max-w-2xl lg:max-w-none mx-auto lg:mx-0 text-center lg:text-left">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1 pl-1 pr-4 backdrop-blur-md transition-colors cursor-default w-fit mx-auto lg:mx-0">
                <Badge variant="default" className="rounded-full px-2 py-0.5 text-[10px] mr-2 shadow-none font-bold tracking-wide bg-indigo-600 border-none text-white">Value Ladder v1.0</Badge>
                <span className="text-xs text-zinc-300 font-medium tracking-wide">Start with our Free Guide</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl xl:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                Master Your <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                  Career Pivot.
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                {HERO_CONTENT.subheadline}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              {/* Email Input for Lead Magnet */}
              <div className="w-full max-w-sm relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                <form className="relative flex items-center" onSubmit={(e) => { e.preventDefault(); }}>
                    <input 
                        type="email" 
                        placeholder="Enter email for Free Daily Guide" 
                        className="w-full h-14 bg-zinc-950 text-white rounded-lg border border-white/10 pl-4 pr-14 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-zinc-500 transition-all font-medium"
                    />
                    <Button 
                        size="sm" 
                        className="absolute right-2 h-10 w-10 p-0 rounded-md bg-primary hover:bg-primary/90 text-white shadow-lg"
                        type="submit"
                        aria-label="Get Free Guide"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </form>
              </div>

              <Button variant="outline" size="lg" className="h-14 px-8 text-base border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-zinc-200 min-w-[160px]">
                <TrendingUp className="h-5 w-5 mr-2" />
                {HERO_CONTENT.ctaSecondary}
              </Button>
            </div>

            <div className="pt-8 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-sm text-zinc-500 font-medium">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Bank-Level Privacy</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>10k+ Success Stories</span>
                </div>
                <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-emerald-500" />
                    <span>Anonymous Mode</span>
                </div>
            </div>
          </div>

          {/* Right Column: Professional Dashboard Interface */}
          <div className="flex-1 w-full max-w-[600px] lg:max-w-full relative group perspective-[2000px]">
             {/* The Interface Container */}
             <div className="relative bg-zinc-950/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col transform transition-all duration-700 hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.3)] hover:border-white/20">
                
                {/* Window Controls */}
                <div className="h-10 border-b border-white/5 bg-zinc-900/50 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
                    </div>
                    <div className="mx-auto text-[10px] font-mono text-zinc-600">cp_dashboard.exe</div>
                </div>

                {/* Dashboard Body */}
                <div className="flex-1 p-8 bg-gradient-to-b from-zinc-900/20 to-black relative">
                    
                    {/* Header Part of Mockup */}
                    <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
                        <div>
                            <div className="text-xs text-zinc-500 font-mono uppercase mb-1 tracking-wider">Current Status</div>
                            <div className="text-2xl font-bold text-white flex items-center gap-3">
                                Strategy Active 
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-xs text-zinc-500 font-mono uppercase mb-1 tracking-wider">Projected Exit</div>
                             <div className="text-xl font-bold text-zinc-200">October 15, 2025</div>
                        </div>
                    </div>

                    {/* Timeline / Progress Visualization */}
                    <div className="space-y-8 relative">
                         {/* Connecting Line */}
                         <div className="absolute left-[15px] top-4 bottom-4 w-px bg-zinc-800"></div>

                        {/* Milestone 1 */}
                        <div className="flex gap-6 relative">
                            <div className="flex flex-col items-center">
                                <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center z-10">
                                    <CheckCircle2 className="h-4 w-4 text-zinc-500" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-zinc-500 font-medium line-through">Skills Audit Complete</h4>
                                <p className="text-xs text-zinc-600 mt-1">Identified 4 transferable assets</p>
                            </div>
                        </div>

                        {/* Milestone 2 (Active) */}
                        <div className="flex gap-6 relative">
                            <div className="flex flex-col items-center">
                                <div className="h-8 w-8 rounded-full bg-indigo-600 border border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center justify-center z-10 ring-4 ring-black">
                                    <TrendingUp className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <div className="w-full">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-white font-bold text-lg">Financial Bridge Secured</h4>
                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-2 py-0.5 font-mono">ON TRACK</Badge>
                                </div>
                                <div className="p-4 bg-zinc-900/80 border border-white/5 rounded-lg w-full">
                                    <div className="flex justify-between text-xs mb-3 text-zinc-400 font-medium">
                                        <span>Freedom Fund Progress</span>
                                        <span className="text-white">75%</span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[75%] rounded-full relative">
                                             <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-[10px] text-zinc-500 font-mono">
                                        <span>$45,000 Saved</span>
                                        <span>Goal: $60,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                         {/* Milestone 3 (Future) */}
                         <div className="flex gap-6 relative opacity-40">
                            <div className="flex flex-col items-center">
                                <div className="h-8 w-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center z-10">
                                    <Briefcase className="h-4 w-4 text-zinc-600" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-zinc-400 font-medium">Market Entry</h4>
                                <p className="text-xs text-zinc-600 mt-1">Interview prep & Networking</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Floating Element: Offer Letter */}
                    <div className="absolute bottom-8 right-8 bg-zinc-900 border border-white/10 p-4 rounded-xl shadow-2xl animate-[float_4s_ease-in-out_infinite] w-[200px] hover:scale-105 transition-transform cursor-default">
                        <div className="flex items-center gap-3 mb-3">
                             <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-emerald-500" />
                             </div>
                             <div>
                                <div className="text-[10px] text-zinc-500 uppercase font-bold">New Offer</div>
                                <div className="text-xs font-bold text-white">Confirmed</div>
                             </div>
                        </div>
                        <div className="h-px bg-zinc-800 w-full mb-3"></div>
                        <div className="flex justify-between items-end">
                             <div className="text-[10px] text-zinc-500">Base Salary</div>
                             <span className="text-sm font-mono text-emerald-400 font-bold">+$25k</span>
                        </div>
                    </div>

                </div>
             </div>

             {/* Background glow for depth */}
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl blur-2xl opacity-10 -z-10 group-hover:opacity-20 transition-opacity duration-700"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
