import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { checkLoggedin } from "../api/users";

const ProtectedRoute = ({ children }) => {
    const [authState, setAuthState] = useState("loading");

    useEffect(() => {
        checkLoggedin()
            .then((user) => setAuthState(user ? "authenticated" : "unauthenticated"))
            .catch(() => setAuthState("unauthenticated"));
    }, []);

    if (authState === "loading") {
        return (
            <div className="protected-loading">
                <div className="protected-spinner" />
            </div>
        );
    }

    if (authState === "unauthenticated") {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;