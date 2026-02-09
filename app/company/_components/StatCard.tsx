import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StatCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: string | number;
  valueColor?: string;
  cardBorderColor?: string;
  cardBgColor?: string;
}

export function StatCard({
  icon: Icon,
  iconBgColor,
  iconColor,
  label,
  value,
  valueColor = 'text-gray-900',
  cardBorderColor = 'border-gray-200',
  cardBgColor = 'bg-white',
}: StatCardProps) {
  return (
    <div className={cn('rounded-xl p-6 border', cardBgColor, cardBorderColor)}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', iconBgColor)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={cn('text-3xl font-bold', valueColor)}>{value}</p>
    </div>
  );
}
