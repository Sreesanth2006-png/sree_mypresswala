/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
// FIX: Import User type from the centralized `types.ts` file to break a circular dependency.
import { User } from '../types';
import OrderCard, { Order, OrderStatus } from './OrderCard';
// FIX: Import TruckIcon to resolve missing component error.
import { ClockIcon, PackageIcon, BuildingOfficeIcon, UserGroupIcon, ArrowUpRightIcon, ClipboardDocumentListIcon, MapPinIcon, PlusIcon, SparklesIcon, WalletIcon, TruckIcon, CheckCircleIcon } from './icons';

export interface Community {
    name: string;
    location: string;
    vendors: number;
}
export interface Vendor {
    name: string;
    owner: string;
    status: 'Active' | 'Inactive';
}

interface DashboardProps {
    user: User;
    orders: Order[];
    communities: Community[];
    vendors: Vendor[];
    onPlaceOrderClick: () => void;
    onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
    onAddCommunityClick: () => void;
    onAddVendorClick: () => void;
    onPayNowClick: (order: Order) => void;
}

const CustomerDashboard: React.FC<{ 
    user: User;
    onPlaceOrderClick: () => void; 
    orders: Order[]; 
    onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void; 
    onPayNowClick: (order: Order) => void;
}> = ({ user, onPlaceOrderClick, orders, onUpdateOrderStatus, onPayNowClick }) => (
    <div className="space-y-8">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
                <h2 className="text-3xl font-bold">Hello, {user.name.split(' ')[0]}!</h2>
                <p className="text-lg opacity-80 mt-1">Ready for a fresh press? Schedule a pickup in just a few clicks.</p>
            </div>
            <button 
                onClick={onPlaceOrderClick}
                className="w-full sm:w-auto bg-white text-[var(--primary-color)] font-bold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-lg flex items-center gap-2">
                <PlusIcon className="w-6 h-6" />
                Place New Order
            </button>
        </div>
        
        <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">My Orders</h3>
            {orders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => <OrderCard key={order.id} order={order} role="customer" onUpdateStatus={onUpdateOrderStatus} onPayNowClick={onPayNowClick} />)}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-sm border">
                     <PackageIcon className="w-16 h-16 mx-auto text-gray-300" />
                     <h4 className="text-xl font-semibold text-gray-700 mt-4">No Orders Yet</h4>
                     <p className="text-gray-500 mt-1">Click 'Place New Order' to get started!</p>
                </div>
            )}
        </div>
    </div>
);

