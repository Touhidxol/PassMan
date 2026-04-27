import Modal from "./layout/Modal";

const DeleteConfirmModal = ({ onCancel, onConfirm }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onCancel}
            maxWidth="max-w-sm"
        >
            {/* Body */}
            <div className="p-6">
                {/* Icon */}
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4 bg-danger-subtle border border-danger-subtle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        className="text-danger"
                        stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                    </svg>
                </div>

                {/* Text */}
                <p className="font-semibold text-base mb-1 text-primary">
                    Delete this password?
                </p>
                <p className="text-sm text-secondary">
                    This action cannot be undone. The password will be permanently removed from your vault.
                </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-subtle">
                <button className="btn-ghost text-sm" onClick={onCancel}>
                    Cancel
                </button>
                <button className="btn-danger text-sm" onClick={onConfirm}>
                    Delete
                </button>
            </div>
        </Modal>
    );
};

export default DeleteConfirmModal;
