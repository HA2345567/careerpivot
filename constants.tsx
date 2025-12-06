
import {
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Users,
  Map,
  MessageSquare,
  Clock,
  DollarSign,
  BrainCircuit,
  Lock
} from "lucide-react";
import { Feature, Step, Testimonial, PricingTier, FAQItem } from "./types";

export const APP_NAME = "CareerPivot";

export const HERO_CONTENT = {
  headline: "Break Free From Golden Handcuffs Without Going Broke.",
  subheadline: "The strategic career operating system for busy professionals. Start with our free daily confidence guide and scale your escape plan.",
  ctaPrimary: "Get Free Daily Guide",
  ctaSecondary: "View Transition Plans",
  socialProof: "Join 10,000+ professionals reclaiming their Monday mornings."
};

export const TRUST_INDICATORS = [
  "Goldman Sachs",
  "Google",
  "Deloitte",
  "J.P. Morgan",
  "Amazon"
];

export const PAIN_POINTS = [
  {
    title: "Trapped by 'Golden Handcuffs'",
    description: "You're paid too well to leave, but the stress is impacting your health and family life.",
    icon: Lock
  },
  {
    title: "Analysis Paralysis",
    description: "You have 20 tabs open about career changes but no concrete plan to actually make the leap.",
    icon: BrainCircuit
  },
  {
    title: "Zero Free Time",
    description: "Between the job and the kids, you don't have 10 hours a week to 'upskill'. You need 15-minute wins.",
    icon: Clock
  }
];

export const FEATURES: Feature[] = [
  {
    title: "Daily SMS Accountability",
    description: "Our core feature. Text us your venting, we text back a micro-step. Designed for busy schedules.",
    icon: MessageSquare
  },
  {
    title: "Salary Bridge Calculator",
    description: "Calculate exactly how much you need to save to bridge the gap between your high salary and a new path.",
    icon: CalculatorIcon
  },
  {
    title: "The 'Safe Exit' Roadmap",
    description: "Get a 6, 12, or 24-month timeline tailored to your mortgage, tuition, and family constraints.",
    icon: Map
  },
  {
    title: "Hidden Skills Audit",
    description: "Our AI analyzes your finance/legal background to find transferable skills for tech or startups.",
    icon: SearchIcon
  },
  {
    title: "Salary Negotiation AI",
    description: "Generate firm, data-backed scripts so you don't lose your earning power when you pivot.",
    icon: DollarSign
  },
  {
    title: "Network of Escapists",
    description: "Connect with former bankers and lawyers who successfully made the jump you're dreaming of.",
    icon: Users
  }
];

export const STEPS: Step[] = [
  {
    title: "Text Us Your Stress",
    description: "Don't bottle it up. Text our AI exactly what frustrated you today. We listen and validate.",
    icon: MessageSquare
  },
  {
    title: "Get Your Roadmap",
    description: "We convert that data into a realistic 6-month transition plan that respects your busy schedule.",
    icon: Map
  },
  {
    title: "Do One Micro-Step",
    description: "Receive one bite-sized task daily (e.g., 'Update 1 resume bullet') that moves the needle.",
    icon: TrendingUp
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "I was a VP at a bank, making $300k but miserable. The daily text prompts were the only thing I had time for. It kept me moving without overwhelming me.",
    name: "Sarah Jenkins",
    title: "Former VP Finance",
    company: "Now EdTech Strategy Lead",
    image: "https://picsum.photos/100/100?random=1"
  },
  {
    quote: "With two kids and a mortgage, I couldn't take a risk. The calculator showed me exactly how to bridge the salary gap. I felt safe quitting.",
    name: "David Chen",
    title: "Senior Manager",
    company: "Transitioning to Climate Tech",
    image: "https://picsum.photos/100/100?random=2"
  },
  {
    quote: "Simple, effective, and cheap. For $15/month, having a bot nag me to fix my LinkedIn was the best ROI I've had all year.",
    name: "Elena Rodriguez",
    title: "Corporate Law Associate",
    company: "Now Non-Profit Director",
    image: "https://picsum.photos/100/100?random=3"
  }
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "AI Blueprint",
    price: "$15",
    period: "/month",
    description: "The Frontend Offer. Convert daily frustrations into actionable steps.",
    features: [
      "Daily SMS Accountability Bot",
      "Basic AI Venting & Validation",
      "Upskilling Suggestion Engine",
      "Weekly Progress Logs"
    ],
    cta: "Start Blueprint ($15)",
    priceId: "price_1Pxyz...", // Replace with real Stripe Price ID
    bestFor: "Validating Your Pivot",
    highlighted: false
  },
  {
    name: "Growth Subscription",
    price: "$50",
    period: "/month",
    description: "The Continuity Program. Sustained guidance and premium tools.",
    features: [
      "Everything in Blueprint",
      "Full Salary Bridge Calculator",
      "Unlimited Roadmap Generations",
      "Private Community Access",
      "Monthly Live Q&A"
    ],
    cta: "Join Growth Club",
    priceId: "price_2Pxyz...", // Replace with real Stripe Price ID
    bestFor: "Committed Career Shifters",
    highlighted: true
  },
  {
    name: "Transformation Program",
    price: "$2,000",
    period: "one-time",
    description: "The Core Offer. A comprehensive, structured path to exit.",
    features: [
      "Lifetime Platform Access",
      "1-on-1 Strategy Kickoff Call",
      "Personalized Exit Roadmap",
      "Resume & LinkedIn Rewrite",
      "Negotiation Coaching"
    ],
    cta: "Apply for Program",
    priceId: "price_3Pxyz...", // Replace with real Stripe Price ID
    bestFor: "Full Career Reinvention",
    highlighted: false
  }
];

// High Ticket Backend Offer
export const EXECUTIVE_OFFER = {
  name: "Executive Escape Strategy",
  price: "$10,000+",
  description: "Bespoke consulting for VP/C-Suite leaders needing a discreet, high-value pivot.",
  features: ["Private Concierge", "Done-For-You Branding", "Board Placement Intro"]
};

export const FAQS: FAQItem[] = [
  {
    question: "How is the $15 Blueprint different from the free guide?",
    answer: "The free guide is a daily tip. The $15 Blueprint is an interactive SMS bot that listens to your specific situation and gives you custom micro-tasks based on your goals."
  },
  {
    question: "What does the $2,000 Core Program include?",
    answer: "It's a high-touch program that includes manual work from our team—resume writing, personal branding, and a 1-on-1 strategy session to map your exit in detail."
  },
  {
    question: "I work 60+ hours a week. Do I have time for this?",
    answer: "Yes. That's exactly who we built this for. Our 'Micro-Step' system takes less than 15 minutes a day, often done via text while commuting or on a lunch break."
  },
  {
    question: "Is my data safe from my employer?",
    answer: "Absolutely. We use bank-level encryption. Your profile is anonymous, and we never sell data to recruiters or ad networks."
  },
  {
    question: "Can I cancel the subscription?",
    answer: "Yes, cancel the Blueprint or Growth subscription instantly with one click. No questions asked."
  }
];

// Helper icons needed for the component
function CalculatorIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  )
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
