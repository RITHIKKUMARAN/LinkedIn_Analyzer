import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Search as SearchIcon, Loader2, ArrowRight, AlertCircle, Sparkles, Filter, X, Building2, Users } from 'lucide-react';
import { ThreeBackground } from '../components/ui/ThreeBackground';
import { CustomCursor } from '../components/ui/CustomCursor';
import { api } from '../services/api';

export const Search = () => {
    const [query, setQuery] = useState('');
    const [industry, setIndustry] = useState('');
    const [minFollowers, setMinFollowers] = useState('');
    const [maxFollowers, setMaxFollowers] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
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

        if (!query.trim() && !industry && !minFollowers && !maxFollowers) {
            gsap.to(".search-bar-container", {
                x: [-10, 10, -10, 10, 0],
                duration: 0.4,
                ease: "power2.inOut"
            });
            setError('Please enter search criteria.');
            return;
        }

        setIsLoading(true);
        setError('');
        setHasSearched(true);

        try {
            const results = await api.searchPages({
                name: query || undefined,
                industry: industry || undefined,
                min_followers: minFollowers ? parseInt(minFollowers) : undefined,
                max_followers: maxFollowers ? parseInt(maxFollowers) : undefined
            });

            setSearchResults(results.items || []);

            // Animate results in
            setTimeout(() => {
                gsap.fromTo(".result-card",
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" }
                );
            }, 100);

        } catch (err) {
            setError('Search failed. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const clearFilters = () => {
        setIndustry('');
        setMinFollowers('');
        setMaxFollowers('');
    };

    return (
        <div className="relative min-h-screen bg-transparent text-white overflow-hidden flex flex-col items-center justify-start p-6 pt-32">
            <CustomCursor />
            <ThreeBackground />

            <Header />

            <div ref={containerRef} className="search-content w-full max-w-5xl relative z-10 flex flex-col items-center">

                {/* Title Section */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-purple-400 mb-4 animate-fade-in search-title">
                        <Sparkles className="w-3 h-3" /> Intelligence Engine
                    </div>
                    <h1 className="search-title text-5xl md:text-7xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500">
                        Discover Companies
                    </h1>
                    <p className="search-title text-gray-400 text-lg md:text-xl max-w-lg mx-auto">
                        Search by name, industry, or follower count. Decode corporate DNA.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="search-bar-container w-full relative group mb-6">
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
                            placeholder="Company name (e.g. 'nvidia', 'openai')..."
                            className="w-full bg-transparent border-none py-6 px-6 text-xl text-white placeholder-gray-600 focus:outline-none font-display placeholder:font-sans"
                        />

                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`mr-2 px-4 py-3 rounded-xl border transition-all ${showFilters ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
                        >
                            <Filter className="w-5 h-5" />
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mr-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                        </button>
                    </div>
                </form>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="w-full mb-8 p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 animate-slide-up">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Advanced Filters</h3>
                            <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                                <X className="w-3 h-3" /> Clear
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Industry</label>
                                <input
                                    type="text"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    placeholder="Technology, Finance..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Min Followers</label>
                                <input
                                    type="number"
                                    value={minFollowers}
                                    onChange={(e) => setMinFollowers(e.target.value)}
                                    placeholder="1000"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Max Followers</label>
                                <input
                                    type="number"
                                    value={maxFollowers}
                                    onChange={(e) => setMaxFollowers(e.target.value)}
                                    placeholder="1000000"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-6 flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 animate-slide-up">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                {/* Search Results */}
                {hasSearched && !isLoading && (
                    <div className="w-full mt-8">
                        <h2 className="text-2xl font-bold mb-6 text-white">
                            {searchResults.length > 0 ? `Found ${searchResults.length} Companies` : 'No Results Found'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {searchResults.map((company: any) => (
                                <div
                                    key={company.id}
                                    onClick={() => navigate(`/insights/${company.linkedin_id}`)}
                                    className="result-card group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Building2 className="w-10 h-10 text-purple-400" />
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{company.name}</h3>
                                                <p className="text-sm text-gray-500">{company.industry || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{company.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {company.follower_count?.toLocaleString() || '0'} followers
                                        </span>
                                        {company.head_count > 0 && (
                                            <span>{company.head_count} employees</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Links */}
                {!hasSearched && (
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
                )}
            </div>
        </div>
    );
};
