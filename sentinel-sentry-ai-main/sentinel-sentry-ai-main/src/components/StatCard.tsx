import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'danger' | 'warning' | 'success';
}

const variantClasses = {
  default: 'text-foreground',
  primary: 'text-primary',
  danger: 'text-destructive',
  warning: 'text-warning',
  success: 'text-success',
};

const iconBgClasses = {
  default: 'bg-secondary',
  primary: 'bg-primary/10',
  danger: 'bg-destructive/10',
  warning: 'bg-warning/10',
  success: 'bg-success/10',
};

export default function StatCard({ title, value, subtitle, icon: Icon, variant = 'default' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-cyber p-5 border-glow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className={`text-2xl font-bold font-mono mt-1 ${variantClasses[variant]}`}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-md ${iconBgClasses[variant]}`}>
          <Icon className={`h-5 w-5 ${variantClasses[variant]}`} />
        </div>
      </div>
    </motion.div>
  );
}
