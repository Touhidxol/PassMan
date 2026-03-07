import jwt from "jsonwebtoken";
import user from "../models/user.js";

// requireAuth middleware is applied to all routes except /login and /register
// to prevent unauthenticated users from accessing protected routes
const requireAuth = async (req, res, next) => {
    if (req.path === "/api/users/register" || req.path === "/api/users/login") {
        return next();
    }

    // verify user is authenticated
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authorization.split(" ")[1];

    try {
        // verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodedToken;

        req.user = await user.findOne({ _id }).select("_id");

        console.log("user is authenticated");
        next();
    } catch (error) {
        console.log("Error while authenticating :", error);
        return res.status(401).json({ error: "Request is not authorized" });
    }
};

export default requireAuth;