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

            <div className="page-root">

                <div className="page-header-row">
                    <h1 className="page-heading">Favorites</h1>
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
                    <p className="result-count-hint">
                        {results.length === 0
                            ? `No results for "${query}"`
                            : `${results.length} result${results.length !== 1 ? "s" : ""}`
                        }
                    </p>
                )}

                {loading && !passwords.length ? (
                    <p className="empty-state">Loading…</p>
                ) : favoritePasswords.length === 0 ? (
                    <p className="empty-state">
                        No favorite passwords yet. Star a password to add it here.
                    </p>
                ) : results.length === 0 ? (
                    <p className="empty-state">No favorites match your search.</p>
                ) : (
                    <ul>
                        {results.map((item) => (
                            <li
                                key={item._id}
                                onClick={() => setCardOpen(item)}
                                className="password-list"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className="password-list-badge">
                                        {item.site.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="password-list-site">{item.site}</p>
                                        {item.username && (
                                            <p className="password-list-username">
                                                {item.username}
                                            </p>
                                        )}
                                    </div>
                                    <span className="password-list-chevron">›</span>
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