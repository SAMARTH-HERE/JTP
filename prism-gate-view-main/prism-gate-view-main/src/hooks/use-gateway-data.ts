import { useState, useCallback } from 'react';
import { generateRequestLogs, generateSecurityEvents, getDashboardStats, services as mockServices, gatewayRoutes, simulateApiRequest } from '@/lib/mock-data';
import type { RequestLog, SecurityEvent, ServiceInfo, DashboardStats, GatewayRoute } from '@/types/gateway';

export function useGatewayData() {
  const [logs, setLogs] = useState<RequestLog[]>(() => generateRequestLogs(50));
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(() => generateSecurityEvents(25));
  const [services] = useState<ServiceInfo[]>(mockServices);
  const [stats, setStats] = useState<DashboardStats>(getDashboardStats);
  const [routes] = useState<GatewayRoute[]>(gatewayRoutes);

  const addLog = useCallback((log: Omit<RequestLog, 'id' | 'timestamp'>) => {
    const newLog: RequestLog = {
      ...log,
      id: Math.random().toString(36).substring(2, 10),
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev]);
    setStats(prev => ({ ...prev, totalRequests: prev.totalRequests + 1 }));
  }, []);

  const addSecurityEvent = useCallback((event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    const newEvent: SecurityEvent = {
      ...event,
      id: Math.random().toString(36).substring(2, 10),
      timestamp: new Date().toISOString(),
    };
    setSecurityEvents(prev => [newEvent, ...prev]);
    setStats(prev => ({ ...prev, securityEvents: prev.securityEvents + 1 }));
  }, []);

  const testEndpoint = useCallback((method: string, endpoint: string, token?: string) => {
    const result = simulateApiRequest(method, endpoint, token);
    
    addLog({
      method,
      route: endpoint,
      serviceName: routes.find(r => r.path === endpoint)?.targetService ?? 'unknown',
      statusCode: result.statusCode,
      responseTime: result.responseTime,
      ip: '127.0.0.1',
      userAgent: 'NexusGate Dashboard/1.0',
    });

    if (result.statusCode === 401 || result.statusCode === 403) {
      addSecurityEvent({
        type: result.statusCode === 401 ? 'auth_failure' : 'unauthorized',
        severity: 'medium',
        source: 'api-gateway',
        message: `${method} ${endpoint} - ${result.body.error}`,
        ip: '127.0.0.1',
        resolved: false,
      });
    }

    return result;
  }, [addLog, addSecurityEvent, routes]);

  return { logs, securityEvents, services, stats, routes, addLog, addSecurityEvent, testEndpoint };
}
