import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { sendOTPEmail } from '../utils/email.js';
import express from 'express';

const router = express.Router();

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        // Always respond the same way — don't leak if email exists
        if (!user) {
            return res.json({ message: 'If this email is registered, an OTP has been sent.' });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = expires;
        await user.save();

        await sendOTPEmail(email, otp);

        res.json({
            success: true,
            message: 'If this email is registered, an OTP has been sent.'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: new Date() }  // OTP not expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordOTP = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

export default router;