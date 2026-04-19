import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import AddSiteModal from "../components/AddSiteModal";
import PasswordCard from "../components/PasswordCard";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import SearchBar from "../components/SearchBar";
import { useAddSiteModal } from "../hooks/useAddSiteModal";
import { usePasswords } from "../hooks/usePasswords";
import { usePasswordCard } from "../hooks/usePasswordCard";
import { useSearch, SORT_OPTIONS } from "../hooks/useSearch";
import { motion } from "framer-motion";
import { Fade, PresenceWrapper } from "../animations";

const Passwords = () => {
    const navigate = useNavigate();
    const { isOpen, openWindow } = useAddSiteModal();
    const { passwords, loadPasswords, loading, error, removePassword, editPassword } = usePasswords();
    const { query, setQuery, sortBy, setSortBy, results } = useSearch(passwords);

    const {
        cardOpen, setCardOpen,
        showDeleteConfirm,
        handleDelete, confirmDelete, cancelDelete,
        handleUpdate,
    } = usePasswordCard({ passwords, removePassword, editPassword });

    useEffect(() => {
        if (error) navigate("/login");
    }, [error, navigate]);

    useEffect(() => {
        if (!isOpen) loadPasswords();
    }, [isOpen, loadPasswords]);

    return (
        <>
            <PresenceWrapper>
                {isOpen && <Fade><AddSiteModal /></Fade>}
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

            <PresenceWrapper>
                {showDeleteConfirm && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={cancelDelete}
                        />
                        <DeleteConfirmModal onCancel={cancelDelete} onConfirm={confirmDelete} />
                    </>
                )}
            </PresenceWrapper>

            <div className="flex-1 flex flex-col w-full p-6 max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex my-3 items-center">
                    <h1 className="sm:!text-5xl !text-3xl font-semibold">Passwords</h1>
                    <div className="flex-1" />
                    <button
                        onClick={openWindow}
                        className="py-[0.6em] px-[1.2em] bg-transparent border-2 border-blue-300 rounded-full text-sm hover:bg-[#1c244785]"
                    >
                        Add
                    </button>
                </div>

                <p className="text-sm my-4 text-white/60">
                    Create, save, and manage your passwords so you can easily sign in to sites and apps.
                </p>

                {/* Search + Sort row */}
                <div className="flex gap-3 mb-4 flex-wrap">
                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        className="flex-1 min-w-[180px]"
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="h-10 px-3 rounded-full border border-white/15 bg-white/5 text-sm text-white/80 outline-none hover:border-white/25 transition-colors cursor-pointer"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value} className="bg-[#242424]">
                                {o.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Result count hint */}
                {query && (
                    <p className="text-xs text-white/40 mb-3">
                        {results.length === 0
                            ? `No results for "${query}"`
                            : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
                    </p>
                )}

                {/* List */}
                <div className="flex-1">
                    {loading && !passwords.length ? (
                        <p className="text-sm text-white/40">Loading…</p>
                    ) : results.length === 0 && !query ? (
                        <p className="text-sm text-white/40">No passwords saved yet. Click Add to get started.</p>
                    ) : (
                        <ul>
                            {results.map((item) => (
                                <li
                                    key={item._id}
                                    onClick={() => setCardOpen(item)}
                                    className="password-list"
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="w-9 h-9 flex items-center justify-center rounded-md bg-[#3a3a3a] text-sm font-semibold text-gray-300">
                                            {item.site.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-200 text-sm font-medium truncate">{item.site}</p>
                                            {item.username && (
                                                <p className="text-xs text-white/35 truncate">{item.username}</p>
                                            )}
                                        </div>
                                        <span className="text-gray-500 text-lg">›</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default Passwords;
