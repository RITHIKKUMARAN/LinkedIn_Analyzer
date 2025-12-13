import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Search as SearchIcon, Loader2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { ThreeBackground } from '../components/ui/ThreeBackground';
import { CustomCursor } from '../components/ui/CustomCursor';

export const Search = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Entrance Animation
        const tl = gsap.timeline();

        tl.fromTo(".search-title",
            { y: 50, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
        )
            .fromTo(".search-bar-container",
                { y: 20, opacity: 0, width: "80%" },
                { y: 0, opacity: 1, width: "100%", duration: 0.8, ease: "back.out(1.2)" },
                "-=0.5"
            )
            .fromTo(".quick-link",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
                "-=0.4"
            );

        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!query.trim()) {
            // "Lively" Error Animation (Shake)
            gsap.to(".search-bar-container", {
                x: [-10, 10, -10, 10, 0],
                duration: 0.4,
                ease: "power2.inOut"
            });
            setError('Please enter a company name.');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate a "Processing" delay for effect before navigating
        gsap.to(".search-content", {
            scale: 0.95,
            opacity: 0.5,
            duration: 0.3
        });

        setTimeout(() => {
            navigate(`/insights/${query}`);
        }, 800);
    };

    return (
        <div className="relative min-h-screen bg-transparent text-white overflow-hidden flex flex-col items-center justify-center p-6">
            <CustomCursor />
            <ThreeBackground />

            <Header />

            <div ref={containerRef} className="search-content w-full max-w-3xl relative z-10 flex flex-col items-center">

                {/* Title Section */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-purple-400 mb-4 animate-fade-in search-title">
                        <Sparkles className="w-3 h-3" /> Intelligence Engine
                    </div>
                    <h1 className="search-title text-5xl md:text-7xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500">
                        Analyze Company
                    </h1>
                    <p className="search-title text-gray-400 text-lg md:text-xl max-w-lg mx-auto">
                        Decode corporate DNA. Enter a LinkedIn ID to extract workforce data and growth signals.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="search-bar-container w-full relative group">
                    <div className={`
                        absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-20 group-hover:opacity-40 transition-opacity blur-xl duration-500
                        ${error ? 'from-red-600 to-orange-600 opacity-50' : ''}
                    `} />

                    <div className={`
                        relative flex items-center bg-[#0a0a0a]/80 backdrop-blur-xl border-2 rounded-2xl overflow-hidden transition-all duration-300
                        ${error ? 'border-red-500/50' : 'border-white/10 group-hover:border-white/20 focus-within:border-purple-500/50'}
                    `}>
                        <SearchIcon className={`w-6 h-6 ml-6 ${error ? 'text-red-500' : 'text-gray-400'}`} />

                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Search company ID (e.g. 'openai' or 'stripe')"
                            className="w-full bg-transparent border-none py-6 px-6 text-xl text-white placeholder-gray-600 focus:outline-none font-display placeholder:font-sans"
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mr-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                        </button>
                    </div>
                </form>

                {/* Error Message (Modern) */}
                {error && (
                    <div className="mt-6 flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 animate-slide-up">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                {/* Quick Links */}
                <div className="mt-12 w-full">
                    <p className="text-center text-gray-500 text-sm mb-6 uppercase tracking-wider font-medium opacity-60">Trending Searches</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['DeepSolv', 'OpenAI', 'Anthropic', 'NVIDIA', 'SpaceX'].map((company) => (
                            <button
                                key={company}
                                onClick={() => setQuery(company.toLowerCase())}
                                className="quick-link px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all text-sm font-medium text-gray-300 hover:text-white"
                            >
                                {company}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
