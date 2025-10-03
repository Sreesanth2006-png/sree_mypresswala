/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { IronIcon, LogoutIcon } from './icons';
// FIX: Import User type from the centralized `types.ts` file to break a circular dependency.
import { User } from '../types';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="w-full py-4 px-4 sm:px-8 bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40 border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] rounded-lg">
                <IronIcon className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                My Press Wala
              </h1>
          </div>
          {user && (
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role.replace('-', ' ')}</p>
                </div>
                <button 
                    onClick={onLogout}
                    className="flex items-center justify-center p-2 text-gray-500 bg-slate-100 rounded-full hover:bg-slate-200 hover:text-gray-800 transition-colors duration-200"
                    aria-label="Logout"
                >
                    <LogoutIcon className="w-6 h-6" />
                </button>
            </div>
          )}
      </div>
    </header>
  );
};

export default Header;
