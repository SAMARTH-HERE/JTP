// Simulated IDS data

export type AttackType = 'Normal' | 'DoS' | 'Probe' | 'R2L' | 'U2R';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface TrafficEntry {
  id: string;
  timestamp: Date;
  srcIp: string;
  dstIp: string;
  protocol: string;
  port: number;
  status: AttackType;
  confidence: number;
  severity: Severity;
  bytes: number;
}

export interface Alert {
  id: string;
  timestamp: Date;
  attackType: AttackType;
  srcIp: string;
  dstIp: string;
  severity: Severity;
  confidence: number;
  description: string;
  acknowledged: boolean;
}

const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'SSH', 'FTP', 'DNS'];
const attackDescriptions: Record<Exclude<AttackType, 'Normal'>, string[]> = {
  DoS: ['SYN flood detected', 'UDP flood attack', 'HTTP flood attempt', 'Slowloris attack'],
  Probe: ['Port scan detected', 'Network sweep', 'Vulnerability scan', 'OS fingerprinting'],
  R2L: ['Brute force login', 'Password guessing', 'Unauthorized access attempt', 'Phishing attempt'],
  U2R: ['Privilege escalation', 'Buffer overflow attempt', 'Rootkit installation', 'Kernel exploit'],
};

function randomIp(): string {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function randomAttackType(): AttackType {
  const r = Math.random();
  if (r < 0.6) return 'Normal';
  if (r < 0.78) return 'DoS';
  if (r < 0.88) return 'Probe';
  if (r < 0.95) return 'R2L';
  return 'U2R';
}

function getSeverity(type: AttackType): Severity {
  if (type === 'Normal') return 'low';
  if (type === 'DoS') return Math.random() > 0.3 ? 'high' : 'critical';
  if (type === 'Probe') return Math.random() > 0.5 ? 'medium' : 'high';
  if (type === 'R2L') return Math.random() > 0.4 ? 'high' : 'critical';
  return 'critical';
}

export function generateTrafficEntry(): TrafficEntry {
  const status = randomAttackType();
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    srcIp: randomIp(),
    dstIp: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    port: [22, 80, 443, 3306, 8080, 21, 53, 8443][Math.floor(Math.random() * 8)],
    status,
    confidence: status === 'Normal' ? 0.92 + Math.random() * 0.08 : 0.7 + Math.random() * 0.28,
    severity: getSeverity(status),
    bytes: Math.floor(Math.random() * 50000) + 64,
  };
}

export function generateAlert(entry: TrafficEntry): Alert | null {
  if (entry.status === 'Normal') return null;
  const descs = attackDescriptions[entry.status];
  return {
    id: crypto.randomUUID(),
    timestamp: entry.timestamp,
    attackType: entry.status,
    srcIp: entry.srcIp,
    dstIp: entry.dstIp,
    severity: entry.severity,
    confidence: entry.confidence,
    description: descs[Math.floor(Math.random() * descs.length)],
    acknowledged: false,
  };
}

export function generateHistoricalData(count: number): TrafficEntry[] {
  const entries: TrafficEntry[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const entry = generateTrafficEntry();
    entry.timestamp = new Date(now - (count - i) * 2000);
    entries.push(entry);
  }
  return entries;
}

export const modelMetrics = {
  accuracy: 0.9647,
  precision: 0.9523,
  recall: 0.9481,
  f1Score: 0.9502,
  confusionMatrix: [
    [9432, 87, 23, 12, 4],
    [54, 3821, 31, 8, 2],
    [18, 42, 2156, 14, 6],
    [9, 5, 11, 876, 3],
    [2, 1, 4, 7, 198],
  ],
  labels: ['Normal', 'DoS', 'Probe', 'R2L', 'U2R'] as AttackType[],
  featureImportance: [
    { feature: 'src_bytes', importance: 0.182 },
    { feature: 'dst_bytes', importance: 0.156 },
    { feature: 'count', importance: 0.134 },
    { feature: 'srv_count', importance: 0.121 },
    { feature: 'serror_rate', importance: 0.098 },
    { feature: 'dst_host_count', importance: 0.087 },
    { feature: 'logged_in', importance: 0.072 },
    { feature: 'same_srv_rate', importance: 0.063 },
    { feature: 'diff_srv_rate', importance: 0.048 },
    { feature: 'duration', importance: 0.039 },
  ],
};
