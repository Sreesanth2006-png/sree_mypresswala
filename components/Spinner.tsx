/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface SpinnerProps {
    fullScreen?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-slate-100 flex justify-center items-center z-50">
                <div className="w-12 h-12 border-4 border-slate-300 border-t-[var(--primary-color)] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
    );
};

export default Spinner;
