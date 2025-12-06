
import React, { useState, useEffect } from 'react';
import { UserContextType, Notification } from '../types';
import { storage } from '../services/storage';
import { SalaryBridgeCalculator } from './SalaryBridgeCalculator';
import { SafeExitRoadmap } from './SafeExitRoadmap';
import { InterviewPrep } from './InterviewPrep';
import { NetworkOfEscapists } from './NetworkOfEscapists';
import { DailyAccountability } from './DailyAccountability';
import { HiddenSkillsAudit } from './HiddenSkillsAudit';
import { SalaryNegotiation } from './SalaryNegotiation';
import { AdminDashboard } from './AdminDashboard';
import { SubscriptionManager } from './SubscriptionManager';
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
  Target,
  DollarSign,
  Menu,
  ArrowRight,
  ShieldAlert,
  CreditCard,
  X,
  Zap
} from 'lucide-react';

interface DashboardProps {
  user: UserContextType;
  onLogout: () => void;
}

type Tab = 'overview' | 'calculator' | 'roadmap' | 'skills' | 'interview' | 'network' | 'bot' | 'negotiation' | 'admin' | 'billing';

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>(user.role === 'admin' ? 'admin' : 'overview');
  const [botMode, setBotMode] = useState<'vent' | 'action'>('vent');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setNotifications(storage.getNotifications());
  }, []);

  const handleNotificationClick = (id: string) => {
    storage.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleUserUpdate = () => {
    const updated = storage.getUser();
    if (updated) setCurrentUser(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'admin': return <AdminDashboard />;
      case 'calculator': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Financial Bridge Calculator</h2><SalaryBridgeCalculator /></div>;
      case 'roadmap': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Your Exit Roadmap</h2><SafeExitRoadmap /></div>;
      case 'skills': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Skills Audit</h2><HiddenSkillsAudit /></div>;
      case 'interview': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Interview Prep</h2><InterviewPrep /></div>;
      case 'network': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Mentor Network</h2><NetworkOfEscapists /></div>;
      case 'bot': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Accountability Agent</h2><DailyAccountability mode={botMode} /></div>;
      case 'negotiation': return <div className="animate-in fade-in zoom-in-95 duration-300"><h2 className="text-2xl font-bold mb-6 text-white">Salary Negotiation Scripts</h2><SalaryNegotiation /></div>;
      case 'billing': return <SubscriptionManager user={currentUser} onUpdate={handleUserUpdate} />;
      default: return <OverviewTab user={currentUser} setTab={setActiveTab} setBotMode={setBotMode} />;
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
          {user.role === 'admin' && (
            <SidebarItem icon={ShieldAlert} label="Admin Console" active={activeTab === 'admin'} onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }} />
          )}

          <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }} />

          {/* Reordered to match the 1-2-3 Flow */}
          <div className="pt-6 pb-2 px-3">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Core Process</p>
          </div>
          <SidebarItem icon={MessageSquare} label="Accountability AI" active={activeTab === 'bot'} onClick={() => { setActiveTab('bot'); setMobileMenuOpen(false); }} />
          <SidebarItem icon={MapIcon} label="Exit Roadmap" active={activeTab === 'roadmap'} onClick={() => { setActiveTab('roadmap'); setMobileMenuOpen(false); }} />

          <div className="pt-6 pb-2 px-3">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Tools</p>
          </div>
          <SidebarItem icon={Calculator} label="Bridge Calculator" active={activeTab === 'calculator'} onClick={() => { setActiveTab('calculator'); setMobileMenuOpen(false); }} />
          <SidebarItem icon={Search} label="Skills Audit" active={activeTab === 'skills'} onClick={() => { setActiveTab('skills'); setMobileMenuOpen(false); }} />
          <SidebarItem icon={Users} label="Interview Prep" active={activeTab === 'interview'} onClick={() => { setActiveTab('interview'); setMobileMenuOpen(false); }} />
          <SidebarItem icon={DollarSign} label="Negotiation" active={activeTab === 'negotiation'} onClick={() => { setActiveTab('negotiation'); setMobileMenuOpen(false); }} />
          <SidebarItem icon={Users} label="Mentor Network" active={activeTab === 'network'} onClick={() => { setActiveTab('network'); setMobileMenuOpen(false); }} />

          <div className="pt-6 pb-2 px-3">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Account</p>
          </div>
          <SidebarItem icon={CreditCard} label="Billing" active={activeTab === 'billing'} onClick={() => { setActiveTab('billing'); setMobileMenuOpen(false); }} />
        </nav>

        <div className="p-4 border-t border-white/5 bg-zinc-950">
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-zinc-500 truncate capitalize">{currentUser.plan || 'Free Plan'}</div>
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
          <div className="flex items-center gap-2 relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 h-9 w-9 p-0 rounded-full hover:bg-white/5 relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>}
            </Button>

            {/* Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute top-12 right-0 w-80 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm">Notifications</h4>
                  <button onClick={() => setNotificationsOpen(false)}><X className="h-4 w-4 text-zinc-500 hover:text-white" /></button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500 text-sm">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n.id)}
                        className={`p-4 border-b border-zinc-800/50 hover:bg-zinc-900 cursor-pointer transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-sm font-semibold ${!n.read ? 'text-white' : 'text-zinc-400'}`}>{n.title}</span>
                          <span className="text-[10px] text-zinc-600">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Overlay for closing notifications */}
            {notificationsOpen && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setNotificationsOpen(false)}></div>}

            <Button variant="ghost" size="sm" className="text-zinc-400 h-9 w-9 p-0 rounded-full hover:bg-white/5" onClick={() => setActiveTab('billing')}>
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
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${active
        ? 'bg-primary/10 text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
      }`}
  >
    <Icon className={`h-4 w-4 transition-colors ${active ? 'text-primary' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
    {label}
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>}
  </button>
);

