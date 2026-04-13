import user from "../models/user.js";
import Password from "../models/password.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// Helper to set the auth cookie consistently
const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,        // ⚠️ Set to true in production (requires HTTPS)
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    });
};

// create token with user id
const createtoken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// controller functions to register and login users

const registeruser = async (req, res) => {
    const body = req.body;

    try {
        if (!body.name || !body.email || !body.password) {
            throw Error("Please fill all the fields");
        }

        if (!validator.isEmail(body.email)) {
            throw Error("Email is not valid");
        }

        if (!validator.isStrongPassword(body.password)) {
            throw Error("Password is not strong enough");
        }

        const exists = await user.findOne({ email: body.email });

        if (exists) {
            throw Error("Email already exists");
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
        if (error instanceof Error) {
            res.status(400).json({
                status: "400 Bad Request",
                message: error.message,
            });
        } else {
            console.error("Internal Server Error:", error);

            res.status(500).json({
                status: "500 Internal Server Error",
                message: "500 Internal Server Error, User not created",
            });
        }
    }
};

const loginuser = async (req, res) => {
    try {
        const login = await user.findOne({
            email: req.body.email,
        });

        if (!login) {
            res.status(404).json({
                message: "Email not found",
                status: "404 Not Found",
            });
            return;
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            login.password
        );

        if (!validPassword) {
            res.status(400).json({
                message: "Invalid password",
                status: "400 Bad Request",
            });
            return;
        }

        const token = createtoken(login._id);
        setAuthCookie(res, token);

        res.status(200).json({
            name: login.name,
            email: login.email,
        });
    } catch (error) {
        res.status(500).json({
            status: "500 Internal Server Error",
            message: "500 Internal Server Error, User not logged in",
        });
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
        secure: false,   // ⚠️ Set to true in production (requires HTTPS)
        sameSite: "lax",
    });
    res.json({ message: "Logged out successfully" });
};

const updateName = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name?.trim()) return res.status(400).json({ message: "Name is required." });

        const updated = await user.findById(req.user._id);
        updated.name = name.trim();
        await updated.save();

        res.json(updated);
    } catch { res.status(500).json({ message: "Failed to update name." }); }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const foundUser = await user.findById(req.user._id);

        const valid = await bcrypt.compare(currentPassword, foundUser.password);

        if (!valid) return res.status(400).json({ message: "Current password is incorrect." });
        if (!validator.isStrongPassword(newPassword))
            return res.status(400).json({ message: "New password is not strong enough." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        foundUser.password = hashedPassword;
        await foundUser.save();
        res.json({ message: "Password updated successfully." });
    } catch { res.status(500).json({ message: "Failed to change password." }); }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        await Password.deleteMany({ user: userId });
        await user.findByIdAndDelete(userId);
        res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
        res.json({ message: "Account deleted." });
    } catch { res.status(500).json({ message: "Failed to delete account." }); }
};

export { registeruser, loginuser, loggedin, logoutuser, updateName, changePassword, deleteAccount };