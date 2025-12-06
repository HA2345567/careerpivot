
import { UserContextType, RoadmapData, CalculatorSettings, SkillsAnalysisData, Notification, BillingHistory } from '../types';

// Keys for LocalStorage
const KEYS = {
  USER: 'cp_user_v1',
  ROADMAP: 'cp_roadmap_v1',
  CALCULATOR: 'cp_calculator_v1',
  SKILLS: 'cp_skills_v1',
  NOTIFICATIONS: 'cp_notifications_v1',
  BILLING: 'cp_billing_v1',
};

// Mock Database Service
export const storage = {
  // User Operations
  saveUser: (user: UserContextType) => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },
  
  getUser: (): UserContextType | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  
  clearUser: () => {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.NOTIFICATIONS);
  },

  // Feature Persistence
  saveRoadmap: (data: RoadmapData) => {
    localStorage.setItem(KEYS.ROADMAP, JSON.stringify({ ...data, lastUpdated: new Date().toISOString() }));
  },

  getRoadmap: (): RoadmapData | null => {
    const data = localStorage.getItem(KEYS.ROADMAP);
    return data ? JSON.parse(data) : null;
  },

  saveCalculatorSettings: (data: CalculatorSettings) => {
    localStorage.setItem(KEYS.CALCULATOR, JSON.stringify(data));
  },

  getCalculatorSettings: (): CalculatorSettings | null => {
    const data = localStorage.getItem(KEYS.CALCULATOR);
    return data ? JSON.parse(data) : null;
  },

  saveSkillsAnalysis: (data: SkillsAnalysisData) => {
    localStorage.setItem(KEYS.SKILLS, JSON.stringify({ ...data, lastUpdated: new Date().toISOString() }));
  },

  getSkillsAnalysis: (): SkillsAnalysisData | null => {
    const data = localStorage.getItem(KEYS.SKILLS);
    return data ? JSON.parse(data) : null;
  },

  // Notifications
  getNotifications: (): Notification[] => {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (data) return JSON.parse(data);
    
    // Default welcome notifications
    return [
      {
        id: '1',
        title: 'Welcome to CareerPivot',
        message: 'Your account has been created. Start by setting your roadmap.',
        type: 'success',
        read: false,
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Complete Profile',
        message: 'Add your target salary to get precise bridge calculations.',
        type: 'info',
        read: false,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  },

  markRead: (id: string) => {
    const notes = storage.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notes));
  },

  // Billing
  getBillingHistory: (): BillingHistory[] => {
    return [
      { id: 'inv_001', date: new Date().toISOString(), amount: '$0.00', status: 'Paid', plan: 'Trial' }
    ];
  },

  upgradePlan: (plan: string) => {
    const user = storage.getUser();
    if (user) {
      storage.saveUser({ ...user, plan: plan as any });
    }
  },

  // Admin Data Mocking
  getSystemStats: () => {
    return {
      totalUsers: 12453,
      activeToday: 842,
      mrr: 145000,
      churnRate: 2.4,
      recentSignups: [
        { name: 'Alex M.', role: 'Senior Dev', target: 'Product', time: '2m ago' },
        { name: 'Sarah K.', role: 'Attorney', target: 'Ops', time: '14m ago' },
        { name: 'Jordan P.', role: 'Marketing', target: 'Growth', time: '1h ago' },
        { name: 'Taylor R.', role: 'Sales', target: 'Founder', time: '3h ago' },
        { name: 'Morgan S.', role: 'Consultant', target: 'Strategy', time: '5h ago' },
      ]
    };
  }
};
