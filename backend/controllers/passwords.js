import Password from "../models/password.js";

export const getPasswords = async (req, res) => {
    try {
        const userId = req.user._id;
        const passwords = await Password.find({ user: userId }).sort({ updatedAt: -1 });
        res.status(200).json(passwords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to load passwords." });
    }
};

export const createPassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { site, username, password, note } = req.body;

        if (!site || !password) {
            return res.status(400).json({ success: false, message: "Site and password are required." });
        }

        const exists = await Password.findOne({ user: userId, site });
        if (exists) {
            return res.status(400).json({ success: false, message: "You already have a password for this site." });
        }

        const newPassword = await Password.create({
            user: userId,
            site,
            username: username || "",
            password,
            note: note || "",
        });

        res.status(201).json(newPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Could not save password." });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const id = req.params.id;
        const payload = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Password id is required." });
        }

        const passwordItem = await Password.findOne({ _id: id, user: userId });
        if (!passwordItem) {
            return res.status(404).json({ success: false, message: "Password not found." });
        }

        passwordItem.site = payload.site ?? passwordItem.site;
        passwordItem.username = payload.username ?? passwordItem.username;
        passwordItem.password = payload.password ?? passwordItem.password;
        passwordItem.note = payload.note ?? passwordItem.note;

        await passwordItem.save();
        res.status(200).json(passwordItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Could not update password." });
    }
};

export const deletePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ success: false, message: "Password id is required." });
        }

        const deleted = await Password.findOneAndDelete({ _id: id, user: userId });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Password not found." });
        }

        res.status(200).json({ success: true, message: "Password deleted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Could not delete password." });
    }
};
