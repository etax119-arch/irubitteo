import { cn } from '@/lib/cn';
import type { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: string | number;
  unit?: string;
  badge?: string;
  badgeColor?: string;
  cardBorderColor?: string;
  cardBgColor?: string;
  valueColor?: string;
}

export function AdminStatCard({
  icon: Icon,
  iconBgColor,
  iconColor,
  label,
  value,
  unit = '',
  badge,
  badgeColor = 'text-green-600',
  cardBorderColor = 'border-gray-200',
  cardBgColor = 'bg-white',
  valueColor = 'text-gray-900',
}: AdminStatCardProps) {
  return (
    <div className={cn('rounded-xl p-6 border', cardBorderColor, cardBgColor)}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', iconBgColor)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
        {badge && (
          <span className={cn('text-xs font-semibold', badgeColor)}>{badge}</span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={cn('text-3xl font-bold', valueColor)}>
        {value}
        {unit}
      </p>
    </div>
  );
}
