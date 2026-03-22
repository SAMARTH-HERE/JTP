import DashboardLayout from '@/components/DashboardLayout';
import { useTrafficSimulation } from '@/hooks/useTrafficSimulation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['hsl(170,80%,50%)', 'hsl(0,75%,55%)', 'hsl(45,90%,55%)', 'hsl(280,70%,60%)', 'hsl(200,70%,50%)'];
const tooltipStyle = { background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: 8, fontSize: 12 };

export default function Analytics() {
  const { traffic, alerts } = useTrafficSimulation();

  const attackCounts: Record<string, number> = { DoS: 0, Probe: 0, R2L: 0, U2R: 0 };
  traffic.forEach(t => { if (t.status !== 'Normal') attackCounts[t.status]++; });
  const barData = Object.entries(attackCounts).map(([name, count]) => ({ name, count }));

  const protocolData: Record<string, number> = {};
  traffic.forEach(t => { protocolData[t.protocol] = (protocolData[t.protocol] || 0) + 1; });
  const pieData = Object.entries(protocolData).map(([name, value]) => ({ name, value }));

  const trendData: { time: string; attacks: number; normal: number }[] = [];
  const bucketSize = Math.max(1, Math.floor(traffic.length / 10));
  for (let i = 0; i < traffic.length; i += bucketSize) {
    const slice = traffic.slice(i, i + bucketSize);
    trendData.push({
      time: `T${Math.floor(i / bucketSize) + 1}`,
      attacks: slice.filter(s => s.status !== 'Normal').length,
      normal: slice.filter(s => s.status === 'Normal').length,
    });
  }

  const severityCounts = { low: 0, medium: 0, high: 0, critical: 0 };
  alerts.forEach(a => severityCounts[a.severity]++);
  const severityData = Object.entries(severityCounts).map(([name, value]) => ({ name, value }));
  const sevColors = ['hsl(145,70%,45%)', 'hsl(45,90%,55%)', 'hsl(0,75%,55%)', 'hsl(0,90%,40%)'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Network traffic analysis and threat intelligence</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-cyber p-5 border-glow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Attack Type Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                <XAxis dataKey="name" stroke="hsl(220,10%,50%)" tick={{ fontSize: 11 }} />
                <YAxis stroke="hsl(220,10%,50%)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="hsl(170,80%,50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-cyber p-5 border-glow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Traffic Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                <XAxis dataKey="time" stroke="hsl(220,10%,50%)" tick={{ fontSize: 11 }} />
                <YAxis stroke="hsl(220,10%,50%)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="normal" stroke="hsl(170,80%,50%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="attacks" stroke="hsl(0,75%,55%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-cyber p-5 border-glow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Protocol Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" stroke="none" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-cyber p-5 border-glow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Alert Severity Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={severityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                <XAxis type="number" stroke="hsl(220,10%,50%)" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" stroke="hsl(220,10%,50%)" tick={{ fontSize: 11 }} width={60} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {severityData.map((_, i) => <Cell key={i} fill={sevColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
