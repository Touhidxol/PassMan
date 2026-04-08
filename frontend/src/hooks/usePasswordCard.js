// hooks/usePasswordCard.js
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const usePasswordCard = ({ passwords, removePassword, editPassword }) => { // 👈 accept as params

    const [cardOpen, setCardOpen] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [indexToRemove, setIndexToRemove] = useState(-1);

    useEffect(() => {
        if (showDeleteConfirm || cardOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [showDeleteConfirm, cardOpen]);

    const handleDelete = (id) => {
        setIndexToRemove(passwords.findIndex(item => item._id === id));
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (indexToRemove === -1) return;
        await removePassword(passwords[indexToRemove]._id);
        setShowDeleteConfirm(false);
        setIndexToRemove(-1);
        setCardOpen(null);
        toast.success("Password Deleted!");
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setIndexToRemove(-1);
    };

    const handleUpdate = async (updatedPassword) => {
        await editPassword(updatedPassword);
        toast.success("Password updated!");
    };

    return {
        cardOpen, setCardOpen,
        showDeleteConfirm,
        handleDelete, confirmDelete, cancelDelete,
        handleUpdate,
    };
};