const VendorDashboard: React.FC<{ orders: Order[]; onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void; }> = ({ orders, onUpdateOrderStatus }) => {
    const newOrders = orders.filter(o => o.status === 'Pending Pickup');
    const inProgressOrders = orders.filter(o => ['Picked Up', 'Ironing in Process'].includes(o.status));
    const readyOrders = orders.filter(o => o.status === 'Ready for Delivery');

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="New Requests" value={newOrders.length.toString()} icon={<ClockIcon className="w-7 h-7"/>} theme="vendor-yellow"/>
                <StatCard title="In Progress" value={inProgressOrders.length.toString()} icon={<SparklesIcon className="w-7 h-7"/>} theme="vendor-blue"/>
                <StatCard title="Ready for Delivery" value={readyOrders.length.toString()} icon={<TruckIcon className="w-7 h-7"/>} theme="vendor-purple"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
                <section className="xl:col-span-1 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-800">New Pickup Requests</h3>
                    {newOrders.length > 0 ? (
                        newOrders.map(order => <OrderCard key={order.id} order={order} role="vendor" onUpdateStatus={onUpdateOrderStatus} />)
                    ) : (
                        <div className="text-center py-12 px-4 bg-white rounded-2xl shadow-sm border">
                            <PackageIcon className="w-12 h-12 mx-auto text-gray-300" />
                            <p className="text-gray-500 mt-3 font-semibold">No new pickup requests.</p>
                        </div>
                    )}
                </section>
                <section className="xl:col-span-2 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-800">Active Orders</h3>
                     {[...inProgressOrders, ...readyOrders].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...inProgressOrders, ...readyOrders].map(order => <OrderCard key={order.id} order={order} role="vendor" onUpdateStatus={onUpdateOrderStatus} />)}
                        </div>
                    ) : (
                        <div className="text-center py-12 px-4 bg-white rounded-2xl shadow-sm border">
                            <SparklesIcon className="w-12 h-12 mx-auto text-gray-300" />
                            <p className="text-gray-500 mt-3 font-semibold">No orders currently in progress.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    theme?: 'admin' | 'vendor-yellow' | 'vendor-blue' | 'vendor-purple';
}
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, theme='admin' }) => {
    const themeClasses = {
        'admin': 'from-[var(--primary-color)] to-[var(--accent-color)] text-white',
        'vendor-yellow': 'from-yellow-400 to-amber-500 text-white',
        'vendor-blue': 'from-blue-500 to-indigo-500 text-white',
        'vendor-purple': 'from-purple-500 to-violet-500 text-white'
    }
    return (
        <div className={`p-6 rounded-2xl bg-gradient-to-br shadow-lg ${themeClasses[theme]}`}>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-lg font-medium opacity-80">{title}</p>
                    <p className="text-4xl font-bold">{value}</p>
                </div>
                <div className="bg-white/20 p-4 rounded-full">
                    {icon}
                </div>
            </div>
        </div>
    );
};


