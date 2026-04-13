import express from "express";
import { registeruser, loginuser, loggedin, logoutuser, updateName, changePassword, deleteAccount } from "../controllers/users.js";

const router = express.Router();

router.post("/register", registeruser);
router.post("/login", loginuser);
router.get("/me", loggedin);
router.post("/logout", logoutuser);
router.patch("/me", updateName);
router.patch("/me/password", changePassword);
router.delete("/me", deleteAccount);

export default router;