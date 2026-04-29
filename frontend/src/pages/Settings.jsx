import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    checkLoggedin,
    updateName,
    changePassword,
    deleteAccount,
} from "../api/users";
import { usePasswords } from "../hooks/usePasswords";
import PasswordStrengthBar from "../components/PasswordStrengthBar";

/* ── Reusable section wrapper ─────────────────────────────────── */
const SectionCard = ({ label, danger, children }) => (
    <div className={danger ? "settings-section-danger" : "settings-section"}>
        <p className={danger ? "settings-section-label-danger" : "settings-section-label"}>
            {label}
        </p>
        {children}
    </div>
);

/* ─────────────────────────────────────────────────────────────── */

const Settings = () => {
    const navigate = useNavigate();
    const { passwords } = usePasswords();

    const [user, setUser] = useState(null);
    const [editingName, setEditingName] = useState(false);
    const [nameVal, setNameVal] = useState("");
    const [nameLoading, setNameLoading] = useState(false);

    const [editingPw, setEditingPw] = useState(false);
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [pwLoading, setPwLoading] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        checkLoggedin().then((data) => {
            if (data) { setUser(data); setNameVal(data.name); }
        });
    }, []);

    /* ── Name update ──────────────────────────────────────────── */
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

    /* ── Password change ──────────────────────────────────────── */
    const handlePwSave = async () => {
        if (!currentPw || !newPw || !confirmPw)
            return toast.error("Please fill all fields.");
        if (newPw !== confirmPw)
            return toast.error("New passwords do not match.");
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

    /* ── Delete account ───────────────────────────────────────── */
    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await deleteAccount();
            toast.success("Account deleted.");
            navigate("/login");
        } catch (err) { toast.error(err.message); }
        finally { setDeleteLoading(false); }
    };

    /* ── Derived stats ────────────────────────────────────────── */
    const weakCount = passwords.filter((p) => {
        const pw = p.password ?? "";
        let s = 0;
        if (pw.length >= 8) s++;
        if (pw.length >= 12) s++;
        if ([/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/]
            .filter((r) => r.test(pw)).length >= 3) s++;
        return s <= 1;
    }).length;

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "—";

    /* ── Shared edit/save/cancel button classes ───────────────── */
    const editBtnCls = "btn-ghost flex items-center gap-1.5 text-xs shrink-0";
    const saveBtnCls = "btn-primary text-xs shrink-0";
    const cancelBtnCls = "btn-ghost text-xs shrink-0";

    return (
        <div className="page-root space-y-4">

            <div className="page-header-row">
                <h1 className="page-heading">Settings</h1>
            </div>

            {/* ── Account info ───────────────────────────── */}
            <SectionCard label="Account info">

                {/* Avatar header */}
                <div className="settings-avatar-row">
                    <div className="settings-avatar">
                        {user?.name?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div>
                        <p className="settings-avatar-name">{user?.name}</p>
                        <p className="settings-avatar-email">{user?.email}</p>
                    </div>
                </div>

                {/* Display name row */}
                <div className="settings-row">
                    {!editingName ? (
                        <>
                            <span className="settings-row-label">Display name</span>
                            <span className="settings-row-value">{user?.name}</span>
                            <button className={editBtnCls} onClick={() => setEditingName(true)}>
                                <svg width="11" height="11" viewBox="0 0 16 16" fill="none"
                                    stroke="currentColor" strokeWidth="1.5">
                                    <path d="M11 2l3 3-8 8H3v-3l8-8z" />
                                </svg>
                                <span className="hidden sm:inline">Edit</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3 w-full">
                            <div className="flex items-center gap-2">
                                <span className="settings-row-label">Display name</span>
                                <input
                                    className="settings-input flex-1"
                                    type="text"
                                    value={nameVal}
                                    autoFocus
                                    onChange={(e) => setNameVal(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleNameSave();
                                        if (e.key === "Escape") handleNameCancel();
                                    }}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button className={cancelBtnCls} onClick={handleNameCancel}>Cancel</button>
                                <button className={saveBtnCls} onClick={handleNameSave} disabled={nameLoading}>
                                    {nameLoading ? "Saving…" : "Save"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Email row — locked */}
                <div className="settings-row">
                    <span className="settings-row-label">Email</span>
                    <span className="settings-row-value fade-mask opacity-50">{user?.email}</span>
                    <span className="settings-locked-note">cannot be changed</span>
                </div>

                {/* Member since */}
                <div className="settings-row" style={{ borderBottom: "none" }}>
                    <span className="settings-row-label">Member since</span>
                    <span className="settings-row-value">{memberSince}</span>
                </div>

            </SectionCard>

            {/* ── Password ───────────────────────────────── */}
            <SectionCard label="Password">
                <div className="py-1">
                    {!editingPw ? (
                        <div className="flex items-center justify-between gap-3">
                            <span className="settings-row-label">Master password</span>
                            <span className="settings-row-value fade-mask tracking-widest opacity-30">
                                ••••••••••
                            </span>
                            <button className={editBtnCls} onClick={() => setEditingPw(true)}>
                                <svg width="11" height="11" viewBox="0 0 16 16" fill="none"
                                    stroke="currentColor" strokeWidth="1.5">
                                    <path d="M11 2l3 3-8 8H3v-3l8-8z" />
                                </svg>
                                <span className="hidden sm:inline">Change</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3 pt-1">
                            <div>
                                <label className="settings-label-small">Current password</label>
                                <input
                                    className="settings-input"
                                    type="password"
                                    placeholder="••••••••"
                                    value={currentPw}
                                    autoFocus
                                    onChange={(e) => setCurrentPw(e.target.value)}
                                />
                                <Link
                                    to="/forgot-password"
                                    className="text-xs p-1 text-theme-muted underline"
                                >
                                    Forgot Current Password
                                </Link>
                            </div>

                            <div>
                                <label className="settings-label-small">New password</label>
                                <input
                                    className="settings-input"
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPw}
                                    onChange={(e) => setNewPw(e.target.value)}
                                />
                                <PasswordStrengthBar password={newPw} showTips className="mt-2" />
                            </div>

                            <div>
                                <label className="settings-label-small">Confirm new password</label>
                                <input
                                    className="settings-input"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPw}
                                    onChange={(e) => setConfirmPw(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                                <button className={cancelBtnCls} onClick={handlePwCancel}>Cancel</button>
                                <button className={saveBtnCls} onClick={handlePwSave} disabled={pwLoading}>
                                    {pwLoading ? "Updating…" : "Update password"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </SectionCard>

            {/* ── Vault summary ──────────────────────────── */}
            <SectionCard label="Vault summary">
                <div className="grid grid-cols-3 gap-3">
                    {[
                        ["Passwords", passwords.length],
                        ["Favorites", passwords.filter((p) => p.favorite).length],
                        ["Weak passwords", weakCount],
                    ].map(([k, v]) => (
                        <div key={k} className="settings-stat-mini">
                            <p className="settings-stat-mini-value">{v}</p>
                            <p className="settings-stat-mini-label">{k}</p>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* ── Data (export / import) ─────────────────── */}
            <SectionCard label="Data">
                {[
                    {
                        title: "Export passwords",
                        desc: "Download all your passwords as an encrypted JSON file.",
                        label: "Export",
                        iconPath: <path d="M8 2v9M4 8l4 4 4-4M2 14h12" strokeLinecap="round" strokeLinejoin="round" />,
                    },
                    {
                        title: "Import passwords",
                        desc: "Import passwords from a CSV or JSON file.",
                        label: "Import",
                        iconPath: <path d="M8 14V5M4 8l4-4 4 4M2 14h12" strokeLinecap="round" strokeLinejoin="round" />,
                    },
                ].map(({ title, desc, label, iconPath }) => (
                    <div key={title} className="settings-row">
                        <div>
                            <p className="text-sm font-medium text-theme-primary">
                                {title}
                                <span className="ml-2 settings-coming-soon-badge">
                                    coming soon
                                </span>
                            </p>
                            <p className="text-xs text-theme-muted mt-0.5">{desc}</p>
                        </div>
                        <button
                            disabled
                            className="btn-ghost text-xs opacity-40 cursor-not-allowed flex items-center gap-1.5 shrink-0"
                        >
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
                                stroke="currentColor" strokeWidth="1.5">
                                {iconPath}
                            </svg>
                            {label}
                        </button>
                    </div>
                ))}
            </SectionCard>

            {/* ── Danger zone ────────────────────────────── */}
            <SectionCard label="Danger zone" danger>
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium" style={{ color: "#fca5a5" }}>
                            Delete account
                        </p>
                        <p className="text-xs text-theme-muted mt-0.5">
                            Permanently deletes your account and all saved passwords.
                            Cannot be undone.
                        </p>
                    </div>

                    {!deleteConfirm ? (
                        <button
                            onClick={() => setDeleteConfirm(true)}
                            className="btn-danger text-xs shrink-0"
                        >
                            Delete
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs" style={{ color: "#fca5a5" }}>Sure?</span>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="btn-danger text-xs"
                            >
                                {deleteLoading ? "Deleting…" : "Yes, delete"}
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(false)}
                                className="btn-ghost text-xs"
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