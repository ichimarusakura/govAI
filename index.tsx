import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress ResizeObserver loop limit exceeded error
const resizeObserverLoopErr = /Loop limit exceeded/;
const originalOnError = window.onerror;
window.onerror = (msg, url, lineNo, columnNo, error) => {
  if (resizeObserverLoopErr.test(msg as string)) {
    return true;
  }
  if (originalOnError) return originalOnError(msg, url, lineNo, columnNo, error);
  return false;
};

const originalOnUnhandledRejection = window.onunhandledrejection;
window.onunhandledrejection = (e) => {
  if (resizeObserverLoopErr.test(e.reason?.message || '')) {
    return;
  }
  if (originalOnUnhandledRejection) return originalOnUnhandledRejection(e);
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.message}</pre>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);