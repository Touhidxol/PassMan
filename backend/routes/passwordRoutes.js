import express from "express";
import {
    getPasswords,
    createPassword,
    updatePassword,
    deletePassword,
} from "../controllers/passwords.js";
import {
    validateCreatePassword,
    validateUpdatePassword,
} from "../middlewares/validate.js";

const router = express.Router();

router.get("/", getPasswords);
router.post("/", validateCreatePassword, createPassword);
router.put("/:id", validateUpdatePassword, updatePassword);
router.delete("/:id", deletePassword);

export default router;