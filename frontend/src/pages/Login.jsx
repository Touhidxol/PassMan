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

    /* Check if already logged in */
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
        <div className="auth-shell sm:bg-gradient-to-br sm:from-emerald-800 sm:to-emerald-950">

            {/* Profile card — shown when a session already exists */}
            {user && (
                <div className="auth-profile-card">
                    <div className="auth-profile-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col text-sm">
                        <span className="auth-profile-name">{user.name}</span>
                        <span className="auth-profile-email">{user.email}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-danger ml-4 text-xs"
                    >
                        Logout
                    </button>
                </div>
            )}

            <div className="auth-card">
                <h2 className="auth-card-title">Login to your Account</h2>
                <p className="auth-card-subtitle">
                    Sign in to securely access your stored passwords.
                </p>

                {user ? (
                    /* Already logged in — offer to continue or switch */
                    <>
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="auth-submit-btn my-3"
                        >
                            {loading ? "Please wait…" : "Login to another Account"}
                        </button>

                        <p className="text-center text-white/50 text-sm">or</p>

                        <Link to="/dashboard">
                            <button
                                disabled={loading}
                                className="w-full p-3 rounded-lg text-white transition-colors my-3"
                                style={{ backgroundColor: "#c2410c" }}
                            >
                                Continue as {user.name}
                            </button>
                        </Link>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} className="relative">

                        <InputTemplate title="Email" id="email">
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                className="input-template peer"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </InputTemplate>

                        <InputTemplate title="Password" id="password">
                            <input
                                type="password"
                                id="password"
                                placeholder=" "
                                className="input-template peer"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </InputTemplate>

                        <Link
                            to="/forgot-password"
                            className="auth-link-muted absolute right-2 -translate-y-4 hover:text-white transition-colors"
                        >
                            Forgot password?
                        </Link>

                        <button
                            disabled={loading}
                            className="auth-submit-btn my-3"
                        >
                            {loading ? "Please wait…" : "Login"}
                        </button>

                    </form>
                )}

                <p className="text-center text-sm mt-4 text-white/60">
                    Don't have an account?{" "}
                    <Link to="/register" className="auth-link-brand hover:underline">
                        Register
                    </Link>
                </p>
            </div>

        </div>
    );
};

export default Login;