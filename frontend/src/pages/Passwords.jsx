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
            {/* AddSiteModal manages its own open state via context */}
            <AddSiteModal />

            {/* Password detail card */}
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

            {/* Delete confirmation */}
            {showDeleteConfirm && (
                <DeleteConfirmModal onCancel={cancelDelete} onConfirm={confirmDelete} />
            )}

            {/* ── Page ─────────────────────────────────────── */}
            <div className="page-root">

                {/* Header row */}
                <div className="page-header-row">
                    <h1 className="page-heading">Passwords</h1>
                    <div className="flex-1" />
                    <button onClick={openWindow} className="btn-add">
                        Add
                    </button>
                </div>

                <p className="page-subtitle">
                    Create, save, and manage your passwords so you can easily sign in
                    to sites and apps.
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
                        className="sort-select"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Result count */}
                {query && (
                    <p className="result-count-hint">
                        {results.length === 0
                            ? `No results for "${query}"`
                            : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
                        }
                    </p>
                )}

                {/* List */}
                <div className="flex-1">
                    {loading && !passwords.length ? (
                        <p className="empty-state">Loading…</p>
                    ) : results.length === 0 && !query ? (
                        <p className="empty-state">
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

            </div>
        </>
    );
};

export default Passwords;