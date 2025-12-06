
import React, { useState } from 'react';
import { Button, Badge, Card } from './ui/Primitives';
import { CreditCard, Check, ShieldCheck, Zap, Loader2, Crown } from 'lucide-react';
import { storage } from '../services/storage';
import { UserContextType } from '../types';

export const SubscriptionManager = ({ user, onUpdate }: { user: UserContextType, onUpdate: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const billingHistory = storage.getBillingHistory();

  const handleUpgrade = (plan: string) => {
    setIsProcessing(true);
    // Simulate Stripe API call
    setTimeout(() => {
      storage.upgradePlan(plan);
      setIsProcessing(false);
      onUpdate();
    }, 2000);
  };

  const isPaid = user.plan !== 'free';

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Billing & Subscription</h2>
        <p className="text-zinc-400">Manage your investment in your future.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Current Plan Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4">Current Status</h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-white capitalize">
              {user.plan === 'growth_club' ? 'Growth Club' : user.plan === 'blueprint' ? 'AI Blueprint' : user.plan === 'free' ? 'Free Guide' : user.plan}
            </span>
            <Badge variant={isPaid ? 'success' : 'secondary'}>
              {isPaid ? 'Active' : 'Lead Magnet'}
            </Badge>
          </div>
          <p className="text-zinc-500 text-sm mb-6">
            {user.plan === 'growth_club' && 'You have full access to the continuity program (community + live Q&A).'}
            {user.plan === 'blueprint' && 'You are on the Frontend Offer ($15/mo). Upgrade for community access.'}
            {user.plan === 'free' && 'You are receiving the free daily confidence guide.'}
          </p>
          
          <div className="space-y-4">
             {isPaid && (
                <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                    <CreditCard className="h-5 w-5 text-zinc-400" />
                    <div className="flex-1">
                    <div className="text-sm text-white">•••• •••• •••• 4242</div>
                    <div className="text-xs text-zinc-500">Expires 12/28</div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">Update</Button>
                </div>
             )}
          </div>
        </div>

        {/* Upgrade Options Logic */}
        <div className="relative">
           {user.plan === 'growth_club' ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-indigo-900/20 to-zinc-900 border border-indigo-500/30 rounded-2xl">
                 <div className="h-16 w-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="h-8 w-8 text-indigo-400" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">You're in the Club!</h3>
                 <p className="text-zinc-400 mb-6">Your Growth Subscription is active. Next billing: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}.</p>
                 <Button variant="outline">Manage Subscription</Button>
              </div>
           ) : (
              <Card className="h-full p-6 border-indigo-500/50 bg-indigo-500/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-3">
                    <Badge variant="default" className="bg-indigo-500 text-white">Recommended</Badge>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Upgrade to Growth Club</h3>
                 <div className="text-3xl font-bold text-white mb-4">$50<span className="text-lg text-zinc-400 font-normal">/mo</span></div>
                 
                 <ul className="space-y-3 mb-8">
                    {['Full Community Access', 'Live Monthly Q&A', 'Unlimited Roadmap Gens', 'Priority Support'].map((feat, i) => (
                       <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                          <Check className="h-4 w-4 text-indigo-400" /> {feat}
                       </li>
                    ))}
                 </ul>

                 <Button 
                    className="w-full h-12 text-base shadow-lg shadow-indigo-500/20" 
                    onClick={() => handleUpgrade('growth_club')}
                    disabled={isProcessing}
                 >
                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2 fill-current" />}
                    {isProcessing ? 'Processing...' : 'Unlock Continuity Access'}
                 </Button>
              </Card>
           )}
        </div>
      </div>

      {/* Invoice History */}
      <div className="pt-8 border-t border-zinc-800">
         <h3 className="text-lg font-bold text-white mb-4">Billing History</h3>
         <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
               <thead className="text-xs text-zinc-500 uppercase bg-zinc-950 border-b border-zinc-800">
                  <tr>
                     <th className="px-6 py-3 font-medium">Date</th>
                     <th className="px-6 py-3 font-medium">Description</th>
                     <th className="px-6 py-3 font-medium">Status</th>
                     <th className="px-6 py-3 font-medium text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-800">
                  {billingHistory.map((inv) => (
                     <tr key={inv.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 text-zinc-300">{new Date(inv.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-white font-medium">CareerPivot - {inv.plan}</td>
                        <td className="px-6 py-4">
                           <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                              {inv.status}
                           </Badge>
                        </td>
                        <td className="px-6 py-4 text-right text-zinc-300 font-mono">{inv.amount}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
