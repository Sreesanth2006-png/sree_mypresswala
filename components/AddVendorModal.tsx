/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { XMarkIcon } from './icons';
import { Vendor } from './Dashboard';

interface AddVendorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (vendorData: Omit<Vendor, 'status'>) => void;
}

const AddVendorModal: React.FC<AddVendorModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [owner, setOwner] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && owner) {
            onSubmit({ name, owner });
            setName('');
            setOwner('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up transform transition-all">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Add New Vendor</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100" aria-label="Close modal">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-6">
                        <div>
                            <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-2">
                                Vendor Business Name
                            </label>
                            <input
                                id="vendorName"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g., QuickClean Irons"
                                className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            />
                        </div>
                         <div>
                            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                                Owner's Full Name
                            </label>
                            <input
                                id="ownerName"
                                type="text"
                                value={owner}
                                onChange={(e) => setOwner(e.target.value)}
                                required
                                placeholder="e.g., Ramesh Kumar"
                                className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            />
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--primary-color)] rounded-lg hover:opacity-90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!name || !owner}>
                            Add Vendor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVendorModal;