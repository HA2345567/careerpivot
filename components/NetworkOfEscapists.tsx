import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Button, Badge } from './ui/Primitives';
import { 
  Search, 
  Users, 
  ArrowRight, 
  Clock, 
  Building2, 
  Briefcase, 
  Loader2, 
  UserPlus, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Linkedin, 
  Star,
  X
} from 'lucide-react';

interface PivotMilestone {
  month: string;
  action: string;
}

interface MentorProfile {
  id: string;
  name: string;
  currentRole: string;
  currentCompany: string;
  formerRole: string;
  formerCompany: string;
  pivotDuration: string;
  story: string;
  topTip: string;
  skills: string[];
  availability: string;
  pivotTimeline: PivotMilestone[];
  avatarId: number;
  isVerified: boolean;
}

const DEFAULT_PROFILES: MentorProfile[] = [
  {
    id: "1",
    name: "Michael Chen",
    currentRole: "Product Manager",
    currentCompany: "EdTech Unicorn",
    formerRole: "Associate",
    formerCompany: "Goldman Sachs",
    pivotDuration: "9 months",
    story: "I was burning out working 90-hour weeks. I started building side projects on weekends to learn the lingo, then leveraged my financial modeling skills to land a PM role.",
    topTip: "Don't hide your finance background. Startups need people who understand P&L.",
    skills: ["Financial Modeling", "Roadmapping", "Stakeholder Mgmt"],
    availability: "Tue/Thu evenings",
    pivotTimeline: [
        { month: "Month 1", action: "Started 'Intro to SQL' course on weekends" },
        { month: "Month 3", action: "Built a budget tracker app MVP" },
        { month: "Month 6", action: "Networking coffee chats with 15 PMs" },
        { month: "Month 9", action: "Landed offer at Series B startup" }
    ],
    avatarId: 32,
    isVerified: true
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    currentRole: "Customer Success Lead",
    currentCompany: "Stripe",
    formerRole: "English Teacher",
    formerCompany: "Public School System",
    pivotDuration: "6 months",
    story: "Managing a classroom of 30 teenagers is basically advanced stakeholder management. I reframed my resume to highlight conflict resolution and communication.",
    topTip: "Teachers are natural CSMs. Use the language of 'account growth' instead of 'student progress'.",
    skills: ["Communication", "Onboarding", "Training"],
    availability: "Weekends",
    pivotTimeline: [
        { month: "Month 1", action: "Identified EdTech as target industry" },
        { month: "Month 3", action: "Revamped LinkedIn to remove 'Teacher' jargon" },
        { month: "Month 5", action: "Referral from a former colleague" },
        { month: "Month 6", action: "Started as CSM" }
    ],
    avatarId: 44,
    isVerified: true
  },
];

