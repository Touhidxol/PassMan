import React, { useEffect } from "react";
import { usePasswords } from "../hooks/usePasswords";
import { usePasswordCard } from "../hooks/usePasswordCard";
import { useSearch } from "../hooks/useSearch";
import PasswordCard from "../components/PasswordCard";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import SearchBar from "../components/SearchBar";
import { PresenceWrapper, Fade } from "../animations";
import { motion } from "framer-motion";

const Favorites = () => {
    const { passwords, loadPasswords, loading, removePassword, editPassword } = usePasswords();

    const {
        cardOpen, setCardOpen,
        showDeleteConfirm,
        handleDelete, confirmDelete, cancelDelete,
        handleUpdate,
    } = usePasswordCard({ passwords, removePassword, editPassword });

    const favoritePasswords = passwords.filter((p) => p.favorite);
    const { query, setQuery, results } = useSearch(favoritePasswords);

    useEffect(() => { loadPasswords(); }, [loadPasswords]);

    return (
        <>
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
                <div className="flex my-3 items-center mb-5">
                    <h1 className="sm:!text-5xl !text-3xl font-semibold">Favorites</h1>
                </div>

                {favoritePasswords.length > 0 && (
                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        placeholder="Search favorites…"
                        className="mb-4"
                    />
                )}

                {query && (
                    <p className="text-xs text-white/40 mb-3">
                        {results.length === 0 ? `No results for "${query}"` : `${results.length} result${results.length !== 1 ? "s" : ""}`}
                    </p>
                )}

                {favoritePasswords.length === 0 ? (
                    <p className="text-sm text-white/40">No favorite passwords yet. Star a password to add it here.</p>
                ) : results.length === 0 ? (
                    <p className="text-sm text-white/40">No favorites match your search.</p>
                ) : (
                    <ul>
                        {results.map((item) => (
                            <li key={item._id} onClick={() => setCardOpen(item)} className="password-list">
                                <div className="flex items-center gap-3 w-full">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-md bg-[#3a3a3a]">
                                        {item.site.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm truncate">{item.site}</p>
                                        {item.username && <p className="text-xs text-white/35 truncate">{item.username}</p>}
                                    </div>
                                    <span>›</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default Favorites;