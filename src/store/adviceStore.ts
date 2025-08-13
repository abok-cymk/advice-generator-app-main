import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Advice } from "../types";

interface AdviceStore {
  // State
  currentAdvice: Advice | null;
  isAnimating: boolean;
  isInitialized: boolean;

  // Actions
  setAdvice: (advice: Advice) => void;
  startAnimation: () => void;
  endAnimation: () => void;
  setInitialized: () => void;
  reset: () => void;
}

// Static initial advice to prevent layout shift and improve LCP
const INITIAL_ADVICE: Advice = {
  id: 0,
  text: "Click the button below to get your first piece of advice!",
};

export const useAdviceStore = create<AdviceStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state with static content for better LCP
    currentAdvice: INITIAL_ADVICE,
    isAnimating: false,
    isInitialized: false,

    // Actions
    setAdvice: (advice: Advice) => {
      const { currentAdvice, isInitialized } = get();

      // If we have different advice and we're initialized, trigger animation
      if (isInitialized && currentAdvice && currentAdvice.id !== advice.id) {
        set({ isAnimating: true });

        // Smooth transition delay
        setTimeout(() => {
          set({ currentAdvice: advice, isAnimating: false });
        }, 150);
      } else {
        set({ currentAdvice: advice, isInitialized: true });
      }
    },

    startAnimation: () => set({ isAnimating: true }),
    endAnimation: () => set({ isAnimating: false }),
    setInitialized: () => set({ isInitialized: true }),
    reset: () =>
      set({
        currentAdvice: INITIAL_ADVICE,
        isAnimating: false,
        isInitialized: false,
      }),
  }))
);

// Selectors for specific state slices
export const useCurrentAdvice = () =>
  useAdviceStore((state) => state.currentAdvice);
export const useIsAnimating = () =>
  useAdviceStore((state) => state.isAnimating);
export const useAdviceActions = () =>
  useAdviceStore((state) => ({
    setAdvice: state.setAdvice,
    startAnimation: state.startAnimation,
    endAnimation: state.endAnimation,
    reset: state.reset,
  }));
