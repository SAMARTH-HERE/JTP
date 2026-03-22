import { useState, useEffect, useCallback } from 'react';
import { generateTrafficEntry, generateAlert, generateHistoricalData, TrafficEntry, Alert } from '@/lib/mock-data';

export function useTrafficSimulation(intervalMs = 1500) {
  const [traffic, setTraffic] = useState<TrafficEntry[]>(() => generateHistoricalData(50));
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isRunning, setIsRunning] = useState(true);

  const addEntry = useCallback(() => {
    const entry = generateTrafficEntry();
    setTraffic(prev => [...prev.slice(-199), entry]);
    const alert = generateAlert(entry);
    if (alert) {
      setAlerts(prev => [...prev.slice(-99), alert]);
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(addEntry, intervalMs);
    return () => clearInterval(id);
  }, [isRunning, intervalMs, addEntry]);

  const stats = {
    totalTraffic: traffic.length,
    totalAlerts: alerts.length,
    attackRate: traffic.length > 0 
      ? ((traffic.filter(t => t.status !== 'Normal').length / traffic.length) * 100).toFixed(1) 
      : '0',
    criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
  };

  return { traffic, alerts, stats, isRunning, setIsRunning, setAlerts };
}
