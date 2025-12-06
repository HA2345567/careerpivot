
import React from 'react';
import { Card, Button, Badge } from './ui/Primitives';
import { Users, DollarSign, Activity, TrendingUp, AlertCircle, Server, Database, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { storage } from '../services/storage';

export const AdminDashboard = () => {
  const stats = storage.getSystemStats();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Administration</h1>
          <p className="text-zinc-400">Platform overview and health monitoring.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
             Systems Operational
          </Badge>
          <div className="text-xs text-zinc-500 font-mono">
            v2.4.0-stable
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-zinc-900/50">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <Users className="h-5 w-5" />
             </div>
             <span className="flex items-center text-xs font-bold text-emerald-500">
                +12% <ArrowUpRight className="h-3 w-3 ml-0.5" />
             </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Total Users</div>
        </Card>

        <Card className="p-6 bg-zinc-900/50">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <DollarSign className="h-5 w-5" />
             </div>
             <span className="flex items-center text-xs font-bold text-emerald-500">
                +8% <ArrowUpRight className="h-3 w-3 ml-0.5" />
             </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">${(stats.mrr / 1000).toFixed(1)}k</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Monthly Revenue</div>
        </Card>

        <Card className="p-6 bg-zinc-900/50">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                <Activity className="h-5 w-5" />
             </div>
             <span className="flex items-center text-xs font-bold text-emerald-500">
                -0.5% <ArrowDownRight className="h-3 w-3 ml-0.5" />
             </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.churnRate}%</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Churn Rate</div>
        </Card>

        <Card className="p-6 bg-zinc-900/50">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Server className="h-5 w-5" />
             </div>
             <span className="flex items-center text-xs font-bold text-emerald-500">
                99.99%
             </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">24ms</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Avg Latency</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Live Activity Feed</h3>
              <Button size="sm" variant="outline">View All Logs</Button>
           </div>
           
           <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                 <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                    <tr>
                       <th className="px-6 py-3 font-medium">User</th>
                       <th className="px-6 py-3 font-medium">Action</th>
                       <th className="px-6 py-3 font-medium">Target</th>
                       <th className="px-6 py-3 font-medium text-right">Time</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-800">
                    {stats.recentSignups.map((user, i) => (
                       <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                          <td className="px-6 py-4 text-zinc-400">
                             <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-[10px]">New Signup</Badge>
                          </td>
                          <td className="px-6 py-4 text-zinc-300">{user.role} → {user.target}</td>
                          <td className="px-6 py-4 text-right text-zinc-500 font-mono text-xs">{user.time}</td>
                       </tr>
                    ))}
                    <tr className="hover:bg-zinc-900/30 transition-colors">
                       <td className="px-6 py-4 font-medium text-white">System</td>
                       <td className="px-6 py-4 text-zinc-400">
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">Database Backup</Badge>
                       </td>
                       <td className="px-6 py-4 text-zinc-300">Automated Snapshot</td>
                       <td className="px-6 py-4 text-right text-zinc-500 font-mono text-xs">6h ago</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>

        {/* System Health */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-white">Infrastructure</h3>
           
           <Card className="p-6 space-y-6 bg-zinc-900/30">
              <div>
                 <div className="flex justify-between mb-2 text-sm">
                    <span className="text-zinc-400 flex items-center gap-2">
                       <Database className="h-4 w-4" /> Database Load
                    </span>
                    <span className="text-white font-bold">34%</span>
                 </div>
                 <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[34%] rounded-full"></div>
                 </div>
              </div>

              <div>
                 <div className="flex justify-between mb-2 text-sm">
                    <span className="text-zinc-400 flex items-center gap-2">
                       <Server className="h-4 w-4" /> API CPU Usage
                    </span>
                    <span className="text-white font-bold">58%</span>
                 </div>
                 <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[58%] rounded-full"></div>
                 </div>
              </div>

              <div>
                 <div className="flex justify-between mb-2 text-sm">
                    <span className="text-zinc-400 flex items-center gap-2">
                       <AlertCircle className="h-4 w-4" /> Error Rate (5xx)
                    </span>
                    <span className="text-white font-bold">0.01%</span>
                 </div>
                 <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[1%] rounded-full"></div>
                 </div>
              </div>
              
              <div className="pt-4 border-t border-zinc-800">
                 <Button className="w-full" variant="outline">
                    View AWS Console
                 </Button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
