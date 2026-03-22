import { Pause, Play } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useTrafficSimulation } from '@/hooks/useTrafficSimulation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const severityColor: Record<string, string> = {
  low: 'text-success',
  medium: 'text-warning',
  high: 'text-destructive',
  critical: 'text-destructive animate-pulse-glow',
};

const statusBadge: Record<string, string> = {
  Normal: 'bg-success/10 text-success',
  DoS: 'bg-destructive/10 text-destructive',
  Probe: 'bg-warning/10 text-warning',
  R2L: 'bg-accent/10 text-accent',
  U2R: 'bg-destructive/10 text-destructive',
};

export default function LiveMonitoring() {
  const { traffic, isRunning, setIsRunning } = useTrafficSimulation(800);
  const recent = traffic.slice(-30).reverse();

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Live Monitoring</h1>
            <p className="text-sm text-muted-foreground">Real-time network traffic analysis</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
            className="gap-2 font-mono text-xs"
          >
            {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {isRunning ? 'PAUSE' : 'RESUME'}
          </Button>
        </div>

        <div className="card-cyber border-glow scanline overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left p-3 font-medium">Time</th>
                  <th className="text-left p-3 font-medium">Source IP</th>
                  <th className="text-left p-3 font-medium">Dest IP</th>
                  <th className="text-left p-3 font-medium">Protocol</th>
                  <th className="text-left p-3 font-medium">Port</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Confidence</th>
                  <th className="text-left p-3 font-medium">Severity</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                <AnimatePresence initial={false}>
                  {recent.map((entry) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`border-b border-border/50 ${entry.status !== 'Normal' ? 'bg-destructive/5' : ''}`}
                    >
                      <td className="p-3 text-muted-foreground">{entry.timestamp.toLocaleTimeString()}</td>
                      <td className="p-3 text-foreground">{entry.srcIp}</td>
                      <td className="p-3 text-foreground">{entry.dstIp}</td>
                      <td className="p-3 text-primary">{entry.protocol}</td>
                      <td className="p-3 text-muted-foreground">{entry.port}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusBadge[entry.status]}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="p-3 text-foreground">{(entry.confidence * 100).toFixed(1)}%</td>
                      <td className={`p-3 uppercase font-semibold ${severityColor[entry.severity]}`}>
                        {entry.severity}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
