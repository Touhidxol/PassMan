import { useState } from "react";
import InputTemplate from "../components/InputTemplate";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const raw = JSON.stringify({
                "name": username,
                "email": email,
                "password": password
            });
            const res = await fetch("http://localhost:3000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: raw,
                redirect: "follow"
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registration failed");
            } else {
                console.log("User registered:", data);
                // store token if returned
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                setEmail("");
                setPassword("");
                setUsername("");
            }
        } catch (err) {
            setError("Something went wrong");
        }

        setLoading(false);
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