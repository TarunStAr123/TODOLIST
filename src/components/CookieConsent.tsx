import { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [isRendered, setIsRendered] = useState(true);

    useEffect(() => {
        // Show after 1.5 seconds for dramatic effect
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => setIsRendered(false), 300); // Wait for transition
    };

    if (!isRendered) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 p-6 bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm transition-all duration-500 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
        >
            <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-slate-900 border-l-4 border-primary pl-3 -ml-6 text-lg">We respect your privacy</h3>
            </div>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
            </p>

            <div className="flex items-center gap-3">
                <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-95"
                >
                    Accept All
                </button>
                <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all active:scale-95"
                >
                    Decline
                </button>
            </div>
        </div>
    );
}
