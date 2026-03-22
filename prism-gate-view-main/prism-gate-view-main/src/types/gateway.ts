export interface GatewayRoute {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  targetService: string;
  requiresAuth: boolean;
  rateLimit: number;
  status: 'active' | 'inactive';
}

export interface ServiceInfo {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  latency: number;
  requestCount: number;
  errorRate: number;
  lastCheck: string;
  version: string;
  port: number;
}

export interface RequestLog {
  id: string;
  timestamp: string;
  method: string;
  route: string;
  serviceName: string;
  statusCode: number;
  responseTime: number;
  userId?: string;
  ip: string;
  userAgent: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'auth_failure' | 'rate_limit' | 'invalid_token' | 'unauthorized' | 'suspicious';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  message: string;
  ip: string;
  userId?: string;
  resolved: boolean;
}

export interface ApiTestRequest {
  method: string;
  endpoint: string;
  headers: Record<string, string>;
  body?: string;
}

export interface ApiTestResponse {
  statusCode: number;
  body: Record<string, unknown>;
  headers: Record<string, string>;
  responseTime: number;
}

export interface DashboardStats {
  totalRequests: number;
  activeServices: number;
  securityEvents: number;
  rateLimitEvents: number;
  avgLatency: number;
  uptimePercent: number;
}

export type UserRole = 'admin' | 'user';
