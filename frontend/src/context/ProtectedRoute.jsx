import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { checkLoggedin } from "../api/users";

const ProtectedRoute = ({ children }) => {
    const [authState, setAuthState] = useState("loading"); // "loading" | "authenticated" | "unauthenticated"

    useEffect(() => {
        const verify = async () => {
            try {
                const user = await checkLoggedin();
                setAuthState(user ? "authenticated" : "unauthenticated");
            } catch {
                setAuthState("unauthenticated");
            }
        };

        verify();
    }, []);

    // Show nothing (or a spinner) while checking auth
    if (authState === "loading") {
        return (
            <div className="flex items-center justify-center h-screen bg-[#242424]">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (authState === "unauthenticated") {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;