import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar";
import AddSiteModal from "../components/AddSiteModal";
import PasswordCard from '../components/PasswordCard';
import { useAddSiteModal } from '../hooks/useAddSiteModal';
import { usePasswords } from "../hooks/usePasswords";

import done from "../assets/icons/done.svg"
import error from "../assets/icons/error.svg"

const Dashboard = () => {
    const navigate = useNavigate();
    const { isOpen, openWindow } = useAddSiteModal();
    const { passwords, loadPasswords, loading, error, removePassword } = usePasswords();

    const [cardOpen, setCardOpen] = useState(null);
    const [showDeleteConfirm, setshowDeleteConfirm] = useState(false)
    const [copyStatus, setCopyStatus] = useState(null);

    const [indexToRemove, setIndexToRemove] = useState(-1);

    const handleDelete = async (site) => {
        setIndexToRemove(passwords.findIndex(item => item.site === site));
        setshowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (indexToRemove === -1) return;
        const itemToDelete = passwords[indexToRemove];
        removePassword(itemToDelete.site)
        setshowDeleteConfirm(false);
        setIndexToRemove(-1);
    };

    const cancelDelete = () => {
        setshowDeleteConfirm(false);
        setIndexToRemove(-1);
    };

    useEffect(() => {
        if (error) {
            navigate('/login');
        }
    }, [error, navigate]);

    //-------while deleting background shouldnt scrollable-----------
    useEffect(() => {
        if (showDeleteConfirm || cardOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [showDeleteConfirm, cardOpen]);
    //-------------------------------------------------------------

    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log("Text copied:", text);
            setCopyStatus("Copied");
            triggerCopied();
        } catch (err) {
            console.error("Copy failed:", err);
            setCopyStatus("Failed to copy");
            triggerCopied();
        } finally {
            setTimeout(() => setCopyStatus(null), 2100); // Hide after 2s
        }
    };

    //---------------load password on render of add button--------------
    //----(so that when we save a password it requies the load again)---
    useEffect(() => {
        if (!isOpen) {
            loadPasswords();
        }
    }, [isOpen, loadPasswords]);


    // for better ux only, not mandatory-----------------------------
    const [iscopied, setiscopied] = useState(false);
    const triggerCopied = () => {
        setiscopied(true);
        setTimeout(() => setiscopied(false), 2000);
    };
    const [shake, setShake] = useState(false);
    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 600); // match animation duration
    };
    //----------------------------------------------------------------


    return (
        <>
            {isOpen && <AddSiteModal />}
            {cardOpen && (
                <PasswordCard
                    item={cardOpen}
                    onDelete={handleDelete}
                    onClose={() => setCardOpen(null)}
                />
            )}

            {/*  -----------------------Poppup to confirm delete------------------------- */}
            <div className={`z-100 w-8/10 max-w-md p-6 flex flex-col items-center justify-center gap-6 rounded-xl fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a1a1a] text-white border border-gray-700 transition-opacity duration-300 shadow-xl shadow-black/50 ${showDeleteConfirm ? "opacity-100" : "opacity-0 pointer-events-none"} ${shake ? 'shake' : ''}`}>
                <div className="text-left w-full"><p className="text-lg font-semibold">Are you sure you want to delete this?</p><p className="text-sm text-gray-400 mt-1">This action cannot be undone.</p></div>
                <div className="flex gap-4 mt-2 justify-end items-centre w-full">
                    <button
                        className="px-4 py-2 rounded-full border border-gray-500 text-gray-300 hover:bg-[#343434] transition"
                        onClick={cancelDelete}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
                        onClick={confirmDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* ------------------------------------------------------------------------- */}


            <div className="w-screen min-h-screen items-center flex flex-col">
                <div className="navv w-full sm:w-2/3 h-20 px-2 flex items-center justify-center">
                    <Navbar />
                </div>
                <div className="conthainer flex-1 flex flex-col w-full sm:w-2/3 rounded-xl">
                    <div className="flex px-5 my-3 items-center">
                        <p className="text-xl">Passwords</p>
                        <div className="flex-1"></div>
                        <button
                            onClick={openWindow}
                            className="py-[0.6em] px-[1.2em] bg-transparent border-2 border-blue-500 rounded-full text-sm hover:bg-[#1c244785]"
                        >
                            Add
                        </button>
                    </div>
                    <p className="px-5 text-sm">
                        Create, save, and manage your passwords so you can easily sign in to
                        sites and apps.
                    </p>
                    <div className="flex-1">
                        <ul className="cards p-5">
                            {passwords.map((item) => {
                                return (
                                    <li
                                        key={item.site}
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
            </div>
        </>
    );

}

export default Dashboard
