import express from "express";
import {
    registeruser,
    loginuser,
    loggedin,
    logoutuser,
    updateName,
    changePassword,
    deleteAccount,
} from "../controllers/users.js";
import { refreshToken } from "../controllers/refreshToken.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = express.Router();

// Public
router.post("/register", registeruser);
router.post("/login", loginuser);
router.post("/refresh", refreshToken);

// Protected
router.get("/me", requireAuth, loggedin);
router.post("/logout", requireAuth, logoutuser);
router.patch("/me", requireAuth, updateName);
router.patch("/me/password", requireAuth, changePassword);
router.delete("/me", requireAuth, deleteAccount);

export default router;
