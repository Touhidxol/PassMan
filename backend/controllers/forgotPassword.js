import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { sendOTPEmail } from '../utils/email.js';

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: 'If this email is registered, an OTP has been sent.' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);

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
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: new Date(Date.now()) },
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
};