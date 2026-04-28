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
        else if (passwords.some((i) => i.site === site)) newErrors.site = "This site already exists.";

        if (!username) newErrors.username = "Username cannot be empty.";
        if (!password) newErrors.password = "Password cannot be empty.";

        if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

        await createPassword(form);
        handleClose();
        await loadPasswords();
    };

    /* Label component — shows error text or normal label */
    const FieldLabel = ({ name, label }) => (
        <label
            htmlFor={name}
            className={`addsite-field-label ${errors[name] ? "addsite-field-label-error" : ""}`}
        >
            {errors[name] ?? label}
        </label>
    );

    return (
        <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-lg" className="flex flex-col">

            {/* Header */}
            <div className="modal-header">
                <p className="modal-header-title">Add new password</p>
                <button onClick={handleClose} className="modal-close-btn">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
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
                        name="site" id="site" type="text"
                        placeholder="example.com"
                        value={form.site}
                        onChange={handleChange}
                        className={`addsite-input ${errors.site ? "addsite-input-error" : ""}`}
                    />
                </div>

                {/* USERNAME */}
                <div>
                    <FieldLabel name="username" label="Username / Email" />
                    <input
                        name="username" id="username" type="text"
                        value={form.username}
                        onChange={handleChange}
                        className={`addsite-input ${errors.username ? "addsite-input-error" : ""}`}
                    />
                </div>

                {/* PASSWORD */}
                <div>
                    <FieldLabel name="password" label="Password" />
                    <div className="relative">
                        <input
                            ref={passwordInputRef}
                            name="password" id="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            className={`addsite-input pr-20 ${errors.password ? "addsite-input-error" : ""}`}
                        />
                        <div className="absolute right-1.5 top-1 flex items-center gap-0">
                            <GenerateButton onGenerate={handleGenerate} />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="flex items-center justify-center w-8 h-8"
                            >
                                <img
                                    src={showPassword ? ShowPasswordIcon : HidePasswordIcon}
                                    alt="toggle"
                                    className="w-5"
                                />
                            </button>
                        </div>
                    </div>
                    <PasswordStrengthBar password={form.password} className="mt-2 mb-1" />
                </div>

                {/* NOTE */}
                <div>
                    <FieldLabel name="note" label="Note (optional)" />
                    <textarea
                        name="note" id="note"
                        rows={3}
                        value={form.note}
                        onChange={handleChange}
                        className="addsite-textarea"
                    />
                </div>

            </div>

            {/* Footer */}
            <div className="modal-footer">
                <button className="btn-ghost" onClick={handleClose}>Cancel</button>
                <button className="btn-primary" onClick={savePassword}>Save password</button>
            </div>

        </Modal>
    );
};

export default AddSiteModal;