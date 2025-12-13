import React from 'react';
import { cn } from '../../utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    ...props
}) => {
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

    const variants = {
        primary: "bg-white text-black hover:bg-gray-200 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]",
        secondary: "bg-surface text-white border border-white/10 hover:border-white/30 hover:bg-white/5",
        outline: "border border-white/20 text-white hover:bg-white/10",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5"
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg"
    };

    return (
        <button
            className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${className || ''}
      `}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
            {/* Glow effect on hover */}
            {variant === 'primary' && (
                <div className="absolute inset-0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
            )}
        </button>
    );
};
