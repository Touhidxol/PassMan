import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputTemplate from "../components/InputTemplate";
import ProfileShort from "../components/ProfileShort";
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState(null);
    //------------check if any account is already logged in------------
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) return;

            try {
                const res = await fetch("http://localhost:3000/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    const errData = await res.json();
                    console.log("Auth error:", errData);
                    return;
                }

                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.log(err);
            }
        };

        checkUser();
    }, []);
    //-----------------------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const raw = JSON.stringify({
                "email": email,
                "password": password
            });
            const res = await fetch("http://localhost:3000/api/users/login", {
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
                toast.error(data.message || "Registration failed");
            } else {
                console.log("User LoggedIn:", data);

                // store token if returned
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                setEmail("");
                setPassword("");
                navigate("/dashboard");
            }
        } catch (err) {
            setError("Something went wrong");
            toast.error("Something went wrong");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-[#002e22] sm:bg-gradient-to-br from-emerald-800 to-emerald-950">
            {user && <ProfileShort user={user} />}

            <div className="bg-[#002e22] text-white p-8 sm:rounded-xl sm:shadow-xl w-full sm:max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Login to your Account
                </h2>
                <p className="text-center text-gray-200 px-8 mb-10">
                    Sign in to securely access your stored passwords.
                </p>

                <form onSubmit={handleSubmit} className="">

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

                    <button
                        disabled={loading}
                        className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition my-3"
                    >
                        {loading ? "Please wait..." : (user ? "Login to another Account" : "Login")}
                    </button>

                    {/* {error && (
                        <p className="text-red-300 text-sm text-center">{error}</p>
                        )} */}

                </form>

                {user && (
                    <>
                        <p className="text-center">or</p>
                        <Link to="/dashboard" >
                            <button
                                disabled={loading}
                                className="w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition my-3"
                            >
                                Continue as {user.name}
                            </button>
                        </Link>
                    </>
                )}

                <p className="text-center text-sm mt-4">
                    Don't have an account?{" "}
                    <a href="/register" className="!text-lime-300 hover:underline">
                        Register
                    </a>
                </p>

            </div>

        </div>
    );
};

export default Login;