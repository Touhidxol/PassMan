import React, { useState } from "react";
import toast from "react-hot-toast";

import webico from "../assets/icons/webico.svg";
import edit from "../assets/icons/edit.svg";
import del from "../assets/icons/delete.svg";
import save from "../assets/icons/save.svg";
import copy from "../assets/icons/copy.svg";
import show from "../assets/icons/outlineeye.svg";
import hiide from "../assets/icons/oulinecrosseye.svg";
import favoriteButton from "../assets/icons/favoriteButton.svg";
import nonFavoriteButton from "../assets/icons/non_favoriteButton.svg"

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
            setIsFavorite(!newValue); // revert on failure
            toast.error("Failed to update favorite.");
        }
    };


    const copyText = async (text) => {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    return (
        <>
            {/* MODAL */}
            <div className="z-20 fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">

                <div className="w-[90%] max-w-lg bg-[#2a2a2a] border border-white/20 rounded-xl p-6 shadow-xl">

                    {/* HEADER */}
                    <div className="flex items-center mb-4">
                        <img src={webico} className="w-6 mr-3" />
                        <p className="text-lg font-semibold">{item.site}</p>

                        {/* ⭐ FAVORITE BUTTON */}
                        <button
                            onClick={handleToggleFavorite}
                            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            className="mx-2 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-5 h-5 transition-colors"
                                fill={isFavorite ? "#facc15" : "none"}
                                stroke={isFavorite ? "#facc15" : "#9ca3af"}
                                strokeWidth="2"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg> */}
                            <img src={isFavorite ? favoriteButton : nonFavoriteButton} alt="isFavorite" className="w-6" />
                        </button>

                        <div className="flex-1"></div>

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
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            className={`w-full p-3 rounded-xl bg-[#222] outline-none ${isEditable ? "bg-[#222]" : ""
                                }`}
                        />

                        <img
                            src={copy}
                            onClick={() => copyText(formData.username)}
                            className="w-5 absolute right-3 top-8.5 cursor-pointer"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-4 relative">
                        <p className="text-xs text-gray-400 mb-1">Password</p>

                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            disabled={!isEditable}
                            className={`w-full p-3 rounded-xl bg-[#222] outline-none ${isEditable ? "bg-[#222]" : ""
                                }`}
                        />

                        <img
                            src={showPassword ? show : hiide}
                            onClick={() => setShowPassword(!showPassword)}
                            className="w-5 absolute right-10 top-8.5 cursor-pointer"
                        />

                        <img
                            src={copy}
                            onClick={() => copyText(formData.password)}
                            className="w-5 absolute right-3 top-8.5 cursor-pointer"
                        />
                    </div>

                    {/* NOTE */}
                    <div className="mb-6">
                        <p className="text-xs text-gray-400 mb-1">Note</p>

                        <textarea
                            value={formData.note}
                            onChange={(e) =>
                                setFormData({ ...formData, note: e.target.value })
                            }
                            disabled={!isEditable}
                            className="w-full p-3 rounded-xl bg-[#222] outline-none resize-none h-[90px]"
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3 justify-end">

                        {!isEditable && (
                            <button
                                onClick={() => setIsEditable(true)}
                                className="flex items-center gap-1 px-3 py-2 rounded-full border border-white hover:bg-[#333]"
                            >
                                <img src={edit} className="w-4" />
                                Edit
                            </button>
                        )}

                        {isEditable && (
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-1 px-3 py-2 rounded-full border border-white hover:bg-[#333]"
                            >
                                <img src={save} className="w-4" />
                                Save
                            </button>
                        )}

                        <button
                            onClick={() => onDelete(item._id)}
                            className="flex items-center gap-1 px-3 py-1 rounded-full border border-red-900 bg-red-700 hover:bg-red-800"
                        >
                            <img src={del} className="w-4" />
                            Delete
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default PasswordCard;