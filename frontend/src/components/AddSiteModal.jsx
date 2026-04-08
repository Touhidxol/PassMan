import React from "react";
import { useAddSiteModal } from "../hooks/useAddSiteModal";
import { usePasswords } from "../hooks/usePasswords";
import { createPassword } from "../api/passwords";
import show from "../assets/icons/show.svg";
import hiide from "../assets/icons/hide.svg";
import { useRef, useState } from "react";

const AddSiteModal = () => {
    const { closeWindow } = useAddSiteModal();
    const { passwords, loadPasswords } = usePasswords();

    const [errors, setErrors] = useState({});
    const [form, setform] = useState({
        site: "",
        username: "",
        password: "",
        note: "",
    });

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const eyeref = useRef();
    const passwordInputRef = useRef();
    const toogleshowpassword = () => {
        if (eyeref.current.src.includes("hide")) {
            passwordInputRef.current.type = "text";
            eyeref.current.src = show;
        } else {
            passwordInputRef.current.type = "password";
            eyeref.current.src = hiide;
        }
    };

    const savepassword = async () => {
        const { site, username, password } = form;
        const siteRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;

        const newErrors = {};

        if (!site) {
            newErrors.site = "Site cannot be empty.";
        } else if (!siteRegex.test(site)) {
            newErrors.site = "Enter a valid domain (e.g., example.com).";
        } else if (passwords.some((item) => item.site === site)) {
            newErrors.site = "This site already exists.";
        }

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

    // Reusable label with inline error
    const FieldLabel = ({ name, label }) => (
        <label
            htmlFor={name}
            className="text-xs mt-5 mb-2 mx-1 flex items-center gap-2"
        >
            {errors[name] ? (
                <span className="text-red-300">{errors[name]}</span>
            ) : (
                <span className="text-white">{label}</span>
            )
            }
        </label>
    );

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-2">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeWindow}
            ></div>

            <div className="relative bg-[#1a1a1a] w-full max-w-[550px] rounded-xl border border-white/20 shadow-lg flex flex-col z-[1000]">
                <div className="flex-1 p-4 px-6">
                    <div className="h-10">Add new password</div>

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

                    {/* PASSWORD */}
                    <div className="w-full flex flex-col relative">
                        <FieldLabel name="password" label="Password" />
                        <input
                            ref={passwordInputRef}
                            onChange={handleChange}
                            type="password"
                            name="password"
                            id="password"
                            className={`w-full h-10 px-4 text-sm text-white placeholder-gray-400 bg-[#202020] rounded-t-lg border-b-2 focus:outline-none focus:border-b-blue-500 ${errors.password ? "border-red-400" : "border-b-[#444]"
                                }`}
                        />
                        <img
                            ref={eyeref}
                            src={hiide}
                            onClick={toogleshowpassword}
                            alt=""
                            className="w-[20px] absolute right-2 bottom-2 cursor-pointer"
                        />
                    </div>

                    <div className="text-xs h-12 flex items-center border-b border-[#2f2f2f]">
                        Make sure you're saving your current password for this site
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

                <div className="flex gap-2 my-4 px-4">
                    <div className="flex-1"></div>
                    <button
                        onClick={closeWindow}
                        className="border border-gray-200 rounded-full text-sm py-[0.6em] px-[1.2em]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={savepassword}
                        className="bg-blue-700 rounded-full text-sm py-[0.6em] px-[1.2em]"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSiteModal;