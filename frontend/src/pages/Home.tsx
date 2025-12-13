import React, { useEffect, useRef, useState } from 'react';
import { Header } from '../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { Search, ArrowRight, BarChart2, Users, Database, Github, Mail, Send, CheckCircle2 } from 'lucide-react';
import { ThreeBackground } from '../components/ui/ThreeBackground';
import { CustomCursor } from '../components/ui/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

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

        // Animations
        const tl = gsap.timeline();

        // Hero Reveal
        tl.fromTo(".hero-line",
            { y: 100, opacity: 0, skewY: 7 },
            { y: 0, opacity: 1, skewY: 0, duration: 1.2, stagger: 0.1, ease: "power4.out" }
        )
            .fromTo(".hero-desc",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
                "-=0.5"
            )
            .fromTo(".hero-btn",
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
                "-=0.5"
            );

        // Feature Cards - Stacking Effect Polish
        gsap.utils.toArray('.feature-card').forEach((card: any, i) => {
            gsap.fromTo(card,
                { scale: 0.9, opacity: 0, y: 50 },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Developer Section Reveal
        gsap.fromTo(".dev-content",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: ".dev-section",
                    start: "top 75%",
                }
            }
        );

        return () => {
            lenis.destroy();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="relative min-h-screen bg-transparent text-white selection:bg-purple-500 selection:text-white overflow-x-hidden">
            <CustomCursor />
            <ThreeBackground />

            <Header />

            {/* Hero Section */}
            <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 relative pt-20">
                <div className="max-w-5xl">
                    <div className="overflow-hidden">
                        <h1 className="hero-line text-[10vw] md:text-[7vw] leading-[0.9] font-bold tracking-tighter mix-blend-overlay">
                            UNLOCK THE
                        </h1>
                    </div>
                    <div className="overflow-hidden">
                        <h1 className="hero-line text-[10vw] md:text-[7vw] leading-[0.9] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-blue-400">
                            DATA VOID
                        </h1>
                    </div>

                    <p className="hero-desc text-xl md:text-2xl text-gray-400 mt-8 max-w-2xl font-light border-l-2 border-purple-500 pl-6">
                        Advanced LinkedIn analytics powered by Neural Networks and Gemini AI.
                        Detect hiring trends, growth signals, and competitor movements in real-time.
                    </p>

                    <div className="hero-btn mt-12 flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/search')}
                            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            Start Analyzing <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 border border-white/20 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2"
                        >
                            Request Access
                        </button>
                    </div>
                </div>

                {/* Floating Elements (Decorative) */}
                <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block opacity-50 pointer-events-none">
                    <div className="relative w-64 h-64 border border-purple-500/30 rounded-full animate-[spin_10s_linear_infinite]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full box-shadow-glow" />
                    </div>
                </div>
            </section>

            {/* Stacking Features Section */}
            <section className="features-section py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl md:text-8xl font-bold mb-32 tracking-tighter text-center font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
                        INTELLIGENCE SUITE
                    </h2>

                    <div className="space-y-32">
                        {[
                            {
                                icon: BarChart2,
                                title: "Deep Analytics",
                                desc: "Real-time tracking of follower growth, engagement rates, and content velocity across competitors.",
                                color: "text-purple-500",
                                border: "group-hover:border-purple-500/50"
                            },
                            {
                                icon: Users,
                                title: "Talent Scraper",
                                desc: "Map organizational structures and detect key hires before they are announced.",
                                color: "text-blue-500",
                                border: "group-hover:border-blue-500/50"
                            },
                            {
                                icon: Database,
                                title: "AI Analyst",
                                desc: "Gemini-powered hypothesis engine that fills in missing data gaps with predictive modeling.",
                                color: "text-green-500",
                                border: "group-hover:border-green-500/50"
                            }
                        ].map((feature, i) => (
                            <div key={i} className={`feature-card sticky top-[20vh] bg-[#0a0a0a] border border-white/10 p-12 rounded-[3rem] shadow-2xl backdrop-blur-xl group transition-all duration-500 hover:scale-[1.02] ${feature.border}`}>
                                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <feature.icon className={`w-64 h-64 ${feature.color}`} />
                                </div>

                                <feature.icon className={`w-16 h-16 ${feature.color} mb-8`} />
                                <h3 className="text-4xl md:text-6xl font-display font-bold mb-6">{feature.title}</h3>
                                <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">{feature.desc}</p>

                                <div className="mt-12 flex items-center gap-4 text-sm font-bold tracking-widest uppercase text-gray-500">
                                    <span>0{i + 1}</span>
                                    <div className="w-12 h-[1px] bg-gray-700" />
                                    <span>System Active</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Developer Branding Section */}
            <section className="dev-section py-32 px-6 bg-black relative z-10 border-t border-white/10">
                <div className="max-w-4xl mx-auto text-center dev-content">
                    <div className="mb-8 flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                <Github className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Crafted by Rithik Kumaran K</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Building the future of data intelligence. Check out the source code and other projects on GitHub.
                    </p>
                    <a
                        href="https://github.com/RITHIKKUMARAN"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10"
                    >
                        <Github className="w-5 h-5" /> github.com/RITHIKKUMARAN
                    </a>
                </div>
            </section>

            {/* Demo Contact Section */}
            <section id="contact" className="py-24 px-6 bg-[#050505] relative z-10">
                <div className="max-w-xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-2">Request a Demo</h2>
                        <p className="text-gray-500">See the full power of Deepsolv in action.</p>
                    </div>

                    <form id="demo-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your work email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                            />
                            <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                        </div>

                        <button
                            type="submit"
                            disabled={submitted}
                            className={`
                                w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300
                                ${submitted ? 'bg-green-600 text-white' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02]'}
                            `}
                        >
                            {submitted ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" /> Request Sent
                                </>
                            ) : (
                                <>
                                    Get Access <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-600 mt-8">
                        By requesting access, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </section>

            <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5 bg-black">
                <p>&copy; {new Date().getFullYear()} Deepsolv Analyer. All rights reserved.</p>
            </footer>
        </div>
    );
};
