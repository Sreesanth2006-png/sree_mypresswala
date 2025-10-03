/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
// FIX: Import shared types from `types.ts` to break circular dependency.
import { User, UserRole } from './types';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import Dashboard, { Community, Vendor } from './components/Dashboard';
import Footer from './components/Footer';
import PlaceOrderModal from './components/PlaceOrderModal';
import { Order, OrderStatus } from './components/OrderCard';
import AddCommunityModal from './components/AddCommunityModal';
import AddVendorModal from './components/AddVendorModal';
import PaymentModal from './components/PaymentModal';
import { IronIcon } from './components/icons';
import Spinner from './components/Spinner';

// Initial user data if localStorage is empty
const initialUsers = [
    { name: 'Priya Sharma', email: 'customer@example.com', password: 'password123', role: 'customer' as UserRole },
    { name: 'QuickClean Irons', email: 'vendor@example.com', password: 'password123', role: 'vendor' as UserRole },
    { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'super-admin' as UserRole },
    { name: 'Raj Patel', email: 'delivery@example.com', password: 'password123', role: 'delivery-staff' as UserRole },
];


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  // State for modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);

  // State for auth feedback
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupNotification, setSignupNotification] = useState<string | null>(null);

  // --- Data Persistence using localStorage ---
  // Generic function to get items from localStorage
  const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Failed to parse ${key} from localStorage`, error);
      return defaultValue;
    }
  };

  // Centralized data state, initialized from localStorage
  const [users, setUsers] = useState(() => getFromStorage('mpw_users', initialUsers));
  const [orders, setOrders] = useState<Order[]>(() => getFromStorage('mpw_orders', []));
  const [communities, setCommunities] = useState<Community[]>(() => getFromStorage('mpw_communities', []));
  const [vendors, setVendors] = useState<Vendor[]>(() => getFromStorage('mpw_vendors', []));

  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // --- Effects to save state to localStorage on change ---
  useEffect(() => { localStorage.setItem('mpw_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('mpw_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('mpw_communities', JSON.stringify(communities)); }, [communities]);
  useEffect(() => { localStorage.setItem('mpw_vendors', JSON.stringify(vendors)); }, [vendors]);

  useEffect(() => {
    // Apply theme to body
    if (user) {
      document.body.setAttribute('data-theme', user.role);
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [user]);

  useEffect(() => {
    // This effect now simply handles the initial loading spinner.
    setLoading(true);
    const timer = setTimeout(() => {
        setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user]);

  const handleLogin = async (email: string, password: string, role: UserRole) => {
    setLoginError(null);
    setSignupNotification(null);
    setAuthLoading(true);

    setTimeout(() => {
      const foundUser = users.find(u => u.email === email && u.password === password && u.role === role);
      if (foundUser) {
        const { password: _, ...userToReturn } = foundUser;
        setUser(userToReturn as User);
      } else {
        setLoginError('Login failed. Please check your credentials.');
      }
      setAuthLoading(false);
    }, 800);
  };

  const handleSignup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoginError(null);
    setSignupNotification(null);
    setAuthLoading(true);
    
    setTimeout(() => {
      if (users.find(u => u.email === email)) {
        setLoginError('A user with this email already exists.');
      } else {
        setUsers(prevUsers => [...prevUsers, { name, email, password, role }]);
        setSignupNotification('Signup successful! You can now log in.');
      }
      setAuthLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    setLoginError(null);
    setSignupNotification(null);
  };

  const handlePlaceOrder = (orderData: { itemCount: number; deliveryType: 'standard' | 'express'; notes: string }) => {
    const newOrder: Order = {
        id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        status: 'Pending Pickup',
        itemCount: orderData.itemCount,
        date: new Date().toISOString().split('T')[0],
        tower: 'F',
        flat: '1603', 
        amount: orderData.itemCount * 15, // Mock price
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setIsOrderModalOpen(false);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
        prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        )
    );
  };

  const handleAddCommunity = (communityData: Omit<Community, 'vendors'>) => {
    const newCommunity: Community = { ...communityData, vendors: 0 };
    setCommunities(prev => [newCommunity, ...prev]);
    setIsCommunityModalOpen(false);
  };

  const handleAddVendor = (vendorData: Omit<Vendor, 'status'>) => {
    const newVendor: Vendor = { ...vendorData, status: 'Active' };
    setVendors(prev => [newVendor, ...prev]);
    setIsVendorModalOpen(false);
  };

  const handlePayNowClick = (order: Order) => {
    setSelectedOrderForPayment(order);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = () => {
    if (selectedOrderForPayment) {
        handleUpdateOrderStatus(selectedOrderForPayment.id, 'Paid');
    }
    setIsPaymentModalOpen(false);
    setSelectedOrderForPayment(null);
  };

  if (loading && !user) {
    return <Spinner fullScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-gray-800 transition-colors duration-500">
      {!user ? (
        <LoginScreen 
          onLogin={handleLogin} 
          onSignup={handleSignup}
          error={loginError}
          notification={signupNotification}
          loading={authLoading}
        />
      ) : (
        <>
          <Header user={user} onLogout={handleLogout} />
          <main className="flex-grow w-full p-4 sm:p-6 md:p-8">
            {loading ? <Spinner /> : (
              <Dashboard 
                user={user} 
                orders={orders}
                communities={communities}
                vendors={vendors}
                onPlaceOrderClick={() => setIsOrderModalOpen(true)}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onAddCommunityClick={() => setIsCommunityModalOpen(true)}
                onAddVendorClick={() => setIsVendorModalOpen(true)}
                onPayNowClick={handlePayNowClick}
              />
            )}
          </main>
          <Footer />
        </>
      )}
      
      {isOrderModalOpen && (
        <PlaceOrderModal 
          isOpen={isOrderModalOpen} 
          onClose={() => setIsOrderModalOpen(false)}
          onSubmit={handlePlaceOrder}
        />
      )}
      {isCommunityModalOpen && (
        <AddCommunityModal 
            isOpen={isCommunityModalOpen}
            onClose={() => setIsCommunityModalOpen(false)}
            onSubmit={handleAddCommunity}
        />
      )}
      {isVendorModalOpen && (
        <AddVendorModal
            isOpen={isVendorModalOpen}
            onClose={() => setIsVendorModalOpen(false)}
            onSubmit={handleAddVendor}
        />
      )}
      {isPaymentModalOpen && selectedOrderForPayment && (
        <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onSubmit={handlePaymentSubmit}
            order={selectedOrderForPayment}
        />
      )}
    </div>
  );
};

export default App;
