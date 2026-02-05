import { LucideIcon } from 'lucide-react';

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
    <div className={`${cardBgColor} rounded-xl p-6 border ${cardBorderColor}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}
