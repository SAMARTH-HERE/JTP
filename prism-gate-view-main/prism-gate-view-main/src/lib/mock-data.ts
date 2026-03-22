import type { GatewayRoute, ServiceInfo, RequestLog, SecurityEvent, DashboardStats } from '@/types/gateway';

const randomId = () => Math.random().toString(36).substring(2, 10);
const randomIp = () => `${Math.floor(Math.random()*223)+1}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

export const gatewayRoutes: GatewayRoute[] = [
  { id: '1', path: '/auth/register', method: 'POST', targetService: 'auth-service', requiresAuth: false, rateLimit: 10, status: 'active' },
  { id: '2', path: '/auth/login', method: 'POST', targetService: 'auth-service', requiresAuth: false, rateLimit: 20, status: 'active' },
  { id: '3', path: '/auth/verify', method: 'GET', targetService: 'auth-service', requiresAuth: true, rateLimit: 50, status: 'active' },
  { id: '4', path: '/users/me', method: 'GET', targetService: 'user-service', requiresAuth: true, rateLimit: 100, status: 'active' },
  { id: '5', path: '/users/me', method: 'PUT', targetService: 'user-service', requiresAuth: true, rateLimit: 30, status: 'active' },
  { id: '6', path: '/data/items', method: 'GET', targetService: 'data-service', requiresAuth: true, rateLimit: 100, status: 'active' },
  { id: '7', path: '/data/items', method: 'POST', targetService: 'data-service', requiresAuth: true, rateLimit: 50, status: 'active' },
  { id: '8', path: '/data/items/:id', method: 'DELETE', targetService: 'data-service', requiresAuth: true, rateLimit: 20, status: 'active' },
  { id: '9', path: '/logs', method: 'GET', targetService: 'logging-service', requiresAuth: true, rateLimit: 30, status: 'active' },
  { id: '10', path: '/health', method: 'GET', targetService: 'monitor-service', requiresAuth: false, rateLimit: 200, status: 'active' },
];

export const services: ServiceInfo[] = [
  { id: '1', name: 'Auth Service', status: 'healthy', uptime: 99.98, latency: 23, requestCount: 14523, errorRate: 0.02, lastCheck: new Date().toISOString(), version: '2.4.1', port: 3001 },
  { id: '2', name: 'User Service', status: 'healthy', uptime: 99.95, latency: 31, requestCount: 8901, errorRate: 0.05, lastCheck: new Date().toISOString(), version: '1.8.3', port: 3002 },
  { id: '3', name: 'Data Service', status: 'healthy', uptime: 99.90, latency: 45, requestCount: 22310, errorRate: 0.10, lastCheck: new Date().toISOString(), version: '3.1.0', port: 3003 },
  { id: '4', name: 'Logging Service', status: 'degraded', uptime: 98.50, latency: 120, requestCount: 45200, errorRate: 1.20, lastCheck: new Date().toISOString(), version: '1.2.7', port: 3004 },
  { id: '5', name: 'Monitor Service', status: 'healthy', uptime: 99.99, latency: 12, requestCount: 3200, errorRate: 0.01, lastCheck: new Date().toISOString(), version: '1.0.5', port: 3005 },
];

const methods = ['GET', 'POST', 'PUT', 'DELETE'];
const routes = ['/auth/login', '/auth/register', '/users/me', '/data/items', '/data/items/42', '/logs', '/health'];
const serviceNames = ['auth-service', 'user-service', 'data-service', 'logging-service', 'monitor-service'];
const statusCodes = [200, 200, 200, 201, 204, 400, 401, 403, 404, 429, 500];
const userAgents = ['Mozilla/5.0 (Windows NT 10.0)', 'PostmanRuntime/7.32', 'curl/8.1.2', 'axios/1.6.0'];

export function generateRequestLogs(count: number): RequestLog[] {
  return Array.from({ length: count }, (_, i) => {
    const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
    return {
      id: randomId(),
      timestamp: new Date(Date.now() - i * 30000 - Math.random() * 60000).toISOString(),
      method: methods[Math.floor(Math.random() * methods.length)],
      route: routes[Math.floor(Math.random() * routes.length)],
      serviceName: serviceNames[Math.floor(Math.random() * serviceNames.length)],
      statusCode,
      responseTime: Math.floor(Math.random() * 500) + 10,
      userId: Math.random() > 0.3 ? `user-${Math.floor(Math.random() * 100)}` : undefined,
      ip: randomIp(),
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
    };
  });
}

const securityTypes: SecurityEvent['type'][] = ['auth_failure', 'rate_limit', 'invalid_token', 'unauthorized', 'suspicious'];
const severities: SecurityEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
const securityMessages = [
  'Failed login attempt from unknown IP',
  'Rate limit exceeded on /auth/login',
  'Invalid JWT token presented',
  'Unauthorized access to admin endpoint',
  'Suspicious request pattern detected',
  'Multiple failed auth attempts from same IP',
  'Token expired - access denied',
  'Brute force attempt detected',
];

export function generateSecurityEvents(count: number): SecurityEvent[] {
  return Array.from({ length: count }, (_, i) => ({
    id: randomId(),
    timestamp: new Date(Date.now() - i * 120000 - Math.random() * 300000).toISOString(),
    type: securityTypes[Math.floor(Math.random() * securityTypes.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    source: serviceNames[Math.floor(Math.random() * serviceNames.length)],
    message: securityMessages[Math.floor(Math.random() * securityMessages.length)],
    ip: randomIp(),
    userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 100)}` : undefined,
    resolved: Math.random() > 0.6,
  }));
}

