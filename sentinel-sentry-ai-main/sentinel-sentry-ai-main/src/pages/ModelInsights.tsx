import DashboardLayout from '@/components/DashboardLayout';
import { modelMetrics } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Brain, Target, Crosshair, TrendingUp } from 'lucide-react';
import StatCard from '@/components/StatCard';

const tooltipStyle = { background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: 8, fontSize: 12 };

export default function ModelInsights() {
  const { accuracy, precision, recall, f1Score, confusionMatrix, labels, featureImportance } = modelMetrics;

  const maxVal = Math.max(...confusionMatrix.flat());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Model Insights</h1>
          <p className="text-sm text-muted-foreground">Random Forest Classifier — NSL-KDD Dataset</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Accuracy" value={`${(accuracy * 100).toFixed(2)}%`} icon={Target} variant="primary" />
          <StatCard title="Precision" value={`${(precision * 100).toFixed(2)}%`} icon={Crosshair} variant="success" />
          <StatCard title="Recall" value={`${(recall * 100).toFixed(2)}%`} icon={TrendingUp} variant="warning" />
          <StatCard title="F1 Score" value={f1Score.toFixed(4)} icon={Brain} variant="primary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-cyber p-5 border-glow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Confusion Matrix</h3>
            <div className="overflow-x-auto">
              <table className="mx-auto">
                <thead>
                  <tr>
                    <th className="p-1" />
                    {labels.map(l => (
                      <th key={l} className="p-1 text-[10px] text-muted-foreground font-mono text-center">{l}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {confusionMatrix.map((row, i) => (
                    <tr key={i}>
                      <td className="p-1 text-[10px] text-muted-foreground font-mono pr-2 text-right">{labels[i]}</td>
                      {row.map((val, j) => {
                        const intensity = val / maxVal;
                        const bg = i === j
                          ? `hsla(170,80%,50%,${intensity * 0.6})`
                          : val > 0 ? `hsla(0,75%,55%,${intensity * 0.4})` : 'transparent';
                        return (
                          <td
                            key={j}
                            className="p-1 text-center text-xs font-mono text-foreground w-12 h-10 border border-border/30"
                            style={{ background: bg }}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center gap-4 mt-3 text-[10px] text-muted-foreground">
              <span>↓ Actual</span><span>→ Predicted</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-cyber p-5 border-glow">
            <h3 className="text-sm font-semibold text-foreground mb-4">Feature Importance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureImportance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                <XAxis type="number" stroke="hsl(220,10%,50%)" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="feature" stroke="hsl(220,10%,50%)" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} width={100} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="importance" fill="hsl(170,80%,50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
