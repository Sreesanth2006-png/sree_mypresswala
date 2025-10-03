/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { XMarkIcon } from './icons';
import { Community } from './Dashboard';

interface AddCommunityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (communityData: Omit<Community, 'vendors'>) => void;
}

const AddCommunityModal: React.FC<AddCommunityModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && location) {
            onSubmit({ name, location });
            setName('');
            setLocation('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up transform transition-all">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Add New Community</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100" aria-label="Close modal">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-6">
                        <div>
                            <label htmlFor="communityName" className="block text-sm font-medium text-gray-700 mb-2">
                                Community Name
                            </label>
                            <input
                                id="communityName"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g., Prestige Lakeside Habitat"
                                className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            />
                        </div>
                         <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                placeholder="e.g., Bangalore"
                                className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            />
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--primary-color)] rounded-lg hover:opacity-90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!name || !location}>
                            Add Community
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCommunityModal;