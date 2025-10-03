/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
// FIX: Import User and UserRole types from the centralized `types.ts` file to break a circular dependency.
import { UserRole } from '../types';
import { UserIcon, IronIcon, BuildingOfficeIcon, TruckIcon } from './icons';
import Spinner from './Spinner';

interface LoginScreenProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
  onSignup: (name: string, email: string, password: string, role: UserRole) => void;
  error?: string | null;
  notification?: string | null;
  loading: boolean;
}

const roles: { id: UserRole, label: string, icon: React.ReactNode, colors: { from: string, to: string } }[] = [
    { id: 'customer', label: "Customer", icon: <UserIcon className="w-8 h-8" />, colors: { from: 'from-teal-400', to: 'to-cyan-500' } },
    { id: 'vendor', label: "Vendor", icon: <IronIcon className="w-8 h-8" />, colors: { from: 'from-indigo-500', to: 'to-purple-600' } },
    { id: 'delivery-staff', label: "Delivery", icon: <TruckIcon className="w-8 h-8" />, colors: { from: 'from-orange-500', to: 'to-amber-500' } },
    { id: 'super-admin', label: "Admin", icon: <BuildingOfficeIcon className="w-8 h-8" />, colors: { from: 'from-slate-700', to: 'to-gray-800' } },
];

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignup, error, notification, loading }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const activeRoleConfig = roles.find(r => r.id === activeRole);

  useEffect(() => {
    // If we get a signup notification, switch back to login mode
    if (notification) {
      setMode('login');
    }
  }, [notification]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (mode === 'login') {
      onLogin(email, password, activeRole);
    } else {
      onSignup(name, email, password, activeRole);
    }
  };

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'login' ? 'signup' : 'login'));
  };

  const isSignup = mode === 'signup';

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row transition-colors duration-700 ease-in-out" data-theme={activeRole}>
        {/* Left decorative panel */}
        <div className={`w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden transition-all duration-700 ease-in-out bg-gradient-to-br ${activeRoleConfig?.colors.from} ${activeRoleConfig?.colors.to}`}>
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <div className="relative z-10 animate-fade-in-up">
                 <div className="flex items-center gap-3 text-white">
                    <IronIcon className="w-9 h-9" />
                    <h1 className="text-3xl font-bold tracking-tight">
                        My Press Wala
                    </h1>
                </div>
            </div>
             <div className="my-auto relative z-10 animate-fade-in-up" style={{ animationDelay: '150ms'}}>
                <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-4">Effortless Ironing,<br/>Delivered.</h2>
                <p className="text-xl text-white/80 max-w-lg">The one-stop solution for seamless ironing services in your residential community.</p>
            </div>
             <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '300ms'}}>
                <p className="text-sm text-white/60">&copy; {new Date().getFullYear()} Yugayatra OPC Private Ltd.</p>
            </div>
        </div>

        {/* Right form panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 p-4 sm:p-8">
            <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: '450ms'}}>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {isSignup ? 'Create Your Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600 mb-8">
                    {isSignup ? 'Select your role and let\'s get you started.' : 'Please select your role to sign in.'}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {roles.map(role => (
                    <button
                        key={role.id}
                        onClick={() => setActiveRole(role.id)}
                        className={`group p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                            activeRole === role.id 
                            ? 'border-[var(--primary-color)] bg-white shadow-lg scale-105' 
                            : 'bg-white border-slate-200 text-gray-500 hover:border-slate-300'
                        }`}
                    >
                        <div className={`mx-auto transition-colors duration-200 text-gray-400 ${activeRole === role.id ? 'text-[var(--primary-color)]' : 'group-hover:text-[var(--primary-color)]'}`}>
                          {role.icon}
                        </div>
                        <span className={`font-semibold text-sm mt-2 block transition-colors duration-200 ${activeRole === role.id ? 'text-gray-800' : 'group-hover:text-gray-800'}`}>{role.label}</span>
                    </button>
                    ))}
                </div>

                {notification && <div className="mb-4 p-3 text-center bg-green-100 text-green-800 rounded-lg text-sm font-medium">{notification}</div>}
                {error && <div className="mb-4 p-3 text-center bg-red-100 text-red-800 rounded-lg text-sm font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && (
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                        id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Priya Sharma"
                        className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                        />
                    </div>
                    )}
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                        className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    />
                    </div>
                    <div>
                    <label htmlFor="password"  className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                        className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    />
                    </div>
                    <button 
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: 'var(--primary-color)'}}
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Spinner /> : (isSignup ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                    <button onClick={toggleMode} className="font-semibold text-[var(--primary-color)] hover:underline">
                    {isSignup ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    </main>
  );
};

export default LoginScreen;
