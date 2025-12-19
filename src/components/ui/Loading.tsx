interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ message = 'Loading...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-b',
    md: 'h-12 w-12 border-b-2',
    lg: 'h-16 w-16 border-b-2',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-white mx-auto mb-4 ${sizeClasses[size]}`}
        ></div>
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>
  );
}

