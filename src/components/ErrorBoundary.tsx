import React, { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
          <div className="bg-card p-8 rounded-3xl shadow-xl max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
                <span className="text-3xl" role="img" aria-hidden="true">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-primary mb-4">Something went wrong</h1>
              <p className="text-secondary mb-6">
                The app encountered an unexpected error. Please refresh the page to try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Refresh Page
              </button>
              <details className="mt-4 text-left">
                <summary className="text-sm text-tertiary cursor-pointer">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs text-tertiary bg-bg-secondary p-3 rounded-lg overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
