import jwt from "jsonwebtoken";
import User from "../models/user.js";

const requireAuth = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(_id).select("_id");

        if (!req.user) {
            return res.status(401).json({ error: "User not found" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: "Request is not authorized" });
    }
};

export default requireAuth;
