interface BadgeProps {
  label: string;
  variant: 'blue' | 'green' | 'yellow' | 'red' | 'grey';
}

const variantClasses: Record<BadgeProps['variant'], string> = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  grey: 'bg-gray-100 text-gray-600',
};

export default function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}
