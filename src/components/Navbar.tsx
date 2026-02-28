import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-2 rounded-xl text-white transition-transform group-hover:scale-105 duration-150">
                        <Layers size={22} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">TaskFlow</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#features" className="hover:text-primary transition-colors duration-150">Features</a>
                    <a href="#pricing" className="hover:text-primary transition-colors duration-150">Pricing</a>
                    <a href="#resources" className="hover:text-primary transition-colors duration-150">Resources</a>
                </div>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-4 text-sm font-medium">
                    <Link
                        to="/login"
                        className="text-slate-600 hover:text-primary hover:bg-primary/5 transition-all duration-150 px-4 py-2 rounded-lg font-semibold"
                    >
                        Login
                    </Link>
                    <Link
                        to="/login"
                        className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-95 font-semibold"
                    >
                        Start for Free
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <Link to="/login" className="md:hidden text-slate-800 p-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </Link>

            </div>
        </nav>
    );
}
