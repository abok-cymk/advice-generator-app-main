import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import type { AdviceCardProps } from '../types';
import { AdviceSkeleton } from './AdviceSkeleton';
import { ErrorMessage } from './ErrorMessage';

export const AdviceCard = ({ 
  advice, 
  isLoading, 
  error, 
  onGetNewAdvice 
}: AdviceCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayAdvice, setDisplayAdvice] = useState(advice);

  // Handle smooth transitions when advice changes
  useEffect(() => {
    if (advice && advice !== displayAdvice) {
      setIsAnimating(true);
      
      // Delay showing new advice to allow fade out
      const timer = setTimeout(() => {
        setDisplayAdvice(advice);
        setIsAnimating(false);
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [advice, displayAdvice]);

  const handleGetNewAdvice = () => {
    if (!isLoading) {
      onGetNewAdvice();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative bg-blue-900 rounded-2xl p-6 md:p-8 shadow-lg">
        {/* Advice Number */}
        <div className="text-center mb-6">
          <span 
            className="text-green-300 text-xs md:text-sm font-extrabold uppercase tracking-[0.3em]"
            aria-label={displayAdvice ? `Advice number ${displayAdvice.id}` : 'Loading advice'}
          >
            {displayAdvice ? `Advice #${displayAdvice.id}` : 'Advice #...'}
          </span>
        </div>

        {/* Advice Content */}
        <div className="text-center mb-6 min-h-[100px] flex items-center justify-center">
          {error ? (
            <ErrorMessage message={error} onRetry={onGetNewAdvice} />
          ) : isLoading ? (
            <AdviceSkeleton />
          ) : (
            <blockquote 
              className={clsx(
                'text-blue-200 text-xl md:text-2xl leading-relaxed transition-opacity duration-150',
                isAnimating ? 'opacity-0' : 'opacity-100'
              )}
              cite="https://api.adviceslip.com"
            >
              {displayAdvice ? (
                `"${displayAdvice.text}"`
              ) : (
                '"Click the button below to get your first piece of advice!"'
              )}
            </blockquote>
          )}
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
            />
          </picture>
        </div>

        {/* Dice Button */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleGetNewAdvice}
            disabled={isLoading}
            className={clsx(
              'w-12 h-12 bg-green-300 rounded-full flex items-center justify-center',
              'transition-all duration-200 ease-in-out',
              'hover:bg-green-400 hover:scale-110 hover:shadow-lg hover:shadow-green-300/50',
              'focus:outline-none focus:ring-4 focus:ring-green-300/50 focus:scale-110',
              'active:scale-95',
              'disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-green-300',
              isLoading && 'animate-pulse'
            )}
            type="button"
            aria-label={isLoading ? 'Loading new advice...' : 'Get new advice'}
          >
            <img 
              src="/icon-dice.svg" 
              alt="" 
              className={clsx(
                'w-6 h-6 transition-transform duration-200',
                isLoading && 'animate-spin'
              )}
              role="presentation"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
