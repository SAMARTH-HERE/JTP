import { Activity, AlertTriangle, Shield, TrendingUp, Wifi } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { useTrafficSimulation } from '@/hooks/useTrafficSimulation';
import { motion } from 'framer-motion';

const COLORS = ['hsl(170,80%,50%)', 'hsl(0,75%,55%)', 'hsl(45,90%,55%)', 'hsl(280,70%,60%)', 'hsl(200,70%,50%)'];

export default function Index() {
  const { traffic, alerts, stats } = useTrafficSimulation();

  const attackDistribution = (() => {
    const counts: Record<string, number> = { Normal: 0, DoS: 0, Probe: 0, R2L: 0, U2R: 0 };
    traffic.forEach(t => counts[t.status]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  })();

  const timelineData = (() => {
    const last20 = traffic.slice(-20);
    return last20.map((t, i) => ({
      time: i,
      normal: t.status === 'Normal' ? 1 : 0,
      attack: t.status !== 'Normal' ? 1 : 0,
      bytes: Math.floor(t.bytes / 1000),
    }));
  })();

  const recentAlerts = alerts.slice(-5).reverse();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-Powered Intrusion Detection System — Real-time Monitoring</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Traffic" value={stats.totalTraffic} icon={Wifi} variant="primary" subtitle="Packets analyzed" />
          <StatCard title="Threats Detected" value={stats.totalAlerts} icon={AlertTriangle} variant="danger" subtitle={`${stats.attackRate}% attack rate`} />
          <StatCard title="Critical Alerts" value={stats.criticalAlerts} icon={Shield} variant="warning" subtitle="Requires attention" />
          <StatCard title="Detection Rate" value="96.5%" icon={TrendingUp} variant="success" subtitle="ML model accuracy" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 card-cyber p-5 border-glow">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Traffic Flow
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                <XAxis dataKey="time" stroke="hsl(220,10%,50%)" tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(220,10%,50%)" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="bytes" stroke="hsl(170,80%,50%)" fill="hsl(170,80%,50%)" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="attack" stroke="hsl(0,75%,55%)" fill="hsl(0,75%,55%)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-cyber p-5 border-glow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Attack Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={attackDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {attackDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {attackDistribution.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-cyber p-5 border-glow">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" /> Recent Alerts
          </h3>
          {recentAlerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No alerts yet. System is monitoring...</p>
          ) : (
            <div className="space-y-2">
              {recentAlerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/30 border border-border">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      alert.severity === 'critical' ? 'bg-destructive animate-pulse-glow' :
                      alert.severity === 'high' ? 'bg-destructive' :
                      alert.severity === 'medium' ? 'bg-warning' : 'bg-success'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground font-mono">{alert.srcIp} → {alert.dstIp}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-medium px-2 py-1 rounded ${
                    alert.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                    alert.severity === 'high' ? 'bg-destructive/10 text-destructive' :
                    alert.severity === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                    {alert.attackType}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
