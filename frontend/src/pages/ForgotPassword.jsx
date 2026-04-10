import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import InputTemplate from '../components/InputTemplate';
import { sendOTP, resetPassword } from '../api/otp';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await sendOTP(email);
            toast.success(res.message || "OTP sent successfully");
            setStep(2);
        } catch (err) {
            toast.error('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);

        try {
            const res = await resetPassword({ email, otp, newPassword })
            toast.success(res.message || "Password reset successful");

            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            toast.error(err.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-[#002e22] sm:bg-gradient-to-br from-emerald-800 to-emerald-950">

            <div className="bg-[#002e22] text-white p-8 sm:rounded-xl sm:shadow-xl w-full sm:max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Reset your Password
                </h2>

                <p className="text-center text-gray-200 px-6 mb-10">
                    {step === 1
                        ? "Enter your email to receive a verification OTP."
                        : "Enter the OTP and set your new password."}
                </p>

                {step === 1 && (
                    <form onSubmit={handleRequestOTP}>

                        <InputTemplate title="Email" id="email">
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                className="input-template peer"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </InputTemplate>

                        <button
                            disabled={loading}
                            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition my-3"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword}>

                        <InputTemplate title="OTP" id="otp">
                            <input
                                type="text"
                                id="otp"
                                placeholder=" "
                                className="input-template peer tracking-widest text-center"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                required
                            />
                        </InputTemplate>

                        <InputTemplate title="New Password" id="newPassword">
                            <input
                                type="password"
                                id="newPassword"
                                placeholder=" "
                                className="input-template peer"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </InputTemplate>

                        <InputTemplate title="Confirm Password" id="confirmPassword">
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder=" "
                                className="input-template peer"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </InputTemplate>

                        <button
                            disabled={loading}
                            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition my-3"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <p className="text-center text-sm mt-4">
                    Remember your password?{" "}
                    <Link to="/login" className="!text-lime-300 hover:underline">
                        Back to Login
                    </Link>
                </p>

            </div>
        </div>
    );
}