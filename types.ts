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
  highlighted?: boolean;
  bestFor: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface UserContextType {
  name: string;
  currentRole: string;
  targetRole: string;
  currentSalary: number;
  burnoutLevel: number; // 1-10
  startDate: Date;
}

export type AppView = 'landing' | 'onboarding' | 'dashboard';
