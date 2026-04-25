import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/forgotPassword.js';
import {
    validateForgotPassword,
    validateResetPassword,
} from '../middlewares/validate.js';

const router = express.Router();

router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

export default router;