/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ClockIcon, TruckIcon, CheckCircleIcon, SparklesIcon, CreditCardIcon } from './icons';

export type OrderStatus = 'Pending Pickup' | 'Picked Up' | 'Ironing in Process' | 'Ready for Delivery' | 'Delivered' | 'Paid';

export interface Order {
    id: string;
    status: OrderStatus;
    itemCount: number;
    date: string;
    tower?: string;
    flat?: string;
    amount: number;
}

interface OrderCardProps {
    order: Order;
    role: 'customer' | 'vendor' | 'super-admin' | 'delivery-staff';
    onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
    onPayNowClick?: (order: Order) => void;
}

const statusConfig: { [key in OrderStatus]: { text: string; bg: string; icon: React.ReactNode; progress: number } } = {
    'Pending Pickup': { text: 'text-yellow-800', bg: 'bg-yellow-100', icon: <ClockIcon className="w-5 h-5" />, progress: 10 },
    'Picked Up': { text: 'text-blue-800', bg: 'bg-blue-100', icon: <TruckIcon className="w-5 h-5" />, progress: 30 },
    'Ironing in Process': { text: 'text-indigo-800', bg: 'bg-indigo-100', icon: <SparklesIcon className="w-5 h-5" />, progress: 50 },
    'Ready for Delivery': { text: 'text-purple-800', bg: 'bg-purple-100', icon: <TruckIcon className="w-5 h-5" />, progress: 70 },
    'Delivered': { text: 'text-green-800', bg: 'bg-green-100', icon: <CheckCircleIcon className="w-5 h-5" />, progress: 90 },
    'Paid': { text: 'text-gray-800', bg: 'bg-gray-200', icon: <CheckCircleIcon className="w-5 h-5" />, progress: 100 },
};


const VendorActions: React.FC<{ order: Order; onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void; }> = ({ order, onUpdateStatus }) => {
    const renderButton = () => {
        switch(order.status) {
            case 'Picked Up':
                return (
                    <button onClick={() => onUpdateStatus(order.id, 'Ironing in Process')} className="w-full bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20">
                        Start Ironing
                    </button>
                );
            case 'Ironing in Process':
                return (
                    <button onClick={() => onUpdateStatus(order.id, 'Ready for Delivery')} className="w-full bg-purple-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-purple-600 transition-colors shadow-md shadow-purple-500/20">
                        Mark as Ready
                    </button>
                );
            default:
                return null;
        }
    }

    const button = renderButton();
    if (!button) return null;

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            {button}
        </div>
    );
}

const CustomerActions: React.FC<{ order: Order; onPayNowClick: (order: Order) => void; }> = ({ order, onPayNowClick }) => {
    if (order.status !== 'Delivered') {
        return null;
    }

    return (
         <div className="mt-4 pt-4 border-t border-gray-100">
            <button 
                onClick={() => onPayNowClick(order)} 
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
            >
                <CreditCardIcon className="w-5 h-5" />
                Pay Now (₹{order.amount})
            </button>
        </div>
    );
};


const OrderCard: React.FC<OrderCardProps> = ({ order, role, onUpdateStatus, onPayNowClick }) => {
    const { text, bg, icon, progress } = statusConfig[order.status];

    const progressColor = order.status === 'Paid' ? 'bg-gray-400' : 'bg-[var(--primary-color)]';
    
    return (
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-xl hover:border-[var(--primary-color)] transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-extrabold text-lg text-gray-800">Order #{order.id.split('-')[1]}</p>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
                    {icon}
                    <span>{order.status}</span>
                </div>
            </div>
            
            {role === 'customer' && order.status !== 'Paid' && (
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-500 ease-out ${progressColor}`} style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-gray-700">
                    <div className="text-center">
                        <span className="text-sm text-gray-500">Items</span>
                        <span className="block font-bold text-2xl text-gray-900">{order.itemCount}</span>
                    </div>
                    {role === 'customer' && (
                        <div className="text-center">
                            <span className="text-sm text-gray-500">Amount</span>
                            <span className="block font-bold text-2xl text-gray-900">₹{order.amount}</span>
                        </div>
                    )}
                    {(role === 'vendor' || role === 'delivery-staff') && order.tower && order.flat && (
                         <div className="text-right">
                            <span className="text-sm text-gray-500">Location</span>
                            <span className="block font-semibold text-lg">Tower {order.tower}, Flat {order.flat}</span>
                        </div>
                    )}
                </div>
            </div>
            {role === 'vendor' && onUpdateStatus && <VendorActions order={order} onUpdateStatus={onUpdateStatus} />}
            {role === 'customer' && onPayNowClick && <CustomerActions order={order} onPayNowClick={onPayNowClick} />}
        </div>
    );
};

export default OrderCard;