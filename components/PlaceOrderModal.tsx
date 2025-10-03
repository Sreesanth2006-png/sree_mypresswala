/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { XMarkIcon } from './icons';

interface PlaceOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orderData: { itemCount: number; deliveryType: 'standard' | 'express'; notes: string }) => void;
}

type DeliveryType = 'standard' | 'express';

const PlaceOrderModal: React.FC<PlaceOrderModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [itemCount, setItemCount] = useState<number | ''>('');
    const [deliveryType, setDeliveryType] = useState<DeliveryType>('standard');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (itemCount !== '' && itemCount > 0) {
            onSubmit({ itemCount, deliveryType, notes });
            // Reset form
            setItemCount('');
            setDeliveryType('standard');
            setNotes('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up transform transition-all">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Place a New Order</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100" aria-label="Close modal">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-6">
                        <div>
                            <label htmlFor="itemCount" className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Clothes
                            </label>
                            <input
                                id="itemCount"
                                type="number"
                                value={itemCount}
                                onChange={(e) => setItemCount(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                required
                                min="1"
                                placeholder="e.g., 15"
                                className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Type</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setDeliveryType('standard')}
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${deliveryType === 'standard' ? 'bg-white border-[var(--primary-color)] ring-2 ring-[var(--primary-color)]/20' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                                >
                                    <p className="font-semibold text-gray-800">Standard Delivery</p>
                                    <p className="text-sm text-gray-600">48 Hours</p>
                                    <p className="text-xs font-semibold text-[var(--primary-color)] mt-2">Platform Fee: 12%</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeliveryType('express')}
                                     className={`p-4 rounded-lg border-2 text-left transition-all ${deliveryType === 'express' ? 'bg-white border-[var(--primary-color)] ring-2 ring-[var(--primary-color)]/20' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                                >
                                    <p className="font-semibold text-gray-800">Express Delivery</p>
                                    <p className="text-sm text-gray-600">24 Hours</p>
                                    <p className="text-xs font-semibold text-[var(--primary-color)] mt-2">Platform Fee: 24%</p>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                Special Instructions (Optional)
                            </label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder="e.g., Don't starch the blue shirt."
                                className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            />
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--primary-color)] rounded-lg hover:opacity-90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!itemCount || itemCount <= 0}>
                            Submit Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlaceOrderModal;