import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized settings for performance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Background refetching
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      
      // Stale time and garbage collection
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      
      // Error handling
      retry: (failureCount, error) => {
        // Don't retry on client errors (4xx)
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
    },
  },
});