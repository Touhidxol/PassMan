import { useEffect } from "react";
import { usePasswords } from "../hooks/usePasswords";
import { usePasswordCard } from "../hooks/usePasswordCard";
import { useSearch } from "../hooks/useSearch";
import PasswordCard from "../components/PasswordCard";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import SearchBar from "../components/SearchBar";
import { PresenceWrapper, Fade } from "../animations";

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

            {showDeleteConfirm && (
                <DeleteConfirmModal onCancel={cancelDelete} onConfirm={confirmDelete} />
            )}

            <div className="flex flex-col w-full p-4 md:p-6 max-w-4xl mx-auto">
                <div className="flex items-center my-3 mb-5">
                    <h1 className="text-3xl sm:text-5xl font-semibold text-primary">
                        Favorites
                    </h1>
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
                    <p className="text-xs mb-3 text-muted">
                        {results.length === 0
                            ? `No results for "${query}"`
                            : `${results.length} result${results.length !== 1 ? "s" : ""}`
                        }
                    </p>
                )}

                {loading && !passwords.length ? (
                    <p className="text-sm text-muted">Loading…</p>
                ) : favoritePasswords.length === 0 ? (
                    <p className="text-sm text-muted">
                        No favorite passwords yet. Star a password to add it here.
                    </p>
                ) : results.length === 0 ? (
                    <p className="text-sm text-muted">
                        No favorites match your search.
                    </p>
                ) : (
                    <ul>
                        {results.map((item) => (
                            <li
                                key={item._id}
                                onClick={() => setCardOpen(item)}
                                className="password-list"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-md text-sm font-semibold shrink-0 bg-surface-hover text-secondary">
                                        {item.site.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate text-primary">
                                            {item.site}
                                        </p>
                                        {item.username && (
                                            <p className="text-xs truncate text-muted">
                                                {item.username}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-muted">›</span>
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
