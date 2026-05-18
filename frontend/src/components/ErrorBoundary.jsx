import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-[#f5f9ff] flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-lg text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Something went wrong
          </h1>
          <p className="text-gray-500 mt-3">
            The workspace could not render this view. Please refresh or return to the dashboard.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
}
