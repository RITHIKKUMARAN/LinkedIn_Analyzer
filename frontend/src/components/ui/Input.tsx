import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ className, label, error, ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>}
            <div className="relative group">
                <input
                    className={`
            w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500
            focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300
            group-hover:border-white/20
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className || ''}
          `}
                    {...props}
                />
                {/* Animated bottom line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-focus-within:w-full" />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};
