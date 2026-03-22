import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadges';
import { useGatewayData } from '@/hooks/use-gateway-data';
import { Server, Activity, AlertTriangle, Clock, Cpu, HardDrive } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ServicesPage() {
  const { services } = useGatewayData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Microservices</h1>
        <p className="text-sm text-muted-foreground mt-1">Service health, performance metrics, and uptime monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map(service => (
          <Card key={service.id} className="card-glow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="w-4 h-4 text-primary" />
                  {service.name}
                </CardTitle>
                <StatusBadge status={service.status} />
              </div>
              <p className="text-xs text-muted-foreground font-mono">Port {service.port} • v{service.version}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Activity className="w-3 h-3" /> Requests
                  </div>
                  <p className="text-lg font-semibold text-foreground">{service.requestCount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> Latency
                  </div>
                  <p className="text-lg font-semibold text-foreground">{service.latency}ms</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="text-foreground font-mono">{service.uptime}%</span>
                </div>
                <Progress value={service.uptime} className="h-1.5" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <AlertTriangle className="w-3 h-3" /> Error Rate
                </div>
                <span className={service.errorRate > 1 ? 'text-warning' : 'text-success'}>{service.errorRate}%</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Cpu className="w-3 h-3" />
                  CPU {Math.floor(Math.random() * 30 + 10)}%
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <HardDrive className="w-3 h-3" />
                  Mem {Math.floor(Math.random() * 40 + 20)}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
