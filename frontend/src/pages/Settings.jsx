import React, { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import toast from "react-hot-toast";
import { checkLoggedin, updateName, changePassword, deleteAccount } from "../api/users";
import { usePasswords } from "../hooks/usePasswords";
import PasswordStrengthBar from "../components/PasswordStrengthBar";

const FieldRow = ({ label, value, placeholder, children }) => (
    <div className="py-3 border-b border-white/10 last:border-none">
        <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-gray-400 min-w-[140px]">{label}</span>
            {children || <span className="text-sm text-white/50 italic">{placeholder ?? value}</span>}
        </div>
    </div>
);

const SectionCard = ({ label, children, danger }) => (
    <div className={`rounded-xl border p-5 ${danger ? "border-red-500/30 bg-[#1f1f1f]" : "bg-[#1f1f1f] border-white/10"}`}>
        <p className={`text-[11px] uppercase tracking-widest mb-4 ${danger ? "text-red-400" : "text-gray-400"}`}>{label}</p>
        {children}
    </div>
);

const Settings = () => {
    const navigate = useNavigate();
    const { passwords } = usePasswords();

    const [user, setUser] = useState(null);

    // name edit
    const [editingName, setEditingName] = useState(false);
    const [nameVal, setNameVal] = useState("");
    const [nameLoading, setNameLoading] = useState(false);

    // password edit
    const [editingPw, setEditingPw] = useState(false);
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [pwLoading, setPwLoading] = useState(false);

    // delete
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        checkLoggedin().then((data) => {
            if (data) { setUser(data); setNameVal(data.name); }
        });
    }, []);

    const handleNameSave = async () => {
        if (!nameVal.trim()) return toast.error("Name cannot be empty.");
        setNameLoading(true);
        try {
            const updated = await updateName(nameVal.trim());
            setUser(updated);
            setEditingName(false);
            toast.success("Name updated!");
        } catch (err) { toast.error(err.message); }
        finally { setNameLoading(false); }
    };

    const handleNameCancel = () => {
        setNameVal(user?.name ?? "");
        setEditingName(false);
    };

    const handlePwSave = async () => {
        if (!currentPw || !newPw || !confirmPw) return toast.error("Please fill all fields.");
        if (newPw !== confirmPw) return toast.error("New passwords do not match.");
        setPwLoading(true);
        try {
            await changePassword({ currentPassword: currentPw, newPassword: newPw });
            toast.success("Password updated!");
            setEditingPw(false);
            setCurrentPw(""); setNewPw(""); setConfirmPw("");
        } catch (err) { toast.error(err.message); }
        finally { setPwLoading(false); }
    };

    const handlePwCancel = () => {
        setEditingPw(false);
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await deleteAccount();
            toast.success("Account deleted.");
            navigate("/login");
        } catch (err) { toast.error(err.message); }
        finally { setDeleteLoading(false); }
    };

    const weakCount = passwords.filter(p => {
        // reuse logic inline — no import needed
        const pw = p.password ?? "";
        let s = 0;
        if (pw.length >= 8) s++;
        if (pw.length >= 12) s++;
        if ([/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(pw)).length >= 3) s++;
        return s <= 1;
    }).length;

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "—";

    const inputCls = "w-full h-10 px-3 rounded-lg bg-[#2a2a2a] border border-white/10 text-sm text-white focus:outline-none focus:border-white/30";
    const editBtnCls = "flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 text-xs text-gray-400 hover:bg-white/10 hover:text-white transition shrink-0";
    const saveBtnCls = "px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-xs text-white transition shrink-0";
    const cancelBtnCls = "px-4 py-1.5 rounded-full border border-white/20 text-xs text-gray-400 hover:bg-white/10 transition shrink-0";

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-4">
            <div className="flex px-1 my-3 items-center mb-6">
                <h1 className="sm:!text-5xl !text-3xl font-semibold">Settings</h1>
            </div>

            {/* Account info */}
            <SectionCard label="Account info">
                {/* Avatar header */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
                    <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center font-semibold text-lg text-white shrink-0">
                        {user?.name?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div>
                        <p className="font-medium text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                </div>

                {/* Display name row */}
                <div className="py-3 border-b border-white/10">
                    {!editingName ? (
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-gray-400 min-w-[140px]">Display name</span>
                            <span className="text-sm flex-1">{user?.name}</span>
                            <button className={editBtnCls} onClick={() => setEditingName(true)}>
                                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2l3 3-8 8H3v-3l8-8z" /></svg>
                                <p className="hidden sm:block">Edit</p>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400 min-w-[140px]">Display name</span>
                                <input
                                    className={inputCls}
                                    type="text"
                                    value={nameVal}
                                    onChange={e => setNameVal(e.target.value)}
                                    autoFocus
                                    onKeyDown={e => { if (e.key === "Enter") handleNameSave(); if (e.key === "Escape") handleNameCancel(); }}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button className={cancelBtnCls} onClick={handleNameCancel}>Cancel</button>
                                <button className={saveBtnCls} onClick={handleNameSave} disabled={nameLoading}>
                                    {nameLoading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Email row — locked */}
                <div className="py-3 border-b border-white/10">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-gray-400 min-w-[140px]">Email</span>
                        <span className="text-sm fade-mask flex-1 text-white/50">{user?.email}</span>
                        <span className="text-xs hidden sm:block text-white/25 italic shrink-0">cannot be changed</span>
                    </div>
                </div>

                {/* Member since */}
                <div className="py-3">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-gray-400 min-w-[140px]">Member since</span>
                        <span className="text-sm flex-1">{memberSince}</span>
                    </div>
                </div>
            </SectionCard>

            {/* Password */}
            <SectionCard label="Password">
                <div className="py-1">
                    {!editingPw ? (
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-gray-400 min-w-[140px]">Master password</span>
                            <span className="text-sm fade-mask tracking-widest text-white/40 flex-1">••••••••••</span>
                            <button className={editBtnCls} onClick={() => setEditingPw(true)}>
                                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2l3 3-8 8H3v-3l8-8z" /></svg>
                                <p className="hidden sm:block">Change</p>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3 pt-1">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Current password</label>
                                <input className={inputCls} type="password" placeholder="••••••••" value={currentPw} onChange={e => setCurrentPw(e.target.value)} autoFocus />
                                <Link to="/forgot-password" className="text-xs p-2 !text-gray-400 !underline text-right w-full">Forgot Current Password</Link>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">New password</label>
                                <input className={inputCls} type="password" placeholder="••••••••" value={newPw} onChange={e => setNewPw(e.target.value)} />
                                <PasswordStrengthBar password={newPw} showTips className="mt-2" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Confirm new password</label>
                                <input className={inputCls} type="password" placeholder="••••••••" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                                <button className={cancelBtnCls} onClick={handlePwCancel}>Cancel</button>
                                <button className={saveBtnCls} onClick={handlePwSave} disabled={pwLoading}>
                                    {pwLoading ? "Updating..." : "Update password"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </SectionCard>

            {/* Vault summary */}
            <SectionCard label="Vault summary">
                <div className="grid grid-cols-3 gap-3">
                    {[
                        ["Passwords", passwords.length],
                        ["Favorites", passwords.filter(p => p.favorite).length],
                        ["Weak passwords", weakCount],
                    ].map(([k, v]) => (
                        <div key={k} className="bg-[#2a2a2a] rounded-lg p-4">
                            <p className="text-2xl font-semibold">{v}</p>
                            <p className="text-xs text-gray-400 mt-1">{k}</p>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Data */}
            <SectionCard label="Data">
                {[
                    {
                        title: "Export passwords",
                        desc: "Download all your passwords as an encrypted JSON file.",
                        icon: <path d="M8 2v9M4 8l4 4 4-4M2 14h12" strokeLinecap="round" strokeLinejoin="round" />,
                        label: "Export",
                    },
                    {
                        title: "Import passwords",
                        desc: "Import passwords from a CSV or JSON file.",
                        icon: <path d="M8 14V5M4 8l4-4 4 4M2 14h12" strokeLinecap="round" strokeLinejoin="round" />,
                        label: "Import",
                    },
                ].map(({ title, desc, icon, label }) => (
                    <div key={title} className="flex items-center justify-between py-3 border-b border-white/10 last:border-none gap-4">
                        <div>
                            <p className="text-sm font-medium">
                                {title}
                                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-500/20">
                                    coming soon
                                </span>
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                        </div>
                        <button
                            disabled
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/10 text-xs text-gray-500 opacity-40 cursor-not-allowed shrink-0"
                        >
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">{icon}</svg>
                            {label}
                        </button>
                    </div>
                ))}
            </SectionCard>

            {/* Danger zone */}
            <SectionCard label="Danger zone" danger>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-red-300">Delete account</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Permanently deletes your account and all saved passwords. Cannot be undone.
                        </p>
                    </div>
                    {!deleteConfirm ? (
                        <button
                            onClick={() => setDeleteConfirm(true)}
                            className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-xs text-white transition shrink-0"
                        >
                            Delete
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-red-300">Sure?</span>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-xs text-white transition"
                            >
                                {deleteLoading ? "Deleting..." : "Yes, delete"}
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(false)}
                                className="px-4 py-1.5 rounded-full border border-white/20 text-xs text-gray-400 hover:bg-white/10 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </SectionCard>
        </div>
    );
};

export default Settings;