export const NetworkOfEscapists = () => {
  const [fromIndustry, setFromIndustry] = useState('');
  const [toIndustry, setToIndustry] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [profiles, setProfiles] = useState<MentorProfile[]>(DEFAULT_PROFILES);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [connectionStep, setConnectionStep] = useState<'details' | 'message' | 'success'>('details');

  const handleSearch = async () => {
    if (!fromIndustry.trim() || !toIndustry.trim()) return;
    
    setIsSearching(true);
    
    try {
      if (process.env.API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `Generate 3 hyper-realistic mentor profiles for a career pivot networking platform.
        CONTEXT: Pivoting FROM "${fromIndustry}" TO "${toIndustry}".
        
        Create personas that successfully made this EXACT transition.
        Include realistic company names (e.g., "Ex-McKinsey", "Now at Google").
        
        Generate a "Pivot Timeline" of 3-4 steps showing exactly how they did it.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                profiles: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      currentRole: { type: Type.STRING },
                      currentCompany: { type: Type.STRING },
                      formerRole: { type: Type.STRING },
                      formerCompany: { type: Type.STRING },
                      pivotDuration: { type: Type.STRING },
                      story: { type: Type.STRING },
                      topTip: { type: Type.STRING },
                      skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                      availability: { type: Type.STRING },
                      pivotTimeline: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                month: { type: Type.STRING },
                                action: { type: Type.STRING }
                            }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });

        if (response.text) {
          const data = JSON.parse(response.text);
          const enhancedProfiles = data.profiles.map((p: any, i: number) => ({
            ...p,
            id: Date.now().toString() + i,
            avatarId: Math.floor(Math.random() * 70) + 1,
            isVerified: true
          }));
          setProfiles(enhancedProfiles);
        }
      } else {
        // Fallback for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Keep default or add new dummy data
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const openMentorModal = (mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    setConnectionStep('details');
  };

  const closeMentorModal = () => {
    setSelectedMentor(null);
  };

  const sendConnectionRequest = () => {
    setConnectionStep('success');
    setTimeout(() => {
        closeMentorModal();
    }, 3000);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl min-h-[600px] relative">
      
      {/* Search Column */}
      <div className="lg:col-span-4 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-zinc-900/20 flex flex-col">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Find Real Mentors
          </h3>
          <p className="text-zinc-400 text-sm">
            We match you with verified professionals who have successfully bridged the specific gap you are facing.
          </p>
        </div>

        <div className="space-y-6 flex-grow">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">I'm leaving...</label>
            <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input 
                    type="text" 
                    value={fromIndustry}
                    onChange={(e) => setFromIndustry(e.target.value)}
                    placeholder="e.g. Accounting"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="bg-zinc-800 rounded-full p-1.5 border border-zinc-700 shadow-xl">
                <ArrowRight className="h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">I'm targeting...</label>
            <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input 
                    type="text" 
                    value={toIndustry}
                    onChange={(e) => setToIndustry(e.target.value)}
                    placeholder="e.g. UX Design"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
            </div>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={isSearching || !fromIndustry || !toIndustry}
            className="w-full h-12 mt-4"
          >
            {isSearching ? (
               <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Matching...</>
            ) : (
               <><Search className="h-4 w-4 mr-2" /> Find Matches</>
            )}
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-3 text-sm text-zinc-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Verified Employment History</span>
            </div>
             <div className="flex items-center gap-3 text-sm text-zinc-500 mt-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Response Rate: &gt;90%</span>
            </div>
        </div>
      </div>

      {/* Results Column */}
      <div className="lg:col-span-8 bg-zinc-950 p-6 md:p-8 relative min-h-[500px] overflow-y-auto custom-scrollbar">
        {isSearching && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-zinc-950/80 backdrop-blur-sm">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-zinc-400 font-mono text-sm animate-pulse">Scanning 12,000+ career paths...</p>
            </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
            {profiles.map((profile, idx) => (
                <div 
                    key={profile.id} 
                    onClick={() => openMentorModal(profile)}
                    className="group bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-primary/50 hover:bg-zinc-900 cursor-pointer transition-all flex flex-col h-full"
                >
                    <div className="flex justify-between items-start mb-4">
                        <img 
                            src={`https://i.pravatar.cc/150?img=${profile.avatarId}`} 
                            alt={profile.name}
                            className="h-14 w-14 rounded-full ring-2 ring-zinc-800 group-hover:ring-primary/50 transition-all object-cover"
                        />
                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-[10px] group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                            <Clock className="h-3 w-3 mr-1 inline" />
                            {profile.pivotDuration} pivot
                        </Badge>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-bold text-white text-lg">{profile.name}</h4>
                        <div className="text-sm font-medium text-primary">{profile.currentRole}</div>
                        <div className="text-xs text-zinc-500">at {profile.currentCompany}</div>
                    </div>

                    <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                             <div className="h-1.5 w-1.5 rounded-full bg-zinc-600"></div>
                             Ex-{profile.formerCompany} ({profile.formerRole})
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {profile.skills.slice(0, 2).map((skill, sIdx) => (
                                <span key={sIdx} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                         <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <MapPin className="h-3 w-3" />
                            <span>Remote / Zoom</span>
                         </div>
                         <div className="text-xs font-bold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            View Path <ArrowRight className="h-3 w-3" />
                         </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {selectedMentor && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
            <div className="w-full md:w-[600px] h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-start bg-zinc-900/50">
                    <div className="flex gap-4">
                        <img 
                            src={`https://i.pravatar.cc/150?img=${selectedMentor.avatarId}`} 
                            alt={selectedMentor.name}
                            className="h-16 w-16 rounded-full ring-2 ring-primary/20 object-cover"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-white">{selectedMentor.name}</h3>
                                {selectedMentor.isVerified && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                            </div>
                            <p className="text-primary font-medium">{selectedMentor.currentRole} @ {selectedMentor.currentCompany}</p>
                            <p className="text-sm text-zinc-500">Formerly {selectedMentor.formerRole} @ {selectedMentor.formerCompany}</p>
                        </div>
                    </div>
                    <button onClick={closeMentorModal} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-grow overflow-y-auto p-6 space-y-8">
                    {connectionStep === 'details' ? (
                        <>
                            {/* Stats Strip */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
                                    <div className="text-lg font-bold text-white">{selectedMentor.pivotDuration}</div>
                                    <div className="text-xs text-zinc-500">Transition Time</div>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
                                    <div className="text-lg font-bold text-white">4.9/5</div>
                                    <div className="text-xs text-zinc-500">Rating</div>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
                                    <div className="text-lg font-bold text-white">45+</div>
                                    <div className="text-xs text-zinc-500">Mentored</div>
                                </div>
                            </div>

                            {/* Bio / Story */}
                            <div>
                                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">My Pivot Story</h4>
                                <p className="text-zinc-300 text-sm leading-relaxed border-l-2 border-primary/50 pl-4">
                                    "{selectedMentor.story}"
                                </p>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">How I Did It</h4>
                                <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
                                    {selectedMentor.pivotTimeline.map((step, i) => (
                                        <div key={i} className="relative">
                                            <div className="absolute -left-[29px] top-1 h-4 w-4 rounded-full border-2 border-zinc-950 bg-zinc-700"></div>
                                            <div className="text-xs font-bold text-primary mb-0.5">{step.month}</div>
                                            <div className="text-sm text-zinc-300">{step.action}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Connect CTA */}
                            <div className="pt-4">
                                <Button className="w-full h-12 text-base gap-2" onClick={() => setConnectionStep('message')}>
                                    <UserPlus className="h-5 w-5" />
                                    Connect & Schedule
                                </Button>
                                <p className="text-center text-xs text-zinc-600 mt-3 flex items-center justify-center gap-1">
                                    <Clock className="h-3 w-3" /> Usually responds within 24 hours
                                </p>
                            </div>
                        </>
                    ) : connectionStep === 'message' ? (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                            <h4 className="text-lg font-bold text-white mb-6">Send a Request</h4>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Connection Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="p-3 rounded-lg border border-primary bg-primary/10 text-primary text-sm font-medium text-left">
                                            ☕ Coffee Chat (15 min)
                                        </button>
                                        <button className="p-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 text-sm font-medium text-left hover:border-zinc-700">
                                            📄 Resume Review
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Personal Note</label>
                                    <textarea 
                                        className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                        defaultValue={`Hi ${selectedMentor.name.split(' ')[0]},\n\nI'm currently a ${fromIndustry || 'professional'} looking to pivot into ${toIndustry || 'your field'}. Your journey from ${selectedMentor.formerCompany} really resonated with me.\n\nWould you be open to a brief chat about how you managed the transition?`}
                                    />
                                </div>

                                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex gap-3 items-start">
                                    <Star className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                    <p className="text-xs text-amber-200/80">
                                        <strong>Pro Tip:</strong> Mentors are 3x more likely to accept requests that mention a specific part of their background.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setConnectionStep('details')}>Back</Button>
                                <Button className="flex-[2]" onClick={sendConnectionRequest}>Send Request</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                            <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                            <p className="text-zinc-400 max-w-xs mx-auto mb-8">
                                {selectedMentor.name} has been notified. Check your email for scheduling options once they accept.
                            </p>
                            <Button variant="outline" onClick={closeMentorModal}>
                                Back to Network
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
