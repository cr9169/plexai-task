interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
};

export default function Spinner({ size = 'md', label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full border-gray-200 border-t-blue-600 animate-spin`}
        role="status"
        aria-label={label ?? 'Loading'}
      />
      {label && (
        <span className="text-sm text-gray-500">{label}</span>
      )}
    </div>
  );
}
