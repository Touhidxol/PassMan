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
import {
    validateRegister,
    validateLogin,
    validateUpdateName,
    validateChangePassword,
} from "../middlewares/validate.js";

const router = express.Router();

// Public
router.post("/register", validateRegister, registeruser);
router.post("/login", validateLogin, loginuser);
router.post("/refresh", refreshToken);

// Protected
router.get("/me", requireAuth, loggedin);
router.post("/logout", requireAuth, logoutuser);
router.patch("/me", requireAuth, validateUpdateName, updateName);
router.patch("/me/password", requireAuth, validateChangePassword, changePassword);
router.delete("/me", requireAuth, deleteAccount);

export default router;