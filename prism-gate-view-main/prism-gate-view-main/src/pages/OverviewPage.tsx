import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, StatusCodeBadge, SeverityBadge } from '@/components/StatusBadges';
import { useGatewayData } from '@/hooks/use-gateway-data';
import { Activity, Server, ShieldAlert, Gauge, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function OverviewPage() {
  const { stats, services, logs, securityEvents } = useGatewayData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">NexusGate Microservices Gateway — Real-time monitoring dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Requests" value={stats.totalRequests} icon={Activity} subtitle="+2.4k today" />
        <StatCard title="Active Services" value={`${stats.activeServices}/5`} icon={Server} subtitle="All operational" />
        <StatCard title="Security Events" value={stats.securityEvents} icon={ShieldAlert} subtitle="12 unresolved" />
        <StatCard title="Rate Limited" value={stats.rateLimitEvents} icon={Gauge} subtitle="Last 24h" />
        <StatCard title="Avg Latency" value={`${stats.avgLatency}ms`} icon={Clock} subtitle="P50 response time" />
        <StatCard title="Uptime" value={`${stats.uptimePercent}%`} icon={TrendingUp} subtitle="30-day average" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services Health */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-base">Service Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map(service => (
                <div key={service.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Server className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{service.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">:{service.port} • v{service.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{service.latency}ms</span>
                    <StatusBadge status={service.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-base">Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {logs.slice(0, 8).map(log => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-primary w-10">{log.method}</span>
                    <span className="text-sm text-foreground truncate max-w-[180px]">{log.route}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusCodeBadge code={log.statusCode} />
                    <span className="text-xs text-muted-foreground">{log.responseTime}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Events */}
        <Card className="card-glow lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {securityEvents.slice(0, 6).map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <SeverityBadge severity={event.severity} />
                    <span className="text-sm text-foreground truncate">{event.message}</span>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-xs text-muted-foreground font-mono">{event.ip}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(event.timestamp), 'HH:mm:ss')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
