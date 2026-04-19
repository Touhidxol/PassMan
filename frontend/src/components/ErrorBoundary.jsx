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
        // In production send this to a service like Sentry
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
            <div
                style={{
                    minHeight: "100vh",
                    minWidth: "100vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#1a1a1a",
                    padding: "2rem",
                }}
            >
                <div
                    style={{
                        maxWidth: 460,
                        width: "100%",
                        background: "#242424",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 16,
                        padding: "2rem",
                        textAlign: "center",
                        color: "#fff",
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            background: "rgba(239,68,68,0.15)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1.25rem",
                            fontSize: 24,
                        }}
                    >
                        ⚠
                    </div>

                    <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
                        Something went wrong
                    </h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                        An unexpected error occurred in this part of the app.
                        Your passwords are safe — this is just a UI crash.
                    </p>

                    {/* Show error detail in development */}
                    {import.meta.env.DEV && this.state.error && (
                        <pre
                            style={{
                                background: "rgba(0,0,0,0.4)",
                                borderRadius: 8,
                                padding: "0.75rem",
                                fontSize: 11,
                                color: "#f87171",
                                textAlign: "left",
                                overflowX: "auto",
                                marginBottom: "1.5rem",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                            }}
                        >
                            {this.state.error.message}
                        </pre>
                    )}

                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                        <button
                            onClick={this.handleReset}
                            style={{
                                padding: "0.5rem 1.25rem",
                                borderRadius: 999,
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "#fff",
                                fontSize: 13,
                                cursor: "pointer",
                            }}
                        >
                            Try again
                        </button>
                        <button
                            onClick={() => (window.location.href = "/dashboard")}
                            style={{
                                padding: "0.5rem 1.25rem",
                                borderRadius: 999,
                                background: "#16a34a",
                                border: "none",
                                color: "#fff",
                                fontSize: 13,
                                cursor: "pointer",
                            }}
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
