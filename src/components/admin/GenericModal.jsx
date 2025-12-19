import React from 'react';
import { FaTimes } from 'react-icons/fa';

const GenericModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">

                    {/* Header */}
                    <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-6">
                        {children}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GenericModal;
