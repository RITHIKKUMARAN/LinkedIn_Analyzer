import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        if (!cursor || !follower) return;

        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: 'power3.out'
            });
        };

        const onHover = () => {
            gsap.to(cursor, { scale: 0.5 });
            gsap.to(follower, { scale: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' });
        };

        const onLeave = () => {
            gsap.to(cursor, { scale: 1 });
            gsap.to(follower, { scale: 1, backgroundColor: 'transparent' });
        };

        window.addEventListener('mousemove', moveCursor);

        // Add listeners to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, .card-interactive');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', onHover);
            el.addEventListener('mouseleave', onLeave);
        });

        // Simple mutation observer to attach to new elements? 
        // For MVP, just global listener delegation might be better or sticking to this.
        // Or re-running logic on page change.

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', onHover);
                el.removeEventListener('mouseleave', onLeave);
            });
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-10 h-10 border border-white/50 rounded-full pointer-events-none z-[9998] mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"
            />
        </>
    );
};
