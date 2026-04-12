import jwt from "jsonwebtoken";
import user from "../models/user.js";

// requireAuth middleware is applied to all routes except /login and /register
// to prevent unauthenticated users from accessing protected routes
const requireAuth = async (req, res, next) => {

    const publicPaths = [
        "/api/users/register",
        "/api/users/login",
        "/api/auth/forgot-password",
        "/api/auth/reset-password",
    ];

    if (publicPaths.includes(req.path)) {
        return next();
    }

    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    try {
        // verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedToken;

        req.user = await user.findOne({ _id }).select("_id");

        if (!req.user) {
            return res.status(401).json({ error: "User not found" });
        }

        console.log(req.user + " is authenticated");
        next();
    } catch (error) {
        console.log("Error while authenticating :", error);
        return res.status(401).json({ error: "Request is not authorized" });
    }
};

export default requireAuth;