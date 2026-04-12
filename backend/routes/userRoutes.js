import express from "express";
import { registeruser, loginuser, loggedin,logoutuser } from "../controllers/users.js";

const router = express.Router();

// register
router.post("/register", registeruser);

// login
router.post("/login", loginuser);

// get current logged in user
router.get("/me", loggedin);

//logout — clears the cookie
router.post("/logout", logoutuser);

export default router;