export function getDashboardStats(): DashboardStats {
  return {
    totalRequests: 94134,
    activeServices: services.filter(s => s.status !== 'down').length,
    securityEvents: 47,
    rateLimitEvents: 128,
    avgLatency: Math.round(services.reduce((sum, s) => sum + s.latency, 0) / services.length),
    uptimePercent: 99.86,
  };
}

export function simulateApiRequest(method: string, endpoint: string, token?: string): {
  statusCode: number;
  body: Record<string, unknown>;
  responseTime: number;
} {
  const responseTime = Math.floor(Math.random() * 300) + 20;
  
  const route = gatewayRoutes.find(r => r.path === endpoint && r.method === method);
  
  if (!route) {
    return { statusCode: 404, body: { error: 'Route not found', message: `No route matches ${method} ${endpoint}` }, responseTime };
  }
  
  if (route.requiresAuth && !token) {
    return { statusCode: 401, body: { error: 'Unauthorized', message: 'Authentication token required' }, responseTime };
  }
  
  if (route.requiresAuth && token && !token.startsWith('eyJ')) {
    return { statusCode: 403, body: { error: 'Forbidden', message: 'Invalid token format' }, responseTime };
  }

  const responses: Record<string, Record<string, unknown>> = {
    '/auth/login': { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', expiresIn: 3600, userId: 'usr_1a2b3c' },
    '/auth/register': { message: 'User registered successfully', userId: 'usr_new123' },
    '/auth/verify': { valid: true, userId: 'usr_1a2b3c', role: 'admin', exp: Date.now() + 3600000 },
    '/users/me': { id: 'usr_1a2b3c', email: 'admin@nexusgate.io', role: 'admin', name: 'System Admin', createdAt: '2024-01-15' },
    '/data/items': method === 'GET' ? { items: [{ id: 1, name: 'Item A' }, { id: 2, name: 'Item B' }], total: 2 } : { message: 'Item created', id: 42 },
    '/logs': { logs: [], total: 0, page: 1 },
    '/health': { status: 'healthy', services: 5, timestamp: new Date().toISOString() },
  };

  const matchedPath = Object.keys(responses).find(p => endpoint.startsWith(p));
  
  return {
    statusCode: method === 'POST' ? 201 : 200,
    body: matchedPath ? responses[matchedPath] : { message: 'OK' },
    responseTime,
  };
}
