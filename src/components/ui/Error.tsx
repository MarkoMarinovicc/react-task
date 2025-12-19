interface ErrorProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  tip?: string;
}

export default function Error({
  message,
  onRetry,
  retryLabel = 'Retry',
  tip,
}: ErrorProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-white text-lg mb-2">Error</p>
        <p className="text-gray-400 text-sm mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {retryLabel}
          </button>
        )}
        {tip && (
          <p className="text-gray-500 text-xs mt-4">{tip}</p>
        )}
      </div>
    </div>
  );
}

