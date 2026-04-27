import { useEffect } from "react";
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

    useEffect(() => { if (error) navigate("/login"); }, [error, navigate]);
    useEffect(() => { if (!isOpen) loadPasswords(); }, [isOpen, loadPasswords]);

    return (
        <>
            <AddSiteModal />

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

            {/* ── Page content ── */}
            <div className="flex flex-col w-full p-4 md:p-6 max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center my-3 mb-4">
                    <h1 className="text-3xl sm:text-5xl font-semibold text-primary">
                        Passwords
                    </h1>
                    <div className="flex-1" />
                    <button
                        onClick={openWindow}
                        className="btn-ghost text-sm text-info border-info"
                    >
                        Add
                    </button>
                </div>

                <p className="text-sm mb-4 text-muted">
                    Create, save, and manage your passwords so you can easily sign in to sites and apps.
                </p>

                {/* Search + Sort */}
                <div className="flex gap-3 mb-4 flex-wrap">
                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        className="flex-1 min-w-[180px]"
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="h-10 px-3 rounded-full text-sm outline-none cursor-pointer bg-surface-3 text-primary border border-default"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value} className="bg-surface-2">
                                {o.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Result count */}
                {query && (
                    <p className="text-xs mb-3 text-muted">
                        {results.length === 0
                            ? `No results for "${query}"`
                            : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
                        }
                    </p>
                )}

                {/* List */}
                <div className="flex-1">
                    {loading && !passwords.length ? (
                        <p className="text-sm text-muted">Loading…</p>
                    ) : results.length === 0 && !query ? (
                        <p className="text-sm text-muted">
                            No passwords saved yet. Click Add to get started.
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
                                        {/* Site initial badge */}
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
            </div>
        </>
    );
};

export default Passwords;
