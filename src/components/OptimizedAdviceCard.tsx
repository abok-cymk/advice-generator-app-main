import { AdviceCard as SuspenseAdviceCard } from './AdviceCardSuspense';
import { AdviceSkeleton } from './AdviceSkeleton';
import { ErrorBoundary } from './ErrorBoundary';
import { Suspense } from 'react';

// Fast initial render component for better LCP
const StaticAdviceCard = () => {
  return (
    <div className="w-full max-w-md mx-auto advice-card">
      <div className="relative bg-blue-900 rounded-2xl p-6 md:p-8 shadow-lg">
        {/* Advice Number */}
        <div className="text-center mb-6">
          <span className="text-green-300 text-xs md:text-sm font-extrabold uppercase tracking-[0.3em]">
            Advice #0
          </span>
        </div>

        {/* Static Advice Content for immediate LCP */}
        <div className="text-center mb-6 min-h-[100px] flex items-center justify-center">
          <blockquote 
            className="text-blue-200 text-xl md:text-2xl leading-relaxed font-extrabold advice-lcp transform-gpu"
            style={{ minHeight: '3.5rem' }}
          >
            "Click the button below to get your first piece of advice!"
          </blockquote>
        </div>

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
              loading="eager"
              decoding="sync"
            />
          </picture>
        </div>

        {/* Dice Button */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out transform-gpu hover:bg-green-400 hover:scale-110 hover:shadow-lg hover:shadow-green-300/50 focus:outline-none focus:ring-4 focus:ring-green-300/50 focus:scale-110 active:scale-95"
            type="button"
            aria-label="Get new advice"
            disabled
          >
            <img 
              src="/icon-dice.svg" 
              alt="" 
              className="w-6 h-6"
              role="presentation"
              loading="eager"
              decoding="sync"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export const OptimizedAdviceCard = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="text-center text-red-400 p-8">
          <p>Something went wrong loading the advice.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-green-300 text-blue-900 rounded hover:bg-green-400"
          >
            Try again
          </button>
        </div>
      }
    >
      <Suspense 
        fallback={
          <div className="relative">
            <StaticAdviceCard />
            <div className="absolute inset-0 flex items-center justify-center">
              <AdviceSkeleton className="opacity-50" />
            </div>
          </div>
        }
      >
        <SuspenseAdviceCard />
      </Suspense>
    </ErrorBoundary>
  );
};
