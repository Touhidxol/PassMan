import Modal from "./layout/Modal";

const DeleteConfirmModal = ({ onCancel, onConfirm }) => (
    <Modal isOpen={true} onClose={onCancel} maxWidth="max-w-sm">

        {/* Body */}
        <div className="p-6">
            <div className="delete-modal-icon">
                <svg
                    width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="var(--color-danger)"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                </svg>
            </div>

            <p className="delete-modal-title">Delete this password?</p>
            <p className="delete-modal-body">
                This action cannot be undone. The password will be permanently
                removed from your vault.
            </p>
        </div>

        {/* Footer */}
        <div className="modal-footer">
            <button className="btn-ghost" onClick={onCancel}>Cancel</button>
            <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>

    </Modal>
);

export default DeleteConfirmModal;