import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import InputTemplate from "../components/InputTemplate";
import PasswordStrengthBar from "../components/PasswordStrengthBar";
import { sendOTP, resetPassword } from "../api/otp";

import ShowIcon from "../assets/icons/outlineeye.svg";
import HideIcon from "../assets/icons/oulinecrosseye.svg";

/* ── OTP digit box component ──────────────────────────────────── */
const OtpInput = ({ value, onChange, onKeyDown, inputRef, isFilled }) => (
    <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={`otp-box ${isFilled ? "otp-box-filled" : ""}`}
    />
);

/* ── Step indicator ────────────────────────────────────────────── */
const Steps = ({ current }) => {
    const steps = ["Email", "Enter OTP", "Reset"];
    return (
        <div className="auth-steps">
            {steps.map((label, i) => {
                const idx = i + 1;
                const done = idx < current;
                const active = idx === current;
                return (
                    <div key={label} className="auth-step-item">
                        <div className={`auth-step-dot ${done ? "auth-step-done" : active ? "auth-step-active" : "auth-step-idle"}`}>
                            {done ? (
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : idx}
                        </div>
                        <span className={`auth-step-label ${active ? "auth-step-label-active" : ""}`}>{label}</span>
                        {i < steps.length - 1 && <div className={`auth-step-line ${done ? "auth-step-line-done" : ""}`} />}
                    </div>
                );
            })}
        </div>
    );
};

/* ── Main component ─────────────────────────────────────────────── */
const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpError, setOtpError] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const otpRefs = useRef([]);

    /* Countdown timer for resend */
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    /* ── Step 1: send OTP ──────────────────────────────────────── */
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendOTP(email);
            toast.success("OTP sent — check your inbox");
            setStep(2);
            setResendCooldown(60);
            setTimeout(() => otpRefs.current[0]?.focus(), 150);
        } catch {
            toast.error("Failed to send OTP. Check your email.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setLoading(true);
        try {
            await sendOTP(email);
            toast.success("New OTP sent");
            setOtp(["", "", "", "", "", ""]);
            setOtpError(false);
            setResendCooldown(60);
            setTimeout(() => otpRefs.current[0]?.focus(), 150);
        } catch {
            toast.error("Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    /* ── OTP box handlers ────────────────────────────────────── */
    const handleOtpChange = (idx, val) => {
        const digit = val.replace(/\D/g, "").slice(-1);
        const next = [...otp];
        next[idx] = digit;
        setOtp(next);
        setOtpError(false);
        if (digit && idx < 5) {
            otpRefs.current[idx + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (idx, e) => {
        if (e.key === "Backspace") {
            if (otp[idx]) {
                const next = [...otp];
                next[idx] = "";
                setOtp(next);
            } else if (idx > 0) {
                otpRefs.current[idx - 1]?.focus();
            }
        }
        if (e.key === "ArrowLeft" && idx > 0) otpRefs.current[idx - 1]?.focus();
        if (e.key === "ArrowRight" && idx < 5) otpRefs.current[idx + 1]?.focus();
    };

    const handleOtpPaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            otpRefs.current[5]?.focus();
            e.preventDefault();
        }
    };

    /* ── Step 2: verify OTP (called when all 6 filled) ────────── */
    const handleVerifyOTP = async (e) => {
        e?.preventDefault();
        const code = otp.join("");
        if (code.length < 6) return;
        setLoading(true);
        try {
            // We don't hit a "verify-only" endpoint; we'll do full reset in step 3.
            // Just advance if OTP looks complete — backend validates in step 3.
            setStep(3);
        } catch {
            setOtpError(true);
            toast.error("Incorrect OTP. Please try again.");
            setOtp(["", "", "", "", "", ""]);
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } finally {
            setLoading(false);
        }
    };

    /* ── Step 3: reset password ───────────────────────────────── */
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
        setLoading(true);
        try {
            const res = await resetPassword({ email, otp: otp.join(""), newPassword });
            toast.success(res.message || "Password reset! Please sign in.");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            // OTP was wrong after all
            toast.error(err.message || "Invalid or expired OTP");
            setStep(2);
            setOtpError(true);
            setOtp(["", "", "", "", "", ""]);
            setTimeout(() => otpRefs.current[0]?.focus(), 150);
        } finally {
            setLoading(false);
        }
    };

    const otpFull = otp.every(d => d !== "");
    const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

    return (
        <div className="auth-shell">
            <div className="auth-bg-grid" />
            <div className="auth-bg-glow" />

            <div className="auth-card" style={{ maxWidth: "420px" }}>
                {/* Logo */}
                <div className="auth-logo-mark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                    </svg>
                </div>

                <h1 className="auth-heading">Reset password</h1>
                <p className="auth-subheading">
                    {step === 1 && "We'll send a verification code to your email"}
                    {step === 2 && `Enter the 6-digit code sent to ${email}`}
                    {step === 3 && "Almost there — choose your new password"}
                </p>

                {/* Step indicator */}
                <Steps current={step} />

                {/* ── Step 1: Email ─────────────────────────────── */}
                {step === 1 && (
                    <form onSubmit={handleRequestOTP} className="space-y-4 mt-2">
                        <InputTemplate title="Email address" id="email">
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                className="input-template peer"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                autoFocus
                            />
                        </InputTemplate>

                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-btn-primary"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="auth-spinner" />
                                    Sending code…
                                </span>
                            ) : "Send verification code"}
                        </button>

                        <p className="auth-footer-text">
                            Remembered your password?{" "}
                            <Link to="/login" className="auth-link-accent">Sign in</Link>
                        </p>
                    </form>
                )}

                {/* ── Step 2: OTP ──────────────────────────────── */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-5 mt-2">
                        {/* OTP boxes */}
                        <div
                            className={`otp-row ${otpError ? "otp-row-error" : ""}`}
                            onPaste={handleOtpPaste}
                        >
                            {otp.map((digit, i) => (
                                <OtpInput
                                    key={i}
                                    value={digit}
                                    isFilled={digit !== ""}
                                    inputRef={el => otpRefs.current[i] = el}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                />
                            ))}
                        </div>

                        {otpError && (
                            <p className="text-center text-xs" style={{ color: "#f87171" }}>
                                Incorrect code — please try again
                            </p>
                        )}

                        {/* Resend */}
                        <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                            Didn't receive it?{" "}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendCooldown > 0 || loading}
                                className={`font-medium transition-colors ${resendCooldown > 0 ? "cursor-not-allowed opacity-40" : "hover:text-emerald-400"}`}
                                style={{ color: resendCooldown > 0 ? undefined : "#34d399" }}
                            >
                                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={!otpFull || loading}
                            className={`auth-btn-primary ${!otpFull ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="auth-spinner" />
                                    Please Wait…
                                </span>
                            ) : "Verify code"}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); setOtpError(false); }}
                            className="auth-btn-ghost"
                        >
                            ← Change email
                        </button>
                    </form>
                )}

                {/* ── Step 3: New Password ──────────────────────── */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-1 mt-2">
                        <div className="relative">
                            <InputTemplate title="New password" id="newPassword">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="newPassword"
                                    placeholder=" "
                                    className="input-template peer pr-12"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    autoFocus
                                    autoComplete="new-password"
                                />
                            </InputTemplate>
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="auth-eye-btn"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <img src={HideIcon} alt="hide" className="w-5 opacity-60 hover:opacity-90" />
                                ) : (
                                    <img src={ShowIcon} alt="show" className="w-5 opacity-60 hover:opacity-90" />
                                )}
                            </button>
                        </div>

                        {newPassword && (
                            <PasswordStrengthBar password={newPassword} showTips className="px-1 pb-2" />
                        )}

                        <div className="relative">
                            <InputTemplate title="Confirm new password" id="confirmPassword">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder=" "
                                    className={`input-template peer pr-12 ${passwordsMismatch ? "!border-red-500" : ""} ${passwordsMatch ? "!border-emerald-500" : ""}`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                            </InputTemplate>
                            <button
                                type="button"
                                onClick={() => setShowConfirm(v => !v)}
                                className="auth-eye-btn"
                                tabIndex={-1}
                            >
                                {showConfirm ? (
                                    <img src={HideIcon} alt="hide" className="w-5 opacity-60 hover:opacity-90" />
                                ) : (
                                    <img src={ShowIcon} alt="show" className="w-5 opacity-60 hover:opacity-90" />
                                )}
                            </button>
                        </div>

                        {passwordsMismatch && (
                            <p className="text-xs px-1" style={{ color: "#f87171" }}>Passwords do not match</p>
                        )}
                        {passwordsMatch && (
                            <p className="text-xs px-1" style={{ color: "#34d399" }}>✓ Passwords match</p>
                        )}

                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={loading || passwordsMismatch}
                                className={`auth-btn-primary ${passwordsMismatch ? "opacity-40 cursor-not-allowed" : ""}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="auth-spinner" />
                                        Resetting…
                                    </span>
                                ) : "Set new password"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;