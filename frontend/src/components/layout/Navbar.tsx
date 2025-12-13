import React, { useEffect, useState } from 'react';
import { Search, LayoutDashboard, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 glass border-b font-medium' : 'py-6 bg-transparent'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <div className="w-4 h-4 bg-black rounded-sm" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Insights</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</a>
                    <a href="/search" className="text-sm text-gray-400 hover:text-white transition-colors">Search</a>
                    <a href="/insights" className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</a>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="secondary" size="sm" className="hidden md:flex">
                        Contact Sales
                    </Button>
                    <button className="md:hidden text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
