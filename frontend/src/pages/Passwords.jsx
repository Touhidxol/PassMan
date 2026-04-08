import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import toast from "react-hot-toast";
import AddSiteModal from "../components/AddSiteModal";
import PasswordCard from '../components/PasswordCard';
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { useAddSiteModal } from '../hooks/useAddSiteModal';
import { usePasswords } from "../hooks/usePasswords";
import { motion } from "framer-motion";
import { Fade, Scale, PresenceWrapper } from "../animations";

const Passwords = () => {
    const navigate = useNavigate();
    const { isOpen, openWindow } = useAddSiteModal();
    const { passwords, loadPasswords, loading, error, removePassword, editPassword } = usePasswords();

    const [cardOpen, setCardOpen] = useState(null);
    const [showDeleteConfirm, setshowDeleteConfirm] = useState(false)

    useEffect(() => {
        if (error) {
            navigate('/login');
        }
    }, [error, navigate]);

    // Delete a password---------------------------------------------------
    const [indexToRemove, setIndexToRemove] = useState(-1);

    const handleDelete = async (id) => {
        setIndexToRemove(passwords.findIndex(item => item._id === id));
        setshowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (indexToRemove === -1) return;
        const itemToDelete = passwords[indexToRemove];
        await removePassword(itemToDelete._id);
        setshowDeleteConfirm(false);
        setIndexToRemove(-1);
        setCardOpen(null);
        toast.success("Password Deleted!");
    };

    const cancelDelete = () => {
        setshowDeleteConfirm(false);
        setIndexToRemove(-1);
    };
    // -------------------------------------------------------------

    //-------while deleting background shouldnt scrollable----------
    useEffect(() => {
        if (showDeleteConfirm || cardOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [showDeleteConfirm, cardOpen]);
    //-------------------------------------------------------------

    // Edit a Password---------------------------------------------
    const handleUpdate = async (updatedPassword) => {
        await editPassword(updatedPassword);

        toast.success("Password updated!");
    };


    //---------------load password---------------------------------
    useEffect(() => {
        if (!isOpen) {
            loadPasswords();
        }
    }, [isOpen, loadPasswords]);
    // ------------------------------------------------------------

    return (
        <>
            <PresenceWrapper>
                {isOpen && (
                    <Fade>
                        <AddSiteModal />
                    </Fade>
                )}
            </PresenceWrapper>

            <PresenceWrapper>
                {cardOpen && (
                    <Fade>
                        <PasswordCard
                            item={cardOpen}
                            onDelete={handleDelete}
                            onClose={() => setCardOpen(null)}
                            onChange={handleUpdate}
                        />
                    </Fade>
                )}
            </PresenceWrapper>

            {/*  -----------------------Poppup to confirm delete------------------------- */}
            <PresenceWrapper>
                {showDeleteConfirm && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={cancelDelete} // optional: click outside to close
                        />
                        <DeleteConfirmModal
                            onCancel={cancelDelete}
                            onConfirm={confirmDelete}
                        />
                    </>
                )}
            </PresenceWrapper>
            {/* ------------------------------------------------------------------------- */}


            <div className="conthainer flex-1 flex flex-col w-full rounded-xl">
                <div className="flex px-5 my-3 items-center">
                    <h1 className="sm:!text-5xl !text-3xl font-semibold">Passwords</h1>
                    <div className="flex-1"></div>
                    <button
                        onClick={openWindow}
                        className="py-[0.6em] px-[1.2em] bg-transparent border-2 border-blue-300 rounded-full text-sm hover:bg-[#1c244785]"
                    >
                        Add
                    </button>
                </div>
                <p className="px-5 text-sm my-4">
                    Create, save, and manage your passwords so you can easily sign in to
                    sites and apps.
                </p>
                <div className="flex-1">
                    <ul className="cards p-5">
                        {passwords.map((item) => {
                            return (
                                <li
                                    key={item._id}
                                    onClick={() => setCardOpen(item)}
                                    className="password-list"
                                >
                                    <div className="flex items-center gap-3 w-full">

                                        {/* Site Icon */}
                                        <div className="w-9 h-9 flex items-center justify-center rounded-md bg-[#3a3a3a] text-sm font-semibold text-gray-300">
                                            {item.site.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Site Name */}
                                        <p className="text-gray-200 text-sm font-medium truncate">
                                            {item.site}
                                        </p>

                                        {/* Arrow */}
                                        <div className="flex-1"></div>
                                        <span className="text-gray-500 text-lg">›</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

        </>
    );

}

export default Passwords
