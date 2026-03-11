import MetricBadge from './MetricBadge';

export interface MetricCardProps {
  label: string;
  value: string;
  badgeVariant: 'green' | 'yellow' | 'red' | 'grey';
  badgeLabel: string;
  note?: string;
}

export default function MetricCard({ label, value, badgeVariant, badgeLabel, note }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      <div className="mt-2">
        <MetricBadge variant={badgeVariant} label={badgeLabel} />
      </div>
      {note && (
        <p className="mt-2 text-xs text-gray-400 italic">{note}</p>
      )}
    </div>
  );
}
