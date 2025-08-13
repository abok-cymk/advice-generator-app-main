import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdviceById, getRandomAdvice } from "../services/adviceApi";
import type { Advice } from "../types";

export const ADVICE_QUERY_KEYS = {
  advice: ["advice"] as const,
  byId: (id: number) => [...ADVICE_QUERY_KEYS.advice, "byId", id] as const,
  random: () => [...ADVICE_QUERY_KEYS.advice, "random"] as const,
} as const;

export const useAdviceById = (id: number, enabled = false) => {
  return useQuery({
    queryKey: ADVICE_QUERY_KEYS.byId(id),
    queryFn: () => getAdviceById(id),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 or rate limit errors
      if (
        error.message.includes("not found") ||
        error.message.includes("Too many requests")
      ) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

export const useRandomAdvice = () => {
  return useQuery({
    queryKey: ADVICE_QUERY_KEYS.random(),
    queryFn: getRandomAdvice,
    staleTime: 0, // Always fetch fresh random advice
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on rate limit errors
      if (error.message.includes("Too many requests")) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useAdviceActions = () => {
  const queryClient = useQueryClient();

  const refreshRandomAdvice = () => {
    queryClient.invalidateQueries({
      queryKey: ADVICE_QUERY_KEYS.random(),
    });
  };

  const prefetchAdvice = async (id: number) => {
    await queryClient.prefetchQuery({
      queryKey: ADVICE_QUERY_KEYS.byId(id),
      queryFn: () => getAdviceById(id),
      staleTime: 5 * 60 * 1000,
    });
  };

  const setAdviceData = (advice: Advice) => {
    queryClient.setQueryData(ADVICE_QUERY_KEYS.byId(advice.id), advice);
    queryClient.setQueryData(ADVICE_QUERY_KEYS.random(), advice);
  };

  return {
    refreshRandomAdvice,
    prefetchAdvice,
    setAdviceData,
  };
};
