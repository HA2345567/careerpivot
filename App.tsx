
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
import { PaymentSuccess } from './components/PaymentSuccess';
import { db } from './services/db';
import { checkoutSubscription } from './services/payment';
import { useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { supabase } from './services/supabase';

function Navbar({ onLogin, user, onLogout }: { onLogin: () => void, user: UserContextType | null, onLogout: () => void }) {
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
          {user ? (
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-zinc-300 hover:text-white" onClick={onLogout}>Check Out</Button> // Or Profile
          ) : (
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-zinc-300 hover:text-white" onClick={onLogin}>Log in</Button>
          )}
          {!user && (
            <Button size="sm" onClick={onLogin} className="shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white border-none">Get Started</Button>
          )}
          {user && (
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user.name.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}



function App() {
  const { user: authUser, loading: authLoading, signOut } = useAuth();
  const [view, setView] = useState<AppView>('landing');
  const [user, setUser] = useState<UserContextType | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [defaultEmail, setDefaultEmail] = useState('');

  // Sync Auth User with App User State
  useEffect(() => {
    if (authLoading) return;

    if (authUser) {
      console.log("App: AuthUser found, fetching profile...", authUser.id);
      // Fetch profile data
      supabase.from('profiles').select('*').eq('id', authUser.id).single()
        .then(({ data, error }) => {
          if (error) {
            console.error("App: Error fetching profile", error);
            // Don't nuke user if just potential transient error, but mostly safe
            return;
          }
          if (data) {
            console.log("App: Profile loaded", data);
            const mappedUser: UserContextType = {
              email: data.email,
              name: data.full_name || authUser.email?.split('@')[0] || 'User',
              currentRole: data.current_job_title || 'Explorer',
              targetRole: data.target_job_title || 'Dream Job',
              currentSalary: data.current_salary || 0,
              monthlyExpenses: data.monthly_expenses || 0,
              burnoutLevel: data.burnout_level || 5,
              startDate: data.start_date ? new Date(data.start_date) : new Date(),
              role: (data.role as 'user' | 'admin') || 'user',
              plan: (data.plan as any) || 'free',
            };
            setUser(mappedUser);
            storage.saveUser(mappedUser);

            if (!window.location.search.includes('success=true')) {
              setView('dashboard');
            }
          }
        });
    } else {
      console.log("App: No AuthUser");
      setUser(null);
      storage.clearUser();
      setView('landing');
    }
  }, [authUser, authLoading]);

  // Check URL for payment success
  useEffect(() => {
    if (window.location.search.includes('success=true')) {
      setView('payment_success');
    }
  }, []);

  const handleStart = (email?: string) => {
    if (user) {
      setView('dashboard');
    } else {
      if (email) setDefaultEmail(email);
      setIsAuthModalOpen(true);
    }
  };

  const handleOnboardingComplete = async (userData: UserContextType) => {
    if (authUser) {
      await supabase.from('profiles').update({
        current_job_title: userData.currentRole,
        target_job_title: userData.targetRole,
        current_salary: userData.currentSalary,
        monthly_expenses: userData.monthlyExpenses,
        burnout_level: userData.burnoutLevel,
        start_date: userData.startDate.toISOString(),
      }).eq('id', authUser.id);
    }

    // Admin check simulation
    const role = (userData.name.toLowerCase().includes('admin') ? 'admin' : 'user') as 'admin' | 'user';
    const finalUser = { ...userData, role };

    setUser(finalUser);
    storage.saveUser(finalUser);
    setView('dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setView('landing');
  };

  const handlePaymentSuccess = () => {
    if (user) {
      const updatedUser = { ...user, plan: 'growth_club' as const };
      setUser(updatedUser);
      storage.saveUser(updatedUser);
    }
    setView('dashboard');
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">Loading...</div>;
  }

  if (view === 'dashboard' && user) {
    return (
      <>
        <Dashboard user={user} onLogout={handleLogout} />
      </>
    );
  }

  if (view === 'payment_success') {
    return <PaymentSuccess onContinue={handlePaymentSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultEmail={defaultEmail}
      />
      {view === 'onboarding' && <OnboardingModal onComplete={handleOnboardingComplete} />}

      <Navbar onLogin={() => setIsAuthModalOpen(true)} user={user} onLogout={handleLogout} />
      <main>
        <div id="hero-cta-wrapper">
          <Hero
            onStart={handleStart}
            onViewPricing={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          />
        </div>
        <ProblemSection />
        <HowItWorks />
        <FeaturesSection />
        <SocialProof />
        <Pricing onPlanSelect={async (priceId) => {
          if (!user) {
            setIsAuthModalOpen(true);
            return;
          }
          console.log('Initiating checkout for:', priceId);
          try {
            await checkoutSubscription(priceId);
          } catch (err) {
            console.error(err);
            alert("Checkout failed. Please check your configuration and ensure you are logged in.");
          }
        }} />
        <FAQ />
        <CTA onStart={() => handleStart()} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
