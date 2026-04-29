import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/users";
import toast from "react-hot-toast";
import InputTemplate from "../components/InputTemplate";
import PasswordStrengthBar from "../components/PasswordStrengthBar";

const Register = () => {
    const navigate = useNavigate();

    const [username,        setUsername]        = useState("");
    const [email,           setEmail]           = useState("");
    const [password,        setPassword]        = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading,         setLoading]         = useState(false);

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
            toast.success("Successfully Registered");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-shell sm:bg-gradient-to-br sm:from-emerald-800 sm:to-emerald-950">
            <div className="auth-card">

                <h2 className="auth-card-title">Create Account</h2>
                <p className="auth-card-subtitle">
                    Create a secure account to store and manage all your passwords in one place.
                </p>

                <form onSubmit={handleSubmit}>

                    <InputTemplate title="Username" id="username">
                        <input
                            type="text"
                            id="username"
                            placeholder=" "
                            className="input-template peer"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </InputTemplate>

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

                    <PasswordStrengthBar
                        password={password}
                        showTips
                        className="-mt-3 mb-4 px-1"
                    />

                    <InputTemplate title="Confirm Password" id="confirmPassword">
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder=" "
                            className="input-template peer"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </InputTemplate>

                    <button
                        disabled={loading}
                        className="auth-submit-btn my-5"
                    >
                        {loading ? "Creating account…" : "Register"}
                    </button>

                </form>

                <p className="text-center text-sm mt-4 text-white/60">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link-brand hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;