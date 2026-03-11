import type { HighlightOrRisk } from '../../types/property.types';

interface AnalysisItemCardProps {
  item: HighlightOrRisk;
  variant: 'highlight' | 'risk';
}

const variantStyles = {
  highlight: {
    border: 'border-green-500',
    bg: 'bg-green-50',
    title: 'text-green-800',
    description: 'text-green-700',
  },
  risk: {
    border: 'border-red-500',
    bg: 'bg-red-50',
    title: 'text-red-800',
    description: 'text-red-700',
  },
};

export default function AnalysisItemCard({ item, variant }: AnalysisItemCardProps) {
  const styles = variantStyles[variant];
  return (
    <div className={`border-l-4 ${styles.border} ${styles.bg} rounded-r-md p-4`}>
      <p className={`text-sm font-semibold ${styles.title}`}>{item.title}</p>
      <p className={`mt-1 text-sm ${styles.description}`}>{item.description}</p>
    </div>
  );
}
