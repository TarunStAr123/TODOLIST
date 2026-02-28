import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:border-b dark:border-slate-700/50 py-3'
                : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-2 rounded-xl text-white transition-transform group-hover:scale-105 duration-150">
                        <Layers size={22} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">TaskFlow</span>
                </Link>

                {/* Desktop Links — minimal: Features + Resources only */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <a href="#features" className="hover:text-primary dark:hover:text-primary transition-colors duration-150">Features</a>
                    <a href="#resources" className="hover:text-primary dark:hover:text-primary transition-colors duration-150">Resources</a>
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-3 text-sm font-medium">
                    <ThemeToggle />
                    <Link
                        to="/login"
                        className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-150 px-4 py-2 rounded-lg font-semibold"
                    >
                        Login
                    </Link>
                    <Link
                        to="/login?mode=signup"
                        className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-95 font-semibold"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Mobile */}
                <div className="md:hidden flex items-center gap-2">
                    <ThemeToggle />
                    <Link to="/login?mode=signup" className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full active:scale-95 transition-all">
                        Sign Up
                    </Link>
                </div>

            </div>
        </nav>
    );
}
