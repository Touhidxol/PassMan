import jwt from "jsonwebtoken";
import User from "../models/user.js";

const isProd = process.env.NODE_ENV === "production";

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
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({ success: true });
    } catch {
        res.status(401).json({ error: "Token invalid or expired" });
    }
};