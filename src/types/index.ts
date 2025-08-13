// API Response Types
export interface AdviceSlipResponse {
  slip: {
    id: number;
    advice: string;
  };
}

// Domain Types
export interface Advice {
  id: number;
  text: string;
}

// Application State Types
export interface AdviceState {
  currentAdvice: Advice | null;
  isLoading: boolean;
  error: string | null;
}

// Component Props Types
export interface AdviceCardProps {
  advice: Advice | null;
  isLoading: boolean;
  error: string | null;
  onGetNewAdvice: () => void;
}

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}
