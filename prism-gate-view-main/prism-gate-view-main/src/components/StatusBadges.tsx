import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function StatusBadge({ status }: { status: 'healthy' | 'degraded' | 'down' }) {
  const config = {
    healthy: { label: 'Healthy', variant: 'success' as const },
    degraded: { label: 'Degraded', variant: 'warning' as const },
    down: { label: 'Down', variant: 'error' as const },
  };
  const c = config[status];
  return (
    <Badge variant={c.variant} className="gap-1">
      <span className={cn("w-1.5 h-1.5 rounded-full", {
        "bg-success": status === 'healthy',
        "bg-warning": status === 'degraded',
        "bg-destructive": status === 'down',
      })} />
      {c.label}
    </Badge>
  );
}

export function SeverityBadge({ severity }: { severity: 'low' | 'medium' | 'high' | 'critical' }) {
  const config = {
    low: 'secondary' as const,
    medium: 'warning' as const,
    high: 'error' as const,
    critical: 'destructive' as const,
  };
  return <Badge variant={config[severity]}>{severity}</Badge>;
}

export function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-success/15 text-success',
    POST: 'bg-primary/15 text-primary',
    PUT: 'bg-warning/15 text-warning',
    DELETE: 'bg-destructive/15 text-destructive',
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold", colors[method] || 'bg-muted text-muted-foreground')}>
      {method}
    </span>
  );
}

export function StatusCodeBadge({ code }: { code: number }) {
  const color = code < 300 ? 'text-success' : code < 400 ? 'text-primary' : code < 500 ? 'text-warning' : 'text-destructive';
  return <span className={cn("font-mono text-xs font-semibold", color)}>{code}</span>;
}
