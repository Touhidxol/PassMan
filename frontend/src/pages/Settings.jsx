import React, { useState } from "react";

const Settings = () => {
    const [twoFA, setTwoFA] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div className="p-6 text-white max-w-4xl mx-auto">

            <div className="flex px-5 my-3 items-center">
                <h1 className="sm:!text-5xl !text-3xl font-semibold">Settings</h1>
            </div>

            {/* ---------------- ACCOUNT ---------------- */}
            <div className="bg-[#1f1f1f] p-5 rounded-xl my-6 border border-white/10">
                <h2 className="text-lg font-medium mb-4">Account</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full p-3 rounded bg-[#2a2a2a] outline-none"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 rounded bg-[#2a2a2a] outline-none"
                    />

                    <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* ---------------- SECURITY ---------------- */}
            <div className="bg-[#1f1f1f] p-5 rounded-xl mb-6 border border-white/10">
                <h2 className="text-lg font-medium mb-4">Security</h2>

                <div className="space-y-4">

                    {/* Change Password */}
                    <button className="w-full text-left p-3 bg-[#2a2a2a] rounded hover:bg-[#333]">
                        🔑 Change Password
                    </button>

                    {/* 2FA Toggle */}
                    <div className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded">
                        <span>Two-Factor Authentication</span>
                        <input
                            type="checkbox"
                            checked={twoFA}
                            onChange={() => setTwoFA(!twoFA)}
                        />
                    </div>

                </div>
            </div>

            {/* ---------------- PREFERENCES ---------------- */}
            <div className="bg-[#1f1f1f] p-5 rounded-xl mb-6 border border-white/10">
                <h2 className="text-lg font-medium mb-4">Preferences</h2>

                <div className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded">
                    <span>Dark Mode</span>
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                    />
                </div>
            </div>

            {/* ---------------- DANGER ZONE ---------------- */}
            <div className="bg-[#2a1f1f] p-5 rounded-xl border border-red-500/30">
                <h2 className="text-lg font-medium mb-4 text-red-400">Danger Zone</h2>

                <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                    Delete Account
                </button>
            </div>

        </div>
    );
};

export default Settings;