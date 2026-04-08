import React, { useEffect, useState } from "react";
import { usePasswords } from "../hooks/usePasswords";
import { usePasswordCard } from "../hooks/usePasswordCard";
import PasswordCard from "../components/PasswordCard";
import { PresenceWrapper, Fade } from "../animations";

const Favorites = () => {
    const { passwords, loadPasswords, loading, error, removePassword, editPassword } = usePasswords();

    const {
        cardOpen, setCardOpen,
        showDeleteConfirm,
        handleDelete, confirmDelete, cancelDelete,
        handleUpdate,
    } = usePasswordCard({ passwords, removePassword, editPassword });

    useEffect(() => {
        loadPasswords();
    }, [loadPasswords]);

    const favoritePasswords = passwords.filter(item => item.favorite);
    // const favoritePasswords = passwords;

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

            <div className="flex flex-col">
                <div className="flex px-5 my-3 items-center">
                    <h1 className="sm:!text-5xl !text-3xl font-semibold">Favorites</h1>
                </div>

                {favoritePasswords.length === 0 ? (
                    <p className="px-5 text-sm text-gray-400">
                        No favorite passwords yet.
                    </p>
                ) : (
                    <ul className="cards p-5">
                        {favoritePasswords.map((item) => (
                            <li
                                key={item._id}
                                onClick={() => setCardOpen(item)}
                                className="password-list"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-md bg-[#3a3a3a]">
                                        {item.site.charAt(0).toUpperCase()}
                                    </div>

                                    <p className="text-sm truncate">{item.site}</p>

                                    <div className="flex-1"></div>
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