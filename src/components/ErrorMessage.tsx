import type { ErrorMessageProps } from '../types';

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div 
      className="text-center p-4 bg-red-50 border border-red-200 rounded-lg"
      role="alert"
      aria-live="polite"
    >
      <p className="text-red-700 text-sm font-medium mb-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-red-600 hover:text-red-800 text-sm underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
          type="button"
        >
          Try again
        </button>
      )}
    </div>
  );
};
