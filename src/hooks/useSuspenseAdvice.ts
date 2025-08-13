import { useQueryClient } from "@tanstack/react-query";
import { useRandomAdvice, ADVICE_QUERY_KEYS } from "../hooks/useAdvice";
import { useAdviceStore } from "../store/adviceStore";
import { useEffect } from "react";

// Suspense-compatible hook that throws promises
export const useSuspenseAdvice = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading, isFetching } = useRandomAdvice();
  const { setAdvice, setInitialized } = useAdviceStore();

  // Update store when data changes
  useEffect(() => {
    if (data) {
      setAdvice(data);
      setInitialized();
    }
  }, [data, setAdvice, setInitialized]);

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
  const queryClient = useQueryClient();
  const { startAnimation } = useAdviceStore();

  return () => {
    startAnimation();
    queryClient.invalidateQueries({
      queryKey: ADVICE_QUERY_KEYS.random(),
    });
  };
};
