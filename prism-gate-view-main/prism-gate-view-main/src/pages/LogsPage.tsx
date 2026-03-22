import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MethodBadge, StatusCodeBadge, SeverityBadge } from '@/components/StatusBadges';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGatewayData } from '@/hooks/use-gateway-data';
import { format } from 'date-fns';
import { Search, FileText, ShieldAlert, AlertCircle } from 'lucide-react';

export default function LogsPage() {
  const { logs, securityEvents } = useGatewayData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || log.route.includes(searchTerm) || log.serviceName.includes(searchTerm) || log.ip.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'success' && log.statusCode < 400) ||
      (statusFilter === 'error' && log.statusCode >= 400);
    const matchesService = serviceFilter === 'all' || log.serviceName === serviceFilter;
    return matchesSearch && matchesStatus && matchesService;
  });

  const filteredSecurity = securityEvents.filter(e => {
    return !searchTerm || e.message.toLowerCase().includes(searchTerm.toLowerCase()) || e.ip.includes(searchTerm);
  });

  const services = [...new Set(logs.map(l => l.serviceName))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Logs & Events</h1>
        <p className="text-sm text-muted-foreground mt-1">Request logs, security events, and error tracking</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search logs..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Errors</SelectItem>
          </SelectContent>
        </Select>
        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {services.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="requests">
        <TabsList className="bg-muted">
          <TabsTrigger value="requests" className="gap-1.5"><FileText className="w-3.5 h-3.5" />Request Logs</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5"><ShieldAlert className="w-3.5 h-3.5" />Security Events</TabsTrigger>
          <TabsTrigger value="errors" className="gap-1.5"><AlertCircle className="w-3.5 h-3.5" />Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card className="card-glow">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Time</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Method</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Route</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Service</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Status</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Latency</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.slice(0, 30).map(log => (
                      <tr key={log.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-xs text-muted-foreground font-mono">{format(new Date(log.timestamp), 'HH:mm:ss')}</td>
                        <td className="p-3"><MethodBadge method={log.method} /></td>
                        <td className="p-3 font-mono text-foreground">{log.route}</td>
                        <td className="p-3 text-muted-foreground">{log.serviceName}</td>
                        <td className="p-3"><StatusCodeBadge code={log.statusCode} /></td>
                        <td className="p-3 text-xs text-muted-foreground">{log.responseTime}ms</td>
                        <td className="p-3 text-xs text-muted-foreground font-mono">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredLogs.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">No logs match your filters</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="card-glow">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Time</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Severity</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Type</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Message</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Source</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSecurity.slice(0, 20).map(event => (
                      <tr key={event.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-xs text-muted-foreground font-mono">{format(new Date(event.timestamp), 'HH:mm:ss')}</td>
                        <td className="p-3"><SeverityBadge severity={event.severity} /></td>
                        <td className="p-3 text-xs font-mono text-foreground">{event.type}</td>
                        <td className="p-3 text-sm text-foreground max-w-[300px] truncate">{event.message}</td>
                        <td className="p-3 text-xs text-muted-foreground">{event.source}</td>
                        <td className="p-3 text-xs text-muted-foreground font-mono">{event.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <Card className="card-glow">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Time</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Method</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Route</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Status</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">Service</th>
                      <th className="p-3 text-left text-xs text-muted-foreground font-medium">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.filter(l => l.statusCode >= 400).slice(0, 20).map(log => (
                      <tr key={log.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-xs text-muted-foreground font-mono">{format(new Date(log.timestamp), 'HH:mm:ss')}</td>
                        <td className="p-3"><MethodBadge method={log.method} /></td>
                        <td className="p-3 font-mono text-foreground">{log.route}</td>
                        <td className="p-3"><StatusCodeBadge code={log.statusCode} /></td>
                        <td className="p-3 text-xs text-muted-foreground">{log.serviceName}</td>
                        <td className="p-3 text-xs text-muted-foreground font-mono">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredLogs.filter(l => l.statusCode >= 400).length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">No errors found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
