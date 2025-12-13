import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Github } from 'lucide-react';

export const Header = () => {
    const navRef = useRef<HTMLElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".nav-logo",
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            );

            gsap.fromTo(".nav-link",
                { y: -20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    delay: 0.1
                }
            );

            gsap.fromTo(".nav-social",
                { x: 20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.3 }
            );
        }, navRef);

        return () => ctx.revert();
    }, []);

    const links = [
        { name: "Home", path: "/" },
        { name: "Search", path: "/search" },
        { name: "Dashboard", path: "/insights/deepsolv" },
    ];

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 right-0 p-6 md:px-12 flex justify-between items-center z-50 pointer-events-none mix-blend-difference text-white"
        >
            {/* Logo */}
            <div
                onClick={() => navigate('/')}
                className="nav-logo text-2xl font-bold tracking-tighter flex items-center gap-2 pointer-events-auto cursor-pointer group"
            >
                <div className="w-3 h-3 bg-white rounded-full group-hover:scale-125 transition-transform duration-300" />
                <span>DEEPSOLV.</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8 pointer-events-auto bg-white/5 px-8 py-3 rounded-full border border-white/10 backdrop-blur-md">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) => `
                            nav-link relative text-sm font-medium tracking-wide transition-colors
                            ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}
                            hover:scale-105 active:scale-95 duration-200
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                {link.name}
                                {isActive && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Social / Actions */}
            <div className="flex gap-6 pointer-events-auto nav-social items-center">
                <a href="#contact" className="hover:text-purple-400 transition-colors uppercase text-xs font-bold tracking-widest hidden md:block">Contact</a>
                <a href="https://github.com/RITHIKKUMARAN" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">
                    <Github className="w-5 h-5" />
                </a>
            </div>
        </nav>
    );
};
