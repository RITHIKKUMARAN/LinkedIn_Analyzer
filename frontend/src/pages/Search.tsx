import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const Search = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            // In a real app we might just navigate to insights and let it fetch,
            // or fetch here to validate.
            // Let's navigate to insights with the ID.
            // Actually, standard flow: Search -> API Check -> Result/Error.
            // We'll trust the insights page to handle the fetch/scrape.
            navigate(`/insights/${query}`);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-2xl space-y-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-bold">
                        Search Company
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Enter a LinkedIn Company ID (e.g., 'google', 'deepsolv') to retrieve insights.
                    </p>

                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 w-full">
                        <Input
                            placeholder="Company ID..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="h-14 text-lg"
                            autoFocus
                        />
                        <Button type="submit" size="lg" isLoading={isLoading} className="md:w-48">
                            Search
                        </Button>
                    </form>

                    {error && <p className="text-red-500">{error}</p>}

                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
                        {['Apple', 'Google', 'Microsoft', 'Netflix'].map(company => (
                            <button
                                key={company}
                                onClick={() => setQuery(company.toLowerCase())}
                                className="p-4 border border-white/5 rounded-xl hover:bg-white/5 transition-colors"
                                type="button"
                            >
                                {company}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
