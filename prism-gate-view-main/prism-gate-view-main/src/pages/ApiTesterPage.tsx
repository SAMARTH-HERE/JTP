import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MethodBadge, StatusCodeBadge } from '@/components/StatusBadges';
import { useGatewayData } from '@/hooks/use-gateway-data';
import { useAuth } from '@/hooks/use-auth';
import { Send, Copy, Terminal } from 'lucide-react';
import { toast } from 'sonner';

export default function ApiTesterPage() {
  const { testEndpoint, routes } = useGatewayData();
  const { session } = useAuth();
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/health');
  const [token, setToken] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<{ statusCode: number; body: Record<string, unknown>; responseTime: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    setLoading(true);
    setTimeout(() => {
      const result = testEndpoint(method, endpoint, token || undefined);
      setResponse(result);
      setLoading(false);
      toast.success(`Request completed: ${result.statusCode}`);
    }, Math.random() * 500 + 200);
  };

  const handleUseSessionToken = () => {
    if (session?.access_token) {
      setToken(session.access_token);
      toast.success('Session token applied');
    } else {
      toast.error('No active session');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">API Tester</h1>
        <p className="text-sm text-muted-foreground mt-1">Test gateway endpoints interactively</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              Request Builder
            </CardTitle>
            <CardDescription>Configure and send requests through the gateway</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={endpoint} onValueChange={setEndpoint}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {routes.map(r => (
                    <SelectItem key={r.id} value={r.path}>
                      {r.method} {r.path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Authorization Token</Label>
                <Button variant="ghost" size="sm" className="text-xs text-primary h-auto p-0" onClick={handleUseSessionToken}>
                  Use session token
                </Button>
              </div>
              <Input placeholder="Bearer eyJhbG..." value={token} onChange={e => setToken(e.target.value)} className="font-mono text-xs" />
            </div>

            {(method === 'POST' || method === 'PUT') && (
              <div className="space-y-2">
                <Label>Request Body (JSON)</Label>
                <Textarea placeholder='{"key": "value"}' value={body} onChange={e => setBody(e.target.value)} className="font-mono text-xs min-h-[100px]" />
              </div>
            )}

            <Button onClick={handleSend} className="w-full" disabled={loading}>
              {loading ? 'Sending...' : <><Send className="w-4 h-4 mr-2" />Send Request</>}
            </Button>
          </CardContent>
        </Card>

        {/* Response */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="text-base">Response</CardTitle>
            {response && (
              <div className="flex items-center gap-3 mt-2">
                <StatusCodeBadge code={response.statusCode} />
                <span className="text-xs text-muted-foreground">{response.responseTime}ms</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MethodBadge method={method} />
                    <span className="text-xs font-mono text-muted-foreground">{endpoint}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(response.body, null, 2));
                    toast.success('Copied to clipboard');
                  }}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <pre className="p-4 rounded-lg bg-muted text-sm font-mono text-foreground overflow-auto max-h-[400px]">
                  {JSON.stringify(response.body, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                Send a request to see the response
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
