import React, { useState } from "react";
import toast from "react-hot-toast";
import PasswordStrengthBar from "./PasswordStrengthBar";
import GenerateButton from "./GenerateButton";

import webico from "../assets/icons/webico.svg";
import edit from "../assets/icons/edit.svg";
import del from "../assets/icons/delete.svg";
import save from "../assets/icons/save.svg";
import copy from "../assets/icons/copy.svg";
import show from "../assets/icons/outlineeye.svg";
import hiide from "../assets/icons/oulinecrosseye.svg";
import favoriteButton from "../assets/icons/favoriteButton.svg";
import nonFavoriteButton from "../assets/icons/non_favoriteButton.svg";

const PasswordCard = ({ item, onDelete, onClose, onChange }) => {
    const [isEditable, setIsEditable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFavorite, setIsFavorite] = useState(item.favorite || false);
    const [formData, setFormData] = useState(item);

    const handleSave = () => {
        setIsEditable(false);
        onChange(formData);
        onClose();
    };

    const handleToggleFavorite = async () => {
        const newValue = !isFavorite;
        setIsFavorite(newValue);
        try {
            await onChange({ ...formData, favorite: newValue });
        } catch {
            setIsFavorite(!newValue);
            toast.error("Failed to update favorite.");
        }
    };

    const copyText = async (text) => {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const handleGenerate = (pw) => {
        setFormData((prev) => ({ ...prev, password: pw }));
        setShowPassword(true);
    };

    return (
        <div className="z-20 fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                className={`w-[90%] max-w-lg max-h-[90vh] overflow-y-auto bg-[#2a2a2a] border ${isEditable ? "border-amber-500" : "border-white/20"
                    } rounded-xl p-6 shadow-xl`}
            >
                {/* HEADER */}
                <div className="flex items-center mb-4">
                    <img src={webico} className="w-6 mr-3" alt="" />
                    <p className="text-lg font-semibold">{item.site}</p>

                    <button
                        onClick={handleToggleFavorite}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        className="mx-2 p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <img
                            src={isFavorite ? favoriteButton : nonFavoriteButton}
                            alt="favorite"
                            className="w-6"
                        />
                    </button>

                    <div className="flex-1" />
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white rounded-full p-2"
                    >
                        ✕
                    </button>
                </div>

                {/* USERNAME */}
                <div className="mb-4 relative">
                    <p className="text-xs text-gray-400 mb-1">Username</p>
                    <input
                        type="text"
                        value={formData.username}
                        disabled={!isEditable}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full p-3 pr-10 rounded-xl bg-[#222] outline-none disabled:text-white/60"
                    />
                    <img
                        src={copy}
                        onClick={() => copyText(formData.username)}
                        className="w-5 absolute right-3 top-8 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                        alt="copy"
                    />
                </div>

                {/* PASSWORD */}
                <div className="mb-2">
                    <p className="text-xs text-gray-400 mb-1">Password</p>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            disabled={!isEditable}
                            className="w-full p-3 pr-24 rounded-xl bg-[#222] outline-none disabled:text-white/60"
                        />
                        {/* Icon cluster: generate (edit only) | show/hide | copy */}
                        <div className="absolute right-2 top-2 flex items-center gap-0.5">
                            {isEditable && (
                                <GenerateButton onGenerate={handleGenerate} />
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="flex items-center justify-center w-8 h-8"
                            >
                                <img src={showPassword ? show : hiide} className="w-5" alt="toggle" />
                            </button>
                            <button
                                type="button"
                                onClick={() => copyText(formData.password)}
                                className="flex items-center justify-center w-8 h-8"
                            >
                                <img src={copy} className="w-5 opacity-50 hover:opacity-100 transition-opacity" alt="copy" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Strength bar — always visible */}
                <PasswordStrengthBar
                    password={formData.password}
                    showTips={isEditable}
                    className="mb-4 px-1"
                />

                {/* NOTE */}
                <div className="mb-6">
                    <p className="text-xs text-gray-400 mb-1">Note</p>
                    <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        disabled={!isEditable}
                        className="w-full p-3 rounded-xl bg-[#222] outline-none resize-none h-[90px] disabled:text-white/60"
                    />
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                    {!isEditable ? (
                        <button
                            onClick={() => setIsEditable(true)}
                            className="flex items-center gap-1 px-5 py-2 rounded-full bg-white/5 hover:bg-[#0073ff5e] transition"
                        >
                            <img src={edit} className="w-4" alt="" /> Edit
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1 px-5 py-2 rounded-full bg-white/5 hover:bg-[#00ff485e] transition"
                        >
                            <img src={save} className="w-4" alt="" /> Save
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(item._id)}
                        className="flex items-center gap-1 px-5 py-2 rounded-full bg-white/5 hover:bg-[#ff000086] transition"
                    >
                        <img src={del} className="w-4" alt="" /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordCard;