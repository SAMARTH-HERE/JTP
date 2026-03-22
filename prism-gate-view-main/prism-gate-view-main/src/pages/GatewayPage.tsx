import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MethodBadge, StatusCodeBadge } from '@/components/StatusBadges';
import { Badge } from '@/components/ui/badge';
import { useGatewayData } from '@/hooks/use-gateway-data';
import { Network, Lock, Unlock, Gauge } from 'lucide-react';
import { format } from 'date-fns';

export default function GatewayPage() {
  const { routes, logs, stats } = useGatewayData();

  const successRate = logs.length > 0
    ? ((logs.filter(l => l.statusCode < 400).length / logs.length) * 100).toFixed(1)
    : '100';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">API Gateway</h1>
        <p className="text-sm text-muted-foreground mt-1">Centralized routing, authentication, and rate limiting</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-glow">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Total Routes</p>
            <p className="text-2xl font-bold text-foreground mt-1">{routes.length}</p>
          </CardContent>
        </Card>
        <Card className="card-glow">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold text-success mt-1">{successRate}%</p>
          </CardContent>
        </Card>
        <Card className="card-glow">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Rate Limited</p>
            <p className="text-2xl font-bold text-warning mt-1">{stats.rateLimitEvents}</p>
          </CardContent>
        </Card>
      </div>

      {/* Route Table */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            Registered Routes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-xs text-muted-foreground font-medium">Method</th>
                  <th className="pb-3 text-xs text-muted-foreground font-medium">Path</th>
                  <th className="pb-3 text-xs text-muted-foreground font-medium">Service</th>
                  <th className="pb-3 text-xs text-muted-foreground font-medium">Auth</th>
                  <th className="pb-3 text-xs text-muted-foreground font-medium">Rate Limit</th>
                  <th className="pb-3 text-xs text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {routes.map(route => (
                  <tr key={route.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3"><MethodBadge method={route.method} /></td>
                    <td className="py-3 font-mono text-foreground">{route.path}</td>
                    <td className="py-3 text-muted-foreground">{route.targetService}</td>
                    <td className="py-3">
                      {route.requiresAuth ? (
                        <span className="flex items-center gap-1 text-warning text-xs"><Lock className="w-3 h-3" />Required</span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground text-xs"><Unlock className="w-3 h-3" />Public</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Gauge className="w-3 h-3" />{route.rateLimit}/min
                      </span>
                    </td>
                    <td className="py-3">
                      <Badge variant={route.status === 'active' ? 'success' : 'error'}>{route.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="text-base">Recent Gateway Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {logs.slice(0, 15).map(log => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <MethodBadge method={log.method} />
                  <span className="text-sm text-foreground font-mono">{log.route}</span>
                  <span className="text-xs text-muted-foreground">{log.serviceName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <StatusCodeBadge code={log.statusCode} />
                  <span className="text-xs text-muted-foreground">{log.responseTime}ms</span>
                  <span className="text-xs text-muted-foreground">{format(new Date(log.timestamp), 'HH:mm:ss')}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
