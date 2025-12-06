
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import SocialProof from './components/SocialProof';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import { OnboardingModal } from './components/OnboardingModal';
import { Dashboard } from './components/Dashboard';
import { APP_NAME } from './constants';
import { Button } from './components/ui/Primitives';
import { AppView, UserContextType } from './types';
import { storage } from './services/storage';

function Navbar({ onLogin }: { onLogin: () => void }) {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
          {APP_NAME}
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
          <a href="#problem" className="hover:text-white transition-colors">The Problem</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">Process</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#reviews" className="hover:text-white transition-colors">Stories</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex gap-4 items-center">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-zinc-300 hover:text-white" onClick={onLogin}>Log in</Button>
          <Button size="sm" onClick={onLogin} className="shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-none">Get Started</Button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [view, setView] = useState<AppView>('landing');
  const [user, setUser] = useState<UserContextType | null>(null);

  // Check for persisted user session using the storage service
  useEffect(() => {
    const savedUser = storage.getUser();
    if (savedUser) {
      setUser(savedUser);
      setView('dashboard');
    }
  }, []);

  const handleStart = () => {
    setView('onboarding');
  };

  const handleOnboardingComplete = (userData: UserContextType) => {
    // Check for admin email during onboarding simulation
    const role = userData.name.toLowerCase().includes('admin') ? 'admin' : 'user';
    
    // If Admin, inject admin credentials for demo
    const finalUser = role === 'admin' ? {
       ...userData,
       role: 'admin',
       name: 'System Administrator',
       currentRole: 'Super User',
       targetRole: 'System Health'
    } : { ...userData, role: 'user' };

    setUser(finalUser as UserContextType);
    storage.saveUser(finalUser as UserContextType);
    setView('dashboard');
  };

  const handleLogout = () => {
    storage.clearUser();
    setUser(null);
    setView('landing');
  };

  if (view === 'dashboard' && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {view === 'onboarding' && <OnboardingModal onComplete={handleOnboardingComplete} />}
      
      <Navbar onLogin={handleStart} />
      <main>
        <div id="hero-cta-wrapper">
           <Hero />
        </div>
        <ProblemSection />
        <HowItWorks />
        <FeaturesSection />
        <SocialProof />
        <Pricing />
        <FAQ />
        <CTA onStart={handleStart} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
