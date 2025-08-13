import { clsx } from 'clsx';

interface AdviceSkeletonProps {
  className?: string;
}

export const AdviceSkeleton = ({ className }: AdviceSkeletonProps) => {
  return (
    <div 
      className={clsx('animate-pulse', className)}
      role="status"
      aria-label="Loading advice"
    >
      {/* Advice number skeleton */}
      <div className="text-center mb-6">
        <div className="h-4 bg-blue-600 rounded w-24 mx-auto"></div>
      </div>

      {/* Advice text skeleton */}
      <div className="text-center mb-6 space-y-3">
        <div className="h-6 bg-blue-600 rounded w-full"></div>
        <div className="h-6 bg-blue-600 rounded w-5/6 mx-auto"></div>
        <div className="h-6 bg-blue-600 rounded w-4/5 mx-auto"></div>
      </div>

      <span className="sr-only">Loading advice...</span>
    </div>
  );
};
