import express from "express";
import { registeruser, loginuser } from "../controllers/users.js";

const router = express.Router();

// register
router.post("/register", registeruser);

// login
router.post("/login", loginuser);

export default router;