const SuperAdminDashboard: React.FC<{ communities: Community[]; vendors: Vendor[]; onAddCommunityClick: () => void; onAddVendorClick: () => void; orders: Order[] }> = ({ communities, vendors, onAddCommunityClick, onAddVendorClick, orders }) => (
    <div className="space-y-12">
        <h2 className="text-4xl font-black text-gray-900">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Communities" value={communities.length.toString()} icon={<BuildingOfficeIcon className="w-8 h-8"/>} />
            <StatCard title="Active Vendors" value={vendors.filter(v => v.status === 'Active').length.toString()} icon={<UserGroupIcon className="w-8 h-8"/>} />
            <StatCard title="Total Orders" value={orders.length.toString()} icon={<PackageIcon className="w-8 h-8"/>} />
            <StatCard title="Platform Revenue" value="₹21.5k" icon={<WalletIcon className="w-8 h-8"/>} />
        </div>

        {/* Placeholder for charts */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Analytics</h3>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 font-medium">[Chart Placeholder]</p>
            </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <h3 className="text-2xl font-bold text-gray-800">Manage Communities</h3>
                    <button onClick={onAddCommunityClick} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[var(--primary-color)] text-white font-bold py-2.5 px-5 rounded-lg hover:opacity-90 transition-colors shadow-lg shadow-[var(--primary-color)]/20"><PlusIcon className="w-5 h-5" /> Add New</button>
                </div>
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Community Name</th>
                                <th className="p-4 font-semibold text-gray-600">Location</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Vendors</th>
                            </tr>
                        </thead>
                        <tbody>
                            {communities.map(c => (
                                <tr key={c.name} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
                                    <td className="p-4 font-medium">{c.name}</td>
                                    <td className="p-4 text-gray-600">{c.location}</td>
                                    <td className="p-4 text-gray-600 text-center font-semibold">{c.vendors}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <h3 className="text-2xl font-bold text-gray-800">Manage Vendors</h3>
                    <button onClick={onAddVendorClick} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[var(--primary-color)] text-white font-bold py-2.5 px-5 rounded-lg hover:opacity-90 transition-colors shadow-lg shadow-[var(--primary-color)]/20"><PlusIcon className="w-5 h-5" /> Add New</button>
                </div>
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Vendor Name</th>
                                <th className="p-4 font-semibold text-gray-600">Owner</th>
                                <th className="p-4 font-semibold text-gray-600 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map(v => (
                                <tr key={v.name} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
                                    <td className="p-4 font-medium">{v.name}</td>
                                    <td className="p-4 text-gray-600">{v.owner}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${v.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{v.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);


const DeliveryStaffDashboard: React.FC<{ orders: Order[]; onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void; }> = ({ orders, onUpdateOrderStatus }) => {
    const activeTasks = orders
        .filter(o => o.status === 'Pending Pickup' || o.status === 'Ready for Delivery')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const trackedOrders = orders
        .filter(o => o.status === 'Picked Up' || o.status === 'Ironing in Process')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div>
            <h2 className="text-4xl font-black text-gray-900 mb-6 flex items-center gap-3">
                 <ClipboardDocumentListIcon className="w-10 h-10 text-[var(--primary-color)]"/> My Daily Tasks
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 sm:p-4">
                <ul className="divide-y divide-slate-200">
                    {activeTasks.length > 0 ? activeTasks.map(task => {
                        const taskType = task.status === 'Pending Pickup' ? 'Pickup' : 'Delivery';
                        return (
                         <li key={task.id} className="py-5 px-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-4">
                                    <span className={`w-28 text-center px-3 py-1.5 text-sm font-bold rounded-full ${taskType === 'Pickup' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{taskType}</span>
                                    <p className="font-bold text-gray-800 text-lg">Order #{task.id.split('-')[1]}</p>
                                </div>
                                <div className="flex items-center gap-3 mt-3 pl-2 text-gray-600">
                                    <MapPinIcon className="w-5 h-5 text-gray-400"/>
                                    <span className="font-semibold">Tower {task.tower}, Flat {task.flat}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{task.itemCount} items</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => onUpdateOrderStatus(task.id, taskType === 'Pickup' ? 'Picked Up' : 'Delivered')}
                                className={`w-full sm:w-auto font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105 shadow-md ${taskType === 'Pickup' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                               {taskType === 'Pickup' ? 'Mark as Picked Up' : 'Mark as Delivered'}
                            </button>
                        </li>
                    )}) : (
                        <div className="text-center py-16 px-4">
                            <PackageIcon className="w-16 h-16 mx-auto text-gray-300" />
                            <p className="text-gray-500 mt-4 text-lg font-semibold">No active tasks. All clear!</p>
                        </div>
                    )}
                </ul>
            </div>

            <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <SparklesIcon className="w-7 h-7 text-gray-400" />
                    In Progress with Vendor
                </h3>
                {trackedOrders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trackedOrders.map(order => (
                            <OrderCard key={order.id} order={order} role="delivery-staff" />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-sm border">
                         <CheckCircleIcon className="w-16 h-16 mx-auto text-gray-300" />
                         <h4 className="text-xl font-semibold text-gray-700 mt-4">No orders are with vendors.</h4>
                         <p className="text-gray-500 mt-1">Orders you pick up will appear here for tracking.</p>
                    </div>
                )}
            </div>
        </div>
    );
}


const Dashboard: React.FC<DashboardProps> = ({ user, orders, communities, vendors, onPlaceOrderClick, onUpdateOrderStatus, onAddCommunityClick, onAddVendorClick, onPayNowClick }) => {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up" style={{animationDelay: '150ms'}}>
        {user.role === 'customer' && <CustomerDashboard user={user} onPlaceOrderClick={onPlaceOrderClick} orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} onPayNowClick={onPayNowClick}/>}
        {user.role === 'vendor' && <VendorDashboard orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} />}
        {user.role === 'super-admin' && <SuperAdminDashboard communities={communities} vendors={vendors} onAddCommunityClick={onAddCommunityClick} onAddVendorClick={onAddVendorClick} orders={orders} />}
        {user.role === 'delivery-staff' && <DeliveryStaffDashboard orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} />}
    </div>
  );
};

export default Dashboard;
