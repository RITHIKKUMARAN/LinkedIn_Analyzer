import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, children, hoverEffect = false, ...props }) => {
    return (
        <div
            className={`
        glass rounded-2xl p-6 
        ${hoverEffect ? 'hover:bg-white/5 hover:border-white/10 transition-colors duration-300' : ''}
        ${className || ''}
      `}
            {...props}
        >
            {children}
        </div>
    );
};
