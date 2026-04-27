import { useRef, useState } from "react";
import { useAddSiteModal } from "../hooks/useAddSiteModal";
import { usePasswords } from "../hooks/usePasswords";
import { createPassword } from "../api/passwords";
import Modal from "./layout/Modal";
import PasswordStrengthBar from "./PasswordStrengthBar";
import GenerateButton from "./GenerateButton";
import ShowPasswordIcon from "../assets/icons/show.svg";
import HidePasswordIcon from "../assets/icons/hide.svg";

const AddSiteModal = () => {
    const { isOpen, closeWindow } = useAddSiteModal();
    const { passwords, loadPasswords } = usePasswords();

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({ site: "", username: "", password: "", note: "" });

    const passwordInputRef = useRef();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const handleGenerate = (pw) => {
        setForm((prev) => ({ ...prev, password: pw }));
        setErrors((prev) => ({ ...prev, password: "" }));
        setShowPassword(true);
    };

    const handleClose = () => {
        setForm({ site: "", username: "", password: "", note: "" });
        setErrors({});
        closeWindow();
    };

    const savePassword = async () => {
        const { site, username, password } = form;
        const siteRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;
        const newErrors = {};

        if (!site) newErrors.site = "Site cannot be empty.";
        else if (!siteRegex.test(site)) newErrors.site = "Enter a valid domain (e.g., example.com).";
        else if (passwords.some((item) => item.site === site)) newErrors.site = "This site already exists.";

        if (!username) newErrors.username = "Username cannot be empty.";
        if (!password) newErrors.password = "Password cannot be empty.";

        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        await createPassword(form);
        handleClose();
        await loadPasswords();
    };

    /* ── Field label — shows error or normal label ── */
    const FieldLabel = ({ name, label }) => (
        <label
            htmlFor={name}
            className={`text-xs mt-5 mb-1.5 mx-0.5 flex items-center gap-2 font-medium ${errors[name] ? "text-danger" : "text-secondary"
                }`}
        >
            {errors[name] ? errors[name] : label}
        </label>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            maxWidth="max-w-lg"
            className="flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-subtle">
                <p className="font-semibold text-sm text-secondary">
                    Add new password
                </p>
                <button
                    onClick={handleClose}
                    className="icon-btn"
                    aria-label="Close"
                >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M2 2l12 12M14 2L2 14" />
                    </svg>
                </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-1 flex-1">

                {/* SITE */}
                <div>
                    <FieldLabel name="site" label="Site" />
                    <input
                        name="site"
                        id="site"
                        type="text"
                        placeholder="example.com"
                        value={form.site}
                        onChange={handleChange}
                        className={`input-dashboard ${errors.site ? "error" : ""}`}
                    />
                </div>

                {/* USERNAME */}
                <div>
                    <FieldLabel name="username" label="Username / Email" />
                    <input
                        name="username"
                        id="username"
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        className={`input-dashboard ${errors.username ? "error" : ""}`}
                    />
                </div>

                {/* PASSWORD */}
                <div>
                    <FieldLabel name="password" label="Password" />
                    <div className="relative">
                        <input
                            ref={passwordInputRef}
                            name="password"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            className={`input-dashboard pr-20 ${errors.password ? "error" : ""}`}
                        />
                        <div className="absolute right-1.5 top-1 flex items-center gap-0">
                            <GenerateButton onGenerate={handleGenerate} />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="flex items-center justify-center w-8 h-8"
                            >
                                <img src={showPassword ? ShowPasswordIcon : HidePasswordIcon} alt="toggle" className="w-5" />
                            </button>
                        </div>
                    </div>
                    <PasswordStrengthBar password={form.password} className="mt-2 mb-1" />
                </div>

                {/* NOTE */}
                <div>
                    <FieldLabel name="note" label="Note (optional)" />
                    <textarea
                        name="note"
                        id="note"
                        value={form.note}
                        onChange={handleChange}
                        rows={3}
                        className="textarea-dashboard"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-subtle bg-modal">
                <button className="btn-ghost text-sm" onClick={handleClose}>
                    Cancel
                </button>
                <button className="btn-primary text-sm" onClick={savePassword}>
                    Save password
                </button>
            </div>
        </Modal>
    );
};

export default AddSiteModal;
