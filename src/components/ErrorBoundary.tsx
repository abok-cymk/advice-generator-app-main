import { Component } from 'react';
import type { ReactNode } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full max-w-md mx-auto">
          <div className="bg-blue-900 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="text-center mb-6">
              <span className="text-green-300 text-xs md:text-sm font-extrabold uppercase tracking-[0.3em]">
                Error
              </span>
            </div>
            
            <div className="text-center mb-6 min-h-[100px] flex items-center justify-center">
              <ErrorMessage 
                message={this.state.error?.message || 'Something went wrong while fetching advice'}
                onRetry={this.handleRetry}
              />
            </div>

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

            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <button
                onClick={this.handleRetry}
                className="w-12 h-12 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-400/50"
                type="button"
                aria-label="Retry loading advice"
              >
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
