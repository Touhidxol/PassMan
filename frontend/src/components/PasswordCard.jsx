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
        const next = !isFavorite;
        setIsFavorite(next);
        try {
            await onChange({ ...formData, favorite: next });
        } catch {
            setIsFavorite(!next);
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

            {/* ── Header ─────────────────────────────────── */}
            <div className="modal-header">
                <img src={WebIcon} className="w-5 shrink-0 theme-icon" alt="" />
                <p className="font-semibold flex-1 truncate ml-2">{item.site}</p>

                {/* Favourite toggle */}
                <button
                    onClick={handleToggleFavorite}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    className="card-icon-btn"
                >
                    <img src={isFavorite ? FavoriteFilledIcon : FavoriteEmptyIcon} alt="favorite" className="w-5" />
                </button>

                {/* Edit / Save */}
                {isEditable ? (
                    <button onClick={handleSave} title="Save" className="card-save-btn">
                        <img src={SaveIcon} className="w-4 theme-icon" alt="save" />
                    </button>
                ) : (
                    <button onClick={() => setIsEditable(true)} title="Edit" className="card-icon-btn">
                        <img src={EditIcon} className="w-4 theme-icon" alt="edit" />
                    </button>
                )}

                {/* Close */}
                <button onClick={onClose} className="card-icon-btn ml-1">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M2 2l12 12M14 2L2 14" />
                    </svg>
                </button>
            </div>

            {/* ── Edit-mode banner ─────────────────────── */}
            {isEditable && (
                <div className="modal-edit-banner">
                    ✎ Editing — click Save when done
                </div>
            )}

            {/* ── Body ────────────────────────────────── */}
            <div className="modal-body space-y-4">

                {/* USERNAME */}
                <div>
                    <p className="card-field-label">Username</p>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.username}
                            disabled={!isEditable}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="card-field pr-10 w-full"
                        />
                        <button
                            type="button"
                            onClick={() => copyText(formData.username)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-90 transition-opacity"
                        >
                            <img src={CopyIcon} className="w-4 theme-icon" alt="copy" />
                        </button>
                    </div>
                </div>

                {/* PASSWORD */}
                <div>
                    <p className="card-field-label">Password</p>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            disabled={!isEditable}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="card-field pr-24 w-full"
                        />
                        <div className="absolute right-1.5 top-1 flex items-center gap-0">
                            {isEditable && <GenerateButton onGenerate={handleGenerate} />}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="w-8 h-8 flex items-center justify-center"
                            >
                                <img
                                    src={showPassword ? ShowIcon : HideIcon}
                                    className="w-5 theme-icon"
                                    alt="toggle"
                                />
                            </button>
                            <button
                                type="button"
                                onClick={() => copyText(formData.password)}
                                className="w-8 h-8 flex items-center justify-center opacity-40 hover:opacity-90 transition-opacity"
                            >
                                <img src={CopyIcon} className="w-4 theme-icon" alt="copy" />
                            </button>
                        </div>
                    </div>

                    {/* Strength bar — always visible */}
                    <PasswordStrengthBar
                        password={formData.password}
                        showTips={isEditable}
                        className="mt-2"
                    />
                </div>

                {/* NOTE */}
                <div>
                    <p className="card-field-label">Note</p>
                    <textarea
                        value={formData.note}
                        disabled={!isEditable}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        rows={3}
                        className="card-field w-full resize-none"
                    />
                </div>

            </div>

            {/* ── Footer ──────────────────────────────── */}
            <div className="modal-footer">
                <button
                    onClick={() => onDelete(item._id)}
                    className="btn-ghost-danger flex items-center gap-1.5"
                >
                    <img src={DeleteIcon} className="w-4 theme-icon" alt="" />
                    Delete
                </button>

                <div className="flex-1" />

                {isEditable ? (
                    <button
                        onClick={handleSave}
                        className="btn-success flex items-center gap-1.5"
                    >
                        <img src={SaveIcon} className="w-4" alt="" />
                        Save
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditable(true)}
                        className="btn-primary flex items-center gap-1.5"
                    >
                        <img src={EditIcon} className="w-4" alt="" />
                        Edit
                    </button>
                )}
            </div>

        </Modal>
    );
};

export default PasswordCard;