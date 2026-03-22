import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SeverityBadge } from '@/components/StatusBadges';
import { StatCard } from '@/components/StatCard';
import { useGatewayData } from '@/hooks/use-gateway-data';
import { useAuth } from '@/hooks/use-auth';
import { ShieldCheck, Users, AlertTriangle, Lock, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Navigate } from 'react-router-dom';

export default function AdminPage() {
  const { role } = useAuth();
  const { securityEvents, logs, stats } = useGatewayData();

  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const failedLogins = securityEvents.filter(e => e.type === 'auth_failure');
  const unresolvedEvents = securityEvents.filter(e => !e.resolved);
  const criticalEvents = securityEvents.filter(e => e.severity === 'critical' || e.severity === 'high');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Security oversight, access control, and system audit</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Security Events" value={stats.securityEvents} icon={ShieldCheck} subtitle={`${unresolvedEvents.length} unresolved`} />
        <StatCard title="Failed Logins" value={failedLogins.length} icon={Lock} subtitle="Last 24h" />
        <StatCard title="Critical Alerts" value={criticalEvents.length} icon={AlertTriangle} subtitle="Needs attention" />
        <StatCard title="Active Sessions" value={42} icon={Users} subtitle="Online now" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unresolved Security Events */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Unresolved Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unresolvedEvents.slice(0, 10).map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <SeverityBadge severity={event.severity} />
                    <span className="text-sm text-foreground truncate">{event.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-3">{format(new Date(event.timestamp), 'HH:mm')}</span>
                </div>
              ))}
              {unresolvedEvents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">All events resolved</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Access Attempts */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              Recent Access Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {failedLogins.slice(0, 10).map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Badge variant="error">Failed</Badge>
                    <span className="text-xs font-mono text-muted-foreground">{event.ip}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{format(new Date(event.timestamp), 'HH:mm:ss')}</span>
                </div>
              ))}
              {failedLogins.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No failed login attempts</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card className="card-glow lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Role-Based Access Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-3 text-left text-xs text-muted-foreground">Permission</th>
                    <th className="p-3 text-center text-xs text-muted-foreground">Admin</th>
                    <th className="p-3 text-center text-xs text-muted-foreground">User</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { perm: 'View Dashboard', admin: true, user: true },
                    { perm: 'API Gateway Routes', admin: true, user: true },
                    { perm: 'Service Monitoring', admin: true, user: true },
                    { perm: 'View Logs', admin: true, user: false },
                    { perm: 'API Tester', admin: true, user: true },
                    { perm: 'Security Events', admin: true, user: false },
                    { perm: 'Manage Users', admin: true, user: false },
                    { perm: 'System Configuration', admin: true, user: false },
                  ].map(row => (
                    <tr key={row.perm} className="border-b border-border/30">
                      <td className="p-3 text-foreground">{row.perm}</td>
                      <td className="p-3 text-center">
                        <Badge variant={row.admin ? 'success' : 'error'}>{row.admin ? '✓' : '✗'}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant={row.user ? 'success' : 'error'}>{row.user ? '✓' : '✗'}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
