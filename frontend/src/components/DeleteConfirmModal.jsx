import React from "react";

const DeleteConfirmModal = ({ onCancel, onConfirm }) => {
    return (
        <div
            className={`z-30 w-8/10 max-w-md p-6 flex flex-col items-center justify-center gap-6 rounded-xl fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a1a1a] text-white border border-gray-700 transition-opacity duration-300 shadow-xl shadow-black/50`}
        >
            <div className="text-left w-full">
                <p className="text-lg font-semibold">
                    Are you sure you want to delete this?
                </p>
                <p className="text-sm text-gray-400 mt-1">
                    This action cannot be undone.
                </p>
            </div>

            <div className="flex gap-4 mt-2 justify-end items-centre w-full">
                <button
                    className="px-4 py-2 rounded-full border border-gray-500 text-gray-300 hover:bg-[#343434] transition"
                    onClick={onCancel}
                >
                    Cancel
                </button>

                <button
                    className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
                    onClick={onConfirm}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;