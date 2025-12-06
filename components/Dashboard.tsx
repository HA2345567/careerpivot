import React, { useState } from 'react';
import { UserContextType } from '../types';
import { SalaryBridgeCalculator } from './SalaryBridgeCalculator';
import { SafeExitRoadmap } from './SafeExitRoadmap';
import { InterviewPrep } from './InterviewPrep';
import { NetworkOfEscapists } from './NetworkOfEscapists';
import { DailyAccountability } from './DailyAccountability';
import { HiddenSkillsAudit } from './HiddenSkillsAudit';
import { SalaryNegotiation } from './SalaryNegotiation';
import { Button, Card, Badge } from './ui/Primitives';
import { 
  LayoutDashboard, 
  Calculator, 
  Map as MapIcon, 
  Users, 
  MessageSquare, 
  Search, 
  LogOut, 
  Bell,
  Settings,
  Flame,
  Clock,
  Target,
  DollarSign,
  Menu,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  user: UserContextType;
  onLogout: () => void;
}

type Tab = 'overview' | 'calculator' | 'roadmap' | 'skills' | 'interview' | 'network' | 'bot' | 'negotiation';

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const freedomDate = new Date();
  freedomDate.setMonth(freedomDate.getMonth() + 6);
  const daysToFreedom = Math.ceil((freedomDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  const renderContent = () => {
    switch(activeTab) {
      case 'calculator': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Financial Bridge Calculator</h2><SalaryBridgeCalculator /></div>;
      case 'roadmap': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Your Exit Roadmap</h2><SafeExitRoadmap /></div>;
      case 'skills': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Skills Audit</h2><HiddenSkillsAudit /></div>;
      case 'interview': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Interview Prep</h2><InterviewPrep /></div>;
      case 'network': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Mentor Network</h2><NetworkOfEscapists /></div>;
      case 'bot': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Accountability Agent</h2><DailyAccountability /></div>;
      case 'negotiation': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Salary Negotiation Scripts</h2><SalaryNegotiation /></div>;
      default: return <OverviewTab user={user} daysToFreedom={daysToFreedom} setTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row overflow-hidden font-sans text-zinc-100">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed md:relative z-50 w-64 bg-zinc-950 border-r border-white/5 flex flex-col h-screen transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-white/5 bg-zinc-950">
           <div className="text-lg font-bold text-white tracking-tight mb-0.5">
             CareerPivot
           </div>
           <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Pro Dashboard</div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto custom-scrollbar">
          <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }} />
          
          <div className="pt-6 pb-2 px-3">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Strategy Tools</p>
          </div>
          <SidebarItem icon={Calculator} label="Bridge Calculator" active={activeTab === 'calculator'} onClick={() => { setActiveTab('calculator'); setMobileMenuOpen(false); }} />
          <SidebarItem icon={MapIcon} label="Exit Roadmap" active={activeTab === 'roadmap'} onClick={() => { setActiveTab('roadmap'); setMobileMenuOpen(false); }} />
          <SidebarItem icon={Search} label="Skills Audit" active={activeTab === 'skills'} onClick={() => { setActiveTab('skills'); setMobileMenuOpen(false); }} />
          
          <div className="pt-6 pb-2 px-3">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Execution</p>
          </div>
          <SidebarItem icon={Users} label="Interview Prep" active={activeTab === 'interview'} onClick={() => { setActiveTab('interview'); setMobileMenuOpen(false); }} />
          <SidebarItem icon={DollarSign} label="Negotiation" active={activeTab === 'negotiation'} onClick={() => { setActiveTab('negotiation'); setMobileMenuOpen(false); }} />
          <SidebarItem icon={Users} label="Network" active={activeTab === 'network'} onClick={() => { setActiveTab('network'); setMobileMenuOpen(false); }} />
          <SidebarItem icon={MessageSquare} label="Accountability Bot" active={activeTab === 'bot'} onClick={() => { setActiveTab('bot'); setMobileMenuOpen(false); }} />
        </nav>

        <div className="p-4 border-t border-white/5 bg-zinc-950">
           <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                 {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                 <div className="text-sm font-bold text-white truncate">{user.name}</div>
                 <div className="text-[10px] text-zinc-500 truncate">{user.currentRole}</div>
              </div>
           </div>
           <Button variant="ghost" size="sm" className="w-full justify-start text-zinc-500 hover:text-red-400 hover:bg-red-500/10" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
           </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen bg-black relative">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/80 backdrop-blur-md sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <button className="md:hidden text-zinc-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-6 w-6" />
              </button>
              <div className="text-zinc-500 text-sm font-mono hidden sm:block">
                  cp_terminal <span className="mx-2">/</span> <span className="text-white font-medium capitalize">{activeTab.replace('-', '_')}</span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-zinc-400 h-9 w-9 p-0 rounded-full hover:bg-white/5">
                 <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-zinc-400 h-9 w-9 p-0 rounded-full hover:bg-white/5">
                 <Settings className="h-4 w-4" />
              </Button>
           </div>
        </header>
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
          {renderContent()}
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${
      active 
        ? 'bg-primary/10 text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]' 
        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
    }`}
  >
    <Icon className={`h-4 w-4 transition-colors ${active ? 'text-primary' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
    {label}
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>}
  </button>
);

const OverviewTab = ({ user, daysToFreedom, setTab }: { user: UserContextType, daysToFreedom: number, setTab: (t: Tab) => void }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    {/* Welcome Header */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
       <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Good evening, {user.name}.</h1>
          <p className="text-zinc-400 text-lg">Pivoting from <span className="text-zinc-200 font-semibold">{user.currentRole}</span> to <span className="text-primary font-semibold">{user.targetRole}</span>.</p>
       </div>
       <div className="flex items-center gap-2">
          <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1.5">
             <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
             Strategy Active
          </Badge>
       </div>
    </div>

    {/* Metric Grid */}
    <div className="grid md:grid-cols-3 gap-6">
       <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 relative overflow-hidden group hover:bg-zinc-900/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Clock className="h-24 w-24 text-primary" />
          </div>
          <div className="relative z-10">
             <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">Freedom Countdown</div>
             <div className="text-4xl font-bold text-white mb-1 tracking-tight">{daysToFreedom} <span className="text-lg text-zinc-500 font-normal">days</span></div>
             <p className="text-xs text-zinc-400 mt-2">Target Date: {new Date(new Date().setMonth(new Date().getMonth() + 6)).toLocaleDateString()}</p>
          </div>
       </div>

       <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 relative overflow-hidden group hover:bg-zinc-900/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Flame className="h-24 w-24 text-rose-500" />
          </div>
          <div className="relative z-10">
             <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">Burnout Level</div>
             <div className="flex items-end gap-2 mb-3">
                 <div className="text-4xl font-bold text-white tracking-tight">{user.burnoutLevel}<span className="text-zinc-600 text-xl font-normal">/10</span></div>
             </div>
             <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${user.burnoutLevel > 7 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-emerald-500'}`} style={{ width: `${user.burnoutLevel * 10}%` }}></div>
             </div>
          </div>
       </div>

       <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 relative overflow-hidden group hover:bg-zinc-900/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Target className="h-24 w-24 text-emerald-500" />
          </div>
          <div className="relative z-10">
             <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">Priority Action</div>
             <div className="text-lg font-bold text-white mb-4 line-clamp-2 leading-snug">Audit Transferable Skills</div>
             <Button size="sm" variant="outline" className="w-full justify-between group/btn" onClick={() => setTab('skills')}>
                Start Audit <Target className="h-4 w-4 text-emerald-500 group-hover/btn:scale-110 transition-transform" />
             </Button>
          </div>
       </div>
    </div>

    {/* Quick Actions */}
    <div>
        <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Recommended Next Steps</h3>
        <div className="grid md:grid-cols-2 gap-4">
             <div 
                onClick={() => setTab('calculator')}
                className="p-5 rounded-xl border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/60 hover:border-primary/30 transition-all cursor-pointer flex items-center gap-5 group"
             >
                <div className="h-12 w-12 rounded-xl bg-black border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg">
                    <Calculator className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="font-bold text-zinc-100 mb-1 group-hover:text-primary transition-colors">Recalculate Runway</h4>
                    <p className="text-sm text-zinc-500">Update financials based on recent spending.</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-zinc-700 group-hover:text-primary transition-colors -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
             </div>

             <div 
                onClick={() => setTab('interview')}
                className="p-5 rounded-xl border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/60 hover:border-emerald-500/30 transition-all cursor-pointer flex items-center gap-5 group"
             >
                <div className="h-12 w-12 rounded-xl bg-black border border-white/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shadow-lg">
                    <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="font-bold text-zinc-100 mb-1 group-hover:text-emerald-500 transition-colors">Practice Pitch</h4>
                    <p className="text-sm text-zinc-500">Refine your "Why I'm leaving" narrative.</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-zinc-700 group-hover:text-emerald-500 transition-colors -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
             </div>
        </div>
    </div>
  </div>
);
