import { Link } from 'react-router-dom';
import DashboardMock from './DashboardMock';
import { Star, ChevronRight } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">

            {/* Background decoration elements */}
            <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 bg-slate-50">
                <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-bl from-primary/10 to-orange-400/5 blur-[120px]" />
                <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-400/10 to-transparent blur-[120px]" />

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">

                    {/* Left Text Content */}
                    <div className="flex-1 max-w-2xl text-center lg:text-left z-10">

                        {/* Review Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in-up">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <span className="text-xs font-semibold text-slate-600">Loved by 10,000+ teams</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            Clarity, <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">finally.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            The simplest way to organize your work, teams, and life. Eliminate distractions and focus on what truly matters.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Start for Free
                                <ChevronRight size={18} strokeWidth={3} />
                            </Link>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-full border border-slate-200 shadow-sm transition-all hover:shadow-md active:scale-95">
                                Book a Demo
                            </button>
                        </div>

                        <p className="mt-5 text-sm text-slate-500 font-medium animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                            No credit card required. 14-day free trial.
                        </p>
                    </div>

                    {/* Right Dashboard Mockup */}
                    <div className="flex-1 w-full flex justify-center lg:justify-end lg:pl-10 relative z-10 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                        <div className="relative w-full max-w-[600px]">
                            <DashboardMock />

                            {/* Floating decorative elements */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce hover:pause" style={{ animationDuration: '3s' }}>
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold">Task Finished</p>
                                    <p className="text-sm font-bold text-slate-800">New landing page</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
