import React, { useEffect, useState, useRef } from 'react';
import { Header } from '../components/layout/Header';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { api } from '../services/api';
import { Loader2, Users, MapPin, Globe, Calendar, ThumbsUp, MessageSquare, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import Lenis from '@studio-freight/lenis';

import { ThreeBackground } from '../components/ui/ThreeBackground';
import { CustomCursor } from '../components/ui/CustomCursor';
import { AiAnalyst } from '../components/AiAnalyst';

gsap.registerPlugin(ScrollTrigger, Draggable);

export const Insights = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const result = await api.getPage(id);
                setData(result);

                // Animation Logic
                setTimeout(() => {
                    const tl = gsap.timeline();

                    // Hero Text Reveal
                    tl.fromTo(".hero-title",
                        { y: 100, opacity: 0, skewY: 7 },
                        { y: 0, opacity: 1, skewY: 0, duration: 1.5, ease: "power4.out" }
                    )
                        .fromTo(".hero-subtitle",
                            { y: 20, opacity: 0 },
                            { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
                            "-=1"
                        )
                        .fromTo(".glass-card",
                            { y: 50, opacity: 0 },
                            { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "back.out(1.2)" },
                            "-=0.5"
                        );

                    // Parallax for Profile Image
                    gsap.to(".profile-image", {
                        yPercent: 50,
                        ease: "none",
                        scrollTrigger: {
                            trigger: ".hero-section",
                            start: "top top",
                            end: "bottom top",
                            scrub: true
                        }
                    });

                }, 100);

            } catch (err) {
                setError('Failed to fetch data. Is the Page ID correct?');
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center overflow-hidden">
                <CustomCursor />
                <ThreeBackground />
                <Header />
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 border-t-2 border-l-2 border-blue-500 rounded-full animate-spin mb-6" />
                    <h2 className="text-3xl font-bold font-display tracking-wider animate-pulse">ANALYZING</h2>
                    <p className="text-blue-400 mt-2 text-sm tracking-widest uppercase">Connecting to Neural Network</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="relative min-h-screen bg-transparent text-white overflow-hidden">
                <CustomCursor />
                <ThreeBackground />
                <Header />
                <div className="min-h-[80vh] flex flex-col items-center justify-center text-center relative z-10">
                    <h2 className="text-4xl font-bold text-red-500 mb-4 tracking-tighter">DATA VOID</h2>
                    <p className="text-gray-400 text-xl max-w-md">{error}</p>
                    <a href="/search" className="mt-8 px-8 py-3 bg-white text-black font-bold hover:bg-gray-200 transition-colors rounded-none tracking-widest uppercase">Try Reconnecting</a>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
            <CustomCursor />
            <ThreeBackground />
            <AiAnalyst pageId={id || ''} />

            <Header />

            <main className="relative z-10" ref={containerRef}>

                {/* Hero Section */}
                <section ref={heroRef} className="hero-section min-h-screen flex flex-col justify-center px-6 md:px-20 pt-20 relative">
                    <div className="max-w-6xl w-full mx-auto relative">
                        {/* Huge Typography */}
                        <div className="overflow-hidden">
                            <h1 className="hero-title text-[12vw] leading-none font-bold tracking-tighter font-display -ml-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600">
                                {data.name.toUpperCase()}
                            </h1>
                        </div>

                        <div className="flex flex-col md:flex-row gap-12 mt-12 items-start">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                                <img
                                    src={data.profile_image_url || "https://via.placeholder.com/150"}
                                    alt={data.name}
                                    className="profile-image relative w-48 h-48 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>

                            <div className="flex-1 space-y-6 max-w-2xl hero-subtitle">
                                <p className="text-2xl font-light text-gray-300 leading-relaxed border-l-2 border-blue-500 pl-6">
                                    {data.description}
                                </p>

                                <div className="grid grid-cols-2 gap-8 pt-6">
                                    <Stat label="Followers" value={data.follower_count} />
                                    <Stat label="Industry" value={data.industry || "N/A"} />
                                    <Stat label="Headcount" value={data.head_count} />
                                    <Stat label="Founded" value={data.founded || "N/A"} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                        <ArrowRight className="rotate-90 w-6 h-6 text-gray-500" />
                    </div>
                </section>

                {/* Content Section - Cards */}
                <section className="min-h-screen px-6 py-20 relative backdrop-blur-sm bg-black/20">
                    <div className="max-w-7xl mx-auto space-y-24">

                        {/* Employees */}
                        <div className="space-y-8">
                            <div className="flex items-end justify-between border-b border-white/10 pb-4">
                                <h3 className="text-4xl font-bold tracking-tighter">TALENT POOL</h3>
                                <p className="text-gray-400 font-mono text-sm">{data.employees?.length || 0} RECORDS</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.employees?.length > 0 ? (
                                    data.employees.map((emp: any, i: number) => (
                                        <div key={i} className="glass-card group relative p-6 rounded-none border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-xl">
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ArrowRight className="w-5 h-5 -rotate-45 text-blue-400" />
                                                </div>
                                            </div>
                                            <h4 className="text-xl font-bold mb-1">{emp.name}</h4>
                                            <p className="text-blue-400 text-sm mb-2">{emp.role}</p>
                                            <p className="text-gray-500 text-xs font-mono">{emp.location}</p>
                                        </div>
                                    ))
                                ) : (
                                    <DataVoid title="No Talent Data" subtitle="Our sensors could not detect individual profiles." />
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="space-y-8">
                            <div className="flex items-end justify-between border-b border-white/10 pb-4">
                                <h3 className="text-4xl font-bold tracking-tighter">SIGNAL TRANSMISSIONS</h3>
                                <p className="text-gray-400 font-mono text-sm">RECENT ACTIVITY</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {data.posts?.length > 0 ? (
                                    data.posts.map((post: any, i: number) => (
                                        <div key={i} className="glass-card p-8 border-l-2 border-blue-500/50 bg-gradient-to-r from-white/5 to-transparent hover:from-white/10 transition-colors">
                                            <p className="text-gray-300 leading-relaxed mb-6 font-light">
                                                "{post.content}"
                                            </p>
                                            <div className="flex items-center gap-6 text-sm text-gray-400 font-mono">
                                                <span className="flex items-center gap-2"><ThumbsUp className="w-4 h-4 text-blue-500" /> {post.like_count}</span>
                                                <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-purple-500" /> {post.comment_count}</span>
                                                <span className="ml-auto opacity-50">{post.posted_at_timestamp ? new Date(post.posted_at_timestamp).toLocaleDateString() : 'UNKNOWN DATE'}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <DataVoid title="Silence Detected" subtitle="No recent transmissions found from this entity." />
                                )}
                            </div>
                        </div>

                    </div>
                </section>

                <footer className="py-20 text-center border-t border-white/10">
                    <p className="text-gray-500 font-mono text-xs spacing-widest">DEEPSOLV ANALYTICS v2.0 // SYSTEM ACTIVE</p>
                </footer>
            </main>
        </div>
    );
};

const Stat = ({ label, value }: { label: string, value: any }) => (
    <div>
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-bold font-mono">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
);

const DataVoid = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="col-span-full border border-dashed border-white/20 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-black/40">
        <AlertTriangle className="w-12 h-12 text-yellow-500/50 mb-4" />
        <h4 className="text-2xl font-bold text-gray-300 mb-2">{title}</h4>
        <p className="text-gray-500">{subtitle}</p>
        <div className="mt-6 px-4 py-2 bg-blue-500/10 text-blue-400 text-xs font-mono rounded-full border border-blue-500/20">
            AI ANALYSIS AVAILABLE
        </div>
    </div>
);
