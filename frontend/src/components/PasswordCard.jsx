import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "./layout/Modal";
import PasswordStrengthBar from "./PasswordStrengthBar";
import GenerateButton from "./GenerateButton";

import WebIcon from "../assets/icons/webico.svg";
import EditIcon from "../assets/icons/edit.svg";
import DeleteIcon from "../assets/icons/delete.svg";
import SaveIcon from "../assets/icons/save.svg";
import CopyIcon from "../assets/icons/copy.svg";
import ShowIcon from "../assets/icons/outlineeye.svg";
import HideIcon from "../assets/icons/oulinecrosseye.svg";
import FavoriteFilledIcon from "../assets/icons/favoriteButton.svg";
import FavoriteEmptyIcon from "../assets/icons/non_favoriteButton.svg";

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
        <Modal isOpen={true} onClose={onClose} maxWidth="max-w-lg">

            {/* ── Header ── */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-subtle">
                <img src={WebIcon} className="w-5 shrink-0" alt="" />
                <p className="font-semibold flex-1 truncate text-primary">{item.site}</p>

                {/* Favorite toggle */}
                <button
                    onClick={handleToggleFavorite}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    className="icon-btn"
                >
                    <img src={isFavorite ? FavoriteFilledIcon : FavoriteEmptyIcon} alt="favorite" className="w-5" />
                </button>

                {/* Edit / Save toggle */}
                {isEditable ? (
                    <button
                        onClick={handleSave}
                        title="Save changes"
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-success/20"
                    >
                        <img src={SaveIcon} className="w-4" alt="save" />
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditable(true)}
                        title="Edit"
                        className="icon-btn"
                    >
                        <img src={EditIcon} className="w-4" alt="edit" />
                    </button>
                )}

                {/* Close */}
                <button onClick={onClose} className="icon-btn">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M2 2l12 12M14 2L2 14" />
                    </svg>
                </button>
            </div>

            {/* ── Edit mode indicator ── */}
            {isEditable && (
                <div className="px-5 py-1.5 text-xs font-medium edit-banner">
                    ✎ Editing — click Save when done
                </div>
            )}

            {/* ── Body ── */}
            <div className="p-5 space-y-4">

                {/* USERNAME */}
                <div>
                    <p className="text-xs font-medium mb-1.5 text-secondary">Username</p>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.username}
                            disabled={!isEditable}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="input-dashboard pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => copyText(formData.username)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-90 transition-opacity"
                        >
                            <img src={CopyIcon} className="w-4" alt="copy" />
                        </button>
                    </div>
                </div>

                {/* PASSWORD */}
                <div>
                    <p className="text-xs font-medium mb-1.5 text-secondary">Password</p>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            disabled={!isEditable}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="input-dashboard pr-26"
                        />
                        <div className="absolute right-1.5 top-1 flex items-center gap-0">
                            {isEditable && <GenerateButton onGenerate={handleGenerate} />}
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="w-8 h-8 flex items-center justify-center">
                                <img src={showPassword ? ShowIcon : HideIcon} className="w-5" alt="toggle" />
                            </button>
                            <button type="button" onClick={() => copyText(formData.password)}
                                className="w-8 h-8 flex items-center justify-center opacity-40 hover:opacity-90 transition-opacity">
                                <img src={CopyIcon} className="w-4" alt="copy" />
                            </button>
                        </div>
                    </div>
                    <PasswordStrengthBar password={formData.password} showTips={isEditable} className="mt-2" />
                </div>

                {/* NOTE */}
                <div>
                    <p className="text-xs font-medium mb-1.5 text-secondary">Note</p>
                    <textarea
                        value={formData.note}
                        disabled={!isEditable}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        rows={3}
                        className="textarea-dashboard"
                    />
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center gap-2 px-5 py-4 border-t border-subtle">
                <button
                    onClick={() => onDelete(item._id)}
                    className="btn-ghost text-sm flex items-center gap-1.5 text-danger border-danger-subtle"
                >
                    <img src={DeleteIcon} className="w-4" alt="" />
                    Delete
                </button>

                <div className="flex-1" />

                {!isEditable ? (
                    <button
                        onClick={() => setIsEditable(true)}
                        className="btn-primary text-sm flex items-center gap-1.5"
                    >
                        <img src={EditIcon} className="w-4" alt="" />
                        Edit
                    </button>
                ) : (
                    <button onClick={handleSave} className="btn-save text-sm">
                        <img src={SaveIcon} className="w-4" alt="" />
                        Save
                    </button>
                )}
            </div>
        </Modal>
    );
};

export default PasswordCard;
