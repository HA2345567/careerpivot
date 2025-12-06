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
  subheadline: "The personalized career strategist that builds your safe exit plan—calculating salary bridges, skills gaps, and family constraints.",
  ctaPrimary: "Start My Escape Plan",
  ctaSecondary: "See How It Works",
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
    title: "Financial Fear",
    description: "You can't afford a 50% pay cut with a mortgage and tuition to pay.",
    icon: DollarSign
  }
];

export const FEATURES: Feature[] = [
  {
    title: "Salary Bridge Calculator",
    description: "We calculate exactly how much you need to save to bridge the gap between your current high salary and your dream job's starting pay.",
    icon: CalculatorIcon
  },
  {
    title: "Hidden Skills Audit",
    description: "Our AI analyzes your experience to find valuable transferable skills you didn't know you had.",
    icon: SearchIcon
  },
  {
    title: "Daily SMS Accountability",
    description: "Turn your daily venting into actionable micro-steps. We text you custom nudges to keep you moving forward.",
    icon: MessageSquare
  },
  {
    title: "Salary Negotiation AI",
    description: "Generate firm, data-backed scripts for email and phone to ensure you don't leave money on the table in your new role.",
    icon: DollarSign
  },
  {
    title: "The 'Safe Exit' Roadmap",
    description: "Get a 6, 12, or 24-month timeline tailored to your family's constraints and financial reality.",
    icon: Map
  },
  {
    title: "Network of Escapists",
    description: "Connect with former bankers, lawyers, and tech leads who successfully made the jump you're dreaming of.",
    icon: Users
  }
];

export const STEPS: Step[] = [
  {
    title: "Vent Your Frustration",
    description: "Tell our AI exactly what you hate about your job via text. We listen, validate, and analyze.",
    icon: MessageSquare
  },
  {
    title: "Get Your Roadmap",
    description: "We convert your complaints into a data-backed transition plan (6mo, 1yr, or 2yr options).",
    icon: Map
  },
  {
    title: "Execute Micro-Steps",
    description: "Receive daily, bite-sized tasks that move the needle without overwhelming your busy schedule.",
    icon: TrendingUp
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "I was a VP at a bank, making $300k but miserable. CareerPivot showed me I could move to EdTech without starting at zero. The salary bridge tool literally saved my mortgage.",
    name: "Sarah Jenkins",
    title: "Former VP Finance",
    company: "Now EdTech Strategy Lead",
    image: "https://picsum.photos/100/100?random=1"
  },
  {
    quote: "I felt guilty wanting to leave big tech. This app didn't give me generic advice. It gave me a math problem I could solve. I'm out in 6 months.",
    name: "David Chen",
    title: "Senior Engineer",
    company: "Transitioning to Climate Tech",
    image: "https://picsum.photos/100/100?random=2"
  },
  {
    quote: "The daily texts kept me sane. Instead of doom-scrolling LinkedIn, I spent 15 mins a day on actionable networking tasks.",
    name: "Elena Rodriguez",
    title: "Corporate Law Associate",
    company: "Now Non-Profit Director",
    image: "https://picsum.photos/100/100?random=3"
  }
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "The Blueprint",
    price: "$15",
    period: "/month",
    description: "For those ready to dip a toe in the water.",
    features: [
      "AI Career Assessment",
      "Daily SMS Accountability Nudges",
      "Basic Transferable Skills Audit",
      "Community Access"
    ],
    cta: "Start Basic Plan",
    bestFor: "Explorers",
    highlighted: false
  },
  {
    name: "The Exit Strategy",
    price: "$49",
    period: "/month",
    description: "The complete operating system for your career pivot.",
    features: [
      "Everything in Blueprint",
      "6/12/24 Month Detailed Roadmaps",
      "Salary Negotiation Scripts",
      "Resume Rewrite Assistant",
      "Monthly Coach Check-in (15 min)"
    ],
    cta: "Get Full Access",
    bestFor: "Committed Pivoters",
    highlighted: true
  },
  {
    name: "Executive Escape",
    price: "$2,000",
    period: "one-time",
    description: "White-glove service for high-net-worth transitions.",
    features: [
      "Dedicated Senior Career Strategist",
      "Done-For-You Personal Branding",
      "Executive Headhunter Introductions",
      "Financial Planner Consultation",
      "Lifetime Platform Access"
    ],
    cta: "Apply for Consultation",
    bestFor: "Executives",
    highlighted: false
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "I'm too busy to take on another 'project'. How much time does this take?",
    answer: "We designed this for burnt-out professionals. Most users spend 15 minutes a day engaging with our SMS prompts. We focus on micro-steps, not massive homework assignments."
  },
  {
    question: "Is my data safe? I don't want my employer to know.",
    answer: "Absolutely. We use bank-level encryption and strict privacy protocols. Your profile is anonymous to the community unless you choose otherwise. We never sell data to recruiters."
  },
  {
    question: "Does this work for specialized industries like Medicine or Law?",
    answer: "Yes. Our AI models are trained on thousands of successful transitions from highly specialized fields into adjacent corporate or creative roles."
  },
  {
    question: "What if I don't know what I want to do next?",
    answer: "That's our specialty. The 'Hidden Skills Audit' and initial SMS conversations are designed to uncover your latent interests and match them to market viability."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time with one click. No questions asked."
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
