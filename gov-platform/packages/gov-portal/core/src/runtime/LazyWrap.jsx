import React, { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Log error to console for visibility
    console.error(`Error loading ${this.props.name}`, error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ color: "red" }}>
          Error loading {this.props.name}: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function LazyWrap(loader, name = "Loading") {
  const Lazy = React.lazy(loader);
  return function Wrapped(props) {
    return (
      <ErrorBoundary name={name}>
        <Suspense fallback={<CircularProgress />}>
          <Lazy {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}