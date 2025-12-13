import React, { useEffect, useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import { Hero3D } from '../components/3d/Hero3D';
import { Button } from '../components/ui/Button';
import { Search, ArrowRight, BarChart2, Users } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
    const navigate = useNavigate();
    const heroTextRef = useRef<HTMLDivElement>(null);
    const featureRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(heroTextRef.current?.children,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" }
        );

        gsap.fromTo(featureRef.current?.children,
            { y: 100, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, stagger: 0.2,
                scrollTrigger: {
                    trigger: featureRef.current,
                    start: "top 80%",
                }
            }
        );
    }, []);

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center px-6">
                <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div ref={heroTextRef} className="space-y-8">
                        <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                            Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">LinkedIn</span> Insights
                        </h1>
                        <p className="text-xl text-gray-400 max-w-lg">
                            Analyze company pages, track growth, and discover employee distributions with our premium insights engine.
                        </p>
                        <div className="flex gap-4">
                            <Button onClick={() => navigate('/search')}>
                                Start Analyzing <Search className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/search')}>
                                View Demo <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <Hero3D />
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 bg-black/50">
                <div className="container mx-auto">
                    <div ref={featureRef} className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                            <BarChart2 className="w-12 h-12 text-blue-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Deep Analytics</h3>
                            <p className="text-gray-400"> comprehensive data on follower growth, engagement rates, and content performance.</p>
                        </div>
                        <div className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                            <Users className="w-12 h-12 text-purple-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Employee Insights</h3>
                            <p className="text-gray-400">Understand workforce distribution, roles, and hiring trends across departments.</p>
                        </div>
                        <div className="p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                            <Search className="w-12 h-12 text-green-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Competitor Tracking</h3>
                            <p className="text-gray-400">Monitor competitors and benchmark your performance against industry leaders.</p>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};
