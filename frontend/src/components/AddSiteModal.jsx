import React, { useRef, useState } from "react";
import { useAddSiteModal } from "../hooks/useAddSiteModal";
import { usePasswords } from "../hooks/usePasswords";
import { createPassword } from "../api/passwords";
import show from "../assets/icons/show.svg";
import hiide from "../assets/icons/hide.svg";
import PasswordStrengthBar from "./PasswordStrengthBar";
import GenerateButton from "./GenerateButton";

const AddSiteModal = () => {
    const { closeWindow } = useAddSiteModal();
    const { passwords, loadPasswords } = usePasswords();
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        site: "",
        username: "",
        password: "",
        note: "",
    });

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

    const savePassword = async () => {
        const { site, username, password } = form;
        const siteRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;
        const newErrors = {};

        if (!site) newErrors.site = "Site cannot be empty.";
        else if (!siteRegex.test(site)) newErrors.site = "Enter a valid domain (e.g., example.com).";
        else if (passwords.some((item) => item.site === site)) newErrors.site = "This site already exists.";

        if (!username) newErrors.username = "Username cannot be empty.";
        if (!password) newErrors.password = "Password cannot be empty.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        await createPassword(form);
        closeWindow();
        await loadPasswords();
    };

    const FieldLabel = ({ name, label }) => (
        <label htmlFor={name} className="text-xs mt-5 mb-2 mx-1 flex items-center gap-2">
            {errors[name]
                ? <span className="text-red-300">{errors[name]}</span>
                : <span className="text-white/70">{label}</span>}
        </label>
    );

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-2">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeWindow}
            />

            <div className="relative bg-[#1a1a1a] w-full max-w-[550px] max-h-[90vh] overflow-y-auto rounded-xl border border-white/20 shadow-lg flex flex-col z-[1000]">
                <div className="flex-1 p-4 px-6">
                    <div className="h-10 text-sm font-medium text-white/70">Add new password</div>

                    {/* SITE */}
                    <div className="w-full flex flex-col">
                        <FieldLabel name="site" label="Site" />
                        <input
                            onChange={handleChange}
                            type="text"
                            name="site"
                            id="site"
                            placeholder="example.com"
                            className={`w-full h-10 px-4 text-sm text-white placeholder-gray-400 bg-[#202020] rounded-t-lg border-b-2 focus:outline-none focus:border-b-blue-500 ${errors.site ? "border-red-400" : "border-b-[#444]"
                                }`}
                        />
                    </div>

                    {/* USERNAME */}
                    <div className="w-full flex flex-col">
                        <FieldLabel name="username" label="Username" />
                        <input
                            onChange={handleChange}
                            type="text"
                            name="username"
                            id="username"
                            className={`w-full h-10 px-4 text-sm text-white placeholder-gray-400 bg-[#202020] rounded-t-lg border-b-2 focus:outline-none focus:border-b-blue-500 ${errors.username ? "border-red-400" : "border-b-[#444]"
                                }`}
                        />
                    </div>

                    {/* PASSWORD — GenerateButton + show/hide in the same icon cluster */}
                    <div className="w-full flex flex-col">
                        <FieldLabel name="password" label="Password" />
                        <div className="relative">
                            <input
                                ref={passwordInputRef}
                                onChange={handleChange}
                                value={form.password}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                className={`w-full h-10 px-4 pr-20 text-sm text-white placeholder-gray-400 bg-[#202020] rounded-t-lg border-b-2 focus:outline-none focus:border-b-blue-500 ${errors.password ? "border-red-400" : "border-b-[#444]"
                                    }`}
                            />
                            <div className="absolute right-1 top-1 flex items-center gap-0.5">
                                <GenerateButton onGenerate={handleGenerate}/>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="flex items-center justify-center w-8 h-8"
                                >
                                    <img src={showPassword ? show : hiide} alt="toggle" className="w-5" />
                                </button>
                            </div>
                        </div>
                        <PasswordStrengthBar password={form.password} className="mt-2 mb-1" />
                    </div>

                    <div className="text-xs h-10 flex items-center border-b border-[#2f2f2f] text-white/30">
                        Make sure you&apos;re saving your current password for this site
                    </div>

                    {/* NOTE */}
                    <div className="w-full flex flex-col">
                        <FieldLabel name="note" label="Note" />
                        <textarea
                            onChange={handleChange}
                            name="note"
                            id="note"
                            className="w-full h-[90px] px-4 py-2 text-sm text-white placeholder-gray-400 bg-[#202020] rounded-t-lg border-b-2 border-b-[#444] focus:outline-none focus:border-b-blue-500 resize-none"
                        />
                    </div>
                </div>

                <div className="flex gap-2 my-4 px-4 sticky bottom-0 bg-[#1a1a1a] pt-2">
                    <div className="flex-1" />
                    <button
                        onClick={closeWindow}
                        className="border border-gray-600 rounded-full text-sm py-[0.6em] px-[1.2em] text-white/70 hover:bg-white/8 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={savePassword}
                        className="bg-blue-700 hover:bg-blue-600 rounded-full text-sm py-[0.6em] px-[1.2em] transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSiteModal;
