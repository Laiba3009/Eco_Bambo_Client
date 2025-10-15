// components/CartErrorBoundary.jsx
// Error boundary specifically for cart-related components

import React from 'react';
import cartLogger from '../lib/cartLogger';

class CartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error with our cart logger
    cartLogger.error('CartErrorBoundary', 'React error caught in cart component', error, {
      errorInfo: errorInfo,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.name || 'Unknown'
    });

    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Also log to console for immediate debugging
    console.error('Cart Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    cartLogger.info('CartErrorBoundary', 'User initiated error recovery', {
      errorBoundary: this.props.name || 'Unknown'
    });
    
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleReportError = () => {
    const errorReport = {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    cartLogger.error('CartErrorBoundary', 'Error report generated', null, errorReport);
    
    // Copy to clipboard for easy reporting
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2)).then(() => {
      alert('Error report copied to clipboard');
    }).catch(() => {
      console.log('Error report:', errorReport);
      alert('Error report logged to console');
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
          <div className="flex items-center mb-4">
            <span className="text-red-500 text-2xl mr-3">⚠️</span>
            <div>
              <h2 className="text-lg font-semibold text-red-800">
                Cart Component Error
              </h2>
              <p className="text-red-600">
                Something went wrong with the cart functionality.
              </p>
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-red-100 rounded text-sm">
              <strong>Error:</strong> {this.state.error?.message}
              <details className="mt-2">
                <summary className="cursor-pointer text-red-700 hover:text-red-900">
                  Show Stack Trace
                </summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>

            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={this.handleReportError}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Copy Error Report
              </button>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              If this problem persists, please try refreshing the page or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CartErrorBoundary;