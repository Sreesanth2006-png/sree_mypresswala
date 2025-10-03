/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="w-full py-6 px-4 sm:px-8 bg-[var(--bg-color)] border-t border-slate-200 mt-auto">
            <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
                <p>&copy; {currentYear} Yugayatra OPC Private Ltd. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;