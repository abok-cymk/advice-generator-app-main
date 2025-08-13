import { Suspense } from 'react';
import { AdviceCard } from './AdviceCardSuspense';
import { AdviceSkeleton } from './AdviceSkeleton';
import { ErrorBoundary } from './ErrorBoundary';

const SuspenseFallback = () => (
  <div className="w-full max-w-md mx-auto">
    <div className="relative bg-blue-900 rounded-2xl p-6 md:p-8 shadow-lg">
      <AdviceSkeleton />
      
      {/* Divider */}
      <div className="flex justify-center mb-6">
        <picture>
          <source 
            media="(min-width: 768px)" 
            srcSet="/pattern-divider-desktop.svg"
          />
          <img 
            src="/pattern-divider-mobile.svg" 
            alt="" 
            className="w-auto h-4"
            role="presentation"
          />
        </picture>
      </div>

      {/* Loading Dice Button */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center animate-pulse">
          <img 
            src="/icon-dice.svg" 
            alt="" 
            className="w-6 h-6 animate-spin"
            role="presentation"
          />
        </div>
      </div>
    </div>
  </div>
);

export const AdviceCardWithSuspense = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SuspenseFallback />}>
        <AdviceCard />
      </Suspense>
    </ErrorBoundary>
  );
};
