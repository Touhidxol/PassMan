import user from "../models/user.js";
import Password from "../models/password.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const isProd = process.env.NODE_ENV === "production";

// Helper to set the auth cookie consistently
const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,          // always true — Render is always HTTPS
        sameSite: "none",      // always "none" for cross-origin
        maxAge: 24 * 60 * 60 * 1000,
    });
};

// create token with user id
const createtoken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registeruser = async (req, res) => {
    const body = req.body;
    // Input is already validated + sanitised by validateRegister middleware

    try {
        if (!validator.isStrongPassword(body.password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain uppercase, lowercase, number, and symbol.",
            });
        }

        const exists = await user.findOne({ email: body.email });
        if (exists) {
            return res.status(409).json({ success: false, message: "Email already in use." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        const newuser = new user({
            name: body.name,
            email: body.email,
            password: hashedPassword,
        });

        const newentry = await newuser.save();
        const token = createtoken(newentry._id);
        setAuthCookie(res, token);

        res.status(201).json({
            name: newentry.name,
            email: newentry.email,
        });
    } catch (error) {
        console.error("[registeruser]", error.message);
        res.status(500).json({ success: false, message: "Registration failed." });
    }
};

const loginuser = async (req, res) => {
    // Input validated by validateLogin middleware
    try {
        const login = await user.findOne({ email: req.body.email });

        if (!login) {
            // Generic message — don't reveal whether email exists
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const validPassword = await bcrypt.compare(req.body.password, login.password);

        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const token = createtoken(login._id);
        setAuthCookie(res, token);

        res.status(200).json({
            message: "Logged in successfully.",
            name: login.name,
            email: login.email,
        });
    } catch (error) {
        console.error("[loginuser]", error.message);
        res.status(500).json({ success: false, message: "Login failed." });
    }
};

const loggedin = async (req, res) => {
    try {
        const foundUser = await user.findById(req.user._id).select("name email createdAt");
        res.json(foundUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user info" });
    }
};

const logoutuser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.json({ message: "Logged out successfully" });
};

const updateName = async (req, res) => {
    // Validated by validateUpdateName middleware
    try {
        const updated = await user.findByIdAndUpdate(
            req.user._id,
            { name: req.body.name },
            { new: true }
        ).select("name email createdAt");

        res.json(updated);
    } catch {
        res.status(500).json({ message: "Failed to update name." });
    }
};

const changePassword = async (req, res) => {
    // Validated by validateChangePassword middleware
    try {
        const { currentPassword, newPassword } = req.body;
        const foundUser = await user.findById(req.user._id);

        const valid = await bcrypt.compare(currentPassword, foundUser.password);
        if (!valid) return res.status(400).json({ message: "Current password is incorrect." });

        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({
                message: "New password must contain uppercase, lowercase, number, and symbol.",
            });
        }

        const salt = await bcrypt.genSalt(10);
        foundUser.password = await bcrypt.hash(newPassword, salt);
        await foundUser.save();

        res.json({ message: "Password updated successfully." });
    } catch {
        res.status(500).json({ message: "Failed to change password." });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        await Password.deleteMany({ user: userId });
        await user.findByIdAndDelete(userId);
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.json({ message: "Account deleted." });
    } catch {
        res.status(500).json({ message: "Failed to delete account." });
    }
};

export { registeruser, loginuser, loggedin, logoutuser, updateName, changePassword, deleteAccount };