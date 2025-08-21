import { useQueryClient } from "@tanstack/react-query";
import { useOptimizedRandomAdvice, useOptimizedAdviceActions } from "../hooks/useOptimizedAdvice";
import { ADVICE_QUERY_KEYS } from "../hooks/useAdvice";
import { useAdviceStore } from "../store/adviceStore";
import { useEffect } from "react";

// Suspense-compatible hook that throws promises
export const useSuspenseAdvice = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading, isFetching, prefetchNextAdvice } = useOptimizedRandomAdvice();
  const { setAdvice, setInitialized } = useAdviceStore();

  // Update store when data changes
  useEffect(() => {
    if (data) {
      setAdvice(data);
      setInitialized();
      
      // Aggressively prefetch next advice for instant loading
      setTimeout(() => {
        prefetchNextAdvice();
      }, 100); // Reduced from 500ms for faster prefetching
    }
  }, [data, setAdvice, setInitialized, prefetchNextAdvice]);

  // Throw error for error boundary
  if (error) {
    throw error;
  }

  // Only throw promise on initial load to prevent blocking subsequent fetches
  if (isLoading && !data && !isFetching) {
    const existingData = queryClient.getQueryData(ADVICE_QUERY_KEYS.random());
    if (!existingData) {
      throw queryClient.fetchQuery({
        queryKey: ADVICE_QUERY_KEYS.random(),
      });
    }
  }

  return {
    advice: data,
    isLoading,
    refetch: () => {
      queryClient.invalidateQueries({
        queryKey: ADVICE_QUERY_KEYS.random(),
      });
    },
  };
};

// Hook for getting new advice with optimistic updates
export const useGetNewAdvice = () => {
  const { getNewAdviceOptimistic } = useOptimizedAdviceActions();
  const { startAnimation, endAnimation } = useAdviceStore();

  return () => {
    startAnimation();
    
    // Try optimistic update first
    const usedCache = getNewAdviceOptimistic();
    
    if (usedCache) {
      // If we used cached data, end animation quickly for instant feel
      setTimeout(() => {
        endAnimation();
      }, 200); // Reduced from 300ms
    } else {
      // If fetching fresh data, reasonable timeout for loading state
      setTimeout(() => {
        endAnimation();
      }, 1000); // Reduced from 1500ms
    }
  };
};
