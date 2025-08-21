import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRandomAdvice } from "../services/adviceApi";
import type { Advice } from "../types";
import { ADVICE_QUERY_KEYS } from "./useAdvice";

// Optimized advice hook with prefetching and caching strategies
export const useOptimizedRandomAdvice = () => {
  const queryClient = useQueryClient();

  // Main random advice query with improved caching
  const query = useQuery({
    queryKey: ADVICE_QUERY_KEYS.random(),
    queryFn: getRandomAdvice,
    staleTime: 30 * 1000, // 30 seconds cache for better performance
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.message.includes("Too many requests")) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 10000), // Faster retry
  });

  // Prefetch next advice in background for instant loading
  const prefetchNextAdvice = async () => {
    try {
      await queryClient.prefetchQuery({
        queryKey: ["advice", "prefetch", Date.now()],
        queryFn: getRandomAdvice,
        staleTime: 2 * 60 * 1000, // 2 minutes
      });
    } catch (error) {
      // Silently fail prefetching to not affect main UX
      console.debug("Prefetch failed:", error);
    }
  };

  // Get a prefetched advice if available, otherwise use current
  const getNextAdvice = (): Advice | null => {
    const prefetchedQueries = queryClient
      .getQueryCache()
      .findAll({ queryKey: ["advice", "prefetch"] })
      .filter(query => query.state.data);

    if (prefetchedQueries.length > 0) {
      const prefetchedAdvice = prefetchedQueries[0].state.data as Advice;
      // Promote prefetched data to main query
      queryClient.setQueryData(ADVICE_QUERY_KEYS.random(), prefetchedAdvice);
      // Remove used prefetched data
      queryClient.removeQueries({ queryKey: prefetchedQueries[0].queryKey });
      return prefetchedAdvice;
    }

    return null;
  };

  return {
    ...query,
    prefetchNextAdvice,
    getNextAdvice,
  };
};

// Enhanced actions hook with optimistic updates
export const useOptimizedAdviceActions = () => {
  const queryClient = useQueryClient();

  const refreshRandomAdvice = () => {
    // Trigger immediate invalidation for fresh data
    queryClient.invalidateQueries({
      queryKey: ADVICE_QUERY_KEYS.random(),
    });
  };

  const getNewAdviceOptimistic = () => {
    // Try to get prefetched advice first for instant response
    const prefetchedQueries = queryClient
      .getQueryCache()
      .findAll({ queryKey: ["advice", "prefetch"] })
      .filter(query => query.state.data);

    if (prefetchedQueries.length > 0) {
      const prefetchedAdvice = prefetchedQueries[0].state.data as Advice;
      // Immediately update with prefetched data
      queryClient.setQueryData(ADVICE_QUERY_KEYS.random(), prefetchedAdvice);
      // Remove used prefetched data
      queryClient.removeQueries({ queryKey: prefetchedQueries[0].queryKey });
      
      // Prefetch next advice in background
      setTimeout(() => {
        queryClient.prefetchQuery({
          queryKey: ["advice", "prefetch", Date.now()],
          queryFn: getRandomAdvice,
          staleTime: 2 * 60 * 1000,
        });
      }, 100);
      
      return true; // Indicate we used cached data
    }

    // Fall back to normal refresh if no prefetched data
    refreshRandomAdvice();
    return false; // Indicate we're fetching fresh data
  };

  return {
    refreshRandomAdvice,
    getNewAdviceOptimistic,
  };
};