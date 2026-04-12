import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/users";
import toast from "react-hot-toast";
import InputTemplate from "../components/InputTemplate";

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");
            return; // stop execution
        }

        setLoading(true);
        setError(null);

        try {
            const credentials = JSON.stringify({
                "name": username,
                "email": email,
                "password": password
            });

            await register(credentials);
            
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setUsername("");
            toast.success("Successfully Registered");
            navigate("/dashboard");

        } catch (err) {
            const message = err.message || "Something went wrong";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-[#002e22] sm:bg-gradient-to-br from-emerald-800 to-emerald-950">

            <div className="bg-[#002e22] text-white p-8 sm:rounded-xl sm:shadow-xl w-full sm:max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Create Account
                </h2>
                <p className="text-center text-gray-200 px-8 mb-10">
                    Create a secure account to store and manage all your passwords in one place.
                </p>

                <form onSubmit={handleSubmit} className="">
                    <InputTemplate title="Username" id='username'>
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

                    <InputTemplate title="Email" id='email'>
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

                    <InputTemplate title="Password" id='password'>
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

                    <InputTemplate title="Confirm Password" id='confirmPassword'>
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
                        className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition my-5"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                </form>

                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="!text-lime-300 hover:underline">
                        Login
                    </a>
                </p>

            </div>

        </div>
    );
};

export default Register;