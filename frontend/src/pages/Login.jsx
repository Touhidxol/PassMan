import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { checkLoggedin, login, logout } from "../api/users";
import InputTemplate from "../components/InputTemplate";
import toast from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        checkLoggedin()
            .then((data) => setUser(data || null))
            .catch(() => { });
    }, []);

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(JSON.stringify({ email, password }));
            setEmail("");
            setPassword("");
            toast.success(data.message || "Successfully logged in");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-shell">
            {/* Background grid + glow */}
            <div className="auth-bg-grid" />
            <div className="auth-bg-glow" />

            {/* Already-logged-in pill */}
            {user && (
                <div className="auth-session-pill">
                    <div className="auth-session-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col text-sm leading-tight">
                        <span className="font-semibold text-white">{user.name}</span>
                        <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem" }}>{user.email}</span>
                    </div>
                    <button onClick={handleLogout} className="auth-session-logout">
                        Sign out
                    </button>
                </div>
            )}

            <div className="auth-card">
                {/* Logo mark */}
                <div className="auth-logo-mark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>

                <h1 className="auth-heading">Welcome back</h1>
                <p className="auth-subheading">Sign in to your secure vault</p>

                {user ? (
                    <div className="space-y-3 mt-6">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="auth-btn-primary"
                        >
                            Continue as {user.name}
                        </button>
                        <button onClick={handleLogout} className="auth-btn-ghost">
                            Use a different account
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-1">
                        <InputTemplate title="Email address" id="email">
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                className="input-template peer"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </InputTemplate>

                        <div className="relative">
                            <InputTemplate title="Password" id="password">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder=" "
                                    className="input-template peer pr-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                            </InputTemplate>
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="auth-eye-btn"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="flex justify-end pt-1 pb-2">
                            <Link to="/forgot-password" className="auth-link-small">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-btn-primary"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="auth-spinner" />
                                    Signing in…
                                </span>
                            ) : "Sign in"}
                        </button>

                        <p className="auth-footer-text">
                            Don't have an account?{" "}
                            <Link to="/register" className="auth-link-accent">Create one</Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;