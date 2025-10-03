/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { XMarkIcon, CreditCardIcon, UpiIcon, BankIcon, CashIcon } from './icons';
import { Order } from './OrderCard';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    order: Order;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';

const paymentOptions = [
    { id: 'card', label: 'Credit/Debit Card', icon: <CreditCardIcon className="w-6 h-6" /> },
    { id: 'upi', label: 'UPI / QR Code', icon: <UpiIcon className="w-6 h-6" /> },
    { id: 'netbanking', label: 'Net Banking', icon: <BankIcon className="w-6 h-6" /> },
    { id: 'cod', label: 'Cash on Delivery', icon: <CashIcon className="w-6 h-6" /> },
];

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSubmit, order }) => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up transform transition-all flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100" aria-label="Close modal">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
                    <div className="p-6 overflow-y-auto">
                        <div className="bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-xl p-6 mb-6 text-center shadow-lg">
                            <p className="text-sm opacity-80">Order #{order.id.split('-')[1]} ({order.itemCount} items)</p>
                            <p className="text-5xl font-extrabold mt-1">₹{order.amount.toFixed(2)}</p>
                            <p className="text-xs opacity-80 mt-1">Total Amount Payable</p>
                        </div>

                        <div className="space-y-3">
                             <label className="block text-sm font-semibold text-gray-700 mb-2">Select Payment Method</label>
                            {paymentOptions.map(option => (
                                 <button
                                    type="button"
                                    key={option.id}
                                    onClick={() => setSelectedMethod(option.id as PaymentMethod)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all ${selectedMethod === option.id ? 'bg-white border-[var(--primary-color)] ring-2 ring-[var(--primary-color)]/20' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                                >
                                    <div className="text-[var(--primary-color)]">{option.icon}</div>
                                    <span className="font-semibold text-gray-800">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-4 border-t border-gray-200 flex-shrink-0">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-8 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-500/20">
                            Confirm Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;