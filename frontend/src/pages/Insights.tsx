import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { api } from '../services/api';
import { Loader2, Users, MapPin, Globe, Calendar, ThumbsUp, MessageSquare } from 'lucide-react';
import { gsap } from 'gsap';

export const Insights = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const result = await api.getPage(id);
                setData(result);

                // Animation
                gsap.fromTo(".insight-card",
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
                );
            } catch (err) {
                setError('Failed to fetch data. Is the Page ID correct?');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                    <h2 className="text-2xl font-bold animate-pulse">Analyzing...</h2>
                    <p className="text-gray-400 mt-2">Scraping live data from LinkedIn</p>
                </div>
            </Layout>
        );
    }

    if (error || !data) {
        return (
            <Layout>
                <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">Error</h2>
                    <p className="text-gray-400 text-xl">{error}</p>
                    <a href="/search" className="mt-8 text-blue-400 hover:underline">Try another search</a>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row gap-8 items-start mb-12 insight-card">
                    <img
                        src={data.profile_image_url || "https://via.placeholder.com/150"}
                        alt={data.name}
                        className="w-32 h-32 rounded-2xl object-cover border-2 border-white/10"
                    />
                    <div className="space-y-4 flex-1">
                        <h1 className="text-5xl font-display font-bold">{data.name}</h1>
                        <p className="text-xl text-gray-400 max-w-2xl">{data.description}</p>

                        <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {data.follower_count} Followers</span>
                            {data.website && (
                                <a href={data.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                                    <Globe className="w-4 h-4" /> Website
                                </a>
                            )}
                            {data.industry && <span className="px-3 py-1 rounded-full bg-white/10">{data.industry}</span>}
                            {data.head_count > 0 && <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {data.head_count} Employees (Est.)</span>}
                            {data.founded && <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Founded {data.founded}</span>}
                        </div>

                        {data.specialties && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <p className="text-sm text-gray-500 mb-2">Specialties</p>
                                <p className="text-gray-300">{data.specialties}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Employees Section */}
                <h2 className="text-3xl font-bold mb-8 mt-12 insight-card">People Also Viewed / Employees</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {data.employees?.length > 0 ? (
                        data.employees.map((emp: any, i: number) => (
                            <Card key={emp.id || i} hoverEffect className="insight-card flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                                    {emp.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{emp.name}</h3>
                                    <p className="text-sm text-gray-400">{emp.role}</p>
                                    <p className="text-xs text-gray-500">{emp.location}</p>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-3">No employee data found.</p>
                    )}
                </div>

                {/* Posts Grid */}
                <h2 className="text-3xl font-bold mb-8 insight-card">Recent Posts</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.posts?.length > 0 ? (
                        data.posts.map((post: any, i: number) => (
                            <Card key={post.id || i} hoverEffect className="insight-card h-full flex flex-col justify-between">
                                <div>
                                    <p className="text-gray-300 mb-6 line-clamp-4">{post.content}</p>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-white/5">
                                    <span className="flex items-center gap-2"><ThumbsUp className="w-4 h-4" /> {post.like_count}</span>
                                    <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> {post.comment_count}</span>
                                    {post.posted_at_timestamp && <span>{new Date(post.posted_at_timestamp).toLocaleDateString()}</span>}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-3">No posts found.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};
