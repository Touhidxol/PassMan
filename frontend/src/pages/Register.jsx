import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/users";
import toast from "react-hot-toast";
import InputTemplate from "../components/InputTemplate";
import PasswordStrengthBar from "../components/PasswordStrengthBar";

import ShowIcon from "../assets/icons/outlineeye.svg";
import HideIcon from "../assets/icons/oulinecrosseye.svg";

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            await register(JSON.stringify({ name: username, email, password }));
            setEmail(""); setPassword(""); setConfirmPassword(""); setUsername("");
            toast.success("Account created!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    return (
        <div className="auth-shell">
            <div className="auth-bg-grid" />
            <div className="auth-bg-glow" />

            <div className="auth-card">
                <div className="auth-logo-mark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                </div>

                <h1 className="auth-heading">Create your vault</h1>
                <p className="auth-subheading">Secure your passwords in minutes</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-1">
                    <InputTemplate title="Full name" id="username">
                        <input
                            type="text"
                            id="username"
                            placeholder=" "
                            className="input-template peer"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </InputTemplate>

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
                                autoComplete="new-password"
                            />
                        </InputTemplate>
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="auth-eye-btn"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <img src={HideIcon} alt="hide" className="w-5 opacity-60 hover:opacity-90" />
                            ) : (
                                <img src={ShowIcon} alt="show" className="w-5 opacity-60 hover:opacity-90" />
                            )}
                        </button>
                    </div>

                    {password && (
                        <PasswordStrengthBar
                            password={password}
                            showTips
                            className="px-1 pb-2"
                        />
                    )}

                    <div className="relative">
                        <InputTemplate title="Confirm password" id="confirmPassword">
                            <input
                                type={showConfirm ? "text" : "password"}
                                id="confirmPassword"
                                placeholder=" "
                                className={`input-template peer pr-12 ${passwordsMismatch ? "!border-red-500" : ""} ${passwordsMatch ? "!border-emerald-500" : ""}`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </InputTemplate>
                        <button
                            type="button"
                            onClick={() => setShowConfirm(v => !v)}
                            className="auth-eye-btn"
                            tabIndex={-1}
                        >
                            {showConfirm ? (
                                <img src={HideIcon} alt="hide" className="w-5 opacity-60 hover:opacity-90" />
                            ) : (
                                <img src={ShowIcon} alt="show" className="w-5 opacity-60 hover:opacity-90" />
                            )}
                        </button>
                    </div>

                    {passwordsMismatch && (
                        <p className="text-xs px-1" style={{ color: "#f87171" }}>Passwords do not match</p>
                    )}
                    {passwordsMatch && (
                        <p className="text-xs px-1" style={{ color: "#34d399" }}>✓ Passwords match</p>
                    )}

                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-btn-primary"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="auth-spinner" />
                                    Creating account…
                                </span>
                            ) : "Create account"}
                        </button>
                    </div>

                    <p className="auth-footer-text">
                        Already have an account?{" "}
                        <Link to="/login" className="auth-link-accent">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;