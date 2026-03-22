import { useState } from 'react';
import { CheckCircle, Filter } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useTrafficSimulation } from '@/hooks/useTrafficSimulation';
import { AttackType, Severity } from '@/lib/mock-data';
import { motion } from 'framer-motion';

export default function Alerts() {
  const { alerts, setAlerts } = useTrafficSimulation();
  const [filterType, setFilterType] = useState<AttackType | 'All'>('All');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'all'>('all');

  const filtered = alerts
    .filter(a => filterType === 'All' || a.attackType === filterType)
    .filter(a => filterSeverity === 'all' || a.severity === filterSeverity)
    .slice(-50)
    .reverse();

  const acknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts Dashboard</h1>
          <p className="text-sm text-muted-foreground">{alerts.length} total alerts detected</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as AttackType | 'All')}
            className="bg-secondary text-foreground text-xs font-mono px-3 py-1.5 rounded-md border border-border"
          >
            <option value="All">All Types</option>
            <option value="DoS">DoS</option>
            <option value="Probe">Probe</option>
            <option value="R2L">R2L</option>
            <option value="U2R">U2R</option>
          </select>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value as Severity | 'all')}
            className="bg-secondary text-foreground text-xs font-mono px-3 py-1.5 rounded-md border border-border"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="card-cyber p-8 text-center border-glow">
              <p className="text-muted-foreground">No alerts match the current filters.</p>
            </div>
          ) : (
            filtered.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`card-cyber p-4 border-glow flex flex-col sm:flex-row sm:items-center gap-3 justify-between ${alert.acknowledged ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${
                    alert.severity === 'critical' ? 'bg-destructive animate-pulse-glow' :
                    alert.severity === 'high' ? 'bg-destructive' :
                    alert.severity === 'medium' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground font-mono">
                      <span>{alert.timestamp.toLocaleTimeString()}</span>
                      <span>{alert.srcIp} → {alert.dstIp}</span>
                      <span>Confidence: {(alert.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-mono font-semibold px-2 py-1 rounded ${
                    alert.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                    alert.severity === 'high' ? 'bg-destructive/10 text-destructive' :
                    alert.severity === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                    {alert.attackType}
                  </span>
                  {!alert.acknowledged && (
                    <button onClick={() => acknowledge(alert.id)} className="text-primary hover:text-primary/80 transition-colors">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
