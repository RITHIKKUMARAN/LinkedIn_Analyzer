import React, { useEffect, useRef } from 'react';
import { Navbar } from './Navbar';
import { gsap } from 'gsap';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Custom cursor logic
        const cursor = cursorRef.current;
        if (!cursor) return;

        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.2,
                ease: "power2.out"
            });
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    return (
        <div className="min-h-screen bg-background text-white relative overflow-hidden">
            <Navbar />

            {/* Custom Cursor */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-8 h-8 border border-white/30 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
            />

            <main className="relative z-10 pt-20">
                {children}
            </main>

            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
            </div>
        </div>
    );
};
