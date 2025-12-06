
import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  image: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  priceId: string;
  highlighted?: boolean;
  bestFor: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type UserRole = 'user' | 'admin';

export interface UserContextType {
  email?: string;
  name: string;
  currentRole: string;
  targetRole: string;
  currentSalary: number;
  monthlyExpenses: number;
  burnoutLevel: number; // 1-10
  startDate: Date;
  role: UserRole;
  avatarId?: number;
  // Updated plan types for Value Ladder
  plan: 'free' | 'blueprint' | 'growth_club' | 'transformation' | 'executive';
}

export interface RoadmapData {
  summary: string;
  phases: {
    name: string;
    duration: string;
    focus: string;
    tasks: string[];
  }[];
  lastUpdated: string;
}

export interface CalculatorSettings {
  currentSalary: number;
  monthlyExpenses: number;
  transitionMonths: number;
  targetSalary: number;
}

export interface SkillsAnalysisData {
  skills: { name: string; description: string }[];
  roles: { title: string; matchReason: string }[];
  lastUpdated: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  timestamp: string;
}

export interface BillingHistory {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending';
  plan: string;
}

export type AppView = 'landing' | 'onboarding' | 'dashboard' | 'payment_success';
