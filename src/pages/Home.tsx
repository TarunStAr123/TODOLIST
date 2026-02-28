import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CookieConsent from '../components/CookieConsent';

export default function Home() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 selection:bg-primary/20 selection:text-primary overflow-hidden transition-colors duration-300">
            <Navbar />

            <main>
                <Hero />

                {/* Social Proof / Logos */}
                <section className="py-12 border-y border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">Trusted by innovative teams worldwide</p>
                        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 grayscale">
                            <CompanyLogo name="ACME Corp" />
                            <CompanyLogo name="Globex" />
                            <CompanyLogo name="Soylent" />
                            <CompanyLogo name="Massive Dynamic" />
                            <CompanyLogo name="Initech" />
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-slate-900 dark:bg-slate-950 py-12 text-slate-400 text-center text-sm border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    <p>&copy; {new Date().getFullYear()} TaskFlow Inc. All rights reserved.</p>
                </div>
            </footer>

            <CookieConsent />
        </div>
    );
}

function CompanyLogo({ name }: { name: string }) {
    return (
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-slate-800 dark:text-slate-300 select-none">
            <div className="w-8 h-8 rounded-lg bg-slate-300 dark:bg-slate-600" />
            {name}
        </div>
    );
}

