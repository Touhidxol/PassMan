import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Issues a fresh access token if the existing one is still valid (within 1 day).
// This gives the user a rolling session — as long as they use the app daily,
// they stay logged in. A proper refresh token (separate secret, longer TTL,
// stored in DB) is a future hardening step.
export const refreshToken = async (req, res) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "No token" });

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(_id).select("_id");
        if (!user) return res.status(401).json({ error: "User not found" });

        const newToken = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", newToken, {
            httpOnly: true,
            secure: false, // ⚠️ Set to true in production (requires HTTPS)
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({ success: true });
    } catch {
        res.status(401).json({ error: "Token invalid or expired" });
    }
};
