import user from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// create token with user id
const createtoken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// controller functions to register and login users

const registeruser = async (req, res) => {
    const body = req.body;

    try {
        const exists = await user.findOne({ email: body.email });

        if (!body.name || !body.email || !body.password) {
            throw Error("Please fill all the fields");
        }

        if (!validator.isEmail(body.email)) {
            throw Error("Email is not valid");
        }

        if (!validator.isStrongPassword(body.password)) {
            throw Error("Password is not strong enough");
        }

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

        res.status(201).json({
            name: newentry.name,
            email: newentry.email,
            token: token,
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

        res.status(200).json({
            name: login.name,
            email: login.email,
            token: token,
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
        const foundUser = await user.findById(req.user._id).select("name email");

        res.json(foundUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user info" });
    }
};

export { registeruser, loginuser, loggedin };