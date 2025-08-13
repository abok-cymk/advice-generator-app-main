import { clsx } from 'clsx';
import { useSuspenseAdvice, useGetNewAdvice } from '../hooks/useSuspenseAdvice';
import { useCurrentAdvice, useIsAnimating } from '../store/adviceStore';
import DividerDesktop from "/pattern-divider-desktop.svg";
import DividerMobile from "/pattern-divider-mobile.svg";
import Dice from "/icon-dice.svg";

export const AdviceCard = () => {
  // Initialize suspense data
  useSuspenseAdvice();
  
  // Get state from store
  const currentAdvice = useCurrentAdvice();
  const isAnimating = useIsAnimating();
  const getNewAdvice = useGetNewAdvice();

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative bg-Blue-900 rounded-2xl p-6 md:p-8 shadow-lg">
        {/* Advice Number */}
        <div className="text-center mb-6">
          <span 
            className="text-Green-300 text-xs md:text-sm font-extrabold uppercase tracking-[0.3em]"
            aria-label={currentAdvice ? `Advice number ${currentAdvice.id}` : 'Loading advice'}
          >
            {currentAdvice?.id ? `Advice #${currentAdvice.id}` : 'Advice #0'}
          </span>
        </div>

        {/* Advice Content - Optimized for LCP */}
        <div className="text-center mb-6 min-h-[100px] flex items-center justify-center">
          <blockquote 
            className={clsx(
              // LCP-optimized classes
              'text-Blue-200 text-xl md:text-2xl leading-relaxed font-extrabold',
              // Reduced transition time for faster perceived performance
              'transition-opacity duration-100 transform-gpu',
              // Ensure proper font rendering
              'advice-lcp',
              isAnimating ? 'opacity-0' : 'opacity-100'
            )}
            cite="https://api.adviceslip.com"
            // Pre-size the element to prevent layout shift
            style={{ minHeight: '3.5rem' }}
          >
            {currentAdvice?.text ? `"${currentAdvice.text}"` : '"Loading your advice..."'}
          </blockquote>
        </div>

        {/* Divider */}
        <div className="flex justify-center mb-6">
          <picture>
            <source 
              media="(min-width: 768px)" 
              srcSet={DividerDesktop}
            />
            <img 
              src={DividerMobile}
              alt="" 
              className="w-auto h-4"
              role="presentation"
              // Optimize image loading
              loading="eager"
              decoding="sync"
            />
          </picture>
        </div>

        {/* Dice Button */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={getNewAdvice}
            className={clsx(
              'w-12 h-12 bg-green-300 rounded-full flex items-center justify-center cursor-pointer',
              'transition-all duration-200 ease-in-out transform-gpu',
              'hover:bg-green-400 hover:scale-110 hover:shadow-lg hover:shadow-green-300/50',
              'focus:outline-none focus:ring-4 focus:ring-green-300/50 focus:scale-110',
              'active:scale-95',
              isAnimating && 'animate-pulse'
            )}
            type="button"
            aria-label="Get new advice"
          >
            <img 
              src={Dice}
              alt="" 
              className={clsx(
                'w-6 h-6 transition-transform duration-200',
                isAnimating && 'animate-spin'
              )}
              role="presentation"
              // Optimize icon loading
              loading="eager"
              decoding="sync"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