const OverviewTab = ({ user, setTab, setBotMode }: { user: UserContextType, setTab: (t: Tab) => void, setBotMode: (m: 'vent' | 'action') => void }) => {
  const freedomDate = new Date();
  freedomDate.setMonth(freedomDate.getMonth() + 6);
  const daysToFreedom = Math.ceil((freedomDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
          {user.plan === 'free' && (
            <Button size="sm" variant="glow" onClick={() => setTab('billing')}>Upgrade</Button>
          )}
        </div>
      </div>

      {/* The 1-2-3 Pivot Protocol */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500 fill-current" />
          Your Pivot Protocol
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-5 border-l-4 border-l-red-500 bg-zinc-900/30 hover:bg-zinc-900/60 cursor-pointer group transition-all" onClick={() => { setBotMode('vent'); setTab('bot'); }}>
            <div className="flex justify-between items-start mb-4">
              <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">Step 1</Badge>
              <MessageSquare className="h-5 w-5 text-zinc-500 group-hover:text-red-500 transition-colors" />
            </div>
            <h4 className="font-bold text-white text-lg mb-1">Vent Your Frustration</h4>
            <p className="text-sm text-zinc-400">Feeling stuck today? Tell the AI Agent. We validate the stress and clear the mental fog.</p>
            <div className="mt-4 text-xs font-bold text-red-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Start Session <ArrowRight className="h-3 w-3" />
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-primary bg-zinc-900/30 hover:bg-zinc-900/60 cursor-pointer group transition-all" onClick={() => setTab('roadmap')}>
            <div className="flex justify-between items-start mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Step 2</Badge>
              <MapIcon className="h-5 w-5 text-zinc-500 group-hover:text-primary transition-colors" />
            </div>
            <h4 className="font-bold text-white text-lg mb-1">Update Roadmap</h4>
            <p className="text-sm text-zinc-400">Review your 6-month exit timeline. Check off milestones or adjust your strategy.</p>
            <div className="mt-4 text-xs font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              View Plan <ArrowRight className="h-3 w-3" />
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-emerald-500 bg-zinc-900/30 hover:bg-zinc-900/60 cursor-pointer group transition-all" onClick={() => { setBotMode('action'); setTab('bot'); }}>
            <div className="flex justify-between items-start mb-4">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Step 3</Badge>
              <Target className="h-5 w-5 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h4 className="font-bold text-white text-lg mb-1">Execute Micro-Step</h4>
            <p className="text-sm text-zinc-400">Don't boil the ocean. The AI will give you ONE tiny, actionable task to do right now.</p>
            <div className="mt-4 text-xs font-bold text-emerald-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Get Task <ArrowRight className="h-3 w-3" />
            </div>
          </Card>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
        <div className="p-6 rounded-2xl bg-zinc-900/20 border border-white/5 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">Freedom Countdown</div>
            <div className="text-4xl font-bold text-white mb-1 tracking-tight">{daysToFreedom} <span className="text-lg text-zinc-500 font-normal">days</span></div>
            <p className="text-xs text-zinc-400 mt-2">Target Date: {new Date(new Date().setMonth(new Date().getMonth() + 6)).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/20 border border-white/5 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">Burnout Level</div>
            <div className="flex items-end gap-2 mb-3">
              <div className="text-4xl font-bold text-white tracking-tight">{user.burnoutLevel}<span className="text-zinc-600 text-xl font-normal">/10</span></div>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${user.burnoutLevel > 7 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${user.burnoutLevel * 10}%` }}></div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/20 border border-white/5 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">Financial Readiness</div>
            <div className="text-4xl font-bold text-white mb-1 tracking-tight">62%</div>
            <Button size="sm" variant="ghost" className="mt-2 h-6 px-0 text-xs text-primary hover:text-primary/80" onClick={() => setTab('calculator')}>
              Review Savings <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
