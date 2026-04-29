import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught:", error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (!this.state.hasError) return this.props.children;

        const { fallback } = this.props;
        if (fallback) return fallback;

        return (
            <div className="error-boundary-root">
                <div className="error-boundary-card">

                    <div className="error-boundary-icon">⚠</div>

                    <h2 className="error-boundary-title">Something went wrong</h2>

                    <p className="error-boundary-body">
                        An unexpected error occurred in this part of the app.
                        Your passwords are safe — this is just a UI crash.
                    </p>

                    {/* Dev-only error detail */}
                    {import.meta.env.DEV && this.state.error && (
                        <pre className="error-boundary-pre">
                            {this.state.error.message}
                        </pre>
                    )}

                    <div className="flex gap-2 justify-center">
                        <button onClick={this.handleReset} className="btn-ghost text-sm">
                            Try again
                        </button>
                        <button
                            onClick={() => (window.location.href = "/dashboard")}
                            className="btn-success text-sm"
                        >
                            Go to dashboard
                        </button>
                    </div>

                </div>
            </div>
        );
    }
}

export default ErrorBoundary;