import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { checkLoggedin, login, logout } from "../api/users";
import InputTemplate from "../components/InputTemplate";
import ProfileShort from "../components/ProfileShort";
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState(null);

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };
    //------------check if any account is already logged in------------
    useEffect(() => {
        const checkUser = async () => {

            try {
                const data = await checkLoggedin();
                setUser(data || null);
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
            const credentials = JSON.stringify({
                "email": email,
                "password": password
            });

            const data = await login(credentials);

            setEmail("");
            setPassword("");
            toast.success(data.message || "Successfully Logged in");
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
            {user && <div className="[@media(max-height:725px)]:hidden">
                <ProfileShort user={user} onLogout={handleLogout} />
            </div>}

            <div className="bg-[#002e22] text-white p-8 sm:rounded-xl sm:shadow-xl w-full sm:max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Login to your Account
                </h2>
                <p className="text-center text-gray-200 px-8 mb-10">
                    Sign in to securely access your stored passwords.
                </p>

                {user ? (
                    <>
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition my-3"
                        >
                            {loading ? "Please wait..." : "Login to another Account"}
                        </button>

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
                ) : (

                    <form onSubmit={handleSubmit} className="relative">

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

                        <Link className="!text-white/70 text-right text-xs absolute right-2 -translate-y-4" to="/forgot-password">Forgot password?</Link>

                        <button
                            disabled={loading}
                            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition my-3"
                        >
                            {loading ? "Please wait..." : "Login"}
                        </button>

                    </form>
                )
